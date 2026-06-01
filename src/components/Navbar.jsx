import { useState } from 'react'
import AuthButton from './AuthButton'
import EducationLogo from './EducationLogo'
import LanguageSelector from './LanguageSelector'
import { navigationLinks } from '../utils/navigation'
import useSmoothScroll from '../hooks/useSmoothScroll'

function Navbar({ onLoginClick }) {
  const handleSmoothScroll = useSmoothScroll()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="motion-navbar relative z-50 h-[47px] shrink-0 bg-mint" data-aos="fade-down" data-aos-duration="650">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-full items-center justify-between pl-[28px] pr-[20px] max-[768px]:px-[14px]"
      >
        <EducationLogo />

        <div className="hidden" aria-hidden="true">
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={handleSmoothScroll}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-[10px] max-[768px]:hidden">
          <AuthButton
            onClick={onLoginClick}
            icon={
              <svg viewBox="0 0 16 16" aria-hidden="true" className="mr-[5px] h-[14px] w-[14px]">
                <path d="M6.1 3.2h-2a1.3 1.3 0 0 0-1.3 1.3v7a1.3 1.3 0 0 0 1.3 1.3h2" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
                <path d="M7.6 8h5.1m-2-2 2 2-2 2" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            Login
          </AuthButton>
          <AuthButton href="#signup" variant="solid">
            Sign Up
          </AuthButton>
          <LanguageSelector />
        </div>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="hidden h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-brand/70 text-[#188348] transition hover:bg-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand max-[768px]:inline-flex"
        >
          <svg viewBox="0 0 18 18" aria-hidden="true" className="h-[18px] w-[18px]">
            <path d="M3 5h12M3 9h12M3 13h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="motion-dropdown absolute left-[14px] right-[14px] top-[53px] z-50 rounded-[8px] bg-mint p-[10px] shadow-[0_10px_22px_rgba(0,0,0,0.08)] min-[769px]:hidden">
          <div className="grid gap-[10px]">
            <AuthButton
              onClick={() => {
                setIsMobileMenuOpen(false)
                onLoginClick()
              }}
              icon={
                <svg viewBox="0 0 16 16" aria-hidden="true" className="mr-[5px] h-[14px] w-[14px]">
                  <path d="M6.1 3.2h-2a1.3 1.3 0 0 0-1.3 1.3v7a1.3 1.3 0 0 0 1.3 1.3h2" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
                  <path d="M7.6 8h5.1m-2-2 2 2-2 2" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Login
            </AuthButton>
            <AuthButton href="#signup" variant="solid">
              Sign Up
            </AuthButton>
            <div className="flex justify-center">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
