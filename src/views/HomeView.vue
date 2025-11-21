<template>
  <div class="home-page">
    <el-container class="common-layout">
      <Sidebar />
      <el-container>

        <el-main>
          <Navbar />
          <el-tabs v-model="activeTab" type="card" closable @tab-remove="handleTabRemove" @tab-click="handleTabClick"
            class="page-tabs">
            <el-tab-pane v-for="tab in tabList" :key="tab.path" :label="tab.title" :name="tab.path"
              :closable="tab.path !== '/'">
              <keep-alive>
                <router-view :key="tab.path" @closeCurrentTab="handleRemoveCurrentTab" />
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>



<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { getUserInfo } from '@/utils/storage';
import Navbar from '@/components/Layout/NavbarLayout.vue';
import Sidebar from '@/components/Layout/SidebarLayout.vue'


const router = useRouter();
const route = useRoute()
// const userInfo = ref({});
// const currentRoute = ref('')

// onMounted(() => {
//   const storedUser = getUserInfo();
//   if (storedUser) {
//     userInfo.value = storedUser;
//   } else {
//     ElMessage.warning('请先登录');
//     router.push('/login');
//   }
// });

// watch(
//   () => route.path,
//   (newPath) => {
//     currentRoute.value = newPath
//   },
//   { immediate: true }
// )

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


// const addTab = (route) => {
//   // const exists = tabList.value.some((tab) => tab.path === route.path);
//   // if (!exists) {
//   //   tabList.value.push({
//   //     path: route.path,
//   //     title: route.meta.title,
//   //   });
//   // }
//   // activeTab.value = route.path;

//   const tabTitle = route.meta.title;
//   tabList.value.push({
//     path: route.path,
//     title: tabTitle
//   });
// };


// const handleRemoveCurrentTab = (targetPath) => {
//   const tabIndex = tabList.value.findIndex(tab => tab.fullPath === targetPath);
//   if (tabIndex > -1) {
//     tabList.value.splice(tabIndex, 1);

//     // 如果删除的是当前活跃标签，切换到其他标签
//     if (targetPath === activeTab.value) {
//       const newActiveTab = tabList.value[Math.max(0, tabIndex - 1)];
//       if (newActiveTab) {
//         activeTab.value = newActiveTab.key;
//         router.push(newActiveTab.fullPath);
//       } else {
//         // 如果没有其他标签，跳转到首页
//         router.push('/');
//       }
//     }
//   }
// };


// const handleRemoveCurrentTab = (targetPath) => {
//   const tabIndex = tabList.value.findIndex(tab => tab.fullPath === targetPath);
//   if (tabIndex > -1) {
//     tabList.value.splice(tabIndex, 1);

//     const sampleTab = tabList.value.find(tab => tab.path === '/samples');
//     if (sampleTab) {
//       activeTab.value = sampleTab.key;
//     }
//   }
// };


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



// const handleMenuSelect = (index) => {
//   router.push(index);
// };

// const handleOpen = (key, keyPath) => {
//   console.log(key, keyPath);
// };

// const handleClose = (key, keyPath) => {
//   console.log(key, keyPath);
// };

</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.common-layout {
  height: 100%;
}

.page-tabs {
  margin-top: 16px;
  height: calc(100vh - 140px);
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
