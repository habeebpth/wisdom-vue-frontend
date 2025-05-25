<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <!-- Success State -->
          <div v-if="isSuccess" class="text-center">
            <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-check text-3xl text-green-600"></i>
            </div>
            
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p class="text-gray-600 mb-6">
              Thank you for your donation. Your contribution will make a difference.
            </p>
            
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Transaction ID:</span>
                <span class="font-semibold">{{ transactionId }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Amount:</span>
                <span class="font-semibold">₹{{ amount }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Date:</span>
                <span class="font-semibold">{{ formattedDate }}</span>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button @click="downloadReceipt" class="btn btn-primary">
                <i class="fas fa-download mr-2"></i> Download Receipt
              </button>
              <router-link to="/payment-history" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                <i class="fas fa-history mr-2"></i> View History
              </router-link>
            </div>
          </div>
          
          <!-- Failure State -->
          <div v-else class="text-center">
            <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-times text-3xl text-red-600"></i>
            </div>
            
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
            <p class="text-gray-600 mb-6">
              We were unable to process your payment. Please try again or contact support.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link to="/donate" class="btn btn-primary">
                <i class="fas fa-redo mr-2"></i> Try Again
              </router-link>
              <router-link to="/" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700">
                <i class="fas fa-home mr-2"></i> Go Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getReceiptUrl } from '@/utils/api'

export default {
  name: 'PaymentResponse',
  props: {
    status: {
      type: String,
      default: 'failed'
    },
    transactionId: {
      type: String,
      default: ''
    },
    amount: {
      type: [Number, String],
      default: 0
    },
    date: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    
    const isSuccess = computed(() => props.status === 'success')
    
    const formattedDate = computed(() => {
      if (!props.date) return ''
      
      try {
        const date = new Date(props.date)
        return date.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (e) {
        console.error('Date formatting error:', e)
        return props.date
      }
    })
    
    const downloadReceipt = async () => {
      if (!props.transactionId) {
        alert('Receipt not available')
        return
      }
      
      try {
        const receiptUrl = await getReceiptUrl(props.transactionId)
        
        // Open receipt URL in a new tab
        window.open(receiptUrl, '_blank')
      } catch (error) {
        console.error('Failed to get receipt:', error)
        alert('Unable to download receipt. Please try again later.')
      }
    }
    
    return {
      isSuccess,
      formattedDate,
      downloadReceipt
    }
  }
}
</script>