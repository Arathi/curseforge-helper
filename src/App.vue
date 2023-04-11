<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

interface IConditions {
  gameId: number;
  classId?: number;
  categoryId?: number;
  gameVersion?: string;
  searchFilter?: string;
  sortField?: number;
  sortOrder?: string;
  modLoaderType?: number;
  gameVersionTypeId?: number;
  authorId?: number;
  slug?: string;
  index?: number;
  pageSize?: number;
}

interface IMod {

}

interface ICategory {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  url: string;
  iconUrl: string;
  dateModified: string;
  isClass?: boolean;
  classId?: number;
  parentCategoryId?: number;
  displayIndex?: number;
}

const GameIdMinecraft = 432;
const ClassIdMods = 6;

const ModsSearchSortField = {
  1: "特性 (Featured)",
  2: "流行度 (Popularity)",
  3: "最后更新 (LastUpdated)",
  4: "名称 (Name)",
  5: "作者 (Author)",
  6: "总下载量 (TotalDownloads)",
  7: "分类 (Category)",
  8: "游戏版本 (GameVersion)",
};

const SortOrderAsc = "asc";
const SortOrderDesc = "desc";
const sortOrders = {
  asc: `升序 (${SortOrderAsc})`,
  desc: `降序 (${SortOrderDesc})`
};

// #region data
let keywords = ref("");

let conditions = reactive({
  gameId: GameIdMinecraft
} as IConditions);

let categories = ref(new Array<ICategory>());
let results = ref(new Array<IMod>());
// #endregion

// #region computed
let sortField = computed({
  get() {
    if (conditions.sortField != undefined && 
      conditions.sortField >= 1 &&
      conditions.sortField <= 8) {
      return ModsSearchSortField[conditions.sortField];
    }
    return "";
  },
  set(value) {}
});
// #endregion

// #region methods
function onBtnSettingClick() {
  console.info("点击设置按钮");
}

function onKeywordsInput(value: string | number) {
  console.debug(`关键字变为：${value}`);
}

function onKeywordsChange(value: string | number) {
  console.info(`关键字确定变为：${value}`);
}

function onSortFieldChange(field: any) {
  let num = Number(field);
  if (!isNaN(num) && num >= 1 && num <= 8) {
    conditions.sortField = num;
  }
  else {
    conditions.sortField = undefined;
  }

  console.debug(`排序字段变为：${conditions.sortField}`);
}

function onSortOrderChange(order: any) {
  if (order == "") {
    conditions.sortOrder = undefined;
  }
  console.debug(`排序方式变为：${conditions.sortOrder}`);
}

function onBtnSearchClick() {
  searchAll();
}

function loadCategories(force: boolean = false) {
  if (force) {
    // categories.value.splice(0, categories.value.length);
    categories.value.length = 0;
  }
  categories.value.push({
    "id": 432,
    "name": "Buildcraft",
    "url": "https://www.curseforge.com/minecraft/mc-mods/mc-addons/addons-buildcraft",
    "iconUrl": "https://media.forgecdn.net/avatars/14/463/635596759188303231.png"
  } as ICategory);
}

function searchAll() {
  let keywordList = keywords.value.split(",");
  let keywordAmount = 0;
  for (let kw of keywordList) {
    let keyword = kw.trim();
    if (keyword.length > 0) {
      let searchFilter: string | undefined = undefined;
      let slug: string | undefined = undefined;
      let modId: number | undefined = undefined;

      if (keyword.startsWith("@")) {
        slug = keyword.substring(1);
      }
      else if (keyword.startsWith("#")) {
        let num = Number(keyword.substring(1));
        if (!isNaN(num)) {
          modId = num;
        }
        else {
          console.warn(`${keyword}无法转换为modId`);
          modId = undefined;
        }
      }
      else {
        searchFilter = keyword;
      }

      keywordAmount++;

      search(
        searchFilter,
        slug,
        modId
      ).then((mods) => {
        for (let mod of mods) {
          results.value.push(mod);
        }
      });
    }
  }

  console.info("有效关键字数量：", keywordAmount);
  if (keywordAmount == 0) {
    search().then((mods) => {
      for (let mod of mods) {
        results.value.push(mod);
      }
    });
  }
}

function search(
  searchFilter?: string, 
  slug?: string,
  modId?: number
) : Promise<IMod[]> {
  let empty: IMod[] = [];

  if (modId != undefined) {
    // getModById
    console.info("获取MOD：", modId);
  }
  else {
    // searchMods
    let conds = {
      gameId: GameIdMinecraft,
      classId: ClassIdMods,
      categoryId: conditions.categoryId,
      gameVersion: conditions.gameVersion,
      searchFilter: searchFilter,
      sortField: conditions.sortField,
      sortOrder: conditions.sortOrder,
      modLoaderType: conditions.modLoaderType,
      gameVersionTypeId: conditions.gameVersionTypeId,
      slug: slug,
      index: 0,
      pageSize: 50
    } as IConditions;

    console.info("查询条件如下：", conds);
  }

  return new Promise(() => {
    return empty;
  });
}
// #endregion
</script>

<template>
  <!-- 设置按钮，浮动 -->
  <div class="curseforge-helper">
    <el-button type="primary" icon="Setting" @click="onBtnSettingClick" />
  </div>

  <div class="cfh-conditions">
    <el-row>
      <h2>以下是 "{{ keywords }}" 的查询结果：</h2>
    </el-row>
    
    <el-row>
      <el-input 
        v-model="keywords"
        @change="onKeywordsChange"
        @input="onKeywordsInput"
        placeholder="关键字 / @slug / #modid，用逗号分隔"
      >
        <template #append>
          <el-button icon="Search" @click="onBtnSearchClick" />
        </template>
      </el-input>
    </el-row>

    <el-row class="cfh-conditions-row" align="middle">
      <span class="cfh-condition-title">分类：</span>
      <el-select 
        v-model="conditions.categoryId"
        clearable 
        placeholder="（请选择分类）"
      >
        <el-option
          v-for="(category, key) in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
      <el-button @click="loadCategories()">
        获取分类
      </el-button>
      <el-button @click="loadCategories(true)">
        强制刷新分类
      </el-button>
    </el-row>

    <el-row class="cfh-conditions-row" align="middle">
      <span class="cfh-condition-title">排序规则：</span>
      <el-select 
        v-model="sortField" 
        @change="onSortFieldChange"
        clearable 
        placeholder="（请选择排序字段）"
      >
        <el-option
          v-for="(option, key) in ModsSearchSortField"
          :key="key"
          :label="option"
          :value="key"
        />
      </el-select>
      <el-select 
        v-model="conditions.sortOrder" 
        @change="onSortOrderChange"
        clearable 
        placeholder="（请选择排序方式）"
      >
        <el-option
          v-for="(label, key) in sortOrders"
          :label="label"
          :value="key"
        />
      </el-select>
    </el-row>
  </div>
</template>

<style scoped>
.curseforge-helper {
  position: fixed;
  left: 10px;
  top: 10px;
  z-index: 1;
}

.cfh-conditions .el-row {
  margin-top: 8px;
  margin-bottom: 8px;
}

.cfh-conditions-row * {
  margin-right: 10px;
}

span.cfh-condition-title {
  width: 64px;
}
</style>