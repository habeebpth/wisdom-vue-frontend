<template>
  <div class="banner-container">
    <!-- Image Slider Section - Optimized for 800×350 dimensions -->
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
          <span class="btn-title">Donate Now</span>
        </router-link>

        <!-- Offer Now Button -->
        <router-link to="/offer" class="action-btn offer-btn">
          <div class="btn-icon">
            <i class="fas fa-hands-helping"></i>
          </div>
          <span class="btn-title">Offer Now</span>
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
    
    // State for collected amount (keeping for future use)
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
      if (isTransitioning.value || currentSlide.value === index) return
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
    
    // Amount functionality (keeping for future use)
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
      
      // Amount functionality (keeping for future use)
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

/* Slider Section - Optimized for 800×350 aspect ratio */
.slider-section {
  position: relative;
  width: 100%;
  aspect-ratio: 800 / 350; /* Maintains exact 800:350 ratio */
  max-width: 1200px;
  margin: 1rem auto;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.slider-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
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
  border-radius: 20px;
  touch-action: pan-y;
}

.slide.active {
  opacity: 1;
}

.slide:hover {
  transform: scale(1.02);
  transition: all 0.3s ease;
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
  background: rgba(0, 0, 0, 0.3);
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

/* Buttons Section - Sticky Bottom */
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
  background: none;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  justify-content: center;
}

.action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
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
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e0;
}

.btn-icon {
  width: 20px;
  height: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.action-btn:hover .btn-icon {
  transform: scale(1.1);
}

.donate-btn .btn-icon {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.offer-btn .btn-icon {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
}

.history-btn .btn-icon {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.btn-content {
  display: flex;
  flex-direction: column;
  text-align: center;
  flex: 1;
}

.btn-title {
  color: #2d3748;
  font-size: 0.95rem;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.btn-subtitle {
  display: none; /* Hide subtitle for cleaner mobile look */
  color: #718096;
  font-size: 0.75rem;
  font-weight: 400;
}

/* Responsive Design - Mobile First */
@media (max-width: 479px) {
  .slider-section {
    margin: 0.5rem;
    border-radius: 15px;
    /* On very small screens, allow some height flexibility while maintaining aspect ratio */
    min-height: 200px;
    max-height: 280px;
  }
  
  .slide-indicators {
    bottom: 1rem;
    padding: 0.5rem 1rem;
  }
  
  .indicator {
    width: 10px;
    height: 10px;
  }
  
  .action-buttons {
    gap: 0.75rem;
  }
  
  .action-btn {
    padding: 0.6rem 1rem;
    border-radius: 10px;
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    font-size: 0.75rem;
  }
  
  .btn-title {
    font-size: 0.85rem;
  }
}

@media (min-width: 480px) {
  .slider-section {
    margin: 1rem;
    border-radius: 18px;
  }
  
  .buttons-section {
    padding: 0.875rem 1.25rem;
  }
  
  .action-buttons {
    gap: 1.25rem;
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
    margin: 1.5rem auto;
    border-radius: 25px;
    max-width: 1000px;
  }
  
  .buttons-section {
    padding: 1rem 1.5rem;
  }
  
  .action-buttons {
    gap: 1.5rem;
    max-width: 450px;
  }
  
  .action-btn {
    border-radius: 15px;
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
  
  .btn-subtitle {
    display: none; /* Keep subtitle hidden on all screens */
  }
}

@media (min-width: 1024px) {
  .slider-section {
    margin: 2rem auto;
    border-radius: 30px;
    max-width: 1200px;
  }

  .buttons-section {
    padding: 1.125rem 1.75rem;
  }

  .action-buttons {
    gap: 2rem;
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

/* Prevent banner from getting too large on ultra-wide screens */
@media (min-width: 1400px) {
  .slider-section {
    max-height: 525px; /* Maintains aspect ratio for 1200px width */
  }
}

/* Landscape phones - adjust height */
@media (max-height: 600px) and (orientation: landscape) {
  .slider-section {
    max-height: 40vh;
    min-height: 180px;
  }
  
  .slide-indicators {
    bottom: 0.75rem;
    padding: 0.5rem 1rem;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slider-section {
  animation: slideInUp 0.8s ease-out;
}

.action-buttons {
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.slide.active {
  animation: fadeIn 0.6s ease-in-out;
}

/* Loading states */
.slide::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.slide:not(.active)::after {
  opacity: 1;
}

/* Touch improvements */
.slide {
  -webkit-tap-highlight-color: transparent;
}

.indicator {
  -webkit-tap-highlight-color: transparent;
}

.action-btn {
  -webkit-tap-highlight-color: transparent;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .slide,
  .indicator,
  .action-btn,
  .btn-icon {
    transition: none;
  }
  
  .slider-section,
  .action-buttons {
    animation: none;
  }
}

/* Focus states for better accessibility */
.indicator:focus,
.action-btn:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}
</style>