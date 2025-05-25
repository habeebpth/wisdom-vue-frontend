<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Progress Steps -->
        <div class="bg-green-600 p-4">
          <div class="flex justify-between">
            <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center">
              <div
                class="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
                :class="[
                  currentStep > index + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                      ? 'bg-white text-green-600'
                      : 'bg-green-400 text-white'
                ]">
                <span v-if="currentStep > index + 1"><i class="fas fa-check"></i></span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="text-xs mt-1 text-white">{{ step }}</span>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="mt-2 h-2 bg-green-400 rounded-full">
            <div class="h-full bg-white rounded-full transition-all duration-300"
              :style="{ width: `${(currentStep - 1) * (100 / (steps.length - 1))}%` }"></div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Offer Form</h1>

          <!-- Step 1: Member Check -->
          <div v-if="currentStep === 1">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">നിങ്ങൾ വിസ്‌ഡം മെമ്പർ ആണോ ?</h2>

            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <input id="member-yes" v-model="isMember" type="radio" :value="true" name="member-status"
                  class="h-5 w-5 text-green-600" />
                <label for="member-yes" class="text-lg">അതെ (Yes)</label>
              </div>

              <div class="flex items-center space-x-3">
                <input id="member-no" v-model="isMember" type="radio" :value="false" name="member-status"
                  class="h-5 w-5 text-green-600" />
                <label for="member-no" class="text-lg">അല്ല (No)</label>
              </div>
            </div>

            <div v-if="errors.memberStatus" class="text-red-600 mt-2">{{ errors.memberStatus }}</div>

            <div class="flex justify-between mt-8">
              <button @click="goBack" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                Back
              </button>
              <button @click="nextStep" class="btn btn-primary bg-green-600 hover:bg-green-700 text-white">
                Continue
              </button>
            </div>
          </div>

          <!-- Step 2: Location Details -->
          <div v-if="currentStep === 2">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">{{ isMember ? 'Member Details' : 'Location Details' }}
            </h2>

            <div class="space-y-4">
              <!-- For Members -->
              <template v-if="isMember">
                <div>
                  <label for="district" class="form-label">ജില്ല (District) <span class="text-red-500">*</span></label>
                  <select id="district" v-model="form.district" class="form-select" required @change="onDistrictChange">
                    <option value="" disabled>Select a district</option>
                    <option v-for="district in districts" :key="district.id" :value="district.id">
                      {{ district.name }}
                    </option>
                  </select>
                  <p v-if="errors.district" class="mt-1 text-sm text-red-600">{{ errors.district }}</p>
                </div>

                <div>
                  <label for="zone" class="form-label">മണ്ഡലം (Zone) <span class="text-red-500">*</span></label>
                  <select id="zone" v-model="form.zone" class="form-select" required @change="onZoneChange"
                    :disabled="!form.district">
                    <option value="" disabled>Select a zone</option>
                    <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                      {{ zone.name }}
                    </option>
                  </select>
                  <p v-if="errors.zone" class="mt-1 text-sm text-red-600">{{ errors.zone }}</p>
                </div>

                <div>
                  <label for="unit" class="form-label">ശാഖ (Unit) <span class="text-red-500">*</span></label>
                  <select id="unit" v-model="form.unit" class="form-select" required :disabled="!form.zone">
                    <option value="" disabled>Select a unit</option>
                    <option v-for="unit in units" :key="unit.id" :value="unit.id">
                      {{ unit.name }}
                    </option>
                  </select>
                  <p v-if="errors.unit" class="mt-1 text-sm text-red-600">{{ errors.unit }}</p>
                </div>
              </template>

              <!-- For Non-Members -->
              <template v-else>
                <div>
                  <label for="district" class="form-label">ജില്ല (District) <span
                      class="text-gray-500">(Optional)</span></label>
                  <select id="district" v-model="form.district" class="form-select" @change="onDistrictChange">
                    <option value="" disabled>Select a district</option>
                    <option v-for="district in districts" :key="district.id" :value="district.id">
                      {{ district.name }}
                    </option>
                  </select>
                  <p v-if="errors.district" class="mt-1 text-sm text-red-600">{{ errors.district }}</p>
                </div>

                <div>
                  <label for="taluk" class="form-label">താലൂക്ക് (Taluk) <span
                      class="text-gray-500">(Optional)</span></label>
                  <select id="taluk" v-model="form.taluk" class="form-select" @change="onTalukChange"
                    :disabled="!form.district">
                    <option value="" disabled>Select a taluk</option>
                    <option v-for="taluk in taluks" :key="taluk.id" :value="taluk.id">
                      {{ taluk.name }}
                    </option>
                  </select>
                  <p v-if="errors.taluk" class="mt-1 text-sm text-red-600">{{ errors.taluk }}</p>
                </div>

                <div>
                  <label for="panchayath" class="form-label">പഞ്ചായത്ത് (Panchayath) <span
                      class="text-gray-500">(Optional)</span></label>
                  <select id="panchayath" v-model="form.panchayath" class="form-select" :disabled="!form.taluk">
                    <option value="" disabled>Select a panchayath</option>
                    <option v-for="panchayath in panchayaths" :key="panchayath.id" :value="panchayath.id">
                      {{ panchayath.name }}
                    </option>
                  </select>
                  <p v-if="errors.panchayath" class="mt-1 text-sm text-red-600">{{ errors.panchayath }}</p>
                </div>

                <div>
                  <label for="ward" class="form-label">വാർഡ് (Ward) <span
                      class="text-gray-500">(Optional)</span></label>
                  <input id="ward" v-model="form.ward" type="text" class="form-input"
                    placeholder="Enter ward number/name" />
                </div>
              </template>
            </div>

            <div class="flex justify-between mt-8">
              <button @click="prevStep" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                Back
              </button>
              <button @click="validateLocationAndContinue"
                class="btn btn-primary bg-green-600 hover:bg-green-700 text-white">
                Continue
              </button>
            </div>
          </div>

          <!-- Step 3: Personal Info -->
          <div v-if="currentStep === 3">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>

            <div class="space-y-4">
              <div>
                <label for="name" class="form-label">പേര് (Name) <span class="text-red-500">*</span></label>
                <input id="name" v-model="form.name" type="text" class="form-input" required
                  placeholder="Enter your full name" />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <div>
                <label for="mobile" class="form-label">മൊബൈൽ (Mobile) <span class="text-red-500">*</span></label>
                <input id="mobile" v-model="form.mobile" type="tel" class="form-input" required
                  placeholder="Enter your mobile number" />
                <p v-if="errors.mobile" class="mt-1 text-sm text-red-600">{{ errors.mobile }}</p>
              </div>

              <div>
                <label for="whatsapp" class="form-label">വാട്സ്ആപ്പ് (WhatsApp) <span
                    class="text-red-500">*</span></label>
                <input id="whatsapp" v-model="form.whatsapp" type="tel" class="form-input" required
                  placeholder="Enter your WhatsApp number" />
                <p v-if="errors.whatsapp" class="mt-1 text-sm text-red-600">{{ errors.whatsapp }}</p>
              </div>

              <div>
                <label for="email" class="form-label">Email <span class="text-gray-500">(Optional)</span></label>
                <input id="email" v-model="form.email" type="email" class="form-input"
                  placeholder="Enter your email address" />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>
            </div>

            <div class="flex justify-between mt-8">
              <button @click="prevStep" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                Back
              </button>
              <button @click="validatePersonalInfoAndContinue"
                class="btn btn-primary bg-green-600 hover:bg-green-700 text-white">
                Continue
              </button>
            </div>
          </div>

          <!-- Step 4: Offer Details -->
          <div v-if="currentStep === 4">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Offer Details</h2>

            <div class="space-y-6">
              <div>
                <label for="offerAmount" class="form-label">ഒരു വർഷം കൊണ്ട് താങ്കളുടെ കുടുംബം നൽകാൻ ഉദ്ദേശിക്കുന്ന സംഖ്യ
                  (ഓഫർ)
                  <span class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input id="offerAmount" v-model.number="form.offerAmount" type="number" class="form-input pl-8"
                    placeholder="Enter amount" min="1" />
                </div>
                <p v-if="errors.offerAmount" class="mt-1 text-sm text-red-600">{{ errors.offerAmount }}</p>
              </div>

              <div>
                <label class="form-label block mb-2">നൽകുന്ന രൂപം (Payment Schedule) <span
                    class="text-red-500">*</span></label>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input id="installment-1" type="radio" v-model="form.installmentType" name="installment-type"
                      value="1" class="h-5 w-5 text-green-600" />
                    <label for="installment-1" class="ml-3 text-gray-700">ഒന്നിച്ച് (One time)</label>
                  </div>

                  <div class="flex items-center">
                    <input id="installment-2" type="radio" v-model="form.installmentType" name="installment-type"
                      value="2" class="h-5 w-5 text-green-600" />
                    <label for="installment-2" class="ml-3 text-gray-700">2 തവണ (2 installments)</label>
                  </div>

                  <div class="flex items-center">
                    <input id="installment-3" type="radio" v-model="form.installmentType" name="installment-type"
                      value="3" class="h-5 w-5 text-green-600" />
                    <label for="installment-3" class="ml-3 text-gray-700">3 തവണ (3 installments)</label>
                  </div>

                  <div class="flex items-center">
                    <input id="installment-4" type="radio" v-model="form.installmentType" name="installment-type"
                      value="4" class="h-5 w-5 text-green-600" />
                    <label for="installment-4" class="ml-3 text-gray-700">4 തവണ (4 installments)</label>
                  </div>

                  <div class="flex items-center">
                    <input id="installment-5" type="radio" v-model="form.installmentType" name="installment-type"
                      value="5" class="h-5 w-5 text-green-600" />
                    <label for="installment-5" class="ml-3 text-gray-700">5 തവണ (5 installments)</label>
                  </div>

                  <div class="flex items-center">
                    <input id="installment-6" type="radio" v-model="form.installmentType" name="installment-type"
                      value="6" class="h-5 w-5 text-green-600" />
                    <label for="installment-6" class="ml-3 text-gray-700">6 തവണ (6 installments)</label>
                  </div>

                  <div class="flex items-center">
                    <input id="installment-custom" type="radio" v-model="form.installmentType" name="installment-type"
                      value="custom" class="h-5 w-5 text-green-600" />
                    <label for="installment-custom" class="ml-3 text-gray-700">Custom: </label>
                    <input v-model.number="form.customInstallments" type="number" min="1" class="ml-2 form-input w-20"
                      :disabled="form.installmentType !== 'custom'" />
                    <span class="ml-2">തവണ</span>
                  </div>
                </div>
                <p v-if="errors.installmentType" class="mt-1 text-sm text-red-600">{{ errors.installmentType }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">പൂർത്തിയാക്കുന്ന വർഷം (Completion Year) <span
                      class="text-red-500">*</span></label>
                  <select v-model="form.completionYear" class="form-select">
                    <option value="" disabled>Select Year</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div>
                  <label class="form-label">പൂർത്തിയാക്കുന്ന മാസം (Completion Month) <span
                      class="text-red-500">*</span></label>
                  <select v-model="form.completionMonth" class="form-select">
                    <option value="" disabled>Select Month</option>
                    <option value="1">ജനുവരി (January)</option>
                    <option value="2">ഫെബ്രുവരി (February)</option>
                    <option value="3">മാർച്ച് (March)</option>
                    <option value="4">ഏപ്രിൽ (April)</option>
                    <option value="5">മേയ് (May)</option>
                    <option value="6">ജൂൺ (June)</option>
                    <option value="7">ജൂലൈ (July)</option>
                    <option value="8">ഓഗസ്റ്റ് (August)</option>
                    <option value="9">സെപ്റ്റംബർ (September)</option>
                    <option value="10">ഒക്‌ടോബർ (October)</option>
                    <option value="11">നവംബർ (November)</option>
                    <option value="12">ഡിസംബർ (December)</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="paidAmount" class="form-label">നൽകിയ തുക (Amount Paid) <span
                    class="text-red-500">*</span></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input id="paidAmount" v-model.number="form.paidAmount" type="number" class="form-input pl-8"
                    placeholder="Enter amount already paid" min="0" @input="calculateRemainingAmount" />
                </div>
                <p v-if="errors.paidAmount" class="mt-1 text-sm text-red-600">{{ errors.paidAmount }}</p>
              </div>

              <div>
                <label for="remainingAmount" class="form-label">ബാക്കി നൽകാൻ ഉള്ളത് (Remaining Amount)</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input id="remainingAmount" :value="remainingAmount" type="number" class="form-input pl-8 bg-gray-100"
                    readonly />
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-8">
              <button @click="prevStep" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                Back
              </button>
              <button @click="submitOffer" class="btn btn-primary bg-green-600 hover:bg-green-700 text-white"
                :disabled="isProcessing">
                <span v-if="isProcessing">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Processing...
                </span>
                <span v-else>Submit Offer</span>
              </button>
            </div>
          </div>

          <!-- Step 5: Success/Confirmation -->
          <div v-if="currentStep === 5">
            <div class="text-center py-8">
              <div class="text-green-600 text-6xl mb-4">
                <i class="fas fa-check-circle"></i>
              </div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p class="text-lg text-gray-600 mb-8">
                Your offer has been successfully submitted. We appreciate your commitment to support our mission.
              </p>

              <div class="bg-gray-50 p-6 rounded-lg text-left mb-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Offer Summary:</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Name:</span>
                    <span class="font-medium">{{ form.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Offer Amount:</span>
                    <span class="font-medium">₹{{ form.offerAmount }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Payment Schedule:</span>
                    <span class="font-medium">{{ getInstallmentText() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Completion Date:</span>
                    <span class="font-medium">{{ getMonthName(form.completionMonth) }} {{ form.completionYear }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Amount Paid:</span>
                    <span class="font-medium">₹{{ form.paidAmount }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Remaining Amount:</span>
                    <span class="font-medium">₹{{ remainingAmount }}</span>
                  </div>
                </div>
              </div>

              <div class="flex justify-center gap-4">
                <button @click="goHome" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                  Go to Home
                </button>
                <button @click="viewHistory" class="btn btn-primary bg-green-600 hover:bg-green-700 text-white">
                  View History
                </button>
              </div>
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
import { getDistricts, getZones, getUnits, getTaluks, getPanchayaths, submitOffer } from '@/utils/api'

export default {
  name: 'OfferForm',
  setup() {
    const store = useStore()
    const router = useRouter()

    // Get preloader functions
    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')

    // Form state
    const currentStep = ref(1)
    const isMember = ref(null)
    const isProcessing = ref(false)

    const steps = ['Member', 'Location', 'Personal', 'Offer', 'Confirmation']

    // User form data
    const form = reactive({
      // Location details (for members)
      district: '',
      zone: '',
      unit: '',

      // Location details (for non-members)
      taluk: '',
      panchayath: '',
      ward: '',

      // Personal information
      name: store.state.user.name || '',
      mobile: store.state.user.mobile || '',
      whatsapp: '',
      email: '',

      // Offer details
      offerAmount: null,
      installmentType: '',
      customInstallments: null,
      completionYear: '2025',
      completionMonth: '',
      paidAmount: 0
    })

    // Validation errors
    const errors = reactive({
      memberStatus: '',
      district: '',
      zone: '',
      unit: '',
      taluk: '',
      panchayath: '',
      name: '',
      mobile: '',
      whatsapp: '',
      email: '',
      offerAmount: '',
      installmentType: '',
      completionYear: '',
      completionMonth: '',
      paidAmount: ''
    })

    // Location data
    const districts = ref([])
    const zones = ref([])
    const units = ref([])
    const taluks = ref([])
    const panchayaths = ref([])

    // Computed remaining amount
    const remainingAmount = computed(() => {
      if (form.offerAmount && form.paidAmount !== null) {
        return form.offerAmount - form.paidAmount
      }
      return 0
    })

    // Get installment text for summary
    const getInstallmentText = () => {
      if (form.installmentType === 'custom') {
        return `${form.customInstallments} installments`
      } else if (form.installmentType === '1') {
        return 'One time payment'
      } else {
        return `${form.installmentType} installments`
      }
    }

    // Get month name from month number
    const getMonthName = (monthNumber) => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      return months[parseInt(monthNumber) - 1] || ''
    }

    // Calculate remaining amount
    const calculateRemainingAmount = () => {
      if (form.paidAmount > form.offerAmount) {
        errors.paidAmount = 'Paid amount cannot be greater than the total offer amount'
        form.paidAmount = form.offerAmount
      } else {
        errors.paidAmount = ''
      }
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
    })

    // Handle district change for member
    const onDistrictChange = async () => {
      if (isMember.value) {
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
      } else {
        form.taluk = ''
        form.panchayath = ''
        taluks.value = []
        panchayaths.value = []

        if (form.district) {
          try {
            showLoader('Loading taluks...')
            taluks.value = await getTaluks(form.district)
            hideLoader()
          } catch (error) {
            console.error('Failed to load taluks:', error)
            hideLoader()
          }
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

    // Handle taluk change
    const onTalukChange = async () => {
      form.panchayath = ''
      panchayaths.value = []

      if (form.taluk) {
        try {
          showLoader('Loading panchayaths...')
          panchayaths.value = await getPanchayaths(form.taluk)
          hideLoader()
        } catch (error) {
          console.error('Failed to load panchayaths:', error)
          hideLoader()
        }
      }
    }

    // Go to next step
    const nextStep = () => {
      if (currentStep.value === 1) {
        if (isMember.value === null) {
          errors.memberStatus = 'Please select whether you are a member or not'
          return
        }
        errors.memberStatus = ''
      }

      currentStep.value++
    }

    // Go to previous step
    const prevStep = () => {
      currentStep.value--
    }

    // Go back to home
    const goBack = () => {
      router.push('/')
    }

    // Go to home after submission
    const goHome = () => {
      router.push('/')
    }

    // View payment history
    const viewHistory = () => {
      router.push('/payment-history')
    }

    // Validate location details
    const validateLocationAndContinue = () => {
      // Reset errors
      errors.district = ''
      errors.zone = ''
      errors.unit = ''
      errors.taluk = ''
      errors.panchayath = ''

      let isValid = true

      // Location fields are now optional for both members and non-members

      if (isValid) {
        nextStep()
      }
    }

    // Validate personal information
    const validatePersonalInfoAndContinue = () => {
      // Reset errors
      errors.name = ''
      errors.mobile = ''
      errors.whatsapp = ''
      errors.email = ''

      let isValid = true

      // Validate name
      if (!form.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
      }

      // Validate mobile
      if (!form.mobile.trim()) {
        errors.mobile = 'Mobile number is required'
        isValid = false
      } else if (!/^[0-9]{10}$/.test(form.mobile)) {
        errors.mobile = 'Please enter a valid 10-digit mobile number'
        isValid = false
      }

      // Validate WhatsApp
      if (!form.whatsapp.trim()) {
        errors.whatsapp = 'WhatsApp number is required'
        isValid = false
      } else if (!/^[0-9]{10}$/.test(form.whatsapp)) {
        errors.whatsapp = 'Please enter a valid 10-digit WhatsApp number'
        isValid = false
      }

      // Validate email (if provided)
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (isValid) {
        // Save user info to store
        store.commit('user/setUserInfo', {
          name: form.name,
          mobile: form.mobile
        })

        nextStep()
      }
    }

    // Submit offer
    const submitOffer = async () => {
      // Reset errors
      errors.offerAmount = ''
      errors.installmentType = ''
      errors.completionYear = ''
      errors.completionMonth = ''
      errors.paidAmount = ''

      let isValid = true

      // Validate offer amount
      if (!form.offerAmount || form.offerAmount <= 0) {
        errors.offerAmount = 'Please enter a valid offer amount'
        isValid = false
      }

      // Validate installment type
      if (!form.installmentType) {
        errors.installmentType = 'Please select a payment schedule'
        isValid = false
      } else if (form.installmentType === 'custom' && (!form.customInstallments || form.customInstallments <= 0)) {
        errors.installmentType = 'Please enter a valid number of installments'
        isValid = false
      }

      // Validate completion date
      if (!form.completionYear) {
        errors.completionYear = 'Please select a completion year'
        isValid = false
      }

      if (!form.completionMonth) {
        errors.completionMonth = 'Please select a completion month'
        isValid = false
      }

      // Validate paid amount
      if (form.paidAmount < 0) {
        errors.paidAmount = 'Paid amount cannot be negative'
        isValid = false
      } else if (form.paidAmount > form.offerAmount) {
        errors.paidAmount = 'Paid amount cannot exceed the total offer amount'
        isValid = false
      }

      if (isValid) {
        try {
          isProcessing.value = true
          showLoader('Submitting your offer...')

          // Prepare data for the backend API
          const offerData = {
            name: form.name,
            mobile: form.mobile,
            whatsapp: form.whatsapp,
            email: form.email,
            isMember: isMember.value,
            district: form.district,
            offerAmount: form.offerAmount,
            installmentType: form.installmentType,
            customInstallments: form.installmentType === 'custom' ? form.customInstallments : null,
            completionYear: form.completionYear,
            completionMonth: form.completionMonth,
            paidAmount: form.paidAmount
          }

          // Add member-specific data
          if (isMember.value) {
            offerData.zone = form.zone;
            offerData.unit = form.unit;
          } else {
            offerData.taluk = form.taluk;
            offerData.panchayath = form.panchayath;
            offerData.ward = form.ward;
          }

          // Send data directly to the backend API
          console.log('Submitting offer with data:', offerData);

          // Direct API call to the backend
          try {
            const apiUrl = 'https://wisdom-home.cloudocz.com/api/offers/submit';
            console.log('Making direct POST request to:', apiUrl);

            const apiResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                name: offerData.name,
                mobile: offerData.mobile,
                whatsapp: offerData.whatsapp || offerData.mobile,
                email: offerData.email || '',
                is_member: offerData.isMember ? 1 : 0,
                district_id: offerData.district || null,
                zone_id: offerData.zone || null,
                unit_id: offerData.unit || null,
                taluk_id: offerData.taluk || null,
                panchayath_id: offerData.panchayath || null,
                ward: offerData.ward || '',
                amount: parseFloat(offerData.offerAmount),
                installment_type: offerData.installmentType,
                custom_installments: offerData.customInstallments || null,
                completion_year: offerData.completionYear,
                completion_month: offerData.completionMonth,
                paid_amount: parseFloat(offerData.paidAmount) || 0
              })
            });

            // Process the response
            if (apiResponse.status === 200) {
              const responseData = await apiResponse.json();
              console.log('Direct API Response success:', responseData);

              const response = {
                success: true,
                offerId: responseData.offerId || 'OF-' + Date.now(),
                date: responseData.date || new Date().toISOString()
              };

              // Create history object - only on success
              const historyData = {
                id: response.offerId,
                type: 'offer',
                amount: form.offerAmount,
                paidAmount: form.paidAmount,
                remainingAmount: remainingAmount.value,
                installments: form.installmentType === 'custom' ? form.customInstallments : form.installmentType,
                completionDate: `${getMonthName(form.completionMonth)} ${form.completionYear}`,
                date: new Date().toISOString(),
                status: 'active'
              }

              // Save to store only on success
              store.dispatch('payment/addOfferToHistory', historyData)

              isProcessing.value = false
              hideLoader()
              nextStep()

            } else {
              // Handle API error responses (422, 500, etc.)
              console.error('API returned error status:', apiResponse.status);

              let errorMessage = 'Failed to submit offer. Please try again.';

              try {
                const errorData = await apiResponse.json();
                console.error('API Error Details:', errorData);

                // Handle validation errors (422)
                if (apiResponse.status === 422 && errorData.errors) {
                  const errorMessages = [];
                  for (const field in errorData.errors) {
                    errorMessages.push(...errorData.errors[field]);
                  }
                  errorMessage = errorMessages.join('\n') || errorMessage;
                } else if (errorData.message) {
                  errorMessage = errorData.message;
                }
              } catch (parseError) {
                console.error('Could not parse error response:', parseError);
              }

              isProcessing.value = false
              hideLoader()
              alert(errorMessage);
            }

          } catch (apiError) {
            // Handle network errors or fetch failures
            console.error('Direct API call failed:', apiError);
            isProcessing.value = false
            hideLoader()
            alert('Network error. Please check your connection and try again.');
          }

        } catch (error) {
          // Handle unexpected errors
          console.error('Error submitting offer:', error)
          isProcessing.value = false
          hideLoader()
          alert('An unexpected error occurred. Please try again.');
        }
      }
    }

    return {
      currentStep,
      steps,
      isMember,
      form,
      errors,
      districts,
      zones,
      units,
      taluks,
      panchayaths,
      remainingAmount,
      isProcessing,
      nextStep,
      prevStep,
      goBack,
      goHome,
      viewHistory,
      onDistrictChange,
      onZoneChange,
      onTalukChange,
      validateLocationAndContinue,
      validatePersonalInfoAndContinue,
      submitOffer,
      calculateRemainingAmount,
      getInstallmentText,
      getMonthName
    }
  }
}
</script>

<style scoped>
.form-label {
  display: block;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #5cb85c;
  box-shadow: 0 0 0 3px rgba(92, 184, 92, 0.2);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>