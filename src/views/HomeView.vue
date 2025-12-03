<template>
  <el-container class="layout-container-demo">
    <Sidebar />

    <el-container>
      <el-header>
        <div class="toolbar">
          <Navbar />
        </div>
      </el-header>
      <el-main>
        <el-tabs v-model="activeTab" type="border-card" closable @tab-remove="handleTabRemove"
          @tab-click="handleTabClick">
          <el-tab-pane v-for="tab in tabList" :key="tab.path" :label="tab.title" :name="tab.path"
            :closable="tab.path !== '/'">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
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
.layout-container-demo .el-header {
  width: 100%;
  position: relative;
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .el-menu {
  border-right: none;
}

/* 平板（≥768px） */
@media (min-width: 768px) {
  .sidebar {
    display: block;
    width: 30%;
  }
}

/* 桌面（≥1024px） */
@media (min-width: 1024px) {
  .el-main {
    width: 100%;
  }
}

@media(max-width:768px) {
  .toolbar .el-main {
    width: 80%;
  }
}
</style>
