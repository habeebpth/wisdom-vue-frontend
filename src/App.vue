<template>
  <div style="min-height: 100vh; background-color: #f9fafb; font-family: 'Poppins', sans-serif; color: #1f2937;">
    <Header />
    <router-view>
      <template #default="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </template>
    </router-view>
    <UserInfoModal v-if="showUserInfoModal" />
    <PwaInstallPrompt />
    <Preloader :show="showPreloader" :message="preloaderMessage" />
  </div>
</template>

<script>
import { computed, onMounted, ref, provide } from 'vue'
import { useStore } from 'vuex'
import Header from '@/components/Header.vue'
import UserInfoModal from '@/components/UserInfoModal.vue'
import PwaInstallPrompt from '@/components/PwaInstallPrompt.vue'
import Preloader from '@/components/Preloader.vue'
import { getUserInfo } from '@/utils/localStorage'

export default {
  name: 'App',
  components: {
    Header,
    UserInfoModal,
    PwaInstallPrompt,
    Preloader
  },
  setup() {
    const store = useStore()
    const showUserInfoModal = computed(() => !store.state.user.hasUserInfo)
    
    // Preloader state
    const showPreloader = ref(false)
    const preloaderMessage = ref('Loading...')
    const loaderTimeout = ref(null)
    const loaderMinTime = 500 // Minimum time in ms to show the loader
    const loaderStartTime = ref(0)
    
    // Create functions to control the preloader
    const showLoader = (message = 'Loading...') => {
      // Clear any existing timeouts
      if (loaderTimeout.value) {
        clearTimeout(loaderTimeout.value)
        loaderTimeout.value = null
      }
      
      // Set loader message
      preloaderMessage.value = message
      
      // Add a small delay before showing the loader to prevent flicker for quick operations
      loaderTimeout.value = setTimeout(() => {
        showPreloader.value = true
        loaderStartTime.value = Date.now()
      }, 100) // 100ms delay before showing loader
    }
    
    const hideLoader = () => {
      // Clear any pending show operations
      if (loaderTimeout.value) {
        clearTimeout(loaderTimeout.value)
        loaderTimeout.value = null
      }
      
      // If loader is visible, ensure it stays visible for minimum time
      if (showPreloader.value) {
        const elapsedTime = Date.now() - loaderStartTime.value
        if (elapsedTime < loaderMinTime) {
          loaderTimeout.value = setTimeout(() => {
            showPreloader.value = false
          }, loaderMinTime - elapsedTime)
        } else {
          showPreloader.value = false
        }
      }
    }
    
    // Make preloader controls available to all components
    provide('showLoader', showLoader)
    provide('hideLoader', hideLoader)

    onMounted(() => {
      // Check if user information exists in localStorage
      const userInfo = getUserInfo()
      if (userInfo && userInfo.name) {
        store.commit('user/setUserInfo', userInfo)
      }
    })

    return {
      showUserInfoModal,
      showPreloader,
      preloaderMessage
    }
  }
}
</script>

<style>
:root {
  --primary-color: #4A90E2;
  --secondary-color: #5CB85C;
  --accent-color: #F0AD4E;
  --danger-color: #D9534F;
  --text-color: #333;
  --light-bg: #F9F9F9;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom button styling */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.btn-primary {
  background-color: #4A90E2;
  color: white;
}

.btn-primary:hover {
  background-color: #3072c4;
}

.btn-secondary {
  background-color: #5CB85C;
  color: white;
}

.btn-secondary:hover {
  background-color: #4a9d4a;
}

.btn-accent {
  background-color: #F0AD4E;
  color: white;
}

.btn-accent:hover {
  background-color: #ec971f;
}

.form-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  border-color: transparent;
}

.form-select {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
}

.form-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  border-color: transparent;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.25rem;
}
</style>