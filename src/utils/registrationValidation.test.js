import test from 'node:test'
import assert from 'node:assert/strict'

import {
  sanitizePhoneNumber,
  sanitizeText,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhoneNumber,
  validateRegistrationPayload,
  validateSecurityQuestion,
} from './registrationValidation.js'

const india = { name: 'India', dialCode: '+91' }
const unitedStates = { name: 'United States', dialCode: '+1' }

test('validates and sanitizes full names', () => {
  assert.deepEqual(validateFullName('  Anne-Marie O\'Neil  '), {
    isValid: true,
    value: 'Anne-Marie O\'Neil',
    error: '',
  })
  assert.equal(validateFullName('A').error, 'Full name must be at least 2 characters.')
  assert.equal(validateFullName('Jane123').error, 'Use letters, spaces, hyphens, or apostrophes only.')
  assert.equal(validateFullName('Jane @ Doe').error, 'Use letters, spaces, hyphens, or apostrophes only.')
})

test('sanitizes text without preserving risky markup characters', () => {
  assert.equal(sanitizeText('  <script>alert(1)</script>  '), 'scriptalert(1)/script')
})

test('validates robust email structures', () => {
  assert.equal(validateEmail(' USER.Name+tag@example.edu ').isValid, true)
  assert.equal(validateEmail('user@@example.com').isValid, false)
  assert.equal(validateEmail('user@example').isValid, false)
  assert.equal(validateEmail('user@example..com').isValid, false)
})

test('keeps phone input numeric and validates selected country length', () => {
  assert.equal(sanitizePhoneNumber('+91 98765abc43210'), '919876543210')
  assert.equal(validatePhoneNumber('9876543210', india).isValid, true)
  assert.equal(validatePhoneNumber('+919876543210', india).normalizedValue, '+919876543210')
  assert.equal(validatePhoneNumber('987654321', india).isValid, false)
  assert.equal(validatePhoneNumber('2025550123', unitedStates).isValid, true)
  assert.equal(validatePhoneNumber('20255501234', unitedStates).isValid, false)
})

test('enforces password complexity and confirm password matching', () => {
  assert.equal(validatePassword('Password1!').isValid, true)
  assert.equal(validatePassword('password1!').error, 'Password must include an uppercase letter.')
  assert.equal(validatePassword('PASSWORD1!').error, 'Password must include a lowercase letter.')
  assert.equal(validatePassword('Password!').error, 'Password must include a number.')
  assert.equal(validatePassword('Password1').error, 'Password must include a special character.')
  assert.equal(validateConfirmPassword('Password1!', 'Password1?').error, 'Passwords must match.')
})

test('validates security question and sanitized answer', () => {
  assert.equal(validateSecurityQuestion('', 'blue').questionError, 'Security question is required.')
  assert.equal(validateSecurityQuestion('What city were you born in?', '').answerError, 'Security answer is required.')
  assert.equal(validateSecurityQuestion('What city were you born in?', '<NY>').value, 'NY')
})

test('validates complete registration payloads consistently', () => {
  const validPayload = validateRegistrationPayload({
    registrationMethod: 'email',
    fullName: 'Sam Learner',
    contact: 'sam@example.edu',
    password: 'Password1!',
    confirmPassword: 'Password1!',
    securityQuestion: 'What city were you born in?',
    securityAnswer: 'Chennai',
    termsAccepted: true,
  })

  assert.equal(validPayload.isValid, true)
  assert.equal(validPayload.sanitized.contact, 'sam@example.edu')

  const invalidPayload = validateRegistrationPayload({
    registrationMethod: 'phone',
    fullName: 'Sam2',
    contact: 'abc',
    country: india,
    password: 'weak',
    confirmPassword: 'different',
    securityQuestion: '',
    securityAnswer: '',
    termsAccepted: false,
  })

  assert.equal(invalidPayload.isValid, false)
  assert.equal(invalidPayload.errors.fullName, 'Use letters, spaces, hyphens, or apostrophes only.')
  assert.equal(invalidPayload.errors.contact, 'Phone number is required.')
  assert.equal(invalidPayload.errors.terms, 'You must accept the terms.')
})
