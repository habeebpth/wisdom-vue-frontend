<template>
  <header style="background-color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); position: sticky; top: 0; z-index: 50;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
        <!-- Logo -->
        <div style="display: flex; align-items: center;">
          <router-link to="/" style="display: flex; align-items: center; text-decoration: none;">
            <img src="/images/wisdom_logo.jpg" alt="Wisdom House Icon" style="height: 2.5rem; width: auto; margin-right: 0.5rem;" />
          </router-link>
        </div>
        
        <!-- Center Text -->
        <div style="position: absolute; left: 50%; transform: translateX(-50%); font-size: 1.5rem; font-weight: 700; color: #001F3F;">
          Wisdom House
        </div>
        
        <!-- Mobile Menu Button -->
        <div style="@media (min-width: 768px) { display: none; }">
          <button @click="toggleMobileMenu" style="color: #4a5568; focus:outline: none;">
            <i class="fas fa-bars" style="font-size: 1.5rem;"></i>
          </button>
        </div>
        
        <!-- Desktop Navigation -->
        <nav style="display: none; @media (min-width: 768px) { display: flex; align-items: center; }">
          <router-link to="/" style="color: #4a5568; font-weight: 500; text-decoration: none; margin-right: 2rem; transition: color 0.2s;">Home</router-link>
          <router-link to="/donate" style="color: #4a5568; font-weight: 500; text-decoration: none; margin-right: 2rem; transition: color 0.2s;">Donate</router-link>
          <router-link to="/payment-history" style="color: #4a5568; font-weight: 500; text-decoration: none; margin-right: 2rem; transition: color 0.2s;">Payment History</router-link>
          <a 
            href="#" 
            @click.prevent="clearData" 
            style="color: #4a5568; font-weight: 500; text-decoration: none; margin-right: 2rem; transition: color 0.2s;"
            v-if="hasUserInfo"
          >
            Clear Data
          </a>
          <span v-if="userName" style="font-size: 0.875rem; color: #718096;">Welcome, {{ userName }}</span>
        </nav>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" style="@media (min-width: 768px) { display: none; } background-color: white; border-top: 1px solid #e2e8f0;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0.75rem 1rem;">
        <nav style="display: flex; flex-direction: column;">
          <router-link 
            to="/" 
            @click="closeMobileMenu"
            style="color: #4a5568; font-weight: 500; text-decoration: none; padding: 0.5rem 0; margin-bottom: 0.75rem;"
          >
            Home
          </router-link>
          <router-link 
            to="/donate" 
            @click="closeMobileMenu"
            style="color: #4a5568; font-weight: 500; text-decoration: none; padding: 0.5rem 0; margin-bottom: 0.75rem;"
          >
            Donate
          </router-link>
          <router-link 
            to="/payment-history" 
            @click="closeMobileMenu"
            style="color: #4a5568; font-weight: 500; text-decoration: none; padding: 0.5rem 0; margin-bottom: 0.75rem;"
          >
            Payment History
          </router-link>
          <a 
            href="#" 
            @click.prevent="clearData" 
            style="color: #4a5568; font-weight: 500; text-decoration: none; padding: 0.5rem 0; margin-bottom: 0.75rem;"
            v-if="hasUserInfo"
          >
            Clear Data
          </a>
          <div v-if="userName" style="font-size: 0.875rem; color: #718096; padding: 0.5rem 0;">
            Welcome, {{ userName }}
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { clearLocalStorage } from '@/utils/localStorage'

export default {
  name: 'Header',
  setup() {
    const store = useStore()
    const router = useRouter()
    const isMobileMenuOpen = ref(false)
    
    const userName = computed(() => store.state.user.name)
    const hasUserInfo = computed(() => store.state.user.hasUserInfo)
    
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }
    
    const clearData = () => {
      if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        // Clear local storage
        clearLocalStorage()
        
        // Reset store state
        store.commit('user/setUserInfo', { name: '', mobile: '' })
        store.commit('donation/resetForm')
        store.commit('donation/setPaymentHistory', [])
        
        // Close mobile menu and redirect to home
        closeMobileMenu()
        router.push('/')
        
        // Refresh page to ensure clean state
        window.location.reload()
      }
    }
    
    return {
      isMobileMenuOpen,
      userName,
      hasUserInfo,
      toggleMobileMenu,
      closeMobileMenu,
      clearData
    }
  }
}
</script>