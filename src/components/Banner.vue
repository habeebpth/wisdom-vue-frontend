<template>
  <div class="banner">
    <div class="banner-overlay">
      <!-- Main Content Container -->
      <div class="banner-content">
        <!-- Collected Amount Section -->
        <div class="collected-section">
          <div class="collected-box">
            <div class="collected-icon">
              <i class="fas fa-inr"></i>
            </div>
            <div class="collected-info">
              <h3 class="collected-label">
                Collected So Far
                <span v-if="!isFirstLoad && !hasError" class="refresh-indicator">
                  <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
                </span>
                <button 
                  v-if="!isFirstLoad" 
                  @click="manualRefresh" 
                  class="manual-refresh-btn"
                  :disabled="isLoading"
                  title="Refresh now"
                >
                  <i class="fas fa-redo" :class="{ 'fa-spin': isManualRefresh }"></i>
                </button>
              </h3>
              <h2 class="collected-amount" :class="{ 'updating': isLoading && !isFirstLoad }">
                {{ displayAmount }}
              </h2>
              <div v-if="isLoading && isFirstLoad" class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading...</span>
              </div>
              <!-- <div v-if="hasError" class="error-indicator">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Unable to load amount</span>
                <button @click="manualRefresh" class="retry-btn">
                  <i class="fas fa-redo"></i> Retry
                </button>
              </div> -->
              <!-- <div v-if="!isFirstLoad && !hasError" class="auto-refresh-info">
                <i class="fas fa-clock"></i>
                <span>Updates every 5 seconds</span>
                <span class="last-updated" v-if="lastUpdated">
                  • Last updated: {{ formatLastUpdated }}
                </span>
              </div> -->
            </div>
          </div>
          <div class="collected-subtitle">
            {{ subtitle }}
          </div>
        </div>

        <!-- Action Buttons Section -->
        <div class="action-buttons">
          <!-- Donate Now Button -->
          <router-link to="/donate" class="action-btn donate-btn">
            <div class="btn-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="btn-content">
              <span class="btn-title">Donate Now</span>
              <span class="btn-subtitle">Make a difference today</span>
            </div>
          </router-link>

          <!-- Offer Now Button -->
          <router-link to="/offer" class="action-btn offer-btn">
            <div class="btn-icon">
              <i class="fas fa-hands-helping"></i>
            </div>
            <div class="btn-content">
              <span class="btn-title">Offer Now</span>
              <span class="btn-subtitle">Pledge your support</span>
            </div>
          </router-link>

          <!-- History Button -->
          <router-link to="/payment-history" class="action-btn history-btn">
            <div class="btn-icon">
              <i class="fas fa-history"></i>
            </div>
            <div class="btn-content">
              <span class="btn-title">History</span>
              <span class="btn-subtitle">View your contributions</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, inject, onMounted, onBeforeUnmount } from 'vue'
import { getCollectedAmount } from '@/utils/api'

export default {
  name: 'Banner',
  props: {
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'
    },
    subtitle: {
      type: String,
      default: 'Your contribution can change lives and create lasting impact'
    }
  },
  setup(props) {
    // Get preloader functions
    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')
    
    // State for collected amount
    const collectedAmount = ref('₹0.00')
    const isLoading = ref(false)
    const hasError = ref(false)
    const refreshInterval = ref(null)
    const isFirstLoad = ref(true)
    const isManualRefresh = ref(false)
    const lastUpdated = ref(null)
    
    // Ensure the banner image URL is set, with a fallback
    const bannerImageUrl = computed(() => {
      return props.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'
    })
    
    // Display amount with loading/error states and refresh animation
    const displayAmount = computed(() => {
      if (isLoading.value && isFirstLoad.value) {
        return 'Loading...'
      }
      if (hasError.value) {
        return '₹0.00'
      }
      return collectedAmount.value
    })
    
    // Format last updated time
    const formatLastUpdated = computed(() => {
      if (!lastUpdated.value) return ''
      const now = new Date()
      const diff = Math.floor((now - lastUpdated.value) / 1000)
      
      if (diff < 10) return 'just now'
      if (diff < 60) return `${diff}s ago`
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
      return lastUpdated.value.toLocaleTimeString()
    })
    
    // Fetch collected amount from API
    const fetchCollectedAmount = async (showLoaderSpinner = true, isManual = false) => {
      try {
        // Only show loading state on first load or if explicitly requested
        if (showLoaderSpinner) {
          isLoading.value = true
        }
        if (isManual) {
          isManualRefresh.value = true
        }
        hasError.value = false
        
        console.log('Fetching collected amount...')
        
        const response = await getCollectedAmount()
        
        if (response.success) {
          const previousAmount = collectedAmount.value
          collectedAmount.value = response.formattedAmount
          lastUpdated.value = new Date()
          
          // Log if amount changed
          if (previousAmount !== response.formattedAmount && !isFirstLoad.value) {
            console.log('Amount updated from', previousAmount, 'to', response.formattedAmount)
          }
          
          console.log('Successfully loaded collected amount:', response.formattedAmount)
        } else {
          throw new Error(response.error || 'Failed to fetch collected amount')
        }
        
      } catch (error) {
        console.error('Error fetching collected amount:', error)
        hasError.value = true
        if (isFirstLoad.value) {
          collectedAmount.value = '₹0.00'
        }
        // Don't reset amount on refresh errors - keep showing last known value
      } finally {
        if (showLoaderSpinner) {
          isLoading.value = false
        }
        if (isManual) {
          isManualRefresh.value = false
        }
        isFirstLoad.value = false
      }
    }
    
    // Manual refresh function
    const manualRefresh = async () => {
      if (isLoading.value || isManualRefresh.value) return
      console.log('Manual refresh triggered')
      await fetchCollectedAmount(false, true)
    }
    
    // Start auto-refresh interval
    const startAutoRefresh = () => {
      // Clear any existing interval
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
      }
      
      // Set up new interval to refresh every 5 seconds
      refreshInterval.value = setInterval(() => {
        console.log('Auto-refreshing collected amount...')
        fetchCollectedAmount(false) // Don't show loading spinner for auto-refresh
      }, 5000) // 5 seconds
      
      console.log('Auto-refresh started - will update every 5 seconds')
    }
    
    // Stop auto-refresh interval
    const stopAutoRefresh = () => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
        refreshInterval.value = null
        console.log('Auto-refresh stopped')
      }
    }
    
    // Load data on component mount
    onMounted(async () => {
      // Show main preloader for banner setup
      showLoader('Loading banner...')
      
      // Preload banner image
      const img = new Image()
      img.src = bannerImageUrl.value
      
      // Load collected amount data initially
      await fetchCollectedAmount(true)
      
      // Start auto-refresh after initial load
      startAutoRefresh()
      
      // Hide loader when image is loaded or on error
      img.onload = () => hideLoader()
      img.onerror = () => hideLoader()
      
      // Add a fallback in case image loading takes too long
      setTimeout(() => hideLoader(), 2000)
    })
    
    // Clean up interval when component is unmounted
    onBeforeUnmount(() => {
      stopAutoRefresh()
    })

    return {
      bannerImageUrl,
      displayAmount,
      isLoading,
      hasError,
      isFirstLoad,
      isManualRefresh,
      lastUpdated,
      formatLastUpdated,
      fetchCollectedAmount,
      manualRefresh,
      startAutoRefresh,
      stopAutoRefresh
    }
  }
}
</script>

