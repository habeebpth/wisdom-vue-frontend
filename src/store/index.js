import { createStore } from 'vuex'
import { saveUserInfo, savePaymentHistory, getPaymentHistory, getOfferHistory as getLocalOfferHistory, saveOfferHistory } from '@/utils/localStorage'
import { getPaymentHistory as fetchServerPaymentHistory, getOfferHistory as fetchServerOfferHistory } from '@/utils/api'

// Create a new store instance
export default createStore({
  modules: {
    user: {
      namespaced: true,
      state: () => ({
        name: '',
        mobile: '',
        hasUserInfo: false
      }),
      mutations: {
        setUserInfo(state, { name, mobile }) {
          state.name = name
          state.mobile = mobile
          state.hasUserInfo = true
        }
      },
      actions: {
        saveUserInfo({ commit }, userData) {
          // Save to local storage
          saveUserInfo(userData)
          
          // Update state
          commit('setUserInfo', userData)
        }
      }
    },
    payment: {
      namespaced: true,
      state: () => ({
        // Donation form state
        amount: 0,
        name: '',
        mobile: '',
        district: '',
        zone: '',
        unit: '',
        currentStep: 1,
        transactionId: '',
        donationDate: null,
        
        // History collections
        paymentHistory: [],
        offerHistory: []
      }),
      mutations: {
        setAmount(state, amount) {
          state.amount = amount
        },
        setUserDetails(state, { name, mobile, district, zone, unit }) {
          state.name = name
          state.mobile = mobile
          state.district = district
          state.zone = zone
          state.unit = unit
        },
        nextStep(state) {
          state.currentStep++
        },
        prevStep(state) {
          state.currentStep--
        },
        resetForm(state) {
          state.amount = 0
          state.district = ''
          state.zone = ''
          state.unit = ''
          state.currentStep = 1
          state.transactionId = ''
          state.donationDate = null
        },
        setTransactionDetails(state, { transactionId, date }) {
          state.transactionId = transactionId
          state.donationDate = date
        },
        
        // Payment history mutations
        setPaymentHistory(state, history) {
          state.paymentHistory = history
        },
        addPaymentToHistory(state, payment) {
          state.paymentHistory.unshift(payment)
          // Save updated history to localStorage
          savePaymentHistory(state.paymentHistory)
        },
        
        // Offer history mutations
        setOfferHistory(state, history) {
          state.offerHistory = history
        },
        addOfferToHistory(state, offer) {
          state.offerHistory.unshift(offer)
          // Save updated offer history to localStorage
          saveOfferHistory(state.offerHistory)
        }
      },
      actions: {
        // Load payment history from localStorage and potentially from server
        async loadPaymentHistory({ commit, rootState }) {
          try {
            // First load from localStorage
            const localHistory = getPaymentHistory()
            commit('setPaymentHistory', localHistory)
            
            // Then try to get from server if user is logged in
            const userInfo = rootState.user.userInfo
            if (userInfo && userInfo.mobile) {
              const serverHistory = await fetchServerPaymentHistory(userInfo.mobile)
              if (serverHistory && serverHistory.length) {
                commit('setPaymentHistory', serverHistory)
                savePaymentHistory(serverHistory) // Update localStorage
              }
            }
          } catch (error) {
            console.error('Error loading payment history:', error)
          }
        },
        
        // Load offer history from localStorage and potentially from server
        async loadOfferHistory({ commit, rootState }) {
          try {
            // First load from localStorage
            const localHistory = getLocalOfferHistory()
            commit('setOfferHistory', localHistory)
            
            // Then try to get from server if user is logged in
            const userInfo = rootState.user.userInfo
            if (userInfo && userInfo.mobile) {
              const serverHistory = await fetchServerOfferHistory(userInfo.mobile)
              if (serverHistory && serverHistory.length) {
                commit('setOfferHistory', serverHistory)
                saveOfferHistory(serverHistory) // Update localStorage
              }
            }
          } catch (error) {
            console.error('Error loading offer history:', error)
          }
        },
        
        // Save transaction details for donation
        saveTransaction({ commit, state, rootState }, transactionDetails) {
          const payment = {
            transactionId: transactionDetails.transactionId,
            amount: state.amount,
            date: transactionDetails.date || new Date().toISOString(),
            userName: rootState.user.name || state.name,
            receiptUrl: transactionDetails.receiptUrl || null
          }
          
          // Add to state and persist
          commit('addPaymentToHistory', payment)
          
          // Set current transaction details
          commit('setTransactionDetails', {
            transactionId: transactionDetails.transactionId,
            date: transactionDetails.date || new Date().toISOString()
          })
        },
        
        // Add an offer to history
        addOfferToHistory({ commit }, offerData) {
          commit('addOfferToHistory', offerData)
        }
      }
    }
  }
})