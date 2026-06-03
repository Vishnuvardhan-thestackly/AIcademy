const NAME_PATTERN = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u
const HTML_RISK_CHARS_PATTERN = /[<>"`]/g

const COUNTRY_PHONE_LENGTHS = {
  '+1': { min: 10, max: 10 },
  '+44': { min: 10, max: 10 },
  '+61': { min: 9, max: 9 },
  '+81': { min: 10, max: 10 },
  '+91': { min: 10, max: 10 },
}

export function sanitizeText(value) {
  return Array.from(String(value ?? ''))
    .filter((character) => {
      const codePoint = character.codePointAt(0)

      return codePoint >= 32 && codePoint !== 127
    })
    .join('')
    .replace(HTML_RISK_CHARS_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function sanitizePhoneNumber(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 15)
}

export function getCountryPhoneRule(country) {
  return COUNTRY_PHONE_LENGTHS[country?.dialCode] || { min: 6, max: 15 }
}

export function validateFullName(value) {
  const sanitized = sanitizeText(value)

  if (!sanitized) {
    return { isValid: false, value: sanitized, error: 'Full name is required.' }
  }

  if (sanitized.length < 2) {
    return { isValid: false, value: sanitized, error: 'Full name must be at least 2 characters.' }
  }

  if (sanitized.length > 100) {
    return { isValid: false, value: sanitized, error: 'Full name must be 100 characters or fewer.' }
  }

  if (!NAME_PATTERN.test(sanitized)) {
    return { isValid: false, value: sanitized, error: 'Use letters, spaces, hyphens, or apostrophes only.' }
  }

  return { isValid: true, value: sanitized, error: '' }
}

export function validateEmail(value) {
  const sanitized = sanitizeText(value).toLowerCase()
  const [localPart, domain] = sanitized.split('@')
  const emailPattern = /^[^\s@]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/

  if (!sanitized) {
    return { isValid: false, value: sanitized, error: 'Email address is required.' }
  }

  if (sanitized.length > 254 || !emailPattern.test(sanitized) || localPart.includes('..') || domain.includes('..')) {
    return { isValid: false, value: sanitized, error: 'Enter a valid email address.' }
  }

  return { isValid: true, value: sanitized, error: '' }
}

export function validatePhoneNumber(value, country) {
  const digits = sanitizePhoneNumber(value)
  const dialDigits = sanitizePhoneNumber(country?.dialCode)
  const phoneRule = getCountryPhoneRule(country)
  const localDigits = dialDigits && digits.startsWith(dialDigits) && digits.length > phoneRule.max
    ? digits.slice(dialDigits.length)
    : digits

  if (!digits) {
    return { isValid: false, value: digits, normalizedValue: '', error: 'Phone number is required.' }
  }

  if (localDigits.length < phoneRule.min || localDigits.length > phoneRule.max) {
    const lengthMessage = phoneRule.min === phoneRule.max
      ? `${phoneRule.min} digits`
      : `${phoneRule.min}-${phoneRule.max} digits`

    return {
      isValid: false,
      value: digits,
      normalizedValue: '',
      error: `Enter a valid ${country?.name || 'selected country'} phone number (${lengthMessage}).`,
    }
  }

  return {
    isValid: true,
    value: digits,
    normalizedValue: `${country?.dialCode || '+'}${localDigits}`,
    error: '',
  }
}

export function getPasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length

  if (!password) {
    return { score: 0, label: 'Required', tone: 'empty' }
  }

  if (score <= 2) {
    return { score, label: 'Weak', tone: 'weak' }
  }

  if (score <= 4) {
    return { score, label: 'Medium', tone: 'medium' }
  }

  return { score, label: 'Strong', tone: 'strong' }
}

export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: 'Password is required.' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters.' }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must include an uppercase letter.' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must include a lowercase letter.' }
  }

  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must include a number.' }
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, error: 'Password must include a special character.' }
  }

  return { isValid: true, error: '' }
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, error: 'Confirm password is required.' }
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords must match.' }
  }

  return { isValid: true, error: '' }
}

export function validateSecurityQuestion(question, answer) {
  const sanitizedAnswer = sanitizeText(answer)

  if (!question) {
    return { isValid: false, value: sanitizedAnswer, questionError: 'Security question is required.', answerError: '' }
  }

  if (!sanitizedAnswer) {
    return { isValid: false, value: sanitizedAnswer, questionError: '', answerError: 'Security answer is required.' }
  }

  if (sanitizedAnswer.length < 2) {
    return { isValid: false, value: sanitizedAnswer, questionError: '', answerError: 'Security answer must be at least 2 characters.' }
  }

  if (sanitizedAnswer.length > 100) {
    return { isValid: false, value: sanitizedAnswer, questionError: '', answerError: 'Security answer must be 100 characters or fewer.' }
  }

  return { isValid: true, value: sanitizedAnswer, questionError: '', answerError: '' }
}

export function validateRegistrationPayload(payload) {
  const fullName = validateFullName(payload.fullName)
  const contact = payload.registrationMethod === 'phone'
    ? validatePhoneNumber(payload.contact, payload.country)
    : validateEmail(payload.contact)
  const password = validatePassword(payload.password)
  const confirmPassword = validateConfirmPassword(payload.password, payload.confirmPassword)
  const security = validateSecurityQuestion(payload.securityQuestion, payload.securityAnswer)
  const termsError = payload.termsAccepted ? '' : 'You must accept the terms.'

  const errors = {
    fullName: fullName.error,
    contact: contact.error,
    password: password.error,
    confirmPassword: confirmPassword.error,
    securityQuestion: security.questionError,
    securityAnswer: security.answerError,
    terms: termsError,
  }

  return {
    isValid: Object.values(errors).every((error) => !error),
    errors,
    sanitized: {
      registrationMethod: payload.registrationMethod,
      fullName: fullName.value,
      contact: contact.normalizedValue || contact.value,
      securityQuestion: payload.securityQuestion,
      securityAnswer: security.value,
      termsAccepted: Boolean(payload.termsAccepted),
    },
  }
}
