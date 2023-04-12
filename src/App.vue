<script setup lang="ts">
import { ref, reactive, computed, onMounted, version } from 'vue';
import Category from './curseforge/Category';
import Mod from './curseforge/Mod';
import CurseForgeApi, { 
  SearchModsConditions as Conditions,
  ModsSearchSortField
} from './curseforge/CurseForgeApi';
import {
  GM_getValue,
  GM_setValue
} from '$';
import CurseForgeConfig from './config/CurseForgeConfig';
import {
  // GameVersion,
  GameVersionType,
  GameVersionsByType
} from './curseforge/GameVersionType';

const modsSearchSortFieldLabels = new Map<ModsSearchSortField, string>();
modsSearchSortFieldLabels.set(ModsSearchSortField.Featured, "特性 (Featured)");
modsSearchSortFieldLabels.set(ModsSearchSortField.Popularity, "流行度 (Popularity)");
modsSearchSortFieldLabels.set(ModsSearchSortField.LastUpdated, "最后更新 (LastUpdated)");
modsSearchSortFieldLabels.set(ModsSearchSortField.Name, "名称 (Name)");
modsSearchSortFieldLabels.set(ModsSearchSortField.Author, "作者 (Author)");
modsSearchSortFieldLabels.set(ModsSearchSortField.TotalDownloads, "总下载量 (TotalDownloads)");
modsSearchSortFieldLabels.set(ModsSearchSortField.Category, "分类 (Category)");
modsSearchSortFieldLabels.set(ModsSearchSortField.GameVersion, "游戏版本 (GameVersion)");

interface GameVersionTypeInfo {
  id: number;
  name: string;
  versions: string[];
}

const SortOrderAsc = "asc";
const SortOrderDesc = "desc";
const sortOrders = {
  asc: `升序 (${SortOrderAsc})`,
  desc: `降序 (${SortOrderDesc})`
};

let cfApi: CurseForgeApi = new CurseForgeApi("");

// #region data
let keywords = ref("");

let conditions = reactive({} as Conditions);

let categories = ref<Category[]>([]);
let gameVersionTypeInfos = ref<GameVersionTypeInfo[]>([]);
let versions = ref<string[]>([]);
let results = ref<Mod[]>([]);
// #endregion

// #region computed
let sortField = computed({
  get() {
    if (conditions.sortField != undefined) {
      let field = conditions.sortField;
      let label = modsSearchSortFieldLabels.get(field);
      if (label != undefined) {
        return label;
      }
    }
    return "";
  },
  set(value) {}
});

let gameVersionType = computed({
  get() {
    if (conditions.gameVersionTypeId != undefined) {
      let type = conditions.gameVersionTypeId;
      for (let info of gameVersionTypeInfos.value) {
        if (info.id == type) {
          return info.name;
        }
      }
    }
    return "";
  },
  set(value) {
    let num = Number(value);
    if (!isNaN(num)) {
      conditions.gameVersionTypeId = num;
    }
    else {
      conditions.gameVersionTypeId = undefined;
    }

    console.info(`游戏版本类型修改为：${conditions.gameVersionTypeId}`);
    generateVersions();
  }
});

// let versions = computed(() => {
//   console.info("正在获取版本号...");
//   let results: string[] = [];
//   if (conditions.gameVersionTypeId != undefined) {
//     let type = conditions.gameVersionTypeId;
//     console.info("当前版本类型为", type);
//     for (let info of gameVersionTypeInfos.value) {
//       if (info.id == type) {
//         results.push(...info.versions);
//       }
//     }
//   }
//   console.info(`当前版本类型下有${results.length}个版本：`, results);
//   return results;
// });
// #endregion

// #region methods
function onBtnSettingClick() {
  console.info("点击设置按钮");
}

function onKeywordsInput(value: string) {
  console.debug(`关键字变为：${value}`);
}

function onKeywordsChange(value: string) {
  console.info(`关键字确定变为：${value}`);
}

function onCategoryIdChange(value: any) {
  if (value == "") {
    conditions.categoryId = undefined;
  }
  console.info(`分类id修改为：${conditions.categoryId}`);
}

function generateVersions() {
  console.info("正在生成游戏版本候选列表")
  versions.value.length = 0;
  if (conditions.gameVersionTypeId != undefined) {
    let type = conditions.gameVersionTypeId;
    for (let info of gameVersionTypeInfos.value) {
      if (info.id == type) {
        versions.value.push(...info.versions);
      }
    }
  }
  console.info("游戏版本候选列表生成完成：", versions.value);
}

function onGameVersionSelect(value: any) {
  console.info("选择游戏版本：", value);
  conditions.gameVersion = value;
  onGameVersionChange(value);
}

