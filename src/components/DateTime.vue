<script setup lang="ts">
import { defineProps, computed } from 'vue';
import moment from 'moment';

let props = defineProps<{
  date: string
}>();

const timestamp = computed(() => {
  let t = moment(props.date);
  return t.unix();
});

const date = computed(() => {
  let t = moment(props.date);
  return t.format("YYYY-MM-DD");
});
</script>

<template>
  <abbr class="tip standard-date standard-datetime" :data-epoch=(timestamp)>{{ date }}</abbr>
</template>

<style scoped></style>