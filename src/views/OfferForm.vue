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
                      class="text-gray-500"></span></label>
                  <select id="district" v-model="form.district" class="form-select">
                    <option value="">Select a district</option>
                    <option v-for="district in keralaDistricts" :key="district.id" :value="district.id">
                      {{ district.name }}
                    </option>
                  </select>
                  <p v-if="errors.district" class="mt-1 text-sm text-red-600">{{ errors.district }}</p>
                </div>

                <div>
                  <label for="taluk" class="form-label">താലൂക്ക് (Taluk) <span
                      class="text-gray-500"></span></label>
                  <input id="taluk" v-model="form.taluk" type="text" class="form-input"
                    placeholder="Enter taluk name" />
                  <p v-if="errors.taluk" class="mt-1 text-sm text-red-600">{{ errors.taluk }}</p>
                </div>

                <div>
                  <label for="panchayath" class="form-label">പഞ്ചായത്ത് (Panchayath) <span
                      class="text-gray-500"></span></label>
                  <input id="panchayath" v-model="form.panchayath" type="text" class="form-input"
                    placeholder="Enter panchayath name" />
                  <p v-if="errors.panchayath" class="mt-1 text-sm text-red-600">{{ errors.panchayath }}</p>
                </div>

                <div>
                  <label for="ward" class="form-label">വാർഡ് (Ward) <span
                      class="text-gray-500"></span></label>
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
            <!-- Existing Offer Notification -->
<div v-if="hasExistingOffer" class="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
  <div class="flex items-start">
    <div class="flex-shrink-0">
      <i class="fas fa-info-circle text-blue-400 text-xl"></i>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-blue-800">✅ Existing Offer Found</h3>
      <div class="mt-1 text-sm text-blue-700">
        <p><strong>Offer ID:</strong> {{ existingOfferId }}</p>
        <p class="mt-1">Your form has been pre-filled with your existing offer details. You can modify and update them in the next step.</p>
      </div>
    </div>
  </div>
