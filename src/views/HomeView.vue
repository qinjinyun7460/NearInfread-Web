<template>
  <div class="home-page">

    <el-container>
      <el-affix :offset="0">
        <Sidebar />
      </el-affix>

      <el-main>
        <Navbar />
        <div class="tabs-container">
          <el-tabs v-model="activeTab" type="card" closable @tab-remove="handleTabRemove" @tab-click="handleTabClick"
            class="page-tabs">
            <el-tab-pane v-for="tab in tabList" :key="tab.path" :label="tab.title" :name="tab.path"
              :closable="tab.path !== '/'">
              <keep-alive>
                <router-view :key="tab.path" @closeCurrentTab="handleRemoveCurrentTab" />

              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navbar from '@/components/Layout/NavbarLayout.vue';
import Sidebar from '@/components/Layout/SidebarLayout.vue'

const router = useRouter();
const route = useRoute()
const activeTab = ref('');
const tabList = ref([
  { path: '/', title: '首页' }
]);

onMounted(() => {
  activeTab.value = route.path;
  if (!tabList.value.some(tab => tab.path === route.path)) {
    addTab(route);
  }

});

const addTab = (route) => {
  const tabTitle = typeof route.meta.title === 'function'
    ? route.meta.title(route)
    : route.meta.title || '未命名页面';

  const tabKey = route.fullPath;
  const exists = tabList.value.some(tab => tab.key === tabKey);

  if (!exists) {
    tabList.value.push({
      key: tabKey,
      path: route.path,
      fullPath: route.fullPath,
      title: tabTitle
    });
  }

  activeTab.value = tabKey;
};

const handleTabRemove = (targetPath) => {
  const tabIndex = tabList.value.findIndex((tab) => tab.path === targetPath);
  if (tabIndex > -1) {
    tabList.value.splice(tabIndex, 1);

    if (targetPath === activeTab.value) {
      const newActiveTab = tabList.value[Math.max(0, tabIndex - 1)];
      if (newActiveTab) {
        activeTab.value = newActiveTab.path;
        router.push(newActiveTab.path);
      }
    }
  }
};

const handleTabClick = (tab) => {
  const targetPath = tab.props.name;
  if (targetPath !== route.path) {
    router.push(targetPath);
  }
};

watch(
  () => route.path,
  (newPath) => {
    activeTab.value = newPath;
    if (!tabList.value.some(tab => tab.path === newPath)) {
      addTab(route);
    }
  },
  { immediate: true }
);

</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.page-tabs {
  overflow: hidden;
}

@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .filter-form .el-form-item {
    margin-bottom: 12px;
    width: 100%;
  }
}
</style>
