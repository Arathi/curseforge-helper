<script setup lang="ts">
import { defineProps, PropType, computed, onMounted } from 'vue';
import DateTime from './DateTime.vue';

import Mod from '../curseforge/Mod';

// #region props
const props = defineProps({
  mod: Object as PropType<Mod>,
});
// #endregion

const mainAuthor = computed(() => {
  let authors = props.mod?.authors;
  if (authors != undefined && authors.length > 0) {
    return authors[0];
  }
});

const downloadCount = computed(() => {
  let amount = props.mod?.downloadCount
  if (amount != undefined) {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(2)} 亿`
    }
    else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)} 万`
    }
    return `${amount}`
  }
  return "0"
});

onMounted(() => {
  
});
</script>

<template>
  <div class="my-2">
    <div class="project-listing-row box py-3 px-4 flex flex-col lg:flex-row lg:items-center">
      <div class="lg:mr-2 flex items-center mb-2 lg:mb-0">
        <!-- 图标 -->
        <div class="relative mr-2 lg:mr-0">
          <div class="project-avatar project-avatar-64">
            <a :href=(mod?.links.websiteUrl) class="bg-white">
              <img :src=(mod?.logo.url) alt="" class="mx-auto">
            </a>
          </div>
        </div>
        <!-- /图标 -->

        <!-- 名称 by 作者 （小） -->
        <div class="flex items-end lg:hidden">
          <a :href=(mod?.links.websiteUrl)>
            <h3 class="font-bold text-lg hover:no-underline">{{ mod?.name }}</h3>
          </a>
          &nbsp;
          <span>By</span>
          &nbsp;
          <a :href=(mainAuthor?.url) class="font-bold hover:no-underline">{{ mainAuthor?.name }}</a>
        </div>
        <!-- /名称 by 作者 （小） -->
      </div>
      <div class="flex flex-col">
        <!-- 名称 by 作者 （大） -->
        <div class="lg:flex items-end hidden">
          <a class="my-auto" :href=(mod?.links.websiteUrl)>
            <h3 class="font-bold text-lg">{{ mod?.name }}</h3>
          </a>
          <span class="my-auto">
            &nbsp;by&nbsp;
          </span>
          <a class="text-base leading-normal font-bold hover:no-underline my-auto" :href=(mainAuthor?.url)>{{ mainAuthor?.name }}</a>
          <span class="my-auto">
            &nbsp;&nbsp;&nbsp;&nbsp;
            #{{ mod?.id }}
          </span>
          <span class="my-auto">
            &nbsp;&nbsp;&nbsp;&nbsp;
            @{{ mod?.slug }}
          </span>
        </div>
        <!-- /名称 by 作者 （大） -->

        <!-- 简介 -->
        <div class="flex my-1">
          <span class="mr-2 text-xs text-gray-500">下载次数：{{ downloadCount }}</span>
          <span class="mr-2 text-xs text-gray-500">更新时间：<date-time :date=(mod?.dateModified!) /></span>
          <span class="text-xs text-gray-500">创建时间：<date-time :date=(mod?.dateCreated!) /></span>
        </div>
        <p class="text-sm leading-snug">
          {{ mod?.summary }}
        </p>
        <!-- /简介 -->
      </div>
      <div class="w-full lg:w-unset justify-between lg:min-w-40 ml-auto flex flex-row-reverse lg:flex-col items-end">
        <!-- 按钮 -->
        <div class="flex mb-2 -mx-1">
          <!-- 下载按钮 -->
          <div class="px-1">
            <a data-project-id="248787" href="/minecraft/mc-mods/appleskin/download" class="button button--hollow"
              data-tooltip="Download file">
              <span class="button__text"><svg class="icon icon-margin" viewBox="0 0 20 20" width="18" height="18">
                  <use
                    xlink:href="/Content/2-0-8501-12076/Skins/CurseForge/images/twitch/Action/Download.svg#Action/Download">
                  </use>
                </svg>
                下载</span>
            </a>
          </div>

          <!-- 安装按钮 -->
          <div class="px-1">
            <a data-project-id="248787" href="/minecraft/mc-mods/appleskin/download?client=y" class="button"
              style="background-color: #F16436" data-tooltip="Install with CurseForge app">
              <figure class="icon icon-margin relative w-5 h-4">
                <img src="/Content/2-0-8501-12076/Skins/CurseForge/images/anvil.svg" alt="CurseForge"
                  class="w-full h-full absolute">
              </figure>
              安装
            </a>
          </div>
        </div>
        <!-- /按钮 -->

        <!-- 分类 -->
        <div class="flex -mx-1">
          <div class="px-1" v-for="category in mod?.categories">
            <a :href=(category.url)>
              <figure class="relative h-6 w-6" :title=(category.name)>
                <img :src=(category.iconUrl)
                  class="rounded absolute inset-0 h-full w-full">
              </figure>
            </a>
          </div>
        </div>
        <!-- /分类 -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>