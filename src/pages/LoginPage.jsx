import { useEffect, useRef, useState } from 'react'
import AOS from 'aos'
import homeLogo from '../assets/images/Home_Logo.jpeg'
import coverImage from '../assets/images/Cover.png'
import { countryDialCodes } from '../utils/countryDialCodes'

const captchaValues = ['oi$dykss', 'm7qP2a', 'rT9wLx', 'H4sK8n', 'z6YpQ3']
const securityQuestions = [
  'What is your mother\'s maiden name?',
  'What was the name of your first school?',
  'What city were you born in?',
  'What was your childhood nickname?',
]

function ForgotPasswordModal({ isOpen, onClose, onVerified }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousActiveElement = document.activeElement
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return
      }

      const focusableElements = modalRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!firstElement || !lastElement) {
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus?.()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setSecurityQuestion('')
      setAnswer('')
      setErrors({})
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!securityQuestion) {
      nextErrors.securityQuestion = 'Security question is required.'
    }
    if (!answer.trim()) {
      nextErrors.answer = 'Answer is required.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      onVerified()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-[18px] py-[28px] animate-fade-rise"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
        aria-describedby="forgot-password-description"
        className="relative w-full max-w-[440px] origin-center scale-100 rounded-[16px] bg-white px-[36px] pb-[72px] pt-[62px] text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)] transition-all duration-200 max-[768px]:max-w-[calc(100vw-28px)] max-[768px]:px-[22px] max-[768px]:pb-[34px] max-[768px]:pt-[54px]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close forgot password popup"
          onClick={onClose}
          style={{ position: 'absolute', left: '30px', top: '30px' }}
          className="absolute left-[30px] top-[30px] flex h-[28px] w-[28px] items-center justify-center text-[#111111] transition hover:text-[#1F8F4C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[26px] w-[26px]">
            <path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#ffd9df]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[35px] w-[35px] text-[#159454]">
            <path d="M12 4.2 21 19H3L12 4.2Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
            <path d="M12 9.5v4.4M12 16.8h.01" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          </svg>
        </div>

        <h2 id="forgot-password-title" className="mt-[16px] text-[24px] font-[700] leading-[30px] text-[#2d2d2d]">
          Account Blocked
        </h2>
        <p id="forgot-password-description" className="mx-auto mt-[11px] max-w-[320px] text-[14px] font-[400] leading-[21px] text-[#6f6f6f]">
          Your account has been temporarily blocked due to multiple failed login attempts. To reset your password, please answer your security question.
        </p>

        <form className="mt-[30px] text-left" onSubmit={handleSubmit} noValidate>
          <label htmlFor="security-question" className="block text-[13px] font-[700] leading-[18px] text-[#17213c]">
            Security Question
          </label>
          <select
            id="security-question"
            value={securityQuestion}
            onChange={(event) => {
              setSecurityQuestion(event.target.value)
              setErrors((current) => ({ ...current, securityQuestion: '' }))
            }}
            className="mt-[9px] h-[38px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[400] text-[#111111] outline-none transition hover:border-[#bfc8d1] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15"
          >
            <option value="">Select a Security Question</option>
            {securityQuestions.map((question) => (
              <option key={question} value={question}>
                {question}
              </option>
            ))}
          </select>
          {errors.securityQuestion && (
            <p className="mt-[6px] text-[12px] font-[500] text-[#d33f49]" role="alert">
              {errors.securityQuestion}
            </p>
          )}

          <input
            type="text"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value)
              setErrors((current) => ({ ...current, answer: '' }))
            }}
            placeholder="Kumar Gandham"
            aria-label="Security answer"
            className="mt-[11px] h-[38px] w-full rounded-[4px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[400] text-[#111111] outline-none transition placeholder:text-[#596177] hover:border-[#bfc8d1] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15"
          />
          {errors.answer && (
            <p className="mt-[6px] text-[12px] font-[500] text-[#d33f49]" role="alert">
              {errors.answer}
            </p>
          )}

          <button
            type="submit"
            className="mt-[26px] h-[38px] w-full rounded-[5px] bg-[#1F8F4C] text-[14px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
          >
            Verify &amp; Reset Password
          </button>
        </form>

        <p className="mt-[18px] text-center text-[13px] font-[400] leading-[18px] text-[#a4a4a4]">
          Can&apos;t remember your answer?{' '}
          <a href="#support" className="text-[#ff7d82] transition hover:text-[#f25f69] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C]">
            Contact Support
          </a>
        </p>
      </section>
    </div>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[13px] w-[13px] text-[#7b7b7b]">
      <rect x="2.5" y="4" width="11" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="m3 4.7 5 3.8 5-3.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[13px] w-[13px] text-[#7b7b7b]">
      <path d="M5.2 2.7 6.5 5c.2.4.1.8-.2 1.1l-.6.6a7 7 0 0 0 3.6 3.6l.6-.6c.3-.3.8-.4 1.1-.2l2.3 1.3c.4.2.6.7.5 1.1l-.5 1.6c-.1.4-.5.7-.9.7A10.6 10.6 0 0 1 1.8 3.6c0-.4.3-.8.7-.9l1.6-.5c.4-.1.9.1 1.1.5Z" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[13px] w-[13px] text-[#7b7b7b]">
      <circle cx="8" cy="5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <path d="M3.8 13c.5-2.1 2-3.4 4.2-3.4s3.7 1.3 4.2 3.4" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  )
}

function RegisterField({ id, label, icon, type = 'text', placeholder, value, onChange, error }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-[8px] block text-[12px] font-[700] leading-[17px] text-[#17213c]">{label}</span>
      <span className={`flex h-[43px] items-center gap-[10px] rounded-[2px] bg-white px-[14px] shadow-[0_1px_14px_rgba(0,0,0,0.035)] transition focus-within:ring-2 focus-within:ring-[#1F8F4C]/20 ${error ? 'ring-1 ring-[#d33f49]' : ''}`}>
        {icon}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-[#555555] outline-none placeholder:text-[#596177]"
        />
      </span>
      {error && (
        <p className="mt-[5px] text-[11px] font-[500] leading-[15px] text-[#d33f49]" role="alert">
          {error}
        </p>
      )}
    </label>
  )
}

function RegistrationPasswordField({ id, label, value, onChange, isVisible, onToggleVisible, error }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-[8px] block text-[12px] font-[700] leading-[17px] text-[#17213c]">{label}</span>
      <span className={`flex h-[43px] items-center gap-[10px] rounded-[2px] bg-white px-[12px] shadow-[0_1px_14px_rgba(0,0,0,0.035)] transition focus-within:ring-2 focus-within:ring-[#1F8F4C]/20 ${error ? 'ring-1 ring-[#d33f49]' : ''}`}>
        <LockIcon />
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••••"
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-[#555555] outline-none placeholder:text-[#596177]"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
          className="text-[#596177] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C]"
        >
          <EyeIcon isVisible={isVisible} />
        </button>
      </span>
      {error && (
        <p className="mt-[5px] text-[11px] font-[500] leading-[15px] text-[#d33f49]" role="alert">
          {error}
        </p>
      )}
    </label>
  )
}

function RegistrationTabs({ activeTab, onTabChange }) {
  const tabs = [
    ['email', 'Email Registration'],
    ['phone', 'Phone Registration'],
  ]

  return (
    <div className="mx-auto mb-[24px] grid w-full max-w-[424px] grid-cols-2 gap-[12px]" role="tablist" aria-label="Create account registration method">
      {tabs.map(([method, label]) => {
        const isActive = activeTab === method

        return (
          <button
            key={method}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${method}-registration-panel`}
            onClick={() => onTabChange(method)}
            data-aos="fade-up"
            data-aos-delay={method === 'email' ? '0' : '80'}
            className={`relative flex h-[52px] items-center justify-center rounded-[6px] border text-[15px] font-[700] leading-[20px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] ${isActive ? 'border-[#1F8F4C] bg-[#1F8F4C] text-white shadow-[0_10px_24px_rgba(31,143,76,0.18)]' : 'border-[#d8dde3] bg-white text-[#10142f] hover:border-[#1F8F4C] hover:text-[#1F8F4C]'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function EmailRegistrationContactField({ value, onChange, error }) {
  return (
    <RegisterField
      id="register-email"
      label="Email Address"
      icon={<MailIcon />}
      type="email"
      placeholder="you@institution.edu"
      value={value}
      onChange={onChange}
      error={error}
    />
  )
}

function CountryFlagIcon({ country }) {
  return (
    <img
      src={`https://flagcdn.com/24x18/${country.flagCode}.png`}
      srcSet={`https://flagcdn.com/48x36/${country.flagCode}.png 2x`}
      width="18"
      height="13"
      alt=""
      aria-hidden="true"
      className="h-[13px] w-[18px] shrink-0 object-cover"
      loading="lazy"
    />
  )
}

function PhoneRegistrationContactField({ value, onChange, error }) {
  const defaultCountry = countryDialCodes.find((country) => country.name === 'India') || countryDialCodes[0]
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const searchInputRef = useRef(null)
  const listboxId = 'register-phone-country-listbox'
  const normalizedSearch = searchValue.trim().toLowerCase()
  const filteredCountries = normalizedSearch
    ? countryDialCodes.filter((country) => (
      country.name.toLowerCase().includes(normalizedSearch)
      || country.dialCode.toLowerCase().includes(normalizedSearch)
    ))
    : countryDialCodes

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleMouseDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchValue('')
      }
    }

    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      window.requestAnimationFrame(() => searchInputRef.current?.focus())
    }
  }, [isOpen])

  const selectCountry = (country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchValue('')
    buttonRef.current?.focus()
  }

  const openDropdown = () => {
    setHighlightedIndex(0)
    setIsOpen(true)
  }

  const handleButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDropdown()
    }
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      setSearchValue('')
      buttonRef.current?.focus()
      return
    }

    if (!filteredCountries.length) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((current) => Math.min(current + 1, filteredCountries.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((current) => Math.max(current - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      selectCountry(filteredCountries[highlightedIndex])
    }
  }

  return (
    <div className="block">
      <label htmlFor="register-phone" className="mb-[8px] block text-[12px] font-[700] leading-[17px] text-[#17213c]">Phone Number</label>
      <span className={`relative flex h-[43px] items-center gap-[10px] rounded-[2px] bg-white px-[14px] shadow-[0_1px_14px_rgba(0,0,0,0.035)] transition focus-within:ring-2 focus-within:ring-[#1F8F4C]/20 ${error ? 'ring-1 ring-[#d33f49]' : ''}`}>
        <PhoneIcon />
        <span ref={dropdownRef} className="relative flex h-full shrink-0 items-center">
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-label="Select country code"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false)
                return
              }

              openDropdown()
            }}
            onKeyDown={handleButtonKeyDown}
            className="flex h-full items-center gap-[4px] border-r border-[#d8dde3] pr-[10px] text-[12px] font-[600] text-[#555555] outline-none transition hover:text-[#1F8F4C] focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C]"
          >
            <CountryFlagIcon country={selectedCountry} />
            <span>{selectedCountry.dialCode}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px] text-[#7b7b7b]">
              <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isOpen && (
            <div className="motion-dropdown absolute left-[-32px] top-[48px] z-30 w-[min(320px,calc(100vw-40px))] overflow-x-hidden rounded-[4px] border border-[#d8dde3] bg-white p-[8px] shadow-[0_14px_34px_rgba(0,0,0,0.12)]">
              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value)
                  setHighlightedIndex(0)
                }}
                onKeyDown={handleSearchKeyDown}
                aria-controls={listboxId}
                aria-activedescendant={filteredCountries[highlightedIndex] ? `country-code-option-${highlightedIndex}` : undefined}
                aria-label="Search country code"
                className="h-[34px] w-full rounded-[2px] border border-[#d8dde3] bg-white px-[10px] text-[12px] text-[#555555] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15"
                placeholder="Search country"
              />
              <div
                id={listboxId}
                role="listbox"
                aria-label="Country codes"
                className="mt-[8px] max-h-[210px] overflow-y-auto"
              >
                {filteredCountries.length ? (
                  filteredCountries.map((country, index) => {
                    const isHighlighted = highlightedIndex === index
                    const isSelected = selectedCountry.name === country.name && selectedCountry.dialCode === country.dialCode

                    return (
                      <button
                        key={`${country.name}-${country.dialCode}`}
                        id={`country-code-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => selectCountry(country)}
                        className={`flex min-h-[34px] w-full items-center gap-[8px] rounded-[2px] px-[8px] text-left text-[12px] leading-[16px] outline-none transition ${isHighlighted ? 'bg-[#1F8F4C]/10 text-[#17213c]' : 'text-[#555555] hover:bg-[#1F8F4C]/10 hover:text-[#17213c]'}`}
                      >
                        <CountryFlagIcon country={country} />
                        <span className="min-w-0 flex-1 truncate">
                          {country.name} ({country.dialCode})
                        </span>
                      </button>
                    )
                  })
                ) : (
                  <p className="px-[8px] py-[10px] text-[12px] leading-[16px] text-[#555555]">No countries found</p>
                )}
              </div>
            </div>
          )}
        </span>
        <input
          id="register-phone"
          type="tel"
          value={value}
          onChange={onChange}
          placeholder="+91 8584589416"
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-[#555555] outline-none placeholder:text-[#596177]"
        />
      </span>
      {error && (
        <p className="mt-[5px] text-[11px] font-[500] leading-[15px] text-[#d33f49]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function CreateAccountForm({ onLogin, onVerifyAccount }) {
  const [registrationMethod, setRegistrationMethod] = useState('phone')
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmRegisterPassword, setConfirmRegisterPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmRegisterPassword, setShowConfirmRegisterPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isPhoneRegistration = registrationMethod === 'phone'
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordIsStrong = registerPassword.length >= 8 && registerPassword.length <= 12 && /[A-Za-z]/.test(registerPassword) && /\d/.test(registerPassword)
  const contactError = isPhoneRegistration
    ? (contact && contact.replace(/\D/g, '').length < 10 ? 'Enter a valid mobile number.' : '')
    : (contact && !emailPattern.test(contact) ? 'Enter a valid email address.' : '')
  const passwordError = registerPassword && !passwordIsStrong ? 'Password must be 8-12 characters and include a number.' : ''
  const confirmPasswordError = confirmRegisterPassword && registerPassword !== confirmRegisterPassword ? 'Passwords must match.' : ''
  const canCreateAccount = fullName.trim()
    && contact.trim()
    && !contactError
    && passwordIsStrong
    && confirmRegisterPassword === registerPassword
    && securityQuestion
    && securityAnswer.trim()
    && termsAccepted

  const requiredError = (value) => submitted && !value.trim() ? 'Required.' : ''

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    if (canCreateAccount) {
      onVerifyAccount(registrationMethod)
    }
  }

  const handleMethodChange = (method) => {
    if (method === registrationMethod) {
      return
    }

    setRegistrationMethod(method)
    setContact('')
    setSubmitted(false)
  }

  return (
    <div className="mx-auto w-[455px] origin-top animate-fade-rise [@media(max-height:820px)]:scale-[0.9] [@media(max-height:760px)]:scale-[0.84] [@media(max-height:700px)]:scale-[0.78] max-[768px]:w-full max-[768px]:max-w-[455px] max-[768px]:scale-100" data-aos="fade-up" data-aos-duration="700">
      <RegistrationTabs activeTab={registrationMethod} onTabChange={handleMethodChange} />

      <a href="#home" aria-label="Back to home" className="mx-auto mb-[16px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
        <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
      </a>

      <header className="mb-[22px]">
        <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Create your Account</h1>
        <p className="mt-[4px] text-[14px] font-[400] leading-[20px] text-[#626262]">Create your AIcademy account to start Learning</p>
      </header>

      <form
        id={`${registrationMethod}-registration-panel`}
        role="tabpanel"
        aria-label={isPhoneRegistration ? 'Phone registration form' : 'Email registration form'}
        onSubmit={handleSubmit}
        noValidate
      >
        <RegisterField
          id="register-name"
          label="Full Name"
          icon={<UserIcon />}
          placeholder="User Learner"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={requiredError(fullName)}
        />

        <div className="mt-[16px]">
          {isPhoneRegistration ? (
            <PhoneRegistrationContactField
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              error={requiredError(contact) || contactError}
            />
          ) : (
            <EmailRegistrationContactField
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              error={requiredError(contact) || contactError}
            />
          )}
        </div>

        <div className="mt-[16px] grid grid-cols-2 gap-[13px] max-[480px]:grid-cols-1">
          <RegistrationPasswordField
            id="register-password"
            label="Password"
            value={registerPassword}
            onChange={(event) => setRegisterPassword(event.target.value)}
            isVisible={showRegisterPassword}
            onToggleVisible={() => setShowRegisterPassword((current) => !current)}
            error={passwordError || (submitted && !registerPassword ? 'Required.' : '')}
          />
          <RegistrationPasswordField
            id="register-confirm-password"
            label="Confirm Password"
            value={confirmRegisterPassword}
            onChange={(event) => setConfirmRegisterPassword(event.target.value)}
            isVisible={showConfirmRegisterPassword}
            onToggleVisible={() => setShowConfirmRegisterPassword((current) => !current)}
            error={confirmPasswordError || (submitted && !confirmRegisterPassword ? 'Required.' : '')}
          />
        </div>

        <label htmlFor="register-security-question" className="mt-[16px] block">
          <span className="mb-[8px] block text-[12px] font-[700] leading-[17px] text-[#17213c]">Security Question</span>
          <select
            id="register-security-question"
            value={securityQuestion}
            onChange={(event) => setSecurityQuestion(event.target.value)}
            className={`h-[43px] w-full rounded-[4px] border border-[#d8dde3] bg-white px-[14px] text-[12px] text-[#111111] outline-none transition focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !securityQuestion ? 'ring-1 ring-[#d33f49]' : ''}`}
          >
            <option value="">Select a Security Question</option>
            {securityQuestions.map((question) => (
              <option key={question} value={question}>
                {question}
              </option>
            ))}
          </select>
          {submitted && !securityQuestion && <p className="mt-[5px] text-[11px] font-[500] text-[#d33f49]">Required.</p>}
        </label>

        <input
          type="text"
          value={securityAnswer}
          onChange={(event) => setSecurityAnswer(event.target.value)}
          placeholder="Kumar Gandham"
          aria-label="Security answer"
          className={`mt-[10px] h-[43px] w-full rounded-[4px] border border-[#d8dde3] bg-white px-[14px] text-[12px] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !securityAnswer.trim() ? 'ring-1 ring-[#d33f49]' : ''}`}
        />
        {submitted && !securityAnswer.trim() && <p className="mt-[5px] text-[11px] font-[500] text-[#d33f49]">Required.</p>}

        <label htmlFor="register-terms" className="mt-[14px] flex items-center gap-[8px] text-[12px] font-[400] leading-[17px] text-[#1f2933]">
          <input
            id="register-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="h-[14px] w-[14px] accent-[#1F8F4C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C]"
          />
          <span>
            I agree to the{' '}
            <a href="#terms" className="text-[#1F8F4C] underline underline-offset-2">terms of use</a>
            {' '}and our{' '}
            <a href="#privacy" className="text-[#1F8F4C] underline underline-offset-2">privacy policy.</a>
          </span>
        </label>
        {submitted && !termsAccepted && <p className="mt-[5px] text-[11px] font-[500] text-[#d33f49]">You must accept the terms.</p>}

        <button
          type="submit"
          disabled={!canCreateAccount}
          className="mt-[16px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[14px] font-[700] text-white transition hover:bg-[#187b40] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
        >
          Next
        </button>
      </form>

      <p className="mt-[10px] text-center text-[12px] font-[600] leading-[17px] text-[#222222]">
        Already have an account?{' '}
        <button type="button" onClick={onLogin} className="text-[#ff7d82] transition hover:text-[#f25f69] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C]">
          Login
        </button>
      </p>
    </div>
  )
}

function VerifyAccountOtpForm({ onBack, onVerified }) {
  const inputRefs = useRef([])
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''))
  const [secondsRemaining, setSecondsRemaining] = useState(30)
  const [otpError, setOtpError] = useState('')

  const otpValue = otpDigits.join('')
  const isOtpComplete = otpDigits.every(Boolean)
  const formattedTimer = `00:${String(secondsRemaining).padStart(2, '0')}`

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setSecondsRemaining((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timerId)
  }, [secondsRemaining])

  const focusInput = (index) => {
    inputRefs.current[index]?.focus()
  }

  const updateDigit = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)

    setOtpDigits((current) => {
      const next = [...current]
      next[index] = digit
      return next
    })
    setOtpError('')

    if (digit && index < 5) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      focusInput(index - 1)
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()

    const pastedOtp = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pastedOtp) {
      return
    }

    const nextDigits = Array(6).fill('')
    pastedOtp.split('').forEach((digit, index) => {
      nextDigits[index] = digit
    })

    setOtpDigits(nextDigits)
    setOtpError('')
    focusInput(Math.min(pastedOtp.length, 6) - 1)
  }

  const handleResend = () => {
    if (secondsRemaining > 0) {
      return
    }

    setSecondsRemaining(30)
    setOtpDigits(Array(6).fill(''))
    setOtpError('')
    focusInput(0)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isOtpComplete || otpValue.length !== 6) {
      setOtpError('Enter all 6 OTP digits.')
      return
    }

    setOtpError('')
    onVerified()
  }

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] z-10 flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="fade-up" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[20px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Verify your Account</h1>
          <p className="mt-[4px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Verify your account to start learning courses
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend className="mb-[14px] text-[13px] font-[700] leading-[18px] text-[#17213c]">
              Enter OTP sent to your Phone/ Email
            </legend>
            <div className="flex gap-[13px]">
              {otpDigits.map((digit, index) => (
                <input
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength="1"
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  aria-label={`Account verification OTP digit ${index + 1}`}
                  aria-invalid={Boolean(otpError)}
                  className={`h-[43px] w-[43px] rounded-[4px] border bg-white text-center text-[18px] font-[600] text-[#111111] outline-none transition focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/20 ${otpError ? 'border-[#d33f49]' : 'border-[#9aa1a8]'}`}
                />
              ))}
            </div>
          </fieldset>

          {otpError && (
            <p className="mt-[10px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
              {otpError}
            </p>
          )}

          <p className="mt-[21px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Didn&apos;t Receive any code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsRemaining > 0}
              className="font-[600] text-[#1F8F4C] transition hover:text-[#187b40] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:text-[#1F8F4C]"
            >
              Request a new Code
            </button>{' '}
            in {formattedTimer}
          </p>

          <button
            type="submit"
            disabled={!isOtpComplete}
            className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
          >
            Verify Account
          </button>
        </form>
      </div>
    </div>
  )
}

