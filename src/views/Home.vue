<template>
  <div class="home-container">
    <!-- Banner Component -->
    <Banner />

    <!-- How to Pay Section -->
    <!-- <div class="how-to-pay-section">
      <div class="pay-background">
        <div class="pay-overlay">
          <div class="pay-content">
            <h2 class="pay-title">How to Pay</h2>
            <p class="pay-subtitle">Learn the easy steps to make your contribution</p>
            <button @click="openYouTubeVideo" class="watch-btn">
              <div class="watch-icon">
                <i class="fab fa-youtube"></i>
              </div>
              <span>Watch Now</span>
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- App Support Section -->
    <div class="app-support-section">
      <div class="support-container">
        <h2 class="support-title">App Support</h2>
        <p class="support-subtitle">Our app support team is here to help you</p>
        
        <div class="support-buttons">
          <a href="https://wa.me/918606000750" class="support-btn whatsapp-btn" target="_blank">
            <div class="support-icon">
              <i class="fab fa-whatsapp"></i>
            </div>
            <span>WhatsApp</span>
          </a>
          
          <a href="tel:+918606000750" class="support-btn call-btn">
            <div class="support-icon">
              <i class="fas fa-phone"></i>
            </div>
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <div class="bottom-container">
        <div class="bottom-info">
          <p class="version">Version 1.0</p>
          <p class="organization">Wisdom Islamic Organisation</p>
        </div>
      </div>
    </div>

    <!-- YouTube Modal -->
    <div v-if="showVideoModal" class="video-modal" @click="closeVideoModal">
      <div class="modal-content" @click.stop>
        <button @click="closeVideoModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
        <div class="video-container">
          <iframe
            :src="youtubeEmbedUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Spacer for sticky buttons -->
    <div class="sticky-spacer"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import Banner from '@/components/Banner.vue'

export default {
  name: 'Home',
  components: {
    Banner
  },
  setup() {
    const showVideoModal = ref(false)
    const youtubeVideoId = ref('dQw4w9WgXcQ') // Replace with actual video ID
    
    // Get preloader functions
    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')
    
    const youtubeEmbedUrl = computed(() => {
      return `https://www.youtube.com/embed/${youtubeVideoId.value}?autoplay=1`
    })
    
    const openYouTubeVideo = () => {
      showVideoModal.value = true
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    
    const closeVideoModal = () => {
      showVideoModal.value = false
      // Restore body scroll
      document.body.style.overflow = 'auto'
    }
    
    // Show preloader when the page is loading
    onMounted(() => {
      showLoader('Loading home page...')
      
      // Simulate a short delay to ensure assets are loaded
      setTimeout(() => {
        hideLoader()
      }, 800)
    })
    
    return {
      showVideoModal,
      youtubeEmbedUrl,
      openYouTubeVideo,
      closeVideoModal
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f8f9fa;
}

/* How to Pay Section */
.how-to-pay-section {
  margin: 2rem 1rem;
}

.pay-background {
  position: relative;
  height: 300px;
  background-image: url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.pay-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.85) 0%, rgba(53, 122, 189, 0.85) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.pay-content {
  text-align: center;
  color: white;
}

.pay-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.pay-subtitle {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.watch-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;
}

.watch-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.watch-icon {
  width: 40px;
  height: 40px;
  background: #FF0000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

/* App Support Section */
.app-support-section {
  background: white;
  margin: 2rem 1rem;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.support-container {
  padding: 2.5rem 2rem;
  text-align: center;
}

.support-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.support-subtitle {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 2rem;
}

.support-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: nowrap; /* Keep buttons in same line */
}

.support-btn {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.85rem;
  flex: 1;
  max-width: 140px;
  justify-content: center;
}

.whatsapp-btn {
  color: #25D366;
  border-color: #25D366;
}

.whatsapp-btn:hover {
  background: #25D366;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
}

.call-btn {
  color: #4299e1;
  border-color: #4299e1;
}

.call-btn:hover {
  background: #4299e1;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(66, 153, 225, 0.3);
}

.support-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

/* Bottom Section */
.bottom-section {
  background: #2d3748;
  color: white;
  margin: 2rem 1rem;
  border-radius: 20px;
  overflow: hidden;
}

.bottom-container {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-info {
  text-align: center;
}

.version {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0 0 0.25rem 0;
}

.organization {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

/* Video Modal */
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 800px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Sticky Spacer */
.sticky-spacer {
  height: 80px; /* Reduced space for smaller sticky buttons */
}

/* Responsive Design */
@media (min-width: 640px) {
  .how-to-pay-section,
  .app-support-section,
  .bottom-section {
    margin: 2rem auto;
    max-width: 600px;
  }
  
  .pay-background {
    height: 350px;
  }
  
  .pay-title {
    font-size: 2.5rem;
  }
  
  .support-buttons {
    gap: 1rem;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .support-btn {
    max-width: 150px;
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 768px) {
  .how-to-pay-section,
  .app-support-section,
  .bottom-section {
    max-width: 800px;
  }
  
  .support-buttons {
    max-width: 350px;
  }
  
  .support-btn {
    max-width: 170px;
  }
}

@media (min-width: 1024px) {
  .how-to-pay-section,
  .app-support-section,
  .bottom-section {
    max-width: 1000px;
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

.how-to-pay-section {
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.app-support-section {
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.bottom-section {
  animation: slideInUp 0.8s ease-out 0.6s both;
}
</style>