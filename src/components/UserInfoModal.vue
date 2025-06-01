<template>
  <div
    style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 0 1rem;">
    <div
      style="background-color: white; border-radius: 0.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); max-width: 28rem; width: 100%; padding: 1.5rem; animation: fadeIn 0.3s ease-in-out;">
      <h2 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem;">Welcome to Wisdom Donations
      </h2>
      <p style="color: #4b5563; margin-bottom: 1.5rem;">
        Please provide your information to continue. This will help us personalize your experience.
      </p>

      <form @submit.prevent="saveUserInfo">
        <div style="margin-bottom: 1rem;">
          <label for="name" class="form-label">Name <span style="color: #ef4444;">*</span></label>
          <input id="name" v-model="form.name" type="text" class="form-input" required placeholder="Enter your name" />
          <p v-if="errors.name" style="margin-top: 0.25rem; font-size: 0.875rem; color: #dc2626;">{{ errors.name }}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label for="mobile" class="form-label">Mobile Number</label>
          <div class="flex">
            <!-- Country Code Selector -->
            <div class="relative">
              <button type="button" @click="showCountryDropdown = !showCountryDropdown"
                class="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <span class="mr-2">{{ selectedMobileCountry.flag }}</span>
                <span class="mr-1">{{ selectedMobileCountry.code }}</span>
                <i class="fas fa-chevron-down text-xs"></i>
              </button>

              <!-- Country Dropdown -->
              <div v-if="showCountryDropdown"
                class="absolute top-full left-0 z-50 w-80 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                <div class="p-2">
                  <input v-model="countrySearch" type="text" placeholder="Search countries..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="max-h-48 overflow-y-auto">
                  <button v-for="country in filteredCountries" :key="country.code" type="button"
                    @click="selectCountry(country)"
                    class="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                    <span class="mr-3">{{ country.flag }}</span>
                    <span class="mr-2 text-sm font-mono">{{ country.code }}</span>
                    <span class="text-sm">{{ country.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Number Input -->
            <input id="mobile" v-model="form.mobile" type="tel"
              class="flex-1 form-input rounded-l-none border-l-0 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter mobile number (optional)" />
          </div>
          <div class="text-xs text-gray-500 mt-1" v-if="form.mobile">
            Expected format: {{ selectedMobileCountry.format }} for {{ selectedMobileCountry.name }}
          </div>
          <p v-if="errors.mobile" style="margin-top: 0.25rem; font-size: 0.875rem; color: #dc2626;">{{ errors.mobile }}
          </p>
        </div>

        <div style="display: flex; justify-content: center; margin-top: 1rem;">
          <button type="submit"
            style="background-color: #4A90E2; color: white; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 1.125rem; width: 100%; transition: background-color 0.2s ease;">
            Save Information
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  validateMobileNumber,
  getDefaultCountry,
  searchCountries,
  parseStoredMobile,
  formatMobileForStorage,
  formatMobileForDatabase
} from '@/utils/mobileValidation'
import { saveUserInfo as saveToLocalStorage, getUserInfo } from '@/utils/localStorage'

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

    // Mobile validation setup
    const selectedMobileCountry = ref(getDefaultCountry())
    const showCountryDropdown = ref(false)
    const countrySearch = ref('')

    const filteredCountries = computed(() => {
      return searchCountries(countrySearch.value)
    })

    const selectCountry = (country) => {
      selectedMobileCountry.value = country
      showCountryDropdown.value = false
      countrySearch.value = ''
    }

    // Load existing user info if available
    onMounted(() => {
      const existingUserInfo = getUserInfo()
      if (existingUserInfo) {
        form.name = existingUserInfo.name || ''

        if (existingUserInfo.mobile) {
          // Parse the stored mobile number
          const parsed = parseStoredMobile(existingUserInfo.mobile)
          selectedMobileCountry.value = parsed.country
          form.mobile = parsed.mobileNumber
        }
      }
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
      if (form.mobile) {
        const mobileError = validateMobileNumber(form.mobile, selectedMobileCountry.value, 'Mobile')
        if (mobileError) {
          errors.mobile = mobileError
          isValid = false
        }
      }

      return isValid
    }

    const saveUserInfo = () => {
      if (validateForm()) {
        // Store mobile number WITH country code in consistent format
        const fullMobile = form.mobile ?
          formatMobileForDatabase(form.mobile, selectedMobileCountry.value) : ''

        const userData = {
          name: form.name,
          mobile: fullMobile // Store as "+91-9876543210"
        }

        console.log('Saving user info:', userData)

        try {
          // Save to localStorage
          saveToLocalStorage(userData)

          // Update store state
          store.commit('user/setUserInfo', userData)

          console.log('User info saved successfully')

        } catch (error) {
          console.error('Error saving user info:', error)
          window.location.reload()
        }
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        showCountryDropdown.value = false
      }
    }

    // Add event listener for clicking outside
    if (typeof document !== 'undefined') {
      document.addEventListener('click', handleClickOutside)
    }

    return {
      form,
      errors,
      selectedMobileCountry,
      showCountryDropdown,
      countrySearch,
      filteredCountries,
      selectCountry,
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

.form-label {
  display: block;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.z-50 {
  z-index: 50;
}

.rounded-l-md {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.rounded-l-none {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.border-r-0 {
  border-right-width: 0;
}

.border-l-0 {
  border-left-width: 0;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.text-gray-500 {
  color: #6b7280;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mr-3 {
  margin-right: 0.75rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.p-2 {
  padding: 0.5rem;
}

.w-full {
  width: 100%;
}

.w-80 {
  width: 20rem;
}

.max-h-60 {
  max-height: 15rem;
}

.max-h-48 {
  max-height: 12rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

.bg-white {
  background-color: white;
}

.border {
  border-width: 1px;
}

.rounded-md {
  border-radius: 0.375rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.focus\:bg-gray-100:focus {
  background-color: #f3f4f6;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:ring-blue-500:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.focus\:border-blue-500:focus {
  border-color: #3b82f6;
}

.text-left {
  text-align: left;
}

.items-center {
  align-items: center;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>