function SelectRoleForm({ onBack, onContinue }) {
  const [selectedRole, setSelectedRole] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const roles = ['Student', 'Parent', 'Teacher']

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    if (selectedRole) {
      onContinue(selectedRole.toLowerCase())
    }
  }

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] z-10 flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="zoom-in" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[20px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Select Role</h1>
          <p className="mt-[4px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Select a Role to continue with your account
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend className="mb-[14px] text-[13px] font-[700] leading-[18px] text-[#17213c]">
              Choose Your Role
            </legend>
            <div className="space-y-[14px]">
              {roles.map((role) => (
                <label key={role} htmlFor={`role-${role.toLowerCase()}`} className="flex w-fit cursor-pointer items-center gap-[9px] text-[13px] font-[500] leading-[18px] text-[#111111]">
                  <input
                    id={`role-${role.toLowerCase()}`}
                    type="radio"
                    name="account-role"
                    value={role.toLowerCase()}
                    checked={selectedRole === role.toLowerCase()}
                    onChange={(event) => {
                      setSelectedRole(event.target.value)
                      setSubmitted(false)
                    }}
                    className="h-[14px] w-[14px] accent-[#1F8F4C] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C]"
                  />
                  {role}
                </label>
              ))}
            </div>
          </fieldset>

          {submitted && !selectedRole && (
            <p className="mt-[10px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
              Select a role to continue.
            </p>
          )}

          <button
            type="submit"
            disabled={!selectedRole}
            className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

function StudentDetailsForm({ onBack, onContinue }) {
  const [grade, setGrade] = useState('')
  const [workPlace, setWorkPlace] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canContinue = grade && workPlace.trim() && schoolName.trim()

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    if (canContinue) {
      onContinue()
    }
  }

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] z-10 flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="fade-left" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[20px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Student Details</h1>
          <p className="mt-[4px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Complete your student profile to continue
          </p>
        </header>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="student-grade" className="block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">Select Grade of Student</span>
              <select
                id="student-grade"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                aria-invalid={submitted && !grade}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[600] text-[#111111] outline-none transition focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !grade ? 'ring-1 ring-[#d33f49]' : ''}`}
              >
                <option value="">Select Grade</option>
                <option value="grade-6">Grade 6</option>
                <option value="grade-7">Grade 7</option>
                <option value="grade-8">Grade 8</option>
                <option value="grade-9">Grade 9</option>
                <option value="grade-10">Grade 10</option>
                <option value="grade-11">Grade 11</option>
                <option value="grade-12">Grade 12</option>
              </select>
              {submitted && !grade && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  Grade is required.
                </p>
              )}
            </label>

            <label htmlFor="student-work-place" className="mt-[18px] block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">Work Place</span>
              <input
                id="student-work-place"
                type="text"
                value={workPlace}
                onChange={(event) => setWorkPlace(event.target.value)}
                placeholder="public School"
                aria-invalid={submitted && !workPlace.trim()}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[500] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !workPlace.trim() ? 'ring-1 ring-[#d33f49]' : ''}`}
              />
              {submitted && !workPlace.trim() && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  Work place is required.
                </p>
              )}
            </label>

            <label htmlFor="student-school-name" className="mt-[18px] block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">School Name</span>
              <input
                id="student-school-name"
                type="text"
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
                placeholder="public School"
                aria-invalid={submitted && !schoolName.trim()}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[500] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !schoolName.trim() ? 'ring-1 ring-[#d33f49]' : ''}`}
              />
              {submitted && !schoolName.trim() && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  School name is required.
                </p>
              )}
            </label>

            <button
              type="submit"
              disabled={!canContinue}
              className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
            >
              Continue
            </button>
          </form>
      </div>
    </div>
  )
}

