<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Payment & Offer History</h1>

        <!-- Tabs -->
        <div class="flex border-b border-gray-200 mb-6">
          <button @click="activeTab = 'donations'" class="px-4 py-2 border-b-2 text-sm font-medium"
            :class="activeTab === 'donations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
            Donations
          </button>
          <button @click="activeTab = 'offers'" class="ml-4 px-4 py-2 border-b-2 text-sm font-medium"
            :class="activeTab === 'offers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
            Offers
          </button>
        </div>

        <!-- Donations Tab -->
        <div v-if="activeTab === 'donations'">
          <!-- No Donations History State -->
          <div v-if="paymentHistory.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-heart text-3xl text-blue-600"></i>
            </div>

            <h2 class="text-xl font-semibold text-gray-800 mb-2">No Donation History</h2>
            <p class="text-gray-600 mb-6">
              You haven't made any donations yet. Make your first donation to see your donation history.
            </p>

            <router-link to="/donate" class="btn btn-primary">
              <i class="fas fa-heart mr-2"></i> Make a Donation
            </router-link>
          </div>

          <!-- Donations History Table -->
          <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(payment, index) in paymentHistory" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {{ formatDate(payment.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{{ payment.amount }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {{ payment.transactionId }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button @click="downloadReceipt(payment.transactionId)"
                        class="text-blue-600 hover:text-blue-800 font-medium">
                        <i class="fas fa-download mr-1"></i> Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Offers Tab -->
        <div v-if="activeTab === 'offers'">
          <!-- No Offers History State -->
          <div v-if="offerHistory.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-hands-helping text-3xl text-green-600"></i>
            </div>

            <h2 class="text-xl font-semibold text-gray-800 mb-2">No Offer History</h2>
            <p class="text-gray-600 mb-6">
              You haven't made any offers yet. Make your first offer to see your offer history.
            </p>

            <router-link to="/offer" class="btn btn-primary bg-green-600 hover:bg-green-700">
              <i class="fas fa-hands-helping mr-2"></i> Make an Offer
            </router-link>
          </div>

          <!-- Offers History Table -->
          <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid Amount
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Installments
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(offer, index) in offerHistory" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {{ formatDate(offer.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{{ offer.amount }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{{ offer.paidAmount }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {{ offer.installments === '1' ? 'One-time' : offer.installments + ' installments' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {{ offer.completionDate }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                        {{ offer.status === 'active' ? 'Active' : 'Completed' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-6 text-center">
          <router-link to="/" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
            <i class="fas fa-arrow-left mr-2"></i> Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, inject } from 'vue'
import { useStore } from 'vuex'
import { getReceiptUrl, getPaymentHistory, getOfferHistory } from '@/utils/api'

export default {
  name: 'PaymentHistory',
  setup() {
    const store = useStore()
    const activeTab = ref('donations')

    // Get preloader functions
    const showLoader = inject('showLoader')
    const hideLoader = inject('hideLoader')

    const paymentHistory = computed(() => store.state.payment.paymentHistory)
    const offerHistory = computed(() => store.state.payment.offerHistory)

    onMounted(() => {
      // Load payment history and offer history on component mount
      loadHistories()
    })

    const loadHistories = async () => {
      console.log('Loading histories...');

      const userInfo = store.getters['user/userInfo'] // Use getter instead
      console.log('User info:', userInfo);

      // Check if user has mobile number
      if (!userInfo.mobile) {
        console.warn('No mobile number found for user:', userInfo);
        // You might want to show a message or redirect user to update their info
        return;
      }

      try {
        showLoader('Loading your payment history...')

        // Use the fullMobileNumber getter or manually construct it
        const fullMobile = userInfo.countryCode + userInfo.mobile
        console.log('Full mobile number for API:', fullMobile);

        // Call API functions with better error handling
        const [paymentData, offerData] = await Promise.allSettled([
          getPaymentHistory(fullMobile).catch(err => {
            console.error('Payment history API error:', err);
            return []; // Return empty array on error
          }),
          getOfferHistory(fullMobile).catch(err => {
            console.error('Offer history API error:', err);
            return []; // Return empty array on error
          })
        ]);

        // Handle the settled promises
        const payments = paymentData.status === 'fulfilled' ? paymentData.value : [];
        const offers = offerData.status === 'fulfilled' ? offerData.value : [];

        console.log('Payment data received:', payments);
        console.log('Offer data received:', offers);

        // Store the data in Vuex store
        store.commit('payment/setPaymentHistory', payments)
        store.commit('payment/setOfferHistory', offers)

        hideLoader()
      } catch (error) {
        console.error('Failed to load histories:', error)
        hideLoader()

        // Show user-friendly error message
        alert('Failed to load history. Please check your connection and try again.');
      }
    }

    // const loadHistories = async () => {
    //   console.log(loadHistories);

    //   const userInfo = store.state.user.userInfo
    //   if (userInfo && userInfo.mobile) {
    //     try {
    //       showLoader('Loading your payment history...')

    //       // Call API functions directly and get the data
    //       const [paymentData, offerData] = await Promise.all([
    //         getPaymentHistory(userInfo.mobile),
    //         getOfferHistory(userInfo.mobile)
    //       ])

    //       // Store the data in Vuex store
    //       store.commit('payment/setPaymentHistory', paymentData)
    //       store.commit('payment/setOfferHistory', offerData)

    //       hideLoader()
    //     } catch (error) {
    //       console.error('Failed to load histories:', error)
    //       hideLoader()
    //     }
    //   }
    // }

    

    const formatDate = (dateString) => {
      if (!dateString) return ''

      try {
        const date = new Date(dateString)
        return date.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (e) {
        console.error('Date formatting error:', e)
        return dateString
      }
    }

    const downloadReceipt = async (transactionId) => {
      if (!transactionId) {
        alert('Receipt not available')
        return
      }

      try {
        showLoader('Generating receipt...')
        const receiptUrl = await getReceiptUrl(transactionId)
        hideLoader()

        // Open receipt URL in a new tab
        window.open(receiptUrl, '_blank')
      } catch (error) {
        console.error('Failed to get receipt:', error)
        hideLoader()
        alert('Unable to download receipt. Please try again later.')
      }
    }

    return {
      activeTab,
      paymentHistory,
      offerHistory,
      formatDate,
      downloadReceipt
    }
  }
}
</script>