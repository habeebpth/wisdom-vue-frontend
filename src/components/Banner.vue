<template>
  <div class="banner-container">
    <!-- Image Slider Section - Enhanced Mobile Responsive -->
    <div class="slider-section">
      <div class="slider-container">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="slide"
          :class="{ active: currentSlide === index }"
          :style="getImageStyle(image)"
          @click="nextSlide"
        >
          <!-- Optional overlay for better text readability -->
          <div class="slide-overlay"></div>
        </div>
        
        <!-- Slide Indicators -->
        <div class="slide-indicators">
          <button
            v-for="(image, index) in images"
            :key="index"
            @click="goToSlide(index)"
            class="indicator"
            :class="{ active: currentSlide === index }"
            :disabled="isTransitioning"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>

        <!-- Navigation Arrows (Hidden on very small screens) -->
        <button 
          @click="previousSlide" 
          class="nav-arrow nav-arrow-left"
          :disabled="isTransitioning"
          aria-label="Previous slide"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          @click="nextSlide" 
          class="nav-arrow nav-arrow-right"
          :disabled="isTransitioning"
          aria-label="Next slide"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Action Buttons Section - Mobile Optimized -->
    <div class="buttons-section">
      <div class="action-buttons">
        <!-- Donate Now Button -->
        <router-link to="/donate" class="action-btn donate-btn">
          <div class="btn-icon">
            <i class="fas fa-heart"></i>
          </div>
          <div class="btn-content">
            <span class="btn-title">Donate Now</span>
            <span class="btn-subtitle">Make a difference</span>
          </div>
        </router-link>

        <!-- Offer Now Button -->
        <router-link to="/offer" class="action-btn offer-btn">
          <div class="btn-icon">
            <i class="fas fa-hands-helping"></i>
          </div>
          <div class="btn-content">
            <span class="btn-title">Offer Now</span>
            <span class="btn-subtitle">Pledge support</span>
          </div>
        </router-link>

        <!-- History Button (Hidden on very small screens, shown as icon-only) -->
        <router-link to="/payment-history" class="action-btn history-btn">
          <div class="btn-icon">
            <i class="fas fa-history"></i>
          </div>
          <div class="btn-content">
            <span class="btn-title">History</span>
            <span class="btn-subtitle">View contributions</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, inject, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'ResponsiveBanner',
  props: {
    images: {
      type: Array,
      default: () => [
        {
          url: '/images/new_banner.png',
          alt: 'Banner',
          fitType: 'contain', // 'contain' shows full image, 'cover' fills container, 'fill' stretches
          // High resolution alternatives
        },
        // {
        //   url: '/images/wh_banner_2.jpeg',
        //   alt: 'Community gathering',
        //   fitType: 'contain',
        //   srcset: '/images/wh_banner_2_2x.jpeg 2x, /images/wh_banner_2_3x.jpeg 3x'
        // },
        // {
        //   url: '/images/wh_banner_3.jpeg',
        //   alt: 'Helping hands',
        //   fitType: 'contain',
        //   srcset: '/images/wh_banner_3_2x.jpeg 2x, /images/wh_banner_3_3x.jpeg 3x'
        // },
        // {
        //   url: '/images/wh_banner_4.jpeg',
        //   alt: 'Islamic architecture',
        //   fitType: 'contain',
        //   srcset: '/images/wh_banner_4_2x.jpeg 2x, /images/wh_banner_4_3x.jpeg 3x'
        // }
      ]
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
    // Slider state
    const currentSlide = ref(0)
    const isTransitioning = ref(false)
    const slideTimer = ref(null)
    
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
    
    // Lifecycle
    onMounted(() => {
      startAutoSlide()
    })
    
    onBeforeUnmount(() => {
      stopAutoSlide()
    })

    
    // High resolution image handling with responsive fitting
    const getImageStyle = (image) => {
      // Check for high DPI displays
      const pixelRatio = window.devicePixelRatio || 1
      let imageUrl = image.url
      
      // Use high-res images for retina displays if available
      if (pixelRatio >= 2 && image.highRes) {
        imageUrl = image.highRes
      } else if (pixelRatio >= 1.5 && image.midRes) {
        imageUrl = image.midRes
      }
      
      // Determine background-size based on image fit preference
      const backgroundSize = image.fitType || 'contain' // 'contain', 'cover', or 'fill'
      
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: backgroundSize,
        // Force hardware acceleration for smoother transitions
        willChange: 'transform, opacity',
        transform: 'translateZ(0)'
      }
    }

    return {
      currentSlide,
      isTransitioning,
      nextSlide,
      previousSlide,
      goToSlide,
      getImageStyle
    }
  }
}
</script>

<style scoped>
/* Main Container */
.banner-container {
  width: 100%;
  position: relative;
}

/* Slider Section - Dynamic Height for Full Image Display */
.slider-section {
  position: relative;
  height: auto;
  min-height: 200px;
  max-height: none;
  width: 100%;
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  aspect-ratio: 16 / 9; /* Default aspect ratio, will adjust based on image */
}

.slider-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f8f9fa;
  background-attachment: scroll;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  cursor: pointer;
  touch-action: pan-y;
  /* High resolution image optimization */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: optimizeQuality;
}

.slide.active {
  opacity: 1;
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
}

