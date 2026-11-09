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

    <!-- User Contribution Summary -->
    <section v-if="statsLoading && !userStats" class="contrib-card contrib-skeleton" aria-busy="true" aria-label="Loading your contribution">
      <div class="sk-row">
        <div class="sk sk-avatar"></div>
        <div class="sk-col">
          <div class="sk sk-line short"></div>
          <div class="sk sk-line"></div>
        </div>
      </div>
      <div class="sk sk-block"></div>
      <div class="sk-tiles">
        <div class="sk sk-tile"></div>
        <div class="sk sk-tile"></div>
        <div class="sk sk-tile"></div>
      </div>
    </section>

    <section v-else-if="showUserStats && summary" class="contrib-card" aria-labelledby="contrib-title">
      <header class="contrib-head">
        <div class="contrib-avatar" aria-hidden="true">{{ summary.initials }}</div>
        <div class="contrib-who">
          <p class="contrib-eyebrow" id="contrib-title">Your contribution</p>
          <h2 class="contrib-name">{{ summary.name }}</h2>
        </div>
        <router-link to="/payment-history" class="contrib-history">
          History <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </router-link>
      </header>

      <!-- Offer progress -->
      <div v-if="summary.offered > 0" class="pledge">
        <div class="pledge-top">
          <div>
            <p class="pledge-label">Paid so far</p>
            <p class="pledge-paid">
              ₹{{ formatAmount(summary.paid) }}
              <span class="pledge-of">of ₹{{ formatAmount(summary.offered) }}</span>
            </p>
          </div>
          <span :class="['pledge-pct', { done: summary.completed }]">{{ summary.percent }}%</span>
        </div>

        <div
          class="pledge-bar"
          role="progressbar"
          :aria-valuenow="summary.percent"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${summary.percent}% of your offer paid`"
        >
          <div class="pledge-fill" :style="{ width: summary.percent + '%' }"></div>
        </div>

        <p v-if="summary.completed" class="pledge-note done">
          <i class="fas fa-circle-check" aria-hidden="true"></i>
          Your offer is fully paid. Thank you!
        </p>
        <p v-else class="pledge-note">
          <strong>₹{{ formatAmount(summary.remaining) }}</strong> left to complete your offer
        </p>
      </div>

      <!-- No offer yet -->
      <div v-else class="pledge">
        <p class="pledge-label">Total donated</p>
        <p class="pledge-paid">₹{{ formatAmount(summary.paid) }}</p>
        <div class="pledge-nudge">
          <span class="pledge-nudge-text">
            <i class="fas fa-hand-holding-heart" aria-hidden="true"></i>
            No offer made yet
          </span>
          <router-link to="/offer" class="pledge-nudge-cta">
            Make an offer <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </router-link>
        </div>
      </div>

      <dl class="contrib-metrics">
        <div class="metric">
          <dt><i class="fas fa-receipt" aria-hidden="true"></i> Donations</dt>
          <dd>{{ summary.donationCount }}</dd>
        </div>
        <div class="metric">
          <dt><i class="fas fa-coins" aria-hidden="true"></i> Offered</dt>
          <dd>₹{{ formatAmount(summary.offered) }}</dd>
        </div>
        <div :class="['metric', { 'metric-due': summary.remaining > 0 }]">
          <dt><i class="fas fa-hourglass-half" aria-hidden="true"></i> Balance</dt>
          <dd>₹{{ formatAmount(summary.remaining) }}</dd>
        </div>
      </dl>
    </section>

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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/utils/localStorage'
import { getUserByMobile } from '@/utils/api'

export default {
  name: 'ResponsiveBanner',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentSlide = ref(0)
    const autoSlideInterval = ref(null)

    // User statistics
    const showUserStats = ref(false)
    const userStats = ref(null)
    const statsLoading = ref(false)
    let statsRequestId = 0

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
        router.push('/donate')
      } else if (slide.action === 'offer') {
        router.push('/offer')
      } else if (slide.action === 'history') {
        router.push('/payment-history')
      }
    }

    // Format amount with commas
    const formatAmount = (amount) => {
      if (!amount) return '0'
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(amount)
    }

    // Derived, display-ready numbers for the contribution card
    const summary = computed(() => {
      if (!userStats.value) return null
      const stats = userStats.value.statistics || {}
      const name = (userStats.value.user && userStats.value.user.name) || store.state.user.name || ''
      const paid = Number(stats.total_donated_amount) || 0
      const offered = Number(stats.total_offer_amount) || 0
      const remaining = Math.max(0, offered - paid)
      const percent = offered > 0 ? Math.min(100, Math.round((paid / offered) * 100)) : 0
      const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join('') || '?'

      return {
        name,
        initials,
        paid,
        offered,
        remaining,
        percent,
        completed: offered > 0 && paid >= offered,
        donationCount: Number(stats.total_donations) || 0
      }
    })

    // Fetch user statistics for the given mobile ("+91-9876543210" format)
    const fetchUserStats = async (mobile) => {
      const requestId = ++statsRequestId

      if (!mobile) {
        showUserStats.value = false
        userStats.value = null
        statsLoading.value = false
        return
      }

      statsLoading.value = true
      try {
        const response = await getUserByMobile(mobile)
        // Ignore responses that arrive after a newer request (e.g. user changed number)
        if (requestId !== statsRequestId) return

        if (response && response.success && response.found) {
          userStats.value = response
          showUserStats.value = true
        } else {
          userStats.value = null
          showUserStats.value = false
        }
      } catch (error) {
        if (requestId !== statsRequestId) return
        console.error('Error fetching user statistics:', error)
        userStats.value = null
        showUserStats.value = false
      } finally {
        if (requestId === statsRequestId) statsLoading.value = false
      }
    }

    // The store is the source of truth for the logged-in user. It is populated
    // either from localStorage on app start or by UserInfoModal on first login,
    // so watching it covers both cases without needing a page refresh.
    // Fall back to localStorage in case this component mounts before App.vue
    // has hydrated the store.
    watch(
      () => store.state.user.mobile || (getUserInfo() || {}).mobile || '',
      (mobile) => fetchUserStats(mobile),
      { immediate: true }
    )

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
      handleSlideClick,
      showUserStats,
      userStats,
      statsLoading,
      summary,
      formatAmount
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

/* ---------- Contribution Card ---------- */
.contrib-card {
  --c-ink: #1f2937;
  --c-muted: #6b7280;
  --c-line: #e8ecf1;
  --c-soft: #f6f8fb;
  --c-brand: #2f6fb6;
  --c-brand-soft: #e8f1fb;
  --c-good: #1f9d55;
  --c-good-soft: #e6f6ed;
  --c-due: #b45309;
  --c-due-soft: #fdf3e4;

  background: #fff;
  margin: 1rem 1rem 1.5rem;
  padding: 1.25rem;
  border: 1px solid var(--c-line);
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 6px 20px rgba(16, 24, 40, 0.06);
  color: var(--c-ink);
  animation: slideInUp 0.5s ease-out both;
}

/* Header */
.contrib-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.125rem;
}

.contrib-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--c-brand-soft);
  color: var(--c-brand);
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.contrib-who {
  flex: 1;
  min-width: 0;
}

.contrib-eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--c-muted);
  letter-spacing: 0.02em;
}

.contrib-name {
  margin: 0.125rem 0 0;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.contrib-history {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  background: var(--c-soft);
  color: var(--c-brand);
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.contrib-history i {
  font-size: 0.65rem;
}

.contrib-history:hover {
  background: var(--c-brand-soft);
}

/* Offer progress */
.pledge {
  background: var(--c-soft);
  border-radius: 14px;
  padding: 1rem;
}

.pledge-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.pledge-label {
  margin: 0 0 0.125rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--c-muted);
}

.pledge-paid {
  margin: 0;
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
  word-break: break-word;
}

.pledge-of {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-muted);
}

.pledge-pct {
  flex-shrink: 0;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: var(--c-brand-soft);
  color: var(--c-brand);
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.pledge-pct.done {
  background: var(--c-good-soft);
  color: var(--c-good);
}

.pledge-bar {
  height: 10px;
  border-radius: 999px;
  background: #e3e8ef;
  overflow: hidden;
}

.pledge-fill {
  height: 100%;
  min-width: 6px;
  border-radius: inherit;
  background: linear-gradient(90deg, #3aa86b 0%, var(--c-good) 100%);
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.pledge-note {
  margin: 0.625rem 0 0;
  font-size: 0.8125rem;
  color: var(--c-muted);
}

.pledge-note strong {
  color: var(--c-ink);
  font-weight: 600;
}

.pledge-note.done {
  color: var(--c-good);
  font-weight: 500;
}

/* No offer yet */
.pledge-nudge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #d8dee6;
}

.pledge-nudge-text {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--c-muted);
}

.pledge-nudge-text i {
  color: var(--c-good);
}

.pledge-nudge-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.75rem;
  border-radius: 999px;
  background: var(--c-good);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
}

.pledge-nudge-cta i {
  font-size: 0.625rem;
}

/* Metrics row */
.contrib-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0.75rem 0 0;
}

.metric {
  border: 1px solid var(--c-line);
  border-radius: 12px;
  padding: 0.625rem 0.75rem;
  min-width: 0;
}

.metric dt {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--c-muted);
  white-space: nowrap;
}

.metric dt i {
  font-size: 0.6875rem;
  opacity: 0.8;
}

.metric dd {
  margin: 0.25rem 0 0;
  font-size: 0.9375rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-due {
  background: var(--c-due-soft);
  border-color: transparent;
}

.metric-due dt,
.metric-due dd {
  color: var(--c-due);
}

/* Loading skeleton */
.contrib-skeleton .sk {
  background: linear-gradient(90deg, #eef1f5 25%, #f6f8fb 50%, #eef1f5 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.2s ease-in-out infinite;
  border-radius: 8px;
}

.sk-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.125rem;
}

.sk-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.sk-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50% !important;
}

.sk-line {
  height: 12px;
  width: 60%;
}

.sk-line.short {
  width: 35%;
}

.sk-block {
  height: 104px;
  border-radius: 14px !important;
}

.sk-tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.sk-tile {
  height: 56px;
  border-radius: 12px !important;
}

@keyframes sk-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (min-width: 640px) {
  .contrib-card {
    margin: 1.5rem auto;
    max-width: 600px;
    padding: 1.5rem;
  }

  .pledge {
    padding: 1.25rem;
  }

  .pledge-paid {
    font-size: 2rem;
  }

  .metric {
    padding: 0.875rem 1rem;
  }

  .metric dt {
    font-size: 0.75rem;
  }

  .metric dd {
    font-size: 1.0625rem;
  }
}

@media (min-width: 768px) {
  .contrib-card {
    max-width: 800px;
  }
}

@media (min-width: 1024px) {
  .contrib-card {
    max-width: 1000px;
  }
}

@media (max-width: 359px) {
  .contrib-metrics {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contrib-card,
  .pledge-fill,
  .contrib-skeleton .sk {
    animation: none;
    transition: none;
  }
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
</style>