function ParentVerificationForm({ onBack, onContinue }) {
  const [childName, setChildName] = useState('')
  const [childGrade, setChildGrade] = useState('')
  const [studentId, setStudentId] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const studentIdIsValid = !studentId || /^[A-Za-z0-9]{6,14}$/.test(studentId.trim())
  const canContinue = childName.trim() && childGrade.trim() && studentId.trim() && studentIdIsValid

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    if (canContinue) {
      onContinue()
    }
  }

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] z-10 flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="fade-right" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[20px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Parent Verification</h1>
          <p className="mt-[4px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Verify your child details to continue
          </p>
        </header>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="child-name" className="block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">Enter Child Name:</span>
              <input
                id="child-name"
                type="text"
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                placeholder="John Cena"
                aria-invalid={submitted && !childName.trim()}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[500] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !childName.trim() ? 'ring-1 ring-[#d33f49]' : ''}`}
              />
              {submitted && !childName.trim() && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  Child name is required.
                </p>
              )}
            </label>

            <label htmlFor="child-grade" className="mt-[18px] block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">Child Grade</span>
              <input
                id="child-grade"
                type="text"
                value={childGrade}
                onChange={(event) => setChildGrade(event.target.value)}
                placeholder="Plus 2"
                aria-invalid={submitted && !childGrade.trim()}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[500] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !childGrade.trim() ? 'ring-1 ring-[#d33f49]' : ''}`}
              />
              {submitted && !childGrade.trim() && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  Child grade is required.
                </p>
              )}
            </label>

            <label htmlFor="student-id" className="mt-[18px] block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">Student ID</span>
              <input
                id="student-id"
                type="text"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                placeholder="AI245836AP"
                aria-invalid={submitted && (!studentId.trim() || !studentIdIsValid)}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[500] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && (!studentId.trim() || !studentIdIsValid) ? 'ring-1 ring-[#d33f49]' : ''}`}
              />
              {submitted && !studentId.trim() && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  Student ID is required.
                </p>
              )}
              {submitted && studentId.trim() && !studentIdIsValid && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  Enter a valid student ID.
                </p>
              )}
            </label>

            <button
              type="submit"
              disabled={!canContinue}
              className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
            >
              Continue
            </button>
          </form>
      </div>
    </div>
  )
}

function TeacherVerificationForm({ onBack, onContinue }) {
  const [schoolName, setSchoolName] = useState('')
  const [subject, setSubject] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canContinue = schoolName.trim() && subject.trim()

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    if (canContinue) {
      onContinue()
    }
  }

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] z-10 flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="fade-left" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[20px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Teacher Verification</h1>
          <p className="mt-[4px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Verify your teaching details to continue
          </p>
        </header>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="teacher-school-name" className="block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">School Name</span>
              <input
                id="teacher-school-name"
                type="text"
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
                placeholder="public School"
                aria-invalid={submitted && !schoolName.trim()}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[500] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !schoolName.trim() ? 'ring-1 ring-[#d33f49]' : ''}`}
              />
              {submitted && !schoolName.trim() && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  School name is required.
                </p>
              )}
            </label>

            <label htmlFor="teacher-subject" className="mt-[18px] block">
              <span className="mb-[8px] block text-[13px] font-[700] leading-[18px] text-[#17213c]">Subject</span>
              <input
                id="teacher-subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="public School"
                aria-invalid={submitted && !subject.trim()}
                className={`h-[46px] w-full rounded-[5px] border border-[#d8dde3] bg-white px-[14px] text-[13px] font-[500] text-[#111111] outline-none transition placeholder:text-[#596177] focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/15 ${submitted && !subject.trim() ? 'ring-1 ring-[#d33f49]' : ''}`}
              />
              {submitted && !subject.trim() && (
                <p className="mt-[6px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
                  Subject is required.
                </p>
              )}
            </label>

            <button
              type="submit"
              disabled={!canContinue}
              className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
            >
              Continue
            </button>
          </form>
      </div>
    </div>
  )
}

