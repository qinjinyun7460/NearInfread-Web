<template>
  <div class="datatable-container">
    <el-card shadow="never">
      <template #header>
        <span>详细数据</span>
      </template>
      <el-table :data="tableData" border size="mini" :max-height="maxHeight" style="width: 100%" :empty-text="emptyText"
        stripe>
        <el-table-column label="波长(nm)" prop="index" align="center" />
        <el-table-column label="吸光度" prop="value" align="center" />
      </el-table>
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
  }
});

const tableData = computed(() => {
  if (props.sampleData.length === 0) return [];

  return props.sampleData.map((item, index) => ({
    index: 1000 + index,
    value: item
  }));
});
</script>

<style scoped>
.datatable-container {
  width: 100%;
  padding: 10px;
}

.el-table--mini th,
.el-table--mini td {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
