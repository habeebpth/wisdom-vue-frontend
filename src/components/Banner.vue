<template>
  <div class="banner-container">
    <!-- Main Slider Section -->
    <div class="slider-section">
      <div class="slider-container">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          :class="['slide', { active: currentSlide === index }]"
          :style="{ backgroundImage: `url(${slide.image})` }"
          @click="handleSlideClick(slide)"
        ></div>
      </div>

      <!-- Slide Indicators -->
      <div class="slide-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          :class="['indicator', { active: currentSlide === index }]"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>

    <!-- Sticky Action Buttons -->
    <div class="buttons-section">
      <div class="action-buttons">
        <router-link to="/donate" class="action-btn donate-btn">
          <div class="btn-icon">
            <i class="fas fa-heart"></i>
          </div>
          <div class="btn-content">
            <div class="btn-title">Donate Now</div>
          </div>
        </router-link>

        <router-link to="/offer" class="action-btn offer-btn">
          <div class="btn-icon">
            <i class="fas fa-hand-holding-heart"></i>
          </div>
          <div class="btn-content">
            <div class="btn-title">Offer Now</div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- About Wisdom House Section -->
    <div class="about-section">
      <div class="about-container">
        <div class="about-content">
          <h2 class="about-title">Wisdom House</h2>
          <div class="about-text">
            <p>കേരളത്തിലെ മുസ്‌ലിം നവോത്ഥാന സംരംഭങ്ങൾക്ക് നേതൃത്വം വഹിക്കുന്ന മുജാഹിദ് പ്രസ്ഥാനത്തിന്റെ ഭാഗമായ വിസ്ഡം ഇസ്‌ലാമിക് ഓർഗനൈസേഷന്റെ ആസ്ഥാന മന്ദിരമാണ് വിസ്ഡം ഹൗസ്. കോഴിക്കോട് നഗരത്തിന്റെ ഹൃദയഭാഗമായ പാളയം ജംഗ്ഷന് സമീപം നിർമ്മാണത്തിലിരിക്കുന്ന വിസ്ഡം ഹൗസ്, മഹത്തായ ഒരു പ്രബോധന സംരംഭത്തെ അകമഴിഞ്ഞ് സഹായിക്കാനുള്ള അവസരമാണ്. 25 കോടി രൂപ ചെലവ് വരുന്ന ഈ പദ്ധതിയെ സഹായിക്കുക. അള്ളാഹു അനുഗ്രഹിക്കട്ടെ. ആമീൻ...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ResponsiveBanner',
  setup() {
    const currentSlide = ref(0)
    const autoSlideInterval = ref(null)
    
    const slides = ref([
      {
        image: 'images/new_edited.jpeg?auto=format&fit=crop&q=80&w=800&h=350',
        title: '',
        action: 'donate'
      },
      {
        image: 'images/wh_banner_2.jpeg?auto=format&fit=crop&q=80&w=800&h=350',
        title: 'Join Our Mission',
        action: 'history'
      },
      {
        image: 'images/wh_banner_3.jpeg?auto=format&fit=crop&q=80&w=800&h=350',
        title: 'Join Our Mission',
        action: 'history'
      },
      {
        image: 'images/wh_banner_4.jpeg?auto=format&fit=crop&q=80&w=800&h=350',
        title: 'Your Contribution Matters',
        action: 'offer'
      },
      {
        image: 'images/wh_banner_5.jpeg?auto=format&fit=crop&q=80&w=800&h=350',
        title: 'Join Our Mission',
        action: 'history'
      }
    ])

    const goToSlide = (index) => {
      currentSlide.value = index
      resetAutoSlide()
    }

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % slides.value.length
    }

    const startAutoSlide = () => {
      autoSlideInterval.value = setInterval(nextSlide, 5000)
    }

    const stopAutoSlide = () => {
      if (autoSlideInterval.value) {
        clearInterval(autoSlideInterval.value)
        autoSlideInterval.value = null
      }
    }

    const resetAutoSlide = () => {
      stopAutoSlide()
      startAutoSlide()
    }

    const handleSlideClick = (slide) => {
      // Handle slide click based on action
      if (slide.action === 'donate') {
        this.$router.push('/donate')
      } else if (slide.action === 'offer') {
        this.$router.push('/offer')
      } else if (slide.action === 'history') {
        this.$router.push('/history')
      }
    }

    onMounted(() => {
      startAutoSlide()
    })

    onUnmounted(() => {
      stopAutoSlide()
    })

    return {
      currentSlide,
      slides,
      goToSlide,
      handleSlideClick
    }
  }
}
</script>

<style scoped>
/* Base Mobile-First Styles */
.banner-container {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
}

/* Slider Section - Mobile First */
.slider-section {
  position: relative;
  width: 100%;
  min-height: 200px;
  max-height: 280px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.slider-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
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
  border-radius: inherit;
}

.slide.active {
  opacity: 1;
}

/* Slide Indicators - Mobile Optimized */
.slide-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(8px);
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 10px; /* Prevent shrinking */
}

.indicator.active {
  background: white;
  border-color: white;
  transform: scale(1.2);
}

.indicator:hover:not(.active) {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.8);
}

/* Buttons Section - Sticky with proper responsive design */
.buttons-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.875rem 1rem;
  padding-bottom: max(0.875rem, env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  max-width: 400px;
  margin: 0 auto;
  justify-content: center;
}

.action-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1.5px solid rgba(226, 232, 240, 0.8);
  border-radius: 14px;
  padding: 0.875rem 1.25rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.6s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:active {
  transform: scale(0.98);
}

.donate-btn {
  border-color: rgba(231, 76, 60, 0.3);
}