<style scoped>
.banner {
  position: relative;
  background-image: url('/img/backgrounds/mosque.jpeg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  max-height: 650px;
  width: 100%;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 31, 63, 0.85) 0%, rgba(74, 144, 226, 0.75) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  height: 100%;
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 900px;
  width: 100%;
}

/* Collected Amount Section */
.collected-section {
  text-align: center;
}

.collected-box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.collected-box:hover {
  transform: translateY(-2px);
}

.collected-icon {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(74, 144, 226, 0.3);
  flex-shrink: 0;
}

.collected-icon i {
  font-size: 1.5rem;
  color: white;
}

.collected-info {
  text-align: left;
}

.collected-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-indicator {
  opacity: 0.7;
  font-size: 0.7rem;
  transition: opacity 0.3s ease;
}

.refresh-indicator:hover {
  opacity: 1;
}

.manual-refresh-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  font-size: 0.7rem;
}

.manual-refresh-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.manual-refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.collected-amount {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.collected-amount.updating {
  opacity: 0.8;
  transform: scale(0.98);
}

.loading-indicator,
.error-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.loading-indicator i {
  animation: spin 1s linear infinite;
}

.error-indicator {
  color: rgba(255, 255, 255, 0.7);
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.7rem;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.auto-refresh-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.65rem;
  margin-top: 0.25rem;
  font-weight: 400;
  flex-wrap: wrap;
}

.last-updated {
  opacity: 0.8;
}

.collected-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  max-width: 500px;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Action Buttons Section */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  width: 100%;
  max-width: 350px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.donate-btn .btn-icon {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.offer-btn .btn-icon {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.history-btn .btn-icon {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.btn-content {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.btn-title {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 400;
}

/* Responsive Design */
@media (min-width: 640px) {
  .banner {
    max-height: 700px;
  }
  
  .banner-content {
    gap: 2rem;
  }
  
  .collected-box {
    padding: 1.75rem;
    gap: 1.25rem;
  }
  
  .collected-icon {
    width: 60px;
    height: 60px;
  }
  
  .collected-icon i {
    font-size: 1.75rem;
  }
  
  .collected-amount {
    font-size: 2.25rem;
  }
  
  .collected-subtitle {
    font-size: 1rem;
  }
  
  .action-buttons {
    grid-template-columns: repeat(3, 1fr);
    max-width: 600px;
    gap: 1rem;
  }
  
  .action-btn {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
    gap: 0.75rem;
  }
  
  .btn-content {
    text-align: center;
  }
  
  .btn-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}

@media (min-width: 768px) {
  .banner-content {
    gap: 2.5rem;
  }
  
  .collected-box {
    padding: 2rem;
    gap: 1.5rem;
  }
  
  .collected-icon {
    width: 65px;
    height: 65px;
  }
  
  .collected-icon i {
    font-size: 2rem;
  }
  
  .collected-amount {
    font-size: 2.5rem;
  }
  
  .collected-subtitle {
    font-size: 1.1rem;
  }
  
  .action-btn {
    padding: 1.5rem;
  }
  
  .btn-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .btn-title {
    font-size: 1.1rem;
  }
  
  .btn-subtitle {
    font-size: 0.8rem;
  }
}

@media (min-width: 1024px) {
  .collected-amount {
    font-size: 2.75rem;
  }
  
  .collected-subtitle {
    font-size: 1.15rem;
  }
}

/* Animation */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.collected-section {
  animation: slideInUp 0.8s ease-out;
}

.action-buttons {
  animation: slideInUp 0.8s ease-out 0.2s both;
}
</style>