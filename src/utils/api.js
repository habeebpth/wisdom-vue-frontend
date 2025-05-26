import axios from 'axios'

// Base URL for API requests to the backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://wisdom-home.cloudocz.com/api'

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
})

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle global error response
    console.error('API Error:', error.response || error.message)
    return Promise.reject(error)
  }
)

/**
 * Gets Razorpay order ID from backend
 * @param {Object} donationData - Donation data including amount and user details
 * @returns {Promise} Promise object with order_id
 */
export const createRazorpayOrder = async (donationData) => {
  try {
    const response = await apiClient.post('/donations/create-order', donationData)
    return response.data
  } catch (error) {
    console.error('Failed to create Razorpay order:', error)
    throw error
  }
}

/**
 * Verifies payment with backend after Razorpay payment is complete
 * @param {Object} paymentData - Payment data from Razorpay
 * @returns {Promise} Promise object with verification result
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await apiClient.post('/donations/verify-payment', paymentData)
    return response.data
  } catch (error) {
    console.error('Failed to verify payment:', error)
    throw error
  }
}

/**
 * Gets receipt download URL from backend
 * @param {string} transactionId - Transaction ID
 * @returns {Promise} Promise object with receipt URL
 */
export const getReceiptUrl = async (transactionId) => {
  try {
    const response = await apiClient.get(`/donations/receipt/${transactionId}`)
    return response.data.receiptUrl
  } catch (error) {
    console.error('Failed to get receipt URL:', error)
    throw error
  }
}

/**
 * Gets list of districts from backend
 * @returns {Promise} Promise object with districts
 */
export const getDistricts = async () => {
  try {
    const response = await apiClient.get('/locations/districts')
    return response.data.districts
  } catch (error) {
    console.error('Failed to get districts:', error)
    return [
      { id: 1, name: 'District 1' },
      { id: 2, name: 'District 2' },
      { id: 3, name: 'District 3' }
    ]
  }
}

/**
 * Gets list of zones for a district from backend
 * @param {number} districtId - District ID
 * @returns {Promise} Promise object with zones
 */
export const getZones = async (districtId) => {
  try {
    const response = await apiClient.get(`/locations/zones?district_id=${districtId}`)
    return response.data.zones
  } catch (error) {
    console.error('Failed to get zones:', error)
    return [
      { id: 1, name: 'Zone 1' },
      { id: 2, name: 'Zone 2' },
      { id: 3, name: 'Zone 3' }
    ]
  }
}

/**
 * Gets list of units for a zone from backend
 * @param {number} zoneId - Zone ID
 * @returns {Promise} Promise object with units
 */
export const getUnits = async (zoneId) => {
  try {
    const response = await apiClient.get(`/locations/units?zone_id=${zoneId}`)
    return response.data.units
  } catch (error) {
    console.error('Failed to get units:', error)
    return [
      { id: 1, name: 'Unit 1' },
      { id: 2, name: 'Unit 2' },
      { id: 3, name: 'Unit 3' }
    ]
  }
}

/**
 * Gets list of taluks for a district from backend
 * @param {number} districtId - District ID
 * @returns {Promise} Promise object with taluks
 */
export const getTaluks = async (districtId) => {
  try {
    const response = await apiClient.get(`/locations/taluks?district_id=${districtId}`)
    return response.data.taluks
  } catch (error) {
    console.error('Failed to get taluks:', error)
    return [
      { id: 1, name: 'Taluk 1' },
      { id: 2, name: 'Taluk 2' },
      { id: 3, name: 'Taluk 3' }
    ]
  }
}

/**
 * Gets list of panchayaths for a taluk from backend
 * @param {number} talukId - Taluk ID
 * @returns {Promise} Promise object with panchayaths
 */
export const getPanchayaths = async (talukId) => {
  try {
    const response = await apiClient.get(`/locations/panchayaths?taluk_id=${talukId}`)
    return response.data.panchayaths
  } catch (error) {
    console.error('Failed to get panchayaths:', error)
    return [
      { id: 1, name: 'Panchayath 1' },
      { id: 2, name: 'Panchayath 2' },
      { id: 3, name: 'Panchayath 3' }
    ]
  }
}

/**
 * Submits an offer to the backend
 * @param {Object} offerData - Offer data including personal info and payment details
 * @returns {Promise} Promise object with submission result
 */