.donate-btn:hover {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: rgba(231, 76, 60, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(231, 76, 60, 0.25);
}

.offer-btn {
  border-color: rgba(39, 174, 96, 0.3);
}

.offer-btn:hover {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: rgba(39, 174, 96, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(39, 174, 96, 0.25);
}

.btn-icon {
  width: 20px;
  height: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: white;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.action-btn:hover .btn-icon {
  transform: scale(1.1) rotate(5deg);
}

.donate-btn .btn-icon {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.offer-btn .btn-icon {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
}

.btn-content {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1;
  min-width: 0;
}

.btn-title {
  color: #1a202c;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

/* Small Mobile (320px - 479px) */
@media (max-width: 479px) {
  .buttons-section {
    padding: 0.75rem 0.875rem;
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
  }
  
  .action-buttons {
    gap: 0.625rem;
    max-width: 100%;
  }
  
  .action-btn {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    gap: 0.5rem;
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    font-size: 0.8rem;
  }
  
  .btn-title {
    font-size: 0.8rem;
  }
}

/* Mobile (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .buttons-section {
    padding: 0.875rem 1rem;
    padding-bottom: max(0.875rem, env(safe-area-inset-bottom, 0px));
  }
  
  .action-buttons {
    gap: 0.75rem;
    max-width: 420px;
  }
  
  .action-btn {
    padding: 0.875rem 1.25rem;
    border-radius: 14px;
  }
  
  .btn-title {
    font-size: 0.9rem;
  }
}
/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .slider-section {
    height: 50vh;
    min-height: 280px;
    max-height: 400px;
    margin: 1rem auto;
    border-radius: 20px;
    max-width: 900px;
  }

  .buttons-section {
    padding: 1rem 1.5rem;
    padding-bottom: max(1rem, env(safe-area-inset-bottom, 0px));
  }

  .action-buttons {
    gap: 1rem;
    max-width: 480px;
  }

  .action-btn {
    padding: 1rem 1.5rem;
    border-radius: 16px;
    gap: 0.75rem;
  }

  .btn-icon {
    width: 22px;
    height: 22px;
    font-size: 0.95rem;
  }

  .btn-title {
    font-size: 1rem;
  }

  .indicator {
    width: 12px;
    height: 12px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .slider-section {
    height: 400px;
    max-height: 500px;
    margin: 2rem auto;
    border-radius: 25px;
    max-width: 1200px;
  }

  .buttons-section {
    padding: 1.125rem 2rem;
    padding-bottom: max(1.125rem, env(safe-area-inset-bottom, 0px));
  }

  .action-buttons {
    gap: 1.25rem;
    max-width: 520px;
  }

  .action-btn {
    padding: 1.125rem 2rem;
    border-radius: 18px;
    gap: 0.875rem;
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
    width: 14px;
    height: 14px;
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .buttons-section {
    padding: 1.25rem 2.5rem;
    padding-bottom: max(1.25rem, env(safe-area-inset-bottom, 0px));
  }

  .action-buttons {
    gap: 1.5rem;
    max-width: 600px;
  }

  .action-btn {
    padding: 1.25rem 2.5rem;
    border-radius: 20px;
    gap: 1rem;
  }

  .btn-icon {
    width: 26px;
    height: 26px;
    font-size: 1.1rem;
  }

  .btn-title {
    font-size: 1.15rem;
  }
}

/* Prevent horizontal scrolling and add proper spacing */
@media (max-width: 767px) {
  .banner-container,
  .slider-section,
  .buttons-section {
    max-width: 100vw;
    overflow-x: hidden;
  }
}

/* Add responsive bottom margin for sticky buttons */
.banner-container::after {
  content: '';
  display: block;
   /* Small mobile */
}

@media (min-width: 480px) {
  .banner-container::after {
    height: 75px; /* Mobile */
  }
}

@media (min-width: 768px) {
  .banner-container::after {
    height: 85px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .banner-container::after {
    height: 95px; /* Desktop */
  }
}

@media (min-width: 1440px) {
  .banner-container::after {
    height: 105px; /* Large desktop */
  }
}

/* Landscape mobile adjustments */
@media (max-height: 500px) and (orientation: landscape) {
  .slider-section {
    height: 70vh;
    min-height: 160px;
    max-height: 200px;
  }
  
  .slide-indicators {
    bottom: 0.5rem;
    padding: 0.4rem 0.8rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .slide,
  .indicator,
  .action-btn {
    transition: none;
  }
}

/* Focus states */
.indicator:focus,
.action-btn:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

/* Touch improvements */
.slide,
.indicator,
.action-btn {
  -webkit-tap-highlight-color: transparent;
}

/* About Wisdom House Section */
.about-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 3rem 0;
  margin-top: 1rem;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.about-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.about-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 2rem;
  position: relative;
}

.about-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border-radius: 2px;
}

.about-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4a5568;
  text-align: justify;
}

.about-text p {
  margin: 0;
  padding: 0 1rem;
}

/* Responsive adjustments for About section */
@media (max-width: 479px) {
  .about-section {
    padding: 2rem 0;
    margin-top: 0.5rem;
  }
  
  .about-title {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
  
  .about-text {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .about-text p {
    padding: 0 0.5rem;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .about-section {
    padding: 2.5rem 0;
  }
  
  .about-title {
    font-size: 2rem;
  }
  
  .about-text {
    font-size: 1.0625rem;
  }
}

@media (min-width: 768px) {
  .about-section {
    padding: 3.5rem 0;
  }
  
  .about-text {
    text-align: center;
  }
  
  .about-text p {
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .about-section {
    padding: 4rem 0;
  }
  
  .about-title {
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
  }
  
  .about-text {
    font-size: 1.1875rem;
  }
}
</style>