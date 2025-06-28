<template>
  <div class="banner-container">
    <!-- 
    Amount Section - Commented for future use
    <div class="amount-section">
      <div class="collected-box">
        <div class="collected-icon">
          <i class="fas fa-rupee-sign"></i>
        </div>
        <div class="collected-info">
          <h3 class="collected-label">
            Collected So Far
            <span v-if="!isFirstLoad && !hasError" class="refresh-indicator">
              <i :class="['fas fa-sync-alt', { 'fa-spin': isLoading }]"></i>
            </span>
            <button 
              v-if="!isFirstLoad"
              @click="manualRefresh" 
              class="manual-refresh-btn"
              :disabled="isLoading"
              title="Refresh now"
            >
              <i :class="['fas fa-redo', { 'fa-spin': isManualRefresh }]"></i>
            </button>
          </h3>
          <h2 :class="['collected-amount', { updating: isLoading && !isFirstLoad }]">
            {{ displayAmount }}
          </h2>
          <div v-if="isLoading && isFirstLoad" class="loading-indicator">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading amount...</span>
          </div>
          <div v-else-if="hasError" class="error-indicator">
            <span>Failed to load amount</span>
            <button @click="fetchCollectedAmount(true)" class="retry-btn">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
          <div v-else-if="lastUpdated" class="auto-refresh-info">
            <span class="last-updated">{{ formatLastUpdated }}</span>
            <span>• Auto-updates every 5s</span>
          </div>
        </div>
      </div>
      <p class="collected-subtitle">
        {{ subtitle }}
      </p>
    </div>
    -->

    <!-- Image Slider Section - 4-Side Curved -->
    <div class="slider-section">
      <div class="slider-container">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="slide"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${image.url})` }"
          @click="nextSlide"
        ></div>
        
        <!-- Slide Indicators -->
        <div class="slide-indicators">
          <button
            v-for="(image, index) in images"
            :key="index"
            @click="goToSlide(index)"
            class="indicator"
            :class="{ active: currentSlide === index }"
            :disabled="isTransitioning"
          ></button>
        </div>
      </div>
    </div>

    <!-- Action Buttons Section -->
    <div class="buttons-section">
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
    images: {
      type: Array,
      default: () => [
        {
          url: '/images/new_edited.jpeg',
          alt: 'Banner'
        },
        {
          url: '/images/wh_banner_2.jpeg',
          alt: 'Community gathering'
        },
        {
          url: '/images/wh_banner_3.jpeg',
          alt: 'Helping hands'
        },
        {
          url: '/images/wh_banner_4.jpeg',
          alt: 'Islamic architecture'
        }
      ]
    },
    subtitle: {
      type: String,
      default: 'Your contribution can change lives and create lasting impact'
    },
    autoSlide: {
      type: Boolean,
      default: true
    },
    slideInterval: {
      type: Number,
      default: 5000
    }
  },
  setup(props) {
    // Get preloader functions
    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')
    
    // Slider state
    const currentSlide = ref(0)
    const isTransitioning = ref(false)
    const slideTimer = ref(null)
    
    // State for collected amount (commented functionality - keeping for future use)
    const collectedAmount = ref('₹0.00')
    const isLoading = ref(false)
    const hasError = ref(false)
    const refreshInterval = ref(null)
    const isFirstLoad = ref(true)
    const isManualRefresh = ref(false)
    const lastUpdated = ref(null)
    
    // Computed properties
    const displayAmount = computed(() => {
      return hasError.value ? '₹0.00' : collectedAmount.value
    })
    
    const formatLastUpdated = computed(() => {
      if (!lastUpdated.value) return ''
      const secondsAgo = Math.floor((new Date() - lastUpdated.value) / 1000)
      if (secondsAgo < 10) return 'just now'
      if (secondsAgo < 60) return `${secondsAgo}s ago`
      if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`
      return lastUpdated.value.toLocaleTimeString()
    })
    
    // Slider methods
    const nextSlide = () => {
      if (isTransitioning.value) return
      isTransitioning.value = true
      currentSlide.value = (currentSlide.value + 1) % props.images.length
      setTimeout(() => {
        isTransitioning.value = false
      }, 600)
    }
    
    const previousSlide = () => {
      if (isTransitioning.value) return
      isTransitioning.value = true
      currentSlide.value = currentSlide.value === 0 ? props.images.length - 1 : currentSlide.value - 1
      setTimeout(() => {
        isTransitioning.value = false
      }, 600)
    }
    
    const goToSlide = (index) => {
      if (isTransitioning.value || index === currentSlide.value) return
      isTransitioning.value = true
      currentSlide.value = index
      setTimeout(() => {
        isTransitioning.value = false
      }, 600)
    }
    
    const startAutoSlide = () => {
      if (!props.autoSlide) return
      stopAutoSlide()
      slideTimer.value = setInterval(() => {
        nextSlide()
      }, props.slideInterval)
    }
    
    const stopAutoSlide = () => {
      if (slideTimer.value) {
        clearInterval(slideTimer.value)
        slideTimer.value = null
      }
    }
    
    // Amount methods (commented functionality - keeping for future use)
    const fetchCollectedAmount = async (showLoading = true, isManual = false) => {
      try {
        if (showLoading) {
          isLoading.value = true
        }
        if (isManual) {
          isManualRefresh.value = true
        }
        hasError.value = false
        console.log('Fetching collected amount...')
        
        const response = await getCollectedAmount()
        if (response.success) {
          const oldAmount = collectedAmount.value
          collectedAmount.value = response.formattedAmount
          lastUpdated.value = new Date()
          
          if (oldAmount !== response.formattedAmount && !isFirstLoad.value) {
            console.log('Amount updated from', oldAmount, 'to', response.formattedAmount)
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
      } finally {
        if (showLoading) {
          isLoading.value = false
        }
        if (isManual) {
          isManualRefresh.value = false
        }
        isFirstLoad.value = false
      }
    }
    
    const manualRefresh = async () => {
      if (isLoading.value || isManualRefresh.value) return
      console.log('Manual refresh triggered')
      await fetchCollectedAmount(false, true)
    }
    
    const startAutoRefresh = () => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
      }
      
      refreshInterval.value = setInterval(() => {
        console.log('Auto-refreshing collected amount...')
        fetchCollectedAmount(false)
      }, 5000)
      
      console.log('Auto-refresh started - will update every 5 seconds')
    }
    
    const stopAutoRefresh = () => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
        refreshInterval.value = null
        console.log('Auto-refresh stopped')
      }
    }
    
    // Lifecycle
    onMounted(async () => {
      showLoader('Loading banner...')
      
      // Preload all banner images
      const imagePromises = props.images.map(image => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = image.url
          img.onload = () => resolve()
          img.onerror = () => resolve()
        })
      })
      
      // Load collected amount data initially (commented for future use)
      await fetchCollectedAmount(true)
      
      // Start auto-refresh and auto-slide
      startAutoRefresh()
      startAutoSlide()
      
      // Wait for images to load or timeout
      Promise.all(imagePromises).finally(() => {
        hideLoader()
      })
      
      setTimeout(() => hideLoader(), 3000)
    })
    
    onBeforeUnmount(() => {
      stopAutoRefresh()
      stopAutoSlide()
    })

    return {
      // Slider
      currentSlide,
      isTransitioning,
      nextSlide,
      previousSlide,
      goToSlide,
      startAutoSlide,
      stopAutoSlide,
      
      // Amount functionality (commented - keeping for future use)
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
/* Main Container */
.banner-container {
  width: 100%;
}

/* Slider Section - 4-Side Curved (Reduced Height) */
.slider-section {
  position: relative;
  height: 40vh;
  min-height: 250px;
  max-height: 350px;
  width: calc(100% - 2rem);
  margin: 1rem auto;
  overflow: hidden;
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.slider-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  cursor: pointer;
  border-radius: 25px;
  touch-action: pan-y;
}

.slide.active {
  opacity: 1;
}

/* Enhanced Slide Indicators */
.slide-indicators {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 3;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
}

.indicator.active {
  background: white;
  border-color: white;
  transform: scale(1.3);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.indicator:hover:not(:disabled):not(.active) {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.indicator:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Buttons Section - Sticky Bottom (Reduced Height) */
.buttons-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 0.75rem 1rem;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e2e8f0;
  z-index: 1000;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  max-width: 900px;
  margin: 0 auto;
  justify-content: center;
}

.action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex: 1;
  min-width: 0;
  text-align: center;
}

.action-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.btn-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  flex-shrink: 0;
}

