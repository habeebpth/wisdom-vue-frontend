<template>
  <div v-if="show" class="preloader-overlay">
    <div class="preloader-content">
      <div class="spinner"></div>
      <p v-if="message" class="preloader-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preloader',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Loading...'
    }
  }
}
</script>

<style scoped>
.preloader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.preloader-content {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4A90E2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.preloader-message {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>