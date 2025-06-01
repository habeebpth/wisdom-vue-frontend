// src/utils/mobileValidation.js
// Global mobile number validation utility

// Country data with mobile number formats
export const countries = [
  { name: 'India', code: '91', flag: '🇮🇳', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'United States', code: '1', flag: '🇺🇸', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'United Kingdom', code: '44', flag: '🇬🇧', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'Canada', code: '1', flag: '🇨🇦', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'Australia', code: '61', flag: '🇦🇺', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Germany', code: '49', flag: '🇩🇪', minLength: 10, maxLength: 12, format: '10-12 digits' },
  { name: 'France', code: '33', flag: '🇫🇷', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Italy', code: '39', flag: '🇮🇹', minLength: 9, maxLength: 10, format: '9-10 digits' },
  { name: 'Spain', code: '34', flag: '🇪🇸', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Netherlands', code: '31', flag: '🇳🇱', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Belgium', code: '32', flag: '🇧🇪', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Switzerland', code: '41', flag: '🇨🇭', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Austria', code: '43', flag: '🇦🇹', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'Sweden', code: '46', flag: '🇸🇪', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Norway', code: '47', flag: '🇳🇴', minLength: 8, maxLength: 8, format: '8 digits' },
  { name: 'Denmark', code: '45', flag: '🇩🇰', minLength: 8, maxLength: 8, format: '8 digits' },
  { name: 'Finland', code: '358', flag: '🇫🇮', minLength: 9, maxLength: 10, format: '9-10 digits' },
  { name: 'Japan', code: '81', flag: '🇯🇵', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'South Korea', code: '82', flag: '🇰🇷', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'China', code: '86', flag: '🇨🇳', minLength: 11, maxLength: 11, format: '11 digits' },
  { name: 'Singapore', code: '65', flag: '🇸🇬', minLength: 8, maxLength: 8, format: '8 digits' },
  { name: 'Malaysia', code: '60', flag: '🇲🇾', minLength: 9, maxLength: 10, format: '9-10 digits' },
  { name: 'Thailand', code: '66', flag: '🇹🇭', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Indonesia', code: '62', flag: '🇮🇩', minLength: 9, maxLength: 12, format: '9-12 digits' },
  { name: 'Philippines', code: '63', flag: '🇵🇭', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'Vietnam', code: '84', flag: '🇻🇳', minLength: 9, maxLength: 10, format: '9-10 digits' },
  { name: 'Bangladesh', code: '880', flag: '🇧🇩', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'Pakistan', code: '92', flag: '🇵🇰', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'Sri Lanka', code: '94', flag: '🇱🇰', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Nepal', code: '977', flag: '🇳🇵', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'United Arab Emirates', code: '971', flag: '🇦🇪', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Saudi Arabia', code: '966', flag: '🇸🇦', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Qatar', code: '974', flag: '🇶🇦', minLength: 8, maxLength: 8, format: '8 digits' },
  { name: 'Kuwait', code: '965', flag: '🇰🇼', minLength: 8, maxLength: 8, format: '8 digits' },
  { name: 'Bahrain', code: '973', flag: '🇧🇭', minLength: 8, maxLength: 8, format: '8 digits' },
  { name: 'Oman', code: '968', flag: '🇴🇲', minLength: 8, maxLength: 8, format: '8 digits' },
  { name: 'Israel', code: '972', flag: '🇮🇱', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Turkey', code: '90', flag: '🇹🇷', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'Russia', code: '7', flag: '🇷🇺', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'Brazil', code: '55', flag: '🇧🇷', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'Mexico', code: '52', flag: '🇲🇽', minLength: 10, maxLength: 10, format: '10 digits' },
  { name: 'Argentina', code: '54', flag: '🇦🇷', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'Chile', code: '56', flag: '🇨🇱', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'South Africa', code: '27', flag: '🇿🇦', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Egypt', code: '20', flag: '🇪🇬', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'Nigeria', code: '234', flag: '🇳🇬', minLength: 10, maxLength: 11, format: '10-11 digits' },
  { name: 'Kenya', code: '254', flag: '🇰🇪', minLength: 9, maxLength: 9, format: '9 digits' },
  { name: 'Ghana', code: '233', flag: '🇬🇭', minLength: 9, maxLength: 10, format: '9-10 digits' }
]

/**
 * Global mobile number validation function
 * @param {string} number - The mobile number to validate
 * @param {object} country - Country object with validation rules
 * @param {string} fieldName - Name of the field for error messages (default: 'Mobile')
 * @returns {string|null} - Error message or null if valid
 */
export const validateMobileNumber = (number, country, fieldName = 'Mobile') => {
  if (!number || !number.trim()) {
    return `${fieldName} number is required`
  }

  // Remove any non-digit characters for validation
  const cleanNumber = number.replace(/\D/g, '')

  if (!cleanNumber) {
    return `Please enter a valid ${fieldName.toLowerCase()} number`
  }

  // Check if number contains only digits
  if (!/^\d+$/.test(cleanNumber)) {
    return `${fieldName} number should contain only digits`
  }

  // Validate length based on country
  const minLength = country.minLength
  const maxLength = country.maxLength
  const numberLength = cleanNumber.length

  if (numberLength < minLength || numberLength > maxLength) {
    if (minLength === maxLength) {
      return `${fieldName} number for ${country.name} should be exactly ${minLength} digits`
    } else {
      return `${fieldName} number for ${country.name} should be ${minLength}-${maxLength} digits`
    }
  }

  // Additional country-specific validations
  if (country.code === '91') {
    // India: should start with 6, 7, 8, or 9
    if (!/^[6-9]/.test(cleanNumber)) {
      return 'Indian mobile numbers should start with 6, 7, 8, or 9'
    }
  } else if (country.code === '1') {
    // US/Canada: area code shouldn't start with 0 or 1
    if (/^[01]/.test(cleanNumber)) {
      return 'US/Canada numbers cannot start with 0 or 1'
    }
  } else if (country.code === '44') {
    // UK: mobile numbers should start with 7
    if (!/^7/.test(cleanNumber)) {
      return 'UK mobile numbers should start with 7'
    }
  } else if (country.code === '86') {
    // China: should start with 1
    if (!/^1/.test(cleanNumber)) {
      return 'Chinese mobile numbers should start with 1'
    }
  } else if (country.code === '65') {
    // Singapore: should start with 8 or 9
    if (!/^[89]/.test(cleanNumber)) {
      return 'Singapore mobile numbers should start with 8 or 9'
    }
  } else if (country.code === '971') {
    // UAE: should start with 5
    if (!/^5/.test(cleanNumber)) {
      return 'UAE mobile numbers should start with 5'
    }
  } else if (country.code === '966') {
    // Saudi Arabia: should start with 5
    if (!/^5/.test(cleanNumber)) {
      return 'Saudi mobile numbers should start with 5'
    }
  }

  return null // No error
}

/**
 * Get country by code
 * @param {string} code - Country code (e.g., '91')
 * @returns {object|null} - Country object or null if not found
 */
export const getCountryByCode = (code) => {
  return countries.find(country => country.code === code) || null
}

/**
 * Get default country (India)
 * @returns {object} - Default country object
 */
export const getDefaultCountry = () => {
  return countries.find(country => country.code === '91') || countries[0]
}

/**
 * Format mobile number for display
 * @param {string} number - Raw mobile number
 * @param {object} country - Country object
 * @returns {string} - Formatted number for display
 */
export const formatMobileNumber = (number, country) => {
  if (!number || !country) return number

  const cleanNumber = number.replace(/\D/g, '')
  return `${country.code} ${cleanNumber}`
}

/**
 * Clean mobile number (remove non-digits)
 * @param {string} number - Raw mobile number
 * @returns {string} - Clean number with only digits
 */
export const cleanMobileNumber = (number) => {
  if (!number) return ''
  return number.replace(/\D/g, '')
}

/**
 * Search countries by name or code
 * @param {string} searchTerm - Search term
 * @returns {array} - Filtered countries array
 */
export const searchCountries = (searchTerm) => {
  if (!searchTerm) return countries

  const term = searchTerm.toLowerCase()
  return countries.filter(country =>
    country.name.toLowerCase().includes(term) ||
    country.code.includes(searchTerm)
  )
}


/**
* Extract mobile number without country code
* @param {string} fullNumber - Full number with country code (e.g., "+919746937888")
* @param {object} country - Country object
* @returns {string} - Mobile number without country code (e.g., "9746937888")
*/
export const extractMobileNumber = (fullNumber, country) => {
  if (!fullNumber || !country) return fullNumber

  // Remove any non-digit characters
  const cleanNumber = fullNumber.replace(/\D/g, '')

  // Remove country code from the beginning
  const countryCodeDigits = country.code.replace(/\D/g, '')

  if (cleanNumber.startsWith(countryCodeDigits)) {
    return cleanNumber.substring(countryCodeDigits.length)
  }

  return cleanNumber
}

/**
 * Parse stored mobile number to extract country and number
 * @param {string} storedMobile - Stored mobile number (could be with or without country code)
 * @returns {object} - { country, mobileNumber }
 */
export const parseStoredMobile = (storedMobile) => {
  if (!storedMobile) {
    return {
      country: getDefaultCountry(),
      mobileNumber: ''
    }
  }

  // Clean the number
  const cleanNumber = storedMobile.replace(/\D/g, '')

  // Try to detect country from the stored number
  for (const country of countries) {
    const countryCodeDigits = country.code.replace(/\D/g, '')

    if (cleanNumber.startsWith(countryCodeDigits)) {
      const mobileNumber = cleanNumber.substring(countryCodeDigits.length)

      // Validate the length for this country
      if (mobileNumber.length >= country.minLength && mobileNumber.length <= country.maxLength) {
        return {
          country: country,
          mobileNumber: mobileNumber
        }
      }
    }
  }

  // If no country code detected, assume it's just the mobile number for default country
  const defaultCountry = getDefaultCountry()

  // If length matches default country, use it
  if (cleanNumber.length >= defaultCountry.minLength && cleanNumber.length <= defaultCountry.maxLength) {
    return {
      country: defaultCountry,
      mobileNumber: cleanNumber
    }
  }

  // Fallback: return as-is with default country
  return {
    country: defaultCountry,
    mobileNumber: cleanNumber
  }
}

/**
 * Format mobile number for storage (without country code)
 * @param {string} mobileNumber - Just the mobile number
 * @param {object} country - Country object  
 * @returns {string} - Clean mobile number for storage
 */
export const formatMobileForStorage = (mobileNumber, country) => {
  if (!mobileNumber) return ''

  // Just store the clean mobile number without country code
  return mobileNumber.replace(/\D/g, '')
}

/**
 * Format mobile number for display (with country code)
 * @param {string} mobileNumber - Just the mobile number
 * @param {object} country - Country object
 * @returns {string} - Formatted for display
 */
export const formatMobileForDisplay = (mobileNumber, country) => {
  if (!mobileNumber || !country) return mobileNumber

  const cleanNumber = mobileNumber.replace(/\D/g, '')
  return `${country.code} ${cleanNumber}`
}

/**
* Format mobile number for storage with country code
* @param {string} mobileNumber - Just the mobile number
* @param {object} country - Country object
* @returns {string} - Formatted as "+countrycode-mobilenumber"
*/
export const formatMobileForDatabase = (mobileNumber, country) => {
  if (!mobileNumber || !country) return ''

  const cleanNumber = mobileNumber.replace(/\D/g, '')
  return `+${country.code}-${cleanNumber}`
}

/**
 * Parse stored mobile number to get country and number
 * @param {string} storedMobile - Mobile in format "+91-9876543210"
 * @returns {object} - { country, mobileNumber, fullMobile }
 */
export const parseStoredMobileForDisplay = (storedMobile) => {
  if (!storedMobile) {
    return {
      country: getDefaultCountry(),
      mobileNumber: '',
      fullMobile: ''
    }
  }

  // Handle format "+91-9876543210"
  const match = storedMobile.match(/^\+(\d+)-(.+)$/)
  if (match) {
    const countryCode = match[1]
    const mobileNumber = match[2]

    const country = getCountryByCode(countryCode) || getDefaultCountry()

    return {
      country: country,
      mobileNumber: mobileNumber,
      fullMobile: storedMobile
    }
  }

  // Fallback for old format
  return {
    country: getDefaultCountry(),
    mobileNumber: storedMobile,
    fullMobile: `+${getDefaultCountry().code}-${storedMobile}`
  }
}