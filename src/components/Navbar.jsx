import AuthButton from './AuthButton'
import EducationLogo from './EducationLogo'
import LanguageSelector from './LanguageSelector'
import { navigationLinks } from '../utils/navigation'
import useSmoothScroll from '../hooks/useSmoothScroll'

function Navbar({ onLoginClick }) {
  const handleSmoothScroll = useSmoothScroll()

  return (
    <header className="motion-navbar relative z-50 h-[47px] shrink-0 bg-mint" data-aos="fade-down" data-aos-duration="650">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-full items-center justify-between pl-[28px] pr-[20px]"
      >
        <EducationLogo />

        <div className="hidden" aria-hidden="true">
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={handleSmoothScroll}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-[10px]">
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
      </nav>
    </header>
  )
}

export default Navbar