.donate-btn .btn-icon {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.offer-btn .btn-icon {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
}

.btn-content {
  display: flex;
  flex-direction: row;
  text-align: center;
  flex: 1;
}

.btn-title {
  color: #2d3748;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0;
}

.btn-subtitle {
  display: none; /* Hide subtitle for cleaner look */
}

/* Responsive Design */
@media (min-width: 640px) {
  .slider-section {
    height: 45vh;
    min-height: 280px;
    max-height: 400px;
    width: calc(100% - 3rem);
    margin: 1.5rem auto;
    border-radius: 30px;
  }
  
  .slider-container {
    border-radius: 30px;
  }
  
  .slide {
    border-radius: 30px;
  }
  
  .buttons-section {
    padding: 0.875rem 1.25rem;
  }
  
  .action-buttons {
    gap: 1rem;
    max-width: 400px;
  }
  
  .action-btn {
    padding: 0.875rem 2rem;
  }

  .btn-icon {
    width: 22px;
    height: 22px;
    font-size: 0.9rem;
  }

  .btn-title {
    font-size: 1rem;
  }

  .indicator {
    width: 14px;
    height: 14px;
  }
}

@media (min-width: 768px) {
  .slider-section {
    height: 50vh;
    min-height: 320px;
    max-height: 450px;
    width: calc(100% - 4rem);
    margin: 2rem auto;
    border-radius: 35px;
  }
  
  .slider-container {
    border-radius: 35px;
  }
  
  .slide {
    border-radius: 35px;
  }
  
  .buttons-section {
    padding: 1rem 1.5rem;
  }
  
  .action-buttons {
    gap: 1.25rem;
    max-width: 450px;
  }
  
  .action-btn {
    padding: 1rem 2.5rem;
  }
  
  .btn-icon {
    width: 24px;
    height: 24px;
    font-size: 1rem;
  }
  
  .btn-title {
    font-size: 1.1rem;
  }

  .indicator {
    width: 16px;
    height: 16px;
  }
}

@media (min-width: 1024px) {
  .slider-section {
    width: calc(100% - 5rem);
    margin: 2.5rem auto;
  }

  .buttons-section {
    padding: 1.125rem 1.75rem;
  }

  .action-buttons {
    gap: 1.5rem;
    max-width: 500px;
  }

  .btn-icon {
    width: 26px;
    height: 26px;
    font-size: 1.1rem;
  }

  .btn-title {
    font-size: 1.2rem;
  }
}

/* Animations */
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

.slider-section {
  animation: slideInUp 0.8s ease-out;
}

.action-buttons {
  animation: slideInUp 0.8s ease-out 0.2s both;
}
</style>