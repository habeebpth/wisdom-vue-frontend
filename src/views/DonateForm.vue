<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Progress Steps -->
        <div class="bg-blue-600 p-4">
          <div class="flex justify-between">
            <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center">
              <div
                class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
                :class="[
                  currentStep > index + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-400 text-white'
                ]">
                <span v-if="currentStep > index + 1"><i class="fas fa-check"></i></span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="text-xs mt-1 text-white">{{ step }}</span>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="mt-2 h-2 bg-blue-400 rounded-full">
            <div class="h-full bg-green-500 rounded-full transition-all duration-300"
              :style="{ width: `${(currentStep - 1) * (100 / (steps.length - 1))}%` }"></div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Make a Donation</h1>

          <!-- Step 1: Amount Selection -->
          <div v-if="currentStep === 1">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Select Donation Amount</h2>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <button v-for="(amount, index) in predefinedAmounts" :key="index" @click="selectAmount(amount)"
                class="py-3 px-4 border rounded-lg text-center transition-colors duration-200" :class="[
                  selectedAmount === amount
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]">
                ₹{{ amount }}
              </button>

              <button @click="showCustomAmount = true"
                class="py-3 px-4 border rounded-lg text-center transition-colors duration-200" :class="[
                  showCustomAmount
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]">
                Other Amount
              </button>

              <div v-if="showCustomAmount" class="col-span-2 sm:col-span-3 mt-4">
                <label for="customAmount" class="form-label">Custom Amount (₹)</label>
                <input id="customAmount" v-model.number="customAmount" type="number" min="1"
                  placeholder="Enter custom amount" class="form-input" @input="selectCustomAmount" />
              </div>
            </div>

            <div v-if="errors.amount" class="text-red-600 mb-4">{{ errors.amount }}</div>

            <div class="flex justify-between mt-8">
              <button @click="goBack" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                Back
              </button>
              <button @click="nextStep" class="btn btn-primary">
                Continue
              </button>
            </div>
          </div>

          <!-- Step 2: User Details -->
          <div v-if="currentStep === 2">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Your Information</h2>

            <div class="space-y-4">
              <div>
                <label for="name" class="form-label">Name <span class="text-red-500">*</span></label>
                <input id="name" v-model="form.name" type="text" class="form-input" required
                  placeholder="Enter your full name" />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <!-- <div>
                <label for="mobile" class="form-label">Mobile Number <span class="text-red-500">*</span></label>
                <input id="mobile" v-model="form.mobile" type="tel" class="form-input" required
                  placeholder="Enter your mobile number" />
                <p v-if="errors.mobile" class="mt-1 text-sm text-red-600">{{ errors.mobile }}</p>
              </div> -->

              <div>
                <label for="mobile" class="form-label">Mobile Number <span class="text-red-500">*</span></label>
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
                    required placeholder="Enter mobile number" />
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Expected format: {{ selectedMobileCountry.format }} for {{ selectedMobileCountry.name }}
                </div>
                <p v-if="errors.mobile" class="mt-1 text-sm text-red-600">{{ errors.mobile }}</p>
              </div>

              <div>
                <label for="district" class="form-label">District <span class="text-gray-500"></span></label>
                <select id="district" v-model="form.district" class="form-select" @change="onDistrictChange">
                  <option value="">Select a district</option>
                  <option v-for="district in districts" :key="district.id" :value="district.id">
                    {{ district.name }}
                  </option>
                </select>
                <p v-if="errors.district" class="mt-1 text-sm text-red-600">{{ errors.district }}</p>
              </div>

              <div>
                <label for="zone" class="form-label">Zone <span class="text-gray-500"></span></label>
                <select id="zone" v-model="form.zone" class="form-select" @change="onZoneChange"
                  :disabled="!form.district">
                  <option value="">Select a zone</option>
                  <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                    {{ zone.name }}
                  </option>
                </select>
                <p v-if="errors.zone" class="mt-1 text-sm text-red-600">{{ errors.zone }}</p>
              </div>

              <div>
                <label for="unit" class="form-label">Unit <span class="text-gray-500"></span></label>
                <select id="unit" v-model="form.unit" class="form-select" :disabled="!form.zone">
                  <option value="">Select a unit</option>
                  <option v-for="unit in units" :key="unit.id" :value="unit.id">
                    {{ unit.name }}
                  </option>
                </select>
                <p v-if="errors.unit" class="mt-1 text-sm text-red-600">{{ errors.unit }}</p>
              </div>
            </div>

            <div class="flex justify-between mt-8">
              <button @click="prevStep" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                Back
              </button>
              <button @click="confirmDetails" class="btn btn-primary">
                Continue to Payment
              </button>
            </div>
          </div>

          <!-- Step 3: Payment -->
          <div v-if="currentStep === 3">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Payment Details</h2>

            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Amount:</span>
                <span class="font-semibold">₹{{ selectedAmount }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Name:</span>
                <span class="font-semibold">{{ form.name }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Mobile:</span>
                <span class="font-semibold">{{ form.mobile }} {{ selectedMobileCountry.value }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Location:</span>
                <span class="font-semibold">
                  {{ getLocationText() }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-center mb-6">
              <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" class="h-8" />
            </div>

            <div v-if="errors.payment" class="text-red-600 mb-4">{{ errors.payment }}</div>

            <div class="flex justify-between mt-8">
              <button @click="prevStep" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                Back
              </button>
              <button @click="initiatePayment" class="btn btn-primary" :disabled="isProcessing">
                <span v-if="isProcessing">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Processing...
                </span>
                <span v-else>Pay Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  validateMobileNumber,
  getDefaultCountry,
  searchCountries,
  parseStoredMobile,
  formatMobileForStorage,
  parseStoredMobileForDisplay,
  formatMobileForDatabase,
  formatMobileForDisplay
} from '@/utils/mobileValidation'
import { getDistricts, getZones, getUnits, createRazorpayOrder, verifyPayment } from '@/utils/api'

export default {
  name: 'DonateForm',
  setup() {
    const store = useStore()
    const router = useRouter()
    // Get preloader functions
    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')





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

    // Form state
    const currentStep = ref(1)
    const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000]
    const selectedAmount = ref(0)
    const customAmount = ref(null)
    const showCustomAmount = ref(false)
    const isProcessing = ref(false)

    const steps = ['Amount', 'Details', 'Payment']

    // User form data
    const form = reactive({
      name: store.state.user.name || '',
      mobile: '', // Will be set properly in onMounted
      district: '',
      zone: '',
      unit: ''
    })

    // Validation errors
    const errors = reactive({
      amount: '',
      name: '',
      mobile: '',
      district: '',
      zone: '',
      unit: '',
      payment: ''
    })



    // Location data
    const districts = ref([])
    const zones = ref([])
    const units = ref([])

    // Get district name by id
    const getDistrictName = (id) => {
      const district = districts.value.find(d => d.id === id)
      return district ? district.name : ''
    }

    // Get zone name by id
    const getZoneName = (id) => {
      const zone = zones.value.find(z => z.id === id)
      return zone ? zone.name : ''
    }

    // Get unit name by id
    const getUnitName = (id) => {
      const unit = units.value.find(u => u.id === id)
      return unit ? unit.name : ''
    }

    // Get full location text
    const getLocationText = () => {
      const districtName = getDistrictName(form.district)
      const zoneName = getZoneName(form.zone)
      const unitName = getUnitName(form.unit)
      return `${districtName}, ${zoneName}, ${unitName}`
    }

    // Load districts on mount
    onMounted(async () => {
      try {
        showLoader('Loading districts...')
        districts.value = await getDistricts()
        hideLoader()
      } catch (error) {
        console.error('Failed to load districts:', error)
        hideLoader()
      }

      // Parse stored mobile number correctly
      const storedMobile = store.state.user.mobile
      if (storedMobile) {
        console.log('Stored mobile from store:', storedMobile)

        const parsed = parseStoredMobileForDisplay(storedMobile)
        console.log('Parsed mobile:', parsed)

        // Set the country and mobile number correctly
        selectedMobileCountry.value = parsed.country
        form.mobile = parsed.mobileNumber
      }
    })
    // Handle district change
    const onDistrictChange = async () => {
      form.zone = ''
      form.unit = ''
      zones.value = []
      units.value = []

      if (form.district) {
        try {
          showLoader('Loading zones...')
          zones.value = await getZones(form.district)
          hideLoader()
        } catch (error) {
          console.error('Failed to load zones:', error)
          hideLoader()
        }
      }
    }

    // Handle zone change
    const onZoneChange = async () => {
      form.unit = ''
      units.value = []

      if (form.zone) {
        try {
          showLoader('Loading units...')
          units.value = await getUnits(form.zone)
          hideLoader()
        } catch (error) {
          console.error('Failed to load units:', error)
          hideLoader()
        }
      }
    }

    // Select a predefined amount
    const selectAmount = (amount) => {
      selectedAmount.value = amount
      customAmount.value = null
      showCustomAmount.value = false
      errors.amount = ''
    }

    // Select a custom amount
    const selectCustomAmount = () => {
      if (customAmount.value > 0) {
        selectedAmount.value = customAmount.value
        errors.amount = ''
      } else if (customAmount.value <= 0 || customAmount.value === null) {
        selectedAmount.value = 0
        errors.amount = 'Please enter a valid amount greater than 0'
      }
    }

    // Go to next step
    const nextStep = () => {
      // Validate amount
      if (selectedAmount.value <= 0) {
        errors.amount = 'Please select or enter a valid donation amount'
        return
      }

      currentStep.value++
      store.commit('payment/setAmount', selectedAmount.value)
    }

    // Go to previous step
    const prevStep = () => {
      currentStep.value--
    }

    // Go back to home
    const goBack = () => {
      router.push('/')
    }

    // Validate form data
    const validateForm = () => {
      let isValid = true

      // Reset errors
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      // Validate name
      if (!form.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
      }

      // Validate mobile using global validation
      const mobileError = validateMobileNumber(form.mobile, selectedMobileCountry.value, 'Mobile')
      if (mobileError) {
        errors.mobile = mobileError
        isValid = false
      }

      return isValid
    }

    // Confirm user details and proceed to payment
    const confirmDetails = () => {
      if (validateForm()) {
        // Create full mobile with country code for storage and API
        const fullMobile = formatMobileForDatabase(form.mobile, selectedMobileCountry.value)

        store.commit('payment/setUserDetails', {
          name: form.name,
          mobile: fullMobile, // Store with country code
          district: form.district,
          zone: form.zone,
          unit: form.unit
        })

        // Also update user store
        store.commit('user/setUserInfo', {
          name: form.name,
          mobile: fullMobile
        })

        currentStep.value++
      }
    }

    const initiatePayment = async () => {
      try {
        isProcessing.value = true
        errors.payment = ''

        // Show preloader while creating order
        showLoader('Creating your donation order...')

        // Create full mobile with selected country code for API
        const fullMobile = formatMobileForDatabase(form.mobile, selectedMobileCountry.value)

        // Create an order on the backend
        const orderData = {
          amount: selectedAmount.value,
          name: form.name,
          mobile: fullMobile, // This should be "+971-527402017" format
          district: form.district,
          zone: form.zone,
          unit: form.unit
        }

        console.log('Order data being sent:', orderData)
        console.log('Selected country:', selectedMobileCountry.value)
        console.log('Full mobile being sent:', fullMobile)

        const response = await createRazorpayOrder(orderData)
        hideLoader()

        // Configure Razorpay options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY_ID',
          amount: selectedAmount.value * 100, // Amount in paise
          currency: 'INR',
          name: 'Wisdom Donations',
          description: 'Donation to Wisdom',
          order_id: response.orderId,
          handler: function (response) {
            handlePaymentSuccess(response)
          },
          prefill: {
            name: form.name,
            contact: form.mobile // Use just the mobile number for Razorpay
          },
          theme: {
            color: '#4A90E2'
          },
          modal: {
            ondismiss: function () {
              isProcessing.value = false
            }
          }
        }

        // Initialize Razorpay
        const razorpay = new window.Razorpay(options)
        razorpay.open()

      } catch (error) {
        isProcessing.value = false
        hideLoader()
        errors.payment = 'Failed to initiate payment. Please try again later.'
        console.error('Payment initiation error:', error)
      }
    }

    // Also update the handlePaymentSuccess method to include country code
    const handlePaymentSuccess = async (response) => {
      try {
        // Show preloader during payment verification
        showLoader('Verifying your payment...')

        // Create full mobile with selected country code for verification
        const fullMobile = formatMobileForDatabase(form.mobile, selectedMobileCountry.value)

        // Verify payment on backend
        const verificationData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          amount: selectedAmount.value,
          mobile: fullMobile, // Include full mobile for verification
          name: form.name
        }

        console.log('Verification data being sent:', verificationData)

        const verificationResponse = await verifyPayment(verificationData)
        hideLoader()

        if (verificationResponse.success) {
          // Save transaction to store
          store.dispatch('payment/saveTransaction', {
            transactionId: response.razorpay_payment_id,
            date: new Date().toISOString(),
            receiptUrl: verificationResponse.receiptUrl || null
          })

          // Navigate to success page
          router.push({
            name: 'PaymentResponse',
            query: {
              status: 'success',
              transactionId: response.razorpay_payment_id,
              amount: selectedAmount.value,
              date: new Date().toISOString()
            }
          })
        } else {
          throw new Error('Payment verification failed')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        hideLoader()
        router.push({
          name: 'PaymentResponse',
          query: {
            status: 'failed'
          }
        })
      } finally {
        isProcessing.value = false
      }
    }

    return {
      currentStep,
      steps,
      predefinedAmounts,
      selectedAmount,
      customAmount,
      showCustomAmount,
      form,
      errors,
      districts,
      zones,
      units,
      isProcessing,
      selectAmount,
      selectCustomAmount,
      nextStep,
      prevStep,
      goBack,
      onDistrictChange,
      onZoneChange,
      getLocationText,
      confirmDetails,
      initiatePayment,
      selectedMobileCountry,
      showCountryDropdown,
      countrySearch,
      filteredCountries,
      selectCountry,
      validateMobileNumber,
      formatMobileForDisplay,
    }
  }
}
</script>