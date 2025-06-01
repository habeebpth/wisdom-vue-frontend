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
        countryCode: '91', // Add countryCode to state
        hasUserInfo: false
      }),
      mutations: {
        setUserInfo(state, { name, mobile, countryCode }) {
          state.name = name
          state.mobile = mobile
          state.countryCode = countryCode || '91' // Default to +91 if not provided
          state.hasUserInfo = !!(name && name.trim()) // Set to true if name exists
        },
        clearUserInfo(state) {
          state.name = ''
          state.mobile = ''
          state.countryCode = '91'
          state.hasUserInfo = false
        }
      },
      actions: {
        saveUserInfo({ commit }, userData) {
          console.log('Saving user info:', userData)
          
          // Save to local storage
          saveUserInfo(userData)
          
          // Update state
          commit('setUserInfo', userData)
        },
        clearUserInfo({ commit }) {
          commit('clearUserInfo')
        }
      },
      getters: {
        userInfo: (state) => ({
          name: state.name,
          mobile: state.mobile,
          countryCode: state.countryCode,
          hasUserInfo: state.hasUserInfo
        }),
        hasValidUserInfo: (state) => {
          return !!(state.name && state.name.trim())
        },
        fullMobileNumber: (state) => {
          return state.countryCode + state.mobile
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
            console.log('Loading payment history from store action...');
            
            const userInfo = rootState.user;
            console.log('User info in store action:', userInfo);
            
            if (!userInfo.mobile) {
              console.warn('No mobile number available, skipping server fetch');
              // Still load from localStorage if available
              const localHistory = getPaymentHistory()
              commit('setPaymentHistory', localHistory)
              return;
            }

            // Show some loading state if needed
            const serverHistory = await fetchServerPaymentHistory(userInfo.mobile);
            
            if (serverHistory && serverHistory.length > 0) {
              console.log('Server payment history loaded:', serverHistory);
              commit('setPaymentHistory', serverHistory);
              savePaymentHistory(serverHistory); // Update localStorage
            } else {
              console.log('No server data, loading from localStorage');
              // Fallback to localStorage
              const localHistory = getPaymentHistory()
              commit('setPaymentHistory', localHistory)
            }
            
          } catch (error) {
            console.error('Error in loadPaymentHistory action:', error);
            
            // Fallback to localStorage on error
            try {
              const localHistory = getPaymentHistory()
              commit('setPaymentHistory', localHistory)
              console.log('Loaded payment history from localStorage as fallback');
            } catch (localError) {
              console.error('Error loading from localStorage:', localError);
              // Set empty array as last resort
              commit('setPaymentHistory', [])
            }
          }
        },
        
        // Load offer history from localStorage and potentially from server
        async loadOfferHistory({ commit, rootState }) {
          try {
            console.log('Loading offer history from store action...');
            
            const userInfo = rootState.user;
            console.log('User info in store action:', userInfo);
            
            if (!userInfo.mobile) {
              console.warn('No mobile number available, skipping server fetch');
              // Still load from localStorage if available
              const localHistory = getLocalOfferHistory()
              commit('setOfferHistory', localHistory)
              return;
            }

            const serverHistory = await fetchServerOfferHistory(userInfo.mobile);
            
            if (serverHistory && serverHistory.length > 0) {
              console.log('Server offer history loaded:', serverHistory);
              commit('setOfferHistory', serverHistory);
              saveOfferHistory(serverHistory); // Update localStorage
            } else {
              console.log('No server data, loading from localStorage');
              // Fallback to localStorage
              const localHistory = getLocalOfferHistory()
              commit('setOfferHistory', localHistory)
            }
            
          } catch (error) {
            console.error('Error in loadOfferHistory action:', error);
            
            // Fallback to localStorage on error
            try {
              const localHistory = getLocalOfferHistory()
              commit('setOfferHistory', localHistory)
              console.log('Loaded offer history from localStorage as fallback');
            } catch (localError) {
              console.error('Error loading from localStorage:', localError);
              // Set empty array as last resort
              commit('setOfferHistory', [])
            }
          }
        },
        
        // Enhanced transaction saving
        saveTransaction({ commit, state, rootState }, transactionDetails) {
          console.log('Saving transaction:', transactionDetails);
          
          const payment = {
            transactionId: transactionDetails.transactionId,
            amount: state.amount,
            date: transactionDetails.date || new Date().toISOString(),
            userName: rootState.user.name || state.name,
            receiptUrl: transactionDetails.receiptUrl || null,
            status: 'completed'
          }
          
          console.log('Payment object to save:', payment);
          
          // Add to state and persist
          commit('addPaymentToHistory', payment)
          
          // Set current transaction details
          commit('setTransactionDetails', {
            transactionId: transactionDetails.transactionId,
            date: transactionDetails.date || new Date().toISOString()
          })
        },
        
        // Enhanced offer saving
        addOfferToHistory({ commit }, offerData) {
          console.log('Adding offer to history:', offerData);
          commit('addOfferToHistory', offerData)
        }
      },
      getters: {
        currentFormData: (state) => ({
          amount: state.amount,
          name: state.name,
          mobile: state.mobile,
          district: state.district,
          zone: state.zone,
          unit: state.unit,
          currentStep: state.currentStep
        }),
        paymentHistoryCount: (state) => state.paymentHistory.length,
        offerHistoryCount: (state) => state.offerHistory.length,
        totalDonated: (state) => {
          return state.paymentHistory.reduce((total, payment) => {
            return total + (parseFloat(payment.amount) || 0)
          }, 0)
        }
      }
    }
  }
})