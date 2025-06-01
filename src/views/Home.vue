<template>
  <div>
    <Banner :imageUrl="bannerImage" title="₹123133.00" subtitle="Your contribution can change lives and create lasting impact">
      <router-link to="/donate" class="btn btn-primary">
        <i class="fas fa-heart mr-2"></i> Donate Now
      </router-link>
      <router-link to="/offer" class="btn btn-secondary">
        <i class="fas fa-gift mr-2"></i> Offer Now
      </router-link>
    </Banner>
    
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Make a Difference Today</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Your contribution helps us continue our mission of providing support and resources to those in need.
            Every donation, no matter how small, makes a significant impact.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Donation Impact Card -->
          <div class="bg-blue-50 rounded-lg p-6 shadow-sm">
            <div class="text-blue-600 text-4xl mb-4">
              <i class="fas fa-hand-holding-heart"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Your Impact</h3>
            <p class="text-gray-600">
              Every donation helps us reach more people and provide essential services to communities in need.
            </p>
          </div>
          
          <!-- Transparency Card -->
          <div class="bg-green-50 rounded-lg p-6 shadow-sm">
            <div class="text-green-600 text-4xl mb-4">
              <i class="fas fa-chart-pie"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Transparency</h3>
            <p class="text-gray-600">
              We are committed to full transparency in how your donations are used and the impact they create.
            </p>
          </div>
          
          <!-- Easy Donations Card -->
          <div class="bg-yellow-50 rounded-lg p-6 shadow-sm">
            <div class="text-yellow-600 text-4xl mb-4">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Easy Donations</h3>
            <p class="text-gray-600">
              Our secure payment system makes it easy to donate anytime, anywhere, from any device.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="md:w-1/2">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">Support Our Mission</h2>
            <p class="text-lg text-gray-600 mb-6">
              Wisdom Donations is dedicated to improving lives through sustainable development, education, 
              and community support programs. Your donations help us continue this important work.
            </p>
            <router-link to="/donate" class="btn btn-primary inline-block">
              Donate Now
            </router-link>
          </div>
          
          <div class="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Recent Achievements</h3>
            <ul class="space-y-4">
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span class="text-gray-700">Provided educational support to 500+ students</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span class="text-gray-700">Implemented clean water projects in 10 communities</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span class="text-gray-700">Distributed medical supplies to underserved areas</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span class="text-gray-700">Launched 5 new community development programs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Toast notification for "Coming Soon" -->
    <div 
      v-if="showToast" 
      class="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
    >
      <i class="fas fa-info-circle mr-2"></i>
      <span>Offer Now feature coming soon!</span>
      <button @click="showToast = false" class="ml-4 text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.bg-white {
  background-color: white;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-center {
  text-align: center;
}

.mb-12 {
  margin-bottom: 3rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-bold {
  font-weight: 700;
}

.text-gray-800 {
  color: #1f2937;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-gray-600 {
  color: #4b5563;
}

.max-w-3xl {
  max-width: 48rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-8 {
  gap: 2rem;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.text-blue-600 {
  color: #4A90E2;
}

.text-4xl {
  font-size: 2.25rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-semibold {
  font-weight: 600;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.bg-green-50 {
  background-color: #ecfdf5;
}

.text-green-600 {
  color: #5CB85C;
}

.bg-yellow-50 {
  background-color: #fffbeb;
}

.text-yellow-600 {
  color: #F0AD4E;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.inline-block {
  display: inline-block;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.items-start {
  align-items: flex-start;
}

.text-green-500 {
  color: #5CB85C;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.text-gray-700 {
  color: #374151;
}

.fixed {
  position: fixed;
}

.bottom-4 {
  bottom: 1rem;
}

.right-4 {
  right: 1rem;
}

.bg-blue-600 {
  background-color: #4A90E2;
}

.text-white {
  color: white;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.mr-2 {
  margin-right: 0.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

.hover\:text-gray-200:hover {
  color: #e5e7eb;
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .md\:flex-row {
    flex-direction: row;
  }
  
  .md\:w-1\/2 {
    width: 50%;
  }
}
</style>

<script>
import { ref, inject, onMounted } from 'vue'
import Banner from '@/components/Banner.vue'

export default {
  name: 'Home',
  components: {
    Banner
  },
  setup() {
    const showToast = ref(false)
    const bannerImage = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'
    
    // Get preloader functions
    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')
    
    // Show preloader when the page is loading
    onMounted(() => {
      showLoader('Loading home page...')
      
      // Simulate a short delay to ensure assets are loaded
      setTimeout(() => {
        hideLoader()
      }, 800)
    })
    
    const showComingSoon = () => {
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }
    
    return {
      showToast,
      bannerImage,
      showComingSoon
    }
  }
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>