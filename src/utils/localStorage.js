// Local storage utility functions

/**
 * Saves user information to local storage
 * @param {Object} userInfo - User information object
 */
export const saveUserInfo = (userInfo) => {
  localStorage.setItem('wisdomDonations_userInfo', JSON.stringify(userInfo))
}

/**
 * Gets user information from local storage
 * @returns {Object|null} User information object or null if not found
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem('wisdomDonations_userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

/**
 * Saves payment history to local storage
 * @param {Array} history - Array of payment history objects
 */
export const savePaymentHistory = (history) => {
  localStorage.setItem('wisdomDonations_paymentHistory', JSON.stringify(history))
}

/**
 * Gets payment history from local storage
 * @returns {Array} Array of payment history objects or empty array if not found
 */
export const getPaymentHistory = () => {
  const history = localStorage.getItem('wisdomDonations_paymentHistory')
  return history ? JSON.parse(history) : []
}

/**
 * Saves offer history to local storage
 * @param {Array} history - Array of offer history objects
 */
export const saveOfferHistory = (history) => {
  localStorage.setItem('wisdomDonations_offerHistory', JSON.stringify(history))
}

/**
 * Gets offer history from local storage
 * @returns {Array} Array of offer history objects or empty array if not found
 */
export const getOfferHistory = () => {
  const history = localStorage.getItem('wisdomDonations_offerHistory')
  return history ? JSON.parse(history) : []
}

/**
 * Clears all app data from local storage
 */
export const clearLocalStorage = () => {
  localStorage.removeItem('wisdomDonations_userInfo')
  localStorage.removeItem('wisdomDonations_paymentHistory')
  localStorage.removeItem('wisdomDonations_offerHistory')
}