function onGameVersionChange(value: any) {
  if (value == "") {
    conditions.gameVersion = undefined;
  }
  console.info(`版本修改为：${conditions.gameVersion}`);
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
  categories.value.length = 0;
  cfApi.getCategories(CurseForgeApi.ClassIdMods).then((results) => {
    console.info(`获得${results.length}个分类：`, results);
    results.map((category) => {
      categories.value.push(category);
    });
  });
}

async function loadGameVersionTypeInfos() {
  let types = await cfApi.getGameVersionTypes();
  let versionsByType = await cfApi.getGameVersions();

  let versionsMapper = new Map<number, string[]>();
  for (let type of versionsByType) {
    let versions = type.versions;
    versions.sort((v1: string, v2: string) => {
      // TODO versions排序，注意对"-snapshot"结尾的版本进行处理
      if (v1 > v2) {
        return 1;
      }
      if (v1 < v2) {
        return -1;
      }
      return 0;
    });

    versionsMapper.set(type.type, versions);
  }

  let typeInfos: GameVersionTypeInfo[] = [];
  for (let type of types) {
    let versions = versionsMapper.get(type.id);
    if (versions != undefined) {
      let typeInfo = {
        id: type.id,
        name: type.name,
        versions: versions
      } as GameVersionTypeInfo;
      typeInfos.push(typeInfo);
    }
  }

  typeInfos.sort((ti1: GameVersionTypeInfo, ti2: GameVersionTypeInfo) => {
    // TODO typeInfos排序，注意对"Minecraft "开头的进行处理，尤其注意"Minecraft Beta"
    if (ti1.name > ti2.name) {
      return 1;
    }
    else if (ti1.name < ti2.name) {
      return -1;
    }
    return 0;
  });

  gameVersionTypeInfos.value.length = 0;
  gameVersionTypeInfos.value.push(...typeInfos);
}

function queryVersions(queryString: string, callback: any) {
  let results: string[] = [];
  if (queryString.trim().length > 0) {
    versions.value.map((version) => {
      let idx = version.indexOf(queryString);
      if (idx >= 0) {
        results.push(version);
      }
    });
  }
  else {
    results.push(...versions.value);
  }
  console.info(`查询到${results.length}个游戏版本：`, results);
  callback(results);
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
) : Promise<Mod[]> {
  let empty: Mod[] = [];

  if (modId != undefined) {
    // getModById
    console.info("获取MOD：", modId);
  }
  else {
    // searchMods
    let conds = {
      categoryId: conditions.categoryId,
      gameVersion: conditions.gameVersion,
      searchFilter: searchFilter,
      sortField: conditions.sortField,
      sortOrder: conditions.sortOrder,
      modLoaderType: conditions.modLoaderType,
      gameVersionTypeId: conditions.gameVersionTypeId,
      slug: slug
    } as Conditions;

    console.info("查询条件如下：", conds);
  }

  return new Promise(() => {
    return empty;
  });
}
// #endregion

// #region mounted
onMounted(() => {
  // 读取CurseForge相关设置
  let cfConfig = GM_getValue("curseforge", {}) as CurseForgeConfig;
  cfApi.reset(cfConfig.apiKey, cfConfig.baseUrl);

  // 加载分类
  loadCategories();

  // 加载版本
  loadGameVersionTypeInfos();
});
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
        @change="onCategoryIdChange"
      >
        <el-option
          v-for="category in categories"
          :value="category.id"
        >
          <span style="float: left;">{{ category.name }}</span>
          <span style="float: right; color: var(--el-text-color-secondary);">{{ category.id }}</span>
        </el-option>
      </el-select>
      <el-button icon="Refresh" @click="loadCategories()" />
    </el-row>

    <el-row class="cfh-conditions-row" align="middle">
      <span class="cfh-condition-title">游戏版本：</span>
      <el-select 
        v-model="gameVersionType"
        clearable 
        placeholder="（请选择游戏版本类型）"
      >
        <el-option
          v-for="typeInfo in gameVersionTypeInfos"
          :value="typeInfo.id"
        >
          <span style="float: left;">{{ typeInfo.name }}</span>
          <span style="float: right; color: var(--el-text-color-secondary);">{{ typeInfo.id }}</span>
        </el-option>
      </el-select>
      <el-autocomplete
        v-model="conditions.gameVersion" 
        style="width: 20%;"
        :fetch-suggestions="queryVersions"
        placeholder="请输入游戏版本"
        clearable
        @select="onGameVersionSelect"
        @change="onGameVersionChange"
      >
        <template #default="{ item }">
          <span>{{ item }}</span>
        </template>
      </el-autocomplete>
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
          v-for="(field, key) in modsSearchSortFieldLabels"
          :value="field[0]"
        >
          <span style="float: left;">{{ field[1] }}</span>
          <span style="float: right; color: var(--el-text-color-secondary);">{{ field[0] }}</span>
        </el-option>
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