</div>

            <div class="space-y-4">
              <div>
                <label for="name" class="form-label">പേര് (Name) <span class="text-red-500">*</span></label>
                <input id="name" v-model="form.name" type="text" class="form-input" required
                  placeholder="Enter your full name" />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <!-- Mobile Number with Country Code -->
              <div>
                <label for="mobile" class="form-label">മൊബൈൽ (Mobile) <span class="text-red-500">*</span></label>
                <div class="flex">
                  <!-- Country Code Selector for Mobile -->
                  <div class="relative">
                    <button type="button" @click="showMobileCountryDropdown = !showMobileCountryDropdown"
                      class="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <span class="mr-2">{{ selectedMobileCountry.flag }}</span>
                      <span class="mr-1">{{ selectedMobileCountry.code }}</span>
                      <i class="fas fa-chevron-down text-xs"></i>
                    </button>

                    <!-- Mobile Country Dropdown -->
                    <div v-if="showMobileCountryDropdown"
                      class="absolute top-full left-0 z-50 w-80 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      <div class="p-2">
                        <input v-model="mobileCountrySearch" type="text" placeholder="Search countries..."
                          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div class="max-h-48 overflow-y-auto">
                        <button v-for="country in filteredMobileCountries" :key="country.code" type="button"
                          @click="selectMobileCountry(country)"
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
                    class="flex-1 form-input rounded-l-none border-l-0 focus:ring-green-500 focus:border-green-500"
                    required placeholder="Enter mobile number" />
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Expected format: {{ selectedMobileCountry.format }} for {{ selectedMobileCountry.name }}
                </div>
                <p v-if="errors.mobile" class="mt-1 text-sm text-red-600">{{ errors.mobile }}</p>
              </div>

              <!-- WhatsApp Same as Mobile Checkbox -->
              <div class="flex items-center space-x-3">
                <input id="sameWhatsApp" v-model="sameWhatsAppAsMobile" type="checkbox"
                  class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  @change="onSameWhatsAppChange" />
                <label for="sameWhatsApp" class="text-sm text-gray-700">WhatsApp number same as mobile</label>
              </div>

              <!-- WhatsApp Number with Country Code -->
              <div v-if="!sameWhatsAppAsMobile">
                <label for="whatsapp" class="form-label">വാട്സ്ആപ്പ് (WhatsApp) <span
                    class="text-red-500">*</span></label>
                <div class="flex">
                  <!-- Country Code Selector for WhatsApp -->
                  <div class="relative">
                    <button type="button" @click="showWhatsAppCountryDropdown = !showWhatsAppCountryDropdown"
                      class="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <span class="mr-2">{{ selectedWhatsAppCountry.flag }}</span>
                      <span class="mr-1">{{ selectedWhatsAppCountry.code }}</span>
                      <i class="fas fa-chevron-down text-xs"></i>
                    </button>

                    <!-- WhatsApp Country Dropdown -->
                    <div v-if="showWhatsAppCountryDropdown"
                      class="absolute top-full left-0 z-50 w-80 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      <div class="p-2">
                        <input v-model="whatsappCountrySearch" type="text" placeholder="Search countries..."
                          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <div class="max-h-48 overflow-y-auto">
                        <button v-for="country in filteredWhatsAppCountries" :key="country.code" type="button"
                          @click="selectWhatsAppCountry(country)"
                          class="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                          <span class="mr-3">{{ country.flag }}</span>
                          <span class="mr-2 text-sm font-mono">{{ country.code }}</span>
                          <span class="text-sm">{{ country.name }}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- WhatsApp Number Input -->
                  <input id="whatsapp" v-model="form.whatsapp" type="tel"
                    class="flex-1 form-input rounded-l-none border-l-0 focus:ring-green-500 focus:border-green-500"
                    required placeholder="Enter WhatsApp number" />
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Expected format: {{ selectedWhatsAppCountry.format }} for {{ selectedWhatsAppCountry.name }}
                </div>
                <p v-if="errors.whatsapp" class="mt-1 text-sm text-red-600">{{ errors.whatsapp }}</p>
              </div>

              <div>
                <label for="email" class="form-label">Email <span class="text-gray-500"></span></label>
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
                    <span class="text-gray-500 sm:text-sm"></span>
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
                    <label for="installment-custom" class="ml-3 text-gray-700"></label>
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
                      class="text-gray-500"></span></label>
                  <select v-model="form.completionYear" class="form-select">
                    <option value="">Select Year</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div>
                  <label class="form-label">പൂർത്തിയാക്കുന്ന മാസം (Completion Month) <span
                      class="text-gray-500"></span></label>
                  <select v-model="form.completionMonth" class="form-select">
                    <option value="">Select Month</option>
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
                <label for="remark" class="form-label">കുറിപ്പ് (Remark) <span class="text-gray-500"></span></label>
                <textarea id="remark" v-model="form.remark" rows="3" class="form-input" 
                  placeholder="Enter any additional remarks or notes (optional)" 
                  maxlength="1000"></textarea>
                <p v-if="errors.remark" class="mt-1 text-sm text-red-600">{{ errors.remark }}</p>
                <div class="text-xs text-gray-500 mt-1">
                  {{ form.remark ? form.remark.length : 0 }}/1000 characters
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
                    <span class="text-gray-600">Mobile:</span>
                    <span class="font-medium">{{ selectedMobileCountry.code }} {{ form.mobile }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">WhatsApp:</span>
                    <span class="font-medium">{{ getWhatsAppDisplay() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Offer Amount:</span>
                    <span class="font-medium">₹{{ form.offerAmount }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Payment Schedule:</span>
                    <span class="font-medium">{{ getInstallmentText() }}</span>
                  </div>
                  <div v-if="form.completionYear && form.completionMonth" class="flex justify-between">
                    <span class="text-gray-600">Completion Date:</span>
                    <span class="font-medium">{{ getMonthName(form.completionMonth) }} {{ form.completionYear }}</span>
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
import { ref, reactive, computed, onMounted, inject, watch } from 'vue'  // ADDED watch
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getDistricts, getZones, getUnits, submitOffer } from '@/utils/api'
import { validateMobileNumber, getDefaultCountry, searchCountries, formatMobileForDatabase, formatMobileForDisplay, parseStoredMobileForDisplay } from '@/utils/mobileValidation'
import axios from 'axios'  // ADDED for API calls

export default {
  name: 'OfferForm',
  setup() {
    const store = useStore()
    const router = useRouter()

    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')

    const currentStep = ref(1)
    const isMember = ref(null)
    const isProcessing = ref(false)
    const sameWhatsAppAsMobile = ref(true)
    
    // NEW: State for existing offer detection
    const hasExistingOffer = ref(false)
    const existingOfferId = ref(null)
    const mobileCheckTimeout = ref(null)

    const showMobileCountryDropdown = ref(false)
    const showWhatsAppCountryDropdown = ref(false)
    const mobileCountrySearch = ref('')
    const whatsappCountrySearch = ref('')

    const steps = ['Member', 'Location', 'Personal', 'Offer', 'Confirmation']

    const selectedMobileCountry = ref(getDefaultCountry())
    const selectedWhatsAppCountry = ref(getDefaultCountry())

    const keralaDistricts = ref([
      { id: 'alappuzha', name: 'Alappuzha' },
      { id: 'ernakulam', name: 'Ernakulam' },
      { id: 'idukki', name: 'Idukki' },
      { id: 'kannur', name: 'Kannur' },
      { id: 'kasaragod', name: 'Kasaragod' },
      { id: 'kollam', name: 'Kollam' },
      { id: 'kottayam', name: 'Kottayam' },
      { id: 'kozhikode', name: 'Kozhikode' },
      { id: 'malappuram', name: 'Malappuram' },
      { id: 'palakkad', name: 'Palakkad' },
      { id: 'pathanamthitta', name: 'Pathanamthitta' },
      { id: 'thiruvananthapuram', name: 'Thiruvananthapuram' },
      { id: 'thrissur', name: 'Thrissur' },
      { id: 'wayanad', name: 'Wayanad' },
      { id: 'other', name: 'Other' }
    ])

    const form = reactive({
      district: '',
      zone: '',
      unit: '',
      taluk: '',
      panchayath: '',
      ward: '',
      name: store.state.user.name || '',
      mobile: store.state.user.mobile || '',
      whatsapp: '',
      email: '',
      offerAmount: null,
      installmentType: '',
      customInstallments: null,
      completionYear: '',
      completionMonth: '',
      remark: ''
    })

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
      remark: ''
    })

    const districts = ref([])
    const zones = ref([])
    const units = ref([])

    const filteredMobileCountries = computed(() => {
      return searchCountries(mobileCountrySearch.value)
    })

    const filteredWhatsAppCountries = computed(() => {
      return searchCountries(whatsappCountrySearch.value)
    })

    // NEW: Check for existing offers
    const checkExistingOffer = async () => {
      if (!form.mobile || form.mobile.length < 10) {
        return
      }

      try {
        showLoader('Checking for existing offers...')
        const fullMobile = formatMobileForDatabase(form.mobile, selectedMobileCountry.value)
        
        console.log('Checking for existing offers for:', fullMobile)
        
        const apiClient = axios.create({
          baseURL: 'https://www.wisdom-home.cloudocz.com/api',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        const response = await apiClient.get(`/users/by-mobile?mobile=${fullMobile}`)
        
        if (response.data.success && response.data.found && response.data.user) {
          console.log('User found:', response.data.user)
          
          const offerResponse = await apiClient.get(`/offers/history?mobile=${fullMobile}`)
          
          if (offerResponse.data.history && offerResponse.data.history.length > 0) {
            const activeOffer = offerResponse.data.history.find(offer => offer.status === 'active')
            
            if (activeOffer) {
              console.log('Active offer found:', activeOffer)
              hasExistingOffer.value = true
              existingOfferId.value = activeOffer.id
              
              // Pre-populate form
              form.name = response.data.user.name || form.name
              form.email = response.data.user.email || form.email
              form.offerAmount = activeOffer.offerAmount
              form.installmentType = activeOffer.installments?.toString() || ''
              
              // Parse completion date
              if (activeOffer.completionDate && activeOffer.completionDate !== 'Not specified') {
                const parts = activeOffer.completionDate.split(' ')
                if (parts.length === 2) {
                  const [monthName, year] = parts
                  const monthMap = {
                    'January': '1', 'February': '2', 'March': '3', 'April': '4',
                    'May': '5', 'June': '6', 'July': '7', 'August': '8',
                    'September': '9', 'October': '10', 'November': '11', 'December': '12'
                  }
                  form.completionMonth = monthMap[monthName] || ''
                  form.completionYear = year || ''
                }
              }
              
              form.remark = activeOffer.remark || ''
              
              hideLoader()
              alert(`✅ Existing offer found!\n\nOffer ID: ${activeOffer.id}\nAmount: ₹${activeOffer.offerAmount}\n\nYou can update your offer details in the next steps.`)
            } else {
              hasExistingOffer.value = false
              existingOfferId.value = null
              hideLoader()
            }
          } else {
            hasExistingOffer.value = false
            existingOfferId.value = null
            hideLoader()
          }
        } else {
          hasExistingOffer.value = false
          existingOfferId.value = null
          hideLoader()
        }
      } catch (error) {
        console.error('Error checking existing offer:', error)
        hasExistingOffer.value = false
        existingOfferId.value = null
        hideLoader()
      }
    }

    // NEW: Watch mobile number for changes
    watch(() => form.mobile, (newMobile) => {
      if (newMobile && newMobile.length >= 10) {
        if (mobileCheckTimeout.value) {
          clearTimeout(mobileCheckTimeout.value)
        }
        mobileCheckTimeout.value = setTimeout(() => {
          checkExistingOffer()
        }, 800)
      }
    })

    const selectMobileCountry = (country) => {
      selectedMobileCountry.value = country
      showMobileCountryDropdown.value = false
      mobileCountrySearch.value = ''
    }

    const selectWhatsAppCountry = (country) => {
      selectedWhatsAppCountry.value = country
      showWhatsAppCountryDropdown.value = false
      whatsappCountrySearch.value = ''
    }

    const onSameWhatsAppChange = () => {
      if (sameWhatsAppAsMobile.value) {
        form.whatsapp = form.mobile
        selectedWhatsAppCountry.value = selectedMobileCountry.value
      } else {
        form.whatsapp = ''
      }
    }

    const getWhatsAppDisplay = () => {
      if (sameWhatsAppAsMobile.value) {
        return `${selectedMobileCountry.value.code} ${form.mobile} (Same as mobile)`
      }
      return `${selectedWhatsAppCountry.value.code} ${form.whatsapp}`
    }

    const getInstallmentText = () => {
      if (form.installmentType === 'custom') {
        return `${form.customInstallments} installments`
      } else if (form.installmentType === '1') {
        return 'One time payment'
      } else {
        return `${form.installmentType} installments`
      }
    }

    const getMonthName = (monthNumber) => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      return months[parseInt(monthNumber) - 1] || ''
    }

    onMounted(async () => {
      try {
        showLoader('Loading districts...')
        districts.value = await getDistricts()
        hideLoader()
      } catch (error) {
        console.error('Failed to load districts:', error)
        hideLoader()
      }

      const storedMobile = store.state.user.mobile
      if (storedMobile) {
        console.log('Stored mobile from store:', storedMobile)

        const parsed = parseStoredMobileForDisplay(storedMobile)
        console.log('Parsed mobile:', parsed)

        selectedMobileCountry.value = parsed.country
        form.mobile = parsed.mobileNumber

        selectedWhatsAppCountry.value = parsed.country
        form.whatsapp = parsed.mobileNumber
      }

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
          showMobileCountryDropdown.value = false
          showWhatsAppCountryDropdown.value = false
        }
      })
    })

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
      }
    }

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

    const prevStep = () => {
      currentStep.value--
    }

    const goBack = () => {
      router.push('/')
    }

    const goHome = () => {
      router.push('/')
    }

    const viewHistory = () => {
      router.push('/payment-history')
    }

    const validateLocationAndContinue = () => {
      errors.district = ''
      errors.zone = ''
      errors.unit = ''
      errors.taluk = ''
      errors.panchayath = ''

      let isValid = true

      if (isValid) {
        nextStep()
      }
    }

    // MODIFIED: Made async and added checkExistingOffer
    const validatePersonalInfoAndContinue = async () => {
      errors.name = ''
      errors.mobile = ''
      errors.whatsapp = ''
      errors.email = ''

      let isValid = true

      if (!form.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
      }

      const mobileError = validateMobileNumber(form.mobile, selectedMobileCountry.value, 'Mobile')
      if (mobileError) {
        errors.mobile = mobileError
        isValid = false
      }

      if (!sameWhatsAppAsMobile.value) {
        const whatsappError = validateMobileNumber(form.whatsapp, selectedWhatsAppCountry.value, 'WhatsApp')
        if (whatsappError) {
          errors.whatsapp = whatsappError
          isValid = false
        }
      } else {
        form.whatsapp = form.mobile
        selectedWhatsAppCountry.value = selectedMobileCountry.value
      }

      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (isValid) {
        // NEW: Check for existing offer before continuing
        await checkExistingOffer()
        
        const fullMobile = formatMobileForDatabase(form.mobile, selectedMobileCountry.value)

        store.commit('user/setUserInfo', {
          name: form.name,
          mobile: fullMobile
        })

        nextStep()
      }
    }

    // MODIFIED: Updated to show appropriate message
    const submitOffer = async () => {
      errors.offerAmount = ''
      errors.installmentType = ''
      errors.completionYear = ''
      errors.completionMonth = ''

      let isValid = true

      if (!form.offerAmount || form.offerAmount <= 0) {
        errors.offerAmount = 'Please enter a valid offer amount'
        isValid = false
      }

      if (!form.installmentType) {
        errors.installmentType = 'Please select a payment schedule'
        isValid = false
      } else if (form.installmentType === 'custom' && (!form.customInstallments || form.customInstallments <= 0)) {
        errors.installmentType = 'Please enter a valid number of installments'
        isValid = false
      }

      if (isValid) {
        try {
          isProcessing.value = true
          showLoader(hasExistingOffer.value ? 'Updating your offer...' : 'Submitting your offer...')  // MODIFIED

          const fullMobile = formatMobileForDatabase(form.mobile, selectedMobileCountry.value)
          const fullWhatsApp = sameWhatsAppAsMobile.value
            ? fullMobile
            : formatMobileForDatabase(form.whatsapp, selectedWhatsAppCountry.value)

          const offerData = {
            name: form.name,
            mobile: fullMobile,
            whatsapp: fullWhatsApp,
            email: form.email,
            isMember: isMember.value,
            district: form.district,
            offerAmount: form.offerAmount,
            installmentType: form.installmentType,
            customInstallments: form.installmentType === 'custom' ? form.customInstallments : null,
            completionYear: form.completionYear,
            completionMonth: form.completionMonth,
            remark: form.remark
          }

          if (isMember.value) {
            offerData.zone = form.zone;
            offerData.unit = form.unit;
          } else {
            offerData.taluk = form.taluk;
            offerData.panchayath = form.panchayath;
            offerData.ward = form.ward;
          }

          console.log('Submitting offer with data:', offerData);

          try {
            const apiUrl = 'https://www.wisdom-home.cloudocz.com/api/offers/submit';
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
                whatsapp: offerData.whatsapp,
                email: offerData.email || '',
                is_member: offerData.isMember ? 1 : 0,
                district_id: offerData.district || null,
                zone_id: offerData.zone || null,
                unit_id: offerData.unit || null,
                taluk: offerData.taluk || '',
                panchayath: offerData.panchayath || '',
                ward: offerData.ward || '',
                amount: parseFloat(offerData.offerAmount),
                installment_type: offerData.installmentType,
                custom_installments: offerData.customInstallments || null,
                completion_year: offerData.completionYear || null,
                completion_month: offerData.completionMonth || null,
                paid_amount: 0,
                remark: offerData.remark || ''
              })
            });

            if (apiResponse.status === 200) {
              const responseData = await apiResponse.json();
              console.log('Direct API Response success:', responseData);

              // NEW: Check if this was an update
              const wasUpdate = responseData.isUpdate || false
              const message = responseData.message || (wasUpdate ? '✅ Offer updated successfully!' : '✅ Offer submitted successfully!')

              const response = {
                success: true,
                offerId: responseData.offerId || 'OF-' + Date.now(),
                date: responseData.date || new Date().toISOString(),
                isUpdate: wasUpdate  // NEW
              };

              const historyData = {
                id: response.offerId,
                type: 'offer',
                amount: form.offerAmount,
                paidAmount: 0,
                remainingAmount: form.offerAmount,
                installments: form.installmentType === 'custom' ? form.customInstallments : form.installmentType,
                completionDate: form.completionYear && form.completionMonth
                  ? `${getMonthName(form.completionMonth)} ${form.completionYear}`
                  : 'Not specified',
                date: new Date().toISOString(),
                status: 'active'
              }

              store.dispatch('payment/addOfferToHistory', historyData)

              isProcessing.value = false
              hideLoader()
              alert(message)  // MODIFIED
              nextStep()

            } else {
              console.error('API returned error status:', apiResponse.status);

              let errorMessage = 'Failed to submit offer. Please try again.';

              try {
                const errorData = await apiResponse.json();
                console.error('API Error Details:', errorData);

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
            console.error('Direct API call failed:', apiError);
            isProcessing.value = false
            hideLoader()
            alert('Network error. Please check your connection and try again.');
          }

        } catch (error) {
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
      keralaDistricts,
      isProcessing,
      sameWhatsAppAsMobile,
      selectedMobileCountry,
      selectedWhatsAppCountry,
      showMobileCountryDropdown,
      showWhatsAppCountryDropdown,
      mobileCountrySearch,
      whatsappCountrySearch,
      filteredMobileCountries,
      filteredWhatsAppCountries,
      selectMobileCountry,
      selectWhatsAppCountry,
      validateMobileNumber,
      onSameWhatsAppChange,
      getWhatsAppDisplay,
      nextStep,
      prevStep,
      goBack,
      goHome,
      viewHistory,
      onDistrictChange,
      onZoneChange,
      validateLocationAndContinue,
      validatePersonalInfoAndContinue,
      submitOffer,
      getInstallmentText,
      getMonthName,
      // NEW: Added to return
      hasExistingOffer,
      existingOfferId,
      checkExistingOffer
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