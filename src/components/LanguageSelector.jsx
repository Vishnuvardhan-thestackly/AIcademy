import { useState } from 'react'

const languages = ['English', 'Deutch', 'Nederland', 'Portuguese', 'Indonesia', 'Turkey']

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  const handleSelect = (language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-[38px] min-w-[72px] items-center justify-center gap-[6px] rounded-[4px] px-[14px] text-[14px] font-[500] leading-none text-[#101010] transition duration-200 hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[14px] w-[14px]">
          <circle cx="8" cy="8" r="5.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2.7 8h10.6M8 2.4c1.7 1.55 2.45 3.45 2.45 5.6S9.7 12.05 8 13.6C6.3 12.05 5.55 10.15 5.55 8S6.3 3.95 8 2.4Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <span>EN</span>
        <svg viewBox="0 0 12 12" aria-hidden="true" className="h-[11px] w-[11px]">
          <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className="motion-dropdown absolute right-0 top-[47px] z-50 w-[216px] rounded-[8px] bg-mint py-[3px] text-left shadow-[0_10px_22px_rgba(0,0,0,0.08)]"
        >
          {languages.map((language) => (
            <button
              key={language}
              type="button"
              role="option"
              aria-selected={selectedLanguage === language}
              onClick={() => handleSelect(language)}
              className="flex h-[41px] w-full items-center justify-between px-[16px] text-[16px] font-[400] leading-none text-[#1d2930] transition duration-200 hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand"
            >
              <span>{language}</span>
              {selectedLanguage === language && (
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[14px] w-[14px] text-brand">
                  <path d="m3.2 8.2 3 3.1 6.6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
