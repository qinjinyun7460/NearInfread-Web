<template>
  <div class="datatable-container">
    <el-card shadow="never">
      <template #header>
        <span>详细数据</span>
      </template>
      <el-table :data="tableData" border :max-height="maxHeight" style="width: 100%" :empty-text="emptyText" stripe>
        <el-table-column label="波长(nm)" prop="index" align="center" />
        <el-table-column label="吸光度" prop="value" align="center" />
      </el-table>

      <!-- <div class="horizontal-table-container" :style="{ overflow: 'auto' }">
        <el-table :data="tableData" border style="width: 100%; min-width: max-content" :empty-text="emptyText" stripe
          fixed="left">
          <el-table-column label="波长" prop="name" align="center" width="100" />
          <el-table-column v-for="column in columns" :key="column.index" :label="`${column.index} nm`"
            :prop="`value${column.index}`" align="center" width="100" />
        </el-table>
      </div> -->

    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';


const props = defineProps({
  sampleData: {
    type: Array,
    required: true,
    default: () => []
  },
  maxHeight: {
    type: [Number, String],
    default: 600
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  columnsPerRow: {
    type: Number,
    default: 20
  }
});

const tableData = computed(() => {
  if (props.sampleData.length === 0) return [];

  return props.sampleData.map((item, index) => ({
    index: 1000 + index,
    value: item
  }));
});


// const columns = computed(() => {
//   if (props.sampleData.length === 0) return [];

//   return props.sampleData.map((_, index) => ({
//     index: 1000 + index
//   }));
// });

// const tableData = computed(() => {
//   if (props.sampleData.length === 0) return [];

//   const rowData = {
//     name: '吸光度'
//   };

//   props.sampleData.forEach((value, index) => {
//     const wavelength = 1000 + index;
//     rowData[`value${wavelength}`] = value;
//   });

//   return [rowData];
// });
</script>

<style scoped>
.datatable-container {
  width: 100%;
  padding: 10px;
}

.horizontal-table-container {
  width: 100%;
}
</style>