function ForgotPasswordForm({ onBack, onResetRequested }) {
  const [resetEmail, setResetEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [error, setError] = useState('')
  const isResetDisabled = !resetEmail.trim() && !mobileNumber.trim()

  const handleReset = (event) => {
    event.preventDefault()

    if (isResetDisabled) {
      setError('Enter your email address or mobile number.')
      return
    }

    setError('')
    onResetRequested()
  }

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="fade-up" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[20px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Forgot Password</h1>
          <p className="mt-[4px] text-[13px] font-[400] leading-[19px] text-[#626262]">Enter your registered email id to reset your password</p>
        </header>

        <form onSubmit={handleReset} noValidate>
          <label htmlFor="reset-email" className="block">
            <span className="mb-[8px] block text-[12px] font-[700] leading-[17px] text-[#17213c]">Email Address</span>
            <span className="flex h-[43px] items-center gap-[10px] rounded-[2px] bg-white px-[13px] shadow-[0_1px_14px_rgba(0,0,0,0.035)] transition focus-within:ring-2 focus-within:ring-[#1F8F4C]/20">
              <MailIcon />
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(event) => {
                  setResetEmail(event.target.value)
                  setError('')
                }}
                placeholder="you@institution.edu"
                aria-label="Email address"
                className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-[#555555] outline-none placeholder:text-[#596177]"
              />
            </span>
          </label>

          <div className="my-[23px] text-center text-[13px] font-[400] leading-[19px] text-[#858585]">Or Reset with</div>

          <label htmlFor="reset-mobile" className="block">
            <span className="mb-[8px] block text-[12px] font-[700] leading-[17px] text-[#17213c]">Mobile Number</span>
            <span className="flex h-[43px] items-center gap-[10px] rounded-[2px] bg-white px-[13px] shadow-[0_1px_14px_rgba(0,0,0,0.035)] transition focus-within:ring-2 focus-within:ring-[#1F8F4C]/20">
              <PhoneIcon />
              <input
                id="reset-mobile"
                type="tel"
                value={mobileNumber}
                onChange={(event) => {
                  setMobileNumber(event.target.value)
                  setError('')
                }}
                placeholder="+91 8524678158"
                aria-label="Mobile number"
                className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-[#555555] outline-none placeholder:text-[#596177]"
              />
            </span>
          </label>

          {error && (
            <p className="mt-[10px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isResetDisabled}
            className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

function OtpVerificationForm({ onBack, onVerified }) {
  const inputRefs = useRef([])
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''))
  const [secondsRemaining, setSecondsRemaining] = useState(30)
  const [otpError, setOtpError] = useState('')

  const otpValue = otpDigits.join('')
  const isOtpComplete = otpDigits.every(Boolean)

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setSecondsRemaining((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timerId)
  }, [secondsRemaining])

  const focusInput = (index) => {
    inputRefs.current[index]?.focus()
  }

  const updateDigit = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)

    setOtpDigits((current) => {
      const next = [...current]
      next[index] = digit
      return next
    })
    setOtpError('')

    if (digit && index < 5) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      focusInput(index - 1)
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()

    const pastedOtp = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pastedOtp) {
      return
    }

    const nextDigits = Array(6).fill('')
    pastedOtp.split('').forEach((digit, index) => {
      nextDigits[index] = digit
    })

    setOtpDigits(nextDigits)
    setOtpError('')
    focusInput(Math.min(pastedOtp.length, 6) - 1)
  }

  const handleResend = () => {
    if (secondsRemaining > 0) {
      return
    }

    setSecondsRemaining(30)
    setOtpDigits(Array(6).fill(''))
    setOtpError('')
    focusInput(0)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isOtpComplete || otpValue.length !== 6) {
      setOtpError('Enter all 6 OTP digits.')
      return
    }

    setOtpError('')
    onVerified()
  }

  const formattedTimer = `00:${String(secondsRemaining).padStart(2, '0')}`

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="fade-up" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[20px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Forgot Password</h1>
          <p className="mt-[4px] text-[13px] font-[400] leading-[19px] text-[#626262]">Enter the received OTP to reset your Password</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend className="mb-[14px] text-[13px] font-[700] leading-[18px] text-[#17213c]">Enter OTP Received</legend>
            <div className="flex gap-[13px]">
              {otpDigits.map((digit, index) => (
                <input
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength="1"
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${index + 1}`}
                  className={`h-[43px] w-[43px] rounded-[4px] border bg-white text-center text-[18px] font-[600] text-[#111111] outline-none transition focus:border-[#1F8F4C] focus:ring-2 focus:ring-[#1F8F4C]/20 ${otpError ? 'border-[#d33f49]' : 'border-[#9aa1a8]'}`}
                />
              ))}
            </div>
          </fieldset>

          {otpError && (
            <p className="mt-[10px] text-[12px] font-[600] leading-[17px] text-[#d33f49]" role="alert">
              {otpError}
            </p>
          )}

          <p className="mt-[21px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Didn&apos;t Receive any code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsRemaining > 0}
              className="font-[600] text-[#1F8F4C] transition hover:text-[#187b40] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:text-[#1F8F4C]"
            >
              Request a new Code
            </button>{' '}
            in {formattedTimer}
          </p>

          <button
            type="submit"
            disabled={!isOtpComplete}
            className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[14px] w-[14px] text-[#6f758b]">
      <rect x="3.5" y="7" width="9" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 7V5.4a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon({ isVisible }) {
  if (isVisible) {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[13px] w-[13px]">
        <path d="M2 8s2.2-3 6-3 6 3 6 3-2.2 3-6 3-6-3-6-3Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[13px] w-[13px]">
      <path d="M2 8s2.2-3 6-3 6 3 6 3-2.2 3-6 3-6-3-6-3Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 12 12 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function PasswordField({ id, label, value, onChange, isVisible, onToggleVisible, helperText, error }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-[8px] block text-[12px] font-[700] leading-[17px] text-[#17213c]">{label}</span>
      <span className={`flex h-[43px] items-center gap-[10px] rounded-[2px] bg-white px-[13px] shadow-[0_1px_14px_rgba(0,0,0,0.035)] transition focus-within:ring-2 focus-within:ring-[#1F8F4C]/20 ${error ? 'ring-1 ring-[#d33f49]' : ''}`}>
        <LockIcon />
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••••"
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-helper`}
          className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-[#555555] outline-none placeholder:text-[#596177]"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
          className="text-[#596177] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F8F4C]"
        >
          <EyeIcon isVisible={isVisible} />
        </button>
      </span>
      <p id={`${id}-helper`} className={`mt-[8px] text-[11px] font-[400] leading-[16px] ${error ? 'text-[#d33f49]' : 'text-[#626262]'}`}>
        {error || helperText}
      </p>
    </label>
  )
}

function CreateNewPasswordForm({ onBack, onPasswordReset }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordLengthError = newPassword && (newPassword.length < 8 || newPassword.length > 12)
    ? 'Password must be 8-12 characters.'
    : ''
  const confirmPasswordError = confirmPassword && newPassword !== confirmPassword ? 'Both Passwords must Match.' : ''
  const isPasswordValid = newPassword.length >= 8 && newPassword.length <= 12
  const canSubmitPassword = isPasswordValid && confirmPassword === newPassword

  const handleSubmit = (event) => {
    event.preventDefault()
    if (canSubmitPassword) {
      onPasswordReset()
    }
  }

  return (
    <div className="relative mx-auto flex h-full w-[475px] items-center max-[768px]:w-full max-[768px]:max-w-[475px] max-[768px]:px-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 top-[18px] flex items-center gap-[9px] text-[16px] font-[500] leading-[22px] text-[#1b1b1b] transition hover:text-[#1F8F4C] focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
      >
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#606060]">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
            <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back
      </button>

      <div className="w-full animate-fade-rise" data-aos="fade-up" data-aos-duration="700">
        <a href="#home" aria-label="Back to home" className="mx-auto mb-[22px] block h-[58px] w-[58px] overflow-hidden rounded-[7px] bg-brand">
          <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
        </a>

        <header className="mb-[27px]">
          <h1 className="text-[36px] font-[700] leading-[43px] tracking-[-0.2px] text-[#333333]">Create New Password</h1>
          <p className="mt-[4px] max-w-[380px] text-[13px] font-[400] leading-[19px] text-[#626262]">
            Your New Password must be different from the previously used passwords.
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <PasswordField
            id="new-password"
            label="Password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            isVisible={showNewPassword}
            onToggleVisible={() => setShowNewPassword((current) => !current)}
            helperText="Must be at least 8-12 characters."
            error={passwordLengthError}
          />

          <div className="mt-[18px]">
            <PasswordField
              id="confirm-new-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              isVisible={showConfirmPassword}
              onToggleVisible={() => setShowConfirmPassword((current) => !current)}
              helperText="Both Passwords must Match."
              error={confirmPasswordError}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmitPassword}
            className="mt-[26px] h-[46px] w-full rounded-[5px] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C] disabled:cursor-not-allowed disabled:bg-[#9ac6a9]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

function SuccessConfettiIcon() {
  return (
    <div className="relative mx-auto mt-[28px] h-[128px] w-[162px]" aria-hidden="true">
      <span className="absolute left-[36px] top-[26px] h-[94px] w-[94px] rounded-full bg-[#ecf7f0]" />
      <svg viewBox="0 0 126 100" className="absolute inset-0 h-full w-full">
        <path d="M42 18c-10 5-15 12-16 22" fill="none" stroke="#fd7c77" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 6" />
        <path d="M73 16c11 3 19 10 24 21" fill="none" stroke="#fd7c77" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 6" />
        <path d="M52 10c-3 8-3 15 0 22" fill="none" stroke="#1F8F4C" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 5" />
        <path d="M64 10v18M84 20l9-11M36 28l-9-9" fill="none" stroke="#f5c84b" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M59 27c-1-7 5-13 8-16M72 31c4-5 10-8 17-10M46 34c-5-4-10-6-16-6" fill="none" stroke="#ff6b9a" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="31" cy="15" r="2" fill="#1F8F4C" />
        <circle cx="96" cy="31" r="2" fill="#1F8F4C" />
        <circle cx="81" cy="9" r="2" fill="#5a9cff" />
        <circle cx="45" cy="7" r="1.8" fill="#ff6b9a" />
        <path d="M63 52h-8v24h8V52Zm6 24h15c4 0 7-3 7-7V58c0-4-3-7-7-7h-8l2-8c.5-2.4-1.3-4.7-3.8-4.7h-.9L62 52v24Z" fill="#1F8F4C" />
      </svg>
    </div>
  )
}

function PasswordResetSuccessModal({ isOpen, onClose, onGoToLogin }) {
  const modalRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousActiveElement = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    buttonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return
      }

      const focusableElements = modalRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!firstElement || !lastElement) {
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-[18px] py-[28px] animate-fade-rise" role="presentation">
      <section
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-reset-success-title"
        aria-describedby="password-reset-success-description"
        className="w-full max-w-[408px] origin-center rounded-[14px] bg-white px-[34px] pb-[28px] pt-[30px] text-center shadow-[0_34px_100px_rgba(0,0,0,0.32)] transition duration-200 ease-out animate-fade-rise"
      >
        <h2 id="password-reset-success-title" className="text-left text-[30px] font-[700] leading-[36px] text-[#2d2d2d]">
          Congratulations!
        </h2>
        <p id="password-reset-success-description" className="mt-[6px] text-left text-[12px] font-[400] leading-[18px] text-[#6f6f6f]">
          Your Password has been changed successfully.
        </p>

        <SuccessConfettiIcon />

        <p className="mt-[18px] text-center text-[16px] font-[500] leading-[22px] text-[#222222]">
          Continue with login to view information
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={onGoToLogin}
          className="mt-[18px] h-[50px] w-full rounded-[10px] border-[4px] border-[#dff3e7] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
        >
          Go to Login
        </button>
      </section>
    </div>
  )
}

function RegistrationSuccessModal({ isOpen, onClose, onGoToDashboard }) {
  const modalRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousActiveElement = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    buttonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return
      }

      const focusableElements = modalRef.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (!firstElement || !lastElement) {
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-[18px] py-[28px] animate-fade-rise" role="presentation">
      <section
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-success-title"
        aria-describedby="registration-success-description"
        className="w-full max-w-[408px] origin-center rounded-[14px] bg-white px-[34px] pb-[28px] pt-[30px] text-center shadow-[0_34px_100px_rgba(0,0,0,0.32)] transition duration-200 ease-out animate-fade-rise"
      >
        <h2 id="registration-success-title" className="text-left text-[30px] font-[700] leading-[36px] text-[#2d2d2d]">
          Registration Successful!!!
        </h2>
        <p id="registration-success-description" className="mt-[6px] text-left text-[12px] font-[400] leading-[18px] text-[#6f6f6f]">
          You can now access the platform.
        </p>

        <SuccessConfettiIcon />

        <p className="mt-[18px] text-center text-[16px] font-[500] leading-[22px] text-[#222222]">
          Continue to your dashboard to view information
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={onGoToDashboard}
          className="mt-[18px] h-[50px] w-full rounded-[10px] border-[4px] border-[#dff3e7] bg-[#1F8F4C] text-[13px] font-[700] text-white transition hover:bg-[#187b40] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F8F4C]"
        >
          Go to Dashboard
        </button>
      </section>
    </div>
  )
}

function LoginPage({ isModal = false }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaIndex, setCaptchaIndex] = useState(0)
  const [captchaInput, setCaptchaInput] = useState('')
  const [message, setMessage] = useState('')
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isPasswordResetSuccessOpen, setIsPasswordResetSuccessOpen] = useState(false)
  const [isRegistrationSuccessOpen, setIsRegistrationSuccessOpen] = useState(false)
  const [authView, setAuthView] = useState('login')

  const isRegisterView = authView === 'register'
  const isLoginView = authView === 'login'
  const captchaValue = captchaValues[captchaIndex]
  const spacedCaptcha = captchaValue.split('').join(' ')

  useEffect(() => {
    window.requestAnimationFrame(() => AOS.refreshHard())
  }, [authView, isForgotPasswordOpen, isPasswordResetSuccessOpen, isRegistrationSuccessOpen])

  const refreshCaptcha = () => {
    setCaptchaIndex((current) => (current + 1) % captchaValues.length)
    setCaptchaInput('')
    setMessage('')
  }

  const playCaptcha = () => {
    if (!('speechSynthesis' in window)) {
      setMessage('Audio captcha is not supported in this browser.')
      return
    }

    const utterance = new SpeechSynthesisUtterance(captchaValue.split('').join(' '))
    utterance.rate = 0.75
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim()) {
      setMessage('Please enter your email address.')
      return
    }

    if (!password) {
      setMessage('Please enter your password.')
      return
    }

    if (captchaInput.trim().toLowerCase() !== captchaValue.toLowerCase()) {
      setMessage('Captcha does not match. Please try again.')
      return
    }

    setMessage(`Login submitted${rememberMe ? ' with remember me enabled' : ''}.`)
  }

  const handleRoleContinue = (role) => {
    if (role === 'student') {
      setAuthView('student-details')
      return
    }

    if (role === 'parent') {
      setAuthView('parent-verification')
      return
    }

    setAuthView('teacher-verification')
  }

  const handleRegistrationCompleted = () => {
    setIsRegistrationSuccessOpen(true)
  }

  const handleGoToDashboard = () => {
    setIsRegistrationSuccessOpen(false)
    setAuthView('login')
  }

  return (
    <main className={`motion-modal ${isModal ? 'absolute inset-0 h-full max-[768px]:overflow-y-auto' : 'min-h-svh'} flex bg-white font-sans text-[#111111] max-[768px]:block`}>
      <section className={`flex w-[60%] min-w-[600px] justify-center overflow-hidden bg-[#fdfdfd] px-16 max-[768px]:min-h-svh max-[768px]:w-full max-[768px]:min-w-0 max-[768px]:px-[18px] ${isRegisterView ? 'items-start pb-[24px] pt-[30px] max-[768px]:pb-[24px] max-[768px]:pt-[24px]' : isLoginView ? 'items-center py-0 max-[768px]:py-[24px]' : 'items-center py-4 max-[768px]:py-[24px]'}`}>
        {authView === 'forgot' ? (
          <ForgotPasswordForm onBack={() => setAuthView('login')} onResetRequested={() => setAuthView('otp')} />
        ) : authView === 'otp' ? (
          <OtpVerificationForm onBack={() => setAuthView('forgot')} onVerified={() => setAuthView('create-password')} />
        ) : authView === 'create-password' ? (
          <CreateNewPasswordForm onBack={() => setAuthView('otp')} onPasswordReset={() => setIsPasswordResetSuccessOpen(true)} />
        ) : authView === 'register' ? (
          <CreateAccountForm onLogin={() => setAuthView('login')} onVerifyAccount={() => setAuthView('register-verify')} />
        ) : authView === 'register-verify' ? (
          <VerifyAccountOtpForm onBack={() => setAuthView('register')} onVerified={() => setAuthView('select-role')} />
        ) : authView === 'select-role' ? (
          <SelectRoleForm onBack={() => setAuthView('register-verify')} onContinue={handleRoleContinue} />
        ) : authView === 'student-details' ? (
          <StudentDetailsForm onBack={() => setAuthView('select-role')} onContinue={handleRegistrationCompleted} />
        ) : authView === 'parent-verification' ? (
          <ParentVerificationForm onBack={() => setAuthView('select-role')} onContinue={handleRegistrationCompleted} />
        ) : authView === 'teacher-verification' ? (
          <TeacherVerificationForm onBack={() => setAuthView('select-role')} onContinue={handleRegistrationCompleted} />
        ) : (
          <div className="w-[760px] origin-center px-[86px] pb-0 [@media(max-height:900px)]:scale-[0.86] [@media(max-height:820px)]:scale-[0.78] [@media(max-height:760px)]:scale-[0.72] [@media(max-height:680px)]:scale-[0.64] max-[768px]:w-full max-[768px]:px-0 max-[768px]:scale-100">
            <a href="#home" aria-label="Back to home" className="mx-auto mb-[10px] block h-[52px] w-[52px] overflow-hidden rounded-[5px] bg-brand">
              <img src={homeLogo} alt="AIcademy" className="h-full w-full scale-[1.12] object-cover" />
            </a>

            <header className="mb-[14px] text-center">
              <h1 className="text-[36px] font-[700] leading-[42px] tracking-[-0.2px]">Welcome to AIcademy</h1>
              <p className="mt-[3px] text-[16px] font-[400] leading-[22px] text-[#454545]">Login to access your AIcademy account</p>
            </header>

            <form className="space-y-[10px]" aria-label="Login form" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-[8px] block text-[16px] font-[600] leading-none">Email Address</span>
                <span className="flex h-[50px] items-center rounded-[2px] bg-white px-[17px] shadow-[0_1px_14px_rgba(0,0,0,0.035)]">
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="mr-[12px] h-[16px] w-[16px] text-[#7b7b7b]">
                    <rect x="2.5" y="4" width="11" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="m3 4.7 5 3.8 5-3.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="sample@gmail.com"
                    className="h-full flex-1 bg-transparent text-[16px] text-[#595959] outline-none placeholder:text-[#a6a6a6]"
                  />
                </span>
              </label>

            <label className="block">
              <span className="mb-[8px] block text-[16px] font-[600] leading-none">Password</span>
              <span className="flex h-[50px] items-center rounded-[2px] bg-white px-[17px] shadow-[0_1px_14px_rgba(0,0,0,0.035)]">
                <svg viewBox="0 0 16 16" aria-hidden="true" className="mr-[12px] h-[16px] w-[16px] text-[#7b7b7b]">
                  <rect x="3.5" y="7" width="9" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 7V5.4a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-full flex-1 bg-transparent text-[16px] text-[#595959] outline-none placeholder:text-[#777777]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-[#6f6f6f] transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[16px] w-[16px]">
                    <path d="M2 8s2.2-3 6-3 6 3 6 3-2.2 3-6 3-6-3-6-3Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </span>
            </label>

            <p className="text-[15px] font-[600] leading-[20px] text-[#ffb300]">Note : Password will be Valid for 45 days only.</p>

            <div className="flex items-center justify-between text-[15px]">
              <label className="flex items-center gap-[7px] text-[#222]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-[14px] w-[14px] accent-brand"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  setMessage('')
                  setIsForgotPasswordOpen(true)
                }}
                className="text-[#ff7d82] transition hover:text-[#f24f59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Forgot Password?
              </button>
            </div>

            <div className="rounded-[4px] border border-[#8bbcff] bg-[#bcd4ff] p-[9px]">
              <div className="mb-[8px] flex h-[66px] items-center justify-center whitespace-nowrap rounded-[4px] bg-white text-[26px] tracking-[10px] text-[#1d1d1d]">
                {spacedCaptcha}
              </div>
              <div className="flex h-[40px] items-center rounded-[2px] bg-white px-[12px]">
                <input
                  value={captchaInput}
                  onChange={(event) => setCaptchaInput(event.target.value)}
                  placeholder="Enter captcha"
                  className="flex-1 bg-transparent text-[14px] text-[#777] outline-none placeholder:text-[#b5b5b5]"
                />
                <div className="flex gap-[8px] text-[#5d6d83]">
                  <button type="button" aria-label="Refresh captcha" onClick={refreshCaptcha} className="transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[14px] w-[14px]">
                      <path d="M12.8 5.2A5 5 0 1 0 13 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M12.7 2.5v2.9h-2.9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button type="button" aria-label="Play captcha audio" onClick={playCaptcha} className="transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[14px] w-[14px]">
                      <path d="M2.5 6.2h2.2l3-2.4v8.4l-3-2.4H2.5V6.2Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M10 6c.8 1.1.8 2.9 0 4M12 4.5c1.5 2 1.5 5 0 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button type="button" aria-label="Captcha information" onClick={() => setMessage('Type the characters shown in the captcha box.')} className="transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[14px] w-[14px]">
                      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8 7.2v3.2M8 5.2h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-[6px] flex items-center justify-between text-[12px] text-[#2369c8]">
                <a href="#privacy">Privacy &amp; Terms</a>
                <span>reCAPTCHA</span>
              </div>
            </div>

            {message && (
              <p className="text-[14px] font-[600] leading-[20px] text-brand" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="h-[46px] w-full rounded-[3px] bg-brand text-[16px] font-[700] text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Login to Your Account
            </button>
          </form>

          <p className="mt-[10px] text-center text-[15px] font-[600]">
            Don&apos;t have on account?{' '}
            <button type="button" onClick={() => setAuthView('register')} className="text-[#ff7d82]">
              Sign up
            </button>
          </p>

          <div className="my-[12px] flex items-center gap-[10px] text-[15px] text-[#777]">
            <span className="h-px flex-1 bg-[#ededed]" />
            <span>Or Login with</span>
            <span className="h-px flex-1 bg-[#ededed]" />
          </div>

          <div className="grid grid-cols-3 gap-[10px] max-[480px]:grid-cols-1">
            {['Microsoft', 'Google', 'Apple'].map((provider) => (
              <button
                key={provider}
                type="button"
                aria-label={`Login with ${provider}`}
                onClick={() => setMessage(`${provider} login selected.`)}
                data-aos="zoom-in"
                data-aos-delay={provider === 'Microsoft' ? '0' : provider === 'Google' ? '80' : '160'}
                className="flex h-[44px] items-center justify-center rounded-[4px] border border-[#6a8dff] bg-white text-[15px] font-[700] transition hover:bg-[#f8fbff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {provider === 'Microsoft' ? (
                  <span className="grid grid-cols-2 gap-[1px]">
                    <span className="h-[6px] w-[6px] bg-[#f25022]" />
                    <span className="h-[6px] w-[6px] bg-[#7fba00]" />
                    <span className="h-[6px] w-[6px] bg-[#00a4ef]" />
                    <span className="h-[6px] w-[6px] bg-[#ffb900]" />
                  </span>
                ) : provider === 'Google' ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[19px] w-[19px]">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.09-1.93 3.27-4.78 3.27-8.09Z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.58-2.77c-.98.66-2.24 1.06-3.7 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 18 18" aria-hidden="true" className="h-[17px] w-[17px]">
                    <path
                      d="M12.2 9.2c0-1.9 1.5-2.8 1.6-2.9-.9-1.3-2.2-1.5-2.7-1.5-1.1-.1-2.2.7-2.8.7-.6 0-1.5-.7-2.5-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 5.9 1 7.8.7.9 1.4 1.9 2.5 1.9 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6 1.8-.9 2.4-1.8c.8-1.1 1.1-2.2 1.1-2.3 0 0-2.6-1-2.6-3.2ZM10.4 3.7c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1.1-.4.5-.8 1.4-.7 2.1.8.1 1.5-.4 2-1Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
        )}
      </section>

      <section className="relative flex w-[40%] flex-none items-center justify-center overflow-hidden bg-white px-[7%] py-0 max-[768px]:hidden">
        <div className="absolute inset-y-0 left-0 right-0 bg-mint" aria-hidden="true" />
        <img
          src={coverImage}
          alt="Student studying online"
          className="motion-image relative z-10 h-[calc(100%+230px)] max-h-[calc(82svh+230px)] w-auto max-w-[calc(100%+230px)] object-contain object-center"
        />
      </section>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onVerified={() => {
          setIsForgotPasswordOpen(false)
          setAuthView('forgot')
        }}
      />
      <PasswordResetSuccessModal
        isOpen={isPasswordResetSuccessOpen}
        onClose={() => setIsPasswordResetSuccessOpen(false)}
        onGoToLogin={() => {
          setIsPasswordResetSuccessOpen(false)
          setAuthView('login')
        }}
      />
      <RegistrationSuccessModal
        isOpen={isRegistrationSuccessOpen}
        onClose={() => setIsRegistrationSuccessOpen(false)}
        onGoToDashboard={handleGoToDashboard}
      />
    </main>
  )
}

export default LoginPage