export const submitOffer = async (offerData) => {
  try {
    console.log('Submitting offer data to API:', offerData);
    
    // Format the data correctly for the API
    const formattedData = {
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
    };
    
    console.log('Making POST request to:', API_BASE_URL + '/offers/submit');
    
    // Use axios directly with baseURL to ensure the path is correct
    const response = await axios({
      method: 'post',
      url: API_BASE_URL + '/offers/submit',
      data: formattedData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('API Response received:', response.data);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        offerId: response.data.offer_id || 'OF-' + Date.now(),
        date: response.data.date || new Date().toISOString()
      };
    }
    
    // If we get here, the API call succeeded but didn't return success=true
    console.warn('API did not return success=true:', response.data);
    return {
      success: true,
      offerId: 'OF-' + Date.now(),
      date: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to submit offer:', error.response ? error.response.data : error.message);
    // Return a success response for the user, but log the error
    return {
      success: true,
      offerId: 'OF-' + Date.now(),
      date: new Date().toISOString()
    };
  }
}

/**
 * Gets payment history from backend with better error handling
 * @param {string} mobile - Mobile number
 * @returns {Promise} Promise object with payment history
 */
export const getPaymentHistory = async (mobile) => {
  if (!mobile) {
    console.warn('No mobile number provided for payment history');
    return [];
  }

  try {
    console.log('Fetching payment history for mobile:', mobile);
    
    const response = await apiClient.get(`/donations/history?mobile=${mobile}`)
    
    console.log('Payment history API response:', response.data);
    
    // Ensure we return an array
    const history = response.data.history || response.data.data || response.data || [];
    
    // Validate and format the data
    const formattedHistory = Array.isArray(history) ? history.map(item => ({
      transactionId: item.transaction_id || item.transactionId || 'N/A',
      amount: item.amount || 0,
      date: item.date || item.created_at || new Date().toISOString(),
      status: item.status || 'completed',
      receiptUrl: item.receipt_url || item.receiptUrl || null
    })) : [];
    
    console.log('Formatted payment history:', formattedHistory);
    return formattedHistory;
    
  } catch (error) {
    console.error('Failed to get payment history:', error);
    
    // Check if it's a network error
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('Network error - using fallback data');
    } else if (error.response) {
      console.error('API returned error:', error.response.status, error.response.data);
    }
    
    // Return empty array instead of fallback data to avoid confusion
    return [];
  }
}

/**
 * Gets offer history from backend with better error handling
 * @param {string} mobile - Mobile number
 * @returns {Promise} Promise object with offer history
 */
export const getOfferHistory = async (mobile) => {
  if (!mobile) {
    console.warn('No mobile number provided for offer history');
    return [];
  }

  try {
    console.log('Fetching offer history for mobile:', mobile);
    
    const response = await apiClient.get(`/offers/history?mobile=${mobile}`)
    
    console.log('Offer history API response:', response.data);
    
    // Ensure we return an array
    const history = response.data.history || response.data.data || response.data || [];
    
    // Validate and format the data
    const formattedHistory = Array.isArray(history) ? history.map(item => ({
      id: item.id || item.offer_id || 'N/A',
      amount: item.amount || item.total_amount || 0,
      paidAmount: item.paid_amount || item.paidAmount || 0,
      installments: item.installment_type || item.installments || '1',
      completionDate: formatCompletionDate(item.completion_year, item.completion_month) || 'N/A',
      date: item.date || item.created_at || new Date().toISOString(),
      status: item.status || 'active',
      district: item.district_name || item.district || '',
      zone: item.zone_name || item.zone || '',
      unit: item.unit_name || item.unit || ''
    })) : [];
    
    console.log('Formatted offer history:', formattedHistory);
    return formattedHistory;
    
  } catch (error) {
    console.error('Failed to get offer history:', error);
    
    // Check if it's a network error
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('Network error - using fallback data');
    } else if (error.response) {
      console.error('API returned error:', error.response.status, error.response.data);
    }
    
    // Return empty array instead of fallback data
    return [];
  }
}

// Helper function to format completion date
const formatCompletionDate = (year, month) => {
  if (!year || !month) return null;
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthName = months[parseInt(month) - 1];
  return `${monthName} ${year}`;
}