/* Navigation Arrows - Hidden on mobile, visible on tablet+ */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 4;
  color: #333;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.nav-arrow:hover:not(:disabled) {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.nav-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-arrow-left {
  left: 15px;
}

.nav-arrow-right {
  right: 15px;
}

/* Slide Indicators - Reduced Bottom Spacing */
.slide-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 3;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.indicator.active {
  background: white;
  border-color: white;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.indicator:hover:not(:disabled):not(.active) {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.indicator:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Action Buttons Section - Mobile First Design */
.buttons-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e2e8f0;
  z-index: 1000;
  safe-area-inset-bottom: env(safe-area-inset-bottom);
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.action-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  min-height: 60px;
}

.action-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.btn-icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}

.donate-btn .btn-icon {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.offer-btn .btn-icon {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
}

.history-btn .btn-icon {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.btn-content {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1;
}

.btn-title {
  color: #2d3748;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
  line-height: 1.2;
}

.btn-subtitle {
  color: #718096;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.2;
}

/* History button hidden on very small screens */
.history-btn {
  display: none;
}

/* Tablet Styles (768px and up) */
@media (min-width: 768px) {
  .slider-section {
    width: calc(100% - 2rem);
    margin: 1rem auto;
    border-radius: 20px;
    aspect-ratio: 21 / 9; /* Wider aspect ratio for tablets */
  }
  
  .slider-container {
    border-radius: 20px;
  }
  
  .slide {
    border-radius: 20px;
  }

  /* Show navigation arrows on tablet+ */
  .nav-arrow {
    display: flex;
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  .nav-arrow-left {
    left: 20px;
  }

  .nav-arrow-right {
    right: 20px;
  }

  /* Show history button on tablet+ */
  .history-btn {
    display: flex;
  }

  .action-buttons {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 0 20px;
  }

  .buttons-section {
    padding: 16px 24px;
  }

  .action-btn {
    padding: 16px;
    min-height: 70px;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  .btn-title {
    font-size: 15px;
  }

  .btn-subtitle {
    font-size: 12px;
  }

  .slide-indicators {
    bottom: 15px;
    gap: 8px;
    padding: 8px 16px;
  }

  .indicator {
    width: 10px;
    height: 10px;
  }
}

/* Desktop Styles (1024px and up) */
@media (min-width: 1024px) {
  .slider-section {
    width: calc(100% - 4rem);
    margin: 2rem auto;
    border-radius: 25px;
    aspect-ratio: 24 / 9; /* Even wider for desktop */
  }

  .slider-container {
    border-radius: 25px;
  }

  .slide {
    border-radius: 25px;
  }

  .nav-arrow {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .nav-arrow-left {
    left: 25px;
  }

  .nav-arrow-right {
    right: 25px;
  }

  .buttons-section {
    padding: 20px 32px;
  }

  .action-buttons {
    gap: 20px;
    max-width: 700px;
  }

  .action-btn {
    padding: 20px;
    min-height: 80px;
  }

  .btn-icon {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .btn-title {
    font-size: 16px;
  }

  .btn-subtitle {
    font-size: 13px;
  }

  .slide-indicators {
    bottom: 18px;
    gap: 10px;
    padding: 10px 20px;
  }

  .indicator {
    width: 12px;
    height: 12px;
  }
}

/* Large Desktop (1440px and up) */
@media (min-width: 1440px) {
  .slider-section {
    max-width: 1200px;
    margin: 2rem auto;
  }

  .action-buttons {
    max-width: 800px;
  }
}

/* Very Small Mobile (320px and up) */
@media (max-width: 374px) {
  .slider-section {
    aspect-ratio: 4 / 3; /* More square ratio for very small screens */
  }

  .action-btn {
    padding: 10px;
    min-height: 55px;
    gap: 6px;
  }

  .btn-icon {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  .btn-title {
    font-size: 13px;
  }

  .btn-subtitle {
    font-size: 10px;
  }

  .buttons-section {
    padding: 10px 12px;
  }

  .action-buttons {
    gap: 8px;
  }

  .slide-indicators {
    bottom: 8px;
    gap: 4px;
    padding: 4px 8px;
  }

  .indicator {
    width: 6px;
    height: 6px;
  }
}

/* Landscape Mobile Phones */
@media (max-height: 500px) and (orientation: landscape) {
  .slider-section {
    aspect-ratio: 21 / 9;
    max-height: 70vh;
  }

  .buttons-section {
    position: relative;
    box-shadow: none;
    border-top: none;
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

.slider-section {
  animation: slideInUp 0.8s ease-out;
}

.action-buttons {
  animation: slideInUp 0.8s ease-out 0.2s both;
}

/* Touch improvements */
.slide {
  -webkit-tap-highlight-color: transparent;
}

.action-btn {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .slide,
  .indicator,
  .action-btn,
  .nav-arrow {
    transition: none;
  }
  
  .slider-section,
  .action-buttons {
    animation: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .buttons-section {
    background: #1a202c;
    border-top-color: #2d3748;
  }

  .action-btn {
    background: #2d3748;
    border-color: #4a5568;
    color: white;
  }

  .action-btn:hover {
    background: #4a5568;
  }

  .btn-title {
    color: white;
  }

  .btn-subtitle {
    color: #a0aec0;
  }
}
</style>