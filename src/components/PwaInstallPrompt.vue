<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <div class="p-4 bg-white rounded-lg shadow-lg flex items-center justify-between">
      <div class="flex items-center">
        <img src="/img/icon-192x192.png" alt="App Icon" class="h-12 w-12 mr-3 rounded-lg" />
        <div>
          <h3 class="font-bold text-gray-800">Install Wisdom Donations</h3>
          <p class="text-gray-600 text-sm">Add to your home screen for easy access</p>
        </div>
      </div>
      <div class="flex">
        <button 
          @click="closePrompt" 
          class="px-3 py-1 mr-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Later
        </button>
        <button 
          @click="installPwa" 
          class="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded"
        >
          Install
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'PwaInstallPrompt',
  setup() {
    const deferredPrompt = ref(null)
    const showInstallPrompt = ref(false)
    
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt.value = e
      // Show the install prompt
      showInstallPrompt.value = true
    }
    
    const closePrompt = () => {
      showInstallPrompt.value = false
      // Store in localStorage that user dismissed the prompt
      localStorage.setItem('pwaInstallPromptDismissed', 'true')
    }
    
    const installPwa = async () => {
      if (deferredPrompt.value) {
        // Use the deferred prompt if available
        deferredPrompt.value.prompt()
        
        try {
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.value.userChoice
          console.log(`User response to the install prompt: ${outcome}`)
        } catch (error) {
          console.error('Error with install prompt:', error)
        }
        
        // We no longer need the prompt. Clear it up
        deferredPrompt.value = null
      } else {
        // Fallback for browsers that support PWA but don't trigger beforeinstallprompt
        // or for testing purposes
        try {
          // Alert the user to install manually
          alert('To install the app: \n\n' +
                '1. Open browser menu (three dots in top-right corner)\n' +
                '2. Select "Install App" or "Add to Home screen"')
        } catch (error) {
          console.error('Error showing manual install instructions:', error)
        }
      }
      
      // Hide our install UI
      showInstallPrompt.value = false
    }
    
    const shouldShowPrompt = () => {
      // Check if the prompt was dismissed in the last 7 days
      const dismissedAt = localStorage.getItem('pwaInstallPromptDismissed')
      if (dismissedAt === 'true') {
        return false
      }
      
      // Check if app is already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return false
      }
      
      return true
    }
    
    onMounted(() => {
      // Show a testing prompt immediately so we can verify the component works
      // This is for development only and should be removed in production
      showInstallPrompt.value = true
      
      // Add event listener for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      
      // Check if the app is running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is running in standalone mode')
      }
      
      console.log('PWA Install Prompt component mounted')
    })
    
    onBeforeUnmount(() => {
      // Remove event listener
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    })
    
    return {
      showInstallPrompt,
      closePrompt,
      installPwa
    }
  }
}
</script>

<style scoped>
.pwa-install-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>