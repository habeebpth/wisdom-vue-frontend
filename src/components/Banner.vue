<template>
  <div class="banner">
    <div class="banner-overlay">
      <h1 class="banner-title">{{ title }}</h1>
      <p class="banner-subtitle">{{ subtitle }}</p>
      <div class="banner-buttons">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  background-image: url('/img/backgrounds/mosque.jpeg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 31, 63, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  width: 100%;
  height: 100%;
}

.banner-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-subtitle {
  font-size: 1rem;
  color: white;
  margin-bottom: 1.5rem;
  max-width: 90%;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 300px;
}

@media (min-width: 640px) {
  .banner {
    height: 20rem;
  }
  
  .banner-title {
    font-size: 2rem;
  }
  
  .banner-subtitle {
    font-size: 1.125rem;
    max-width: 80%;
  }
  
  .banner-buttons {
    flex-direction: row;
    justify-content: center;
    max-width: none;
  }
}

@media (min-width: 768px) {
  .banner {
    height: 24rem;
  }
  
  .banner-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .banner-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    max-width: 42rem;
  }
}

@media (min-width: 1024px) {
  .banner-title {
    font-size: 3rem;
  }
  
  .banner-subtitle {
    font-size: 1.5rem;
  }
}
</style>

<script>
import { computed, ref, inject, onMounted } from 'vue'

export default {
  name: 'Banner',
  props: {
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'
    },
    title: {
      type: String,
      default: 'Make a Difference Today'
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
    
    // Ensure the banner image URL is set, with a fallback
    const bannerImageUrl = computed(() => {
      return props.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'
    })
    
    // Show preloader while the banner image is loading
    onMounted(() => {
      // Create a new image to preload the banner image
      const img = new Image()
      img.src = bannerImageUrl.value
      
      // Show loader while image is loading
      showLoader('Loading banner...')
      
      // Hide loader when image is loaded or on error
      img.onload = () => hideLoader()
      img.onerror = () => hideLoader()
      
      // Add a fallback in case image loading takes too long
      setTimeout(() => hideLoader(), 2000)
    })

    return {
      bannerImageUrl
    }
  }
}
</script>