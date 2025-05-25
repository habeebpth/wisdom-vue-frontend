<template>
  <div style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 0 1rem;">
    <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); max-width: 28rem; width: 100%; padding: 1.5rem; animation: fadeIn 0.3s ease-in-out;">
      <h2 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem;">Welcome to Wisdom Donations</h2>
      <p style="color: #4b5563; margin-bottom: 1.5rem;">
        Please provide your information to continue. This will help us personalize your experience.
      </p>
      
      <form @submit.prevent="saveUserInfo">
        <div style="margin-bottom: 1rem;">
          <label for="name" class="form-label">Name <span style="color: #ef4444;">*</span></label>
          <input 
            id="name" 
            v-model="form.name" 
            type="text" 
            class="form-input" 
            required
            placeholder="Enter your name"
          />
          <p v-if="errors.name" style="margin-top: 0.25rem; font-size: 0.875rem; color: #dc2626;">{{ errors.name }}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label for="mobile" class="form-label">Mobile Number</label>
          <input 
            id="mobile" 
            v-model="form.mobile" 
            type="tel" 
            class="form-input" 
            placeholder="Enter your mobile number (optional)"
          />
          <p v-if="errors.mobile" style="margin-top: 0.25rem; font-size: 0.875rem; color: #dc2626;">{{ errors.mobile }}</p>
        </div>
        
        <div style="display: flex; justify-content: center; margin-top: 1rem;">
          <button type="submit" style="background-color: #4A90E2; color: white; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 1.125rem; width: 100%; transition: background-color 0.2s ease;">
            Save Information
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserInfoModal',
  setup() {
    const store = useStore()
    
    const form = reactive({
      name: '',
      mobile: ''
    })
    
    const errors = reactive({
      name: '',
      mobile: ''
    })
    
    const validateForm = () => {
      let isValid = true
      
      // Reset errors
      errors.name = ''
      errors.mobile = ''
      
      // Validate name
      if (!form.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
      }
      
      // Validate mobile (optional, but if provided, must be valid)
      if (form.mobile && !/^[0-9]{10}$/.test(form.mobile)) {
        errors.mobile = 'Please enter a valid 10-digit mobile number'
        isValid = false
      }
      
      return isValid
    }
    
    const saveUserInfo = () => {
      if (validateForm()) {
        store.dispatch('user/saveUserInfo', {
          name: form.name,
          mobile: form.mobile
        })
      }
    }
    
    return {
      form,
      errors,
      saveUserInfo
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
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>