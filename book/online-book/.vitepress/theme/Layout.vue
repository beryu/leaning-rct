<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { onMounted, ref } from "vue";

const storageKey = "leaning-rct:sidebar-collapsed";
const isSidebarCollapsed = ref(false);

onMounted(() => {
  try {
    isSidebarCollapsed.value =
      window.localStorage.getItem(storageKey) === "true";
  } catch {
    // The layout remains usable when storage is unavailable.
  }
});

function setSidebarCollapsed(value: boolean) {
  isSidebarCollapsed.value = value;
  try {
    window.localStorage.setItem(storageKey, String(value));
  } catch {
    // The current session can still use the toggle without persistence.
  }
}
</script>

<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <DefaultTheme.Layout>
      <template #sidebar-nav-before>
        <button
          class="sidebar-toggle sidebar-toggle--collapse"
          type="button"
          aria-label="サイドバーを折りたたむ"
          title="サイドバーを折りたたむ"
          @click="setSidebarCollapsed(true)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.5 7-5 5 5 5" />
          </svg>
        </button>
      </template>
      <template #layout-top>
        <button
          class="sidebar-toggle sidebar-toggle--expand"
          type="button"
          aria-label="サイドバーを展開する"
          title="サイドバーを展開する"
          @click="setSidebarCollapsed(false)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9.5 7 5 5-5 5" />
          </svg>
        </button>
      </template>
    </DefaultTheme.Layout>
  </div>
</template>
