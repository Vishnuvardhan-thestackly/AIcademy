import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [initialAuthView, setInitialAuthView] = useState('login')
  const [currentAuthView, setCurrentAuthView] = useState('login')
  const shouldShowModalClose = currentAuthView === 'login' || currentAuthView === 'register'

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    AOS.init({
      duration: reducedMotion ? 1 : 700,
      easing: 'ease-out-cubic',
      offset: 80,
      delay: 0,
      once: true,
      mirror: false,
    })
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => AOS.refreshHard())

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [isLoginOpen])

  useEffect(() => {
    if (!isLoginOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isLoginOpen])

  return (
    <>
      <MainLayout
        onLoginClick={() => {
          setInitialAuthView('login')
          setCurrentAuthView('login')
          setIsLoginOpen(true)
        }}
        onSignupClick={() => {
          setInitialAuthView('register')
          setCurrentAuthView('register')
          setIsLoginOpen(true)
        }}
      >
        <LandingPage />
      </MainLayout>

      {isLoginOpen && (
        <div
          className="motion-modal fixed inset-0 z-50 overflow-hidden bg-white"
          role="dialog"
          aria-modal="true"
          aria-label="Login"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsLoginOpen(false)
            }
          }}
        >
          <div className="absolute inset-0 overflow-hidden bg-white">
            {shouldShowModalClose && (
              <button
                type="button"
                aria-label="Back to home"
                onClick={() => setIsLoginOpen(false)}
                className="absolute left-[18px] top-[18px] z-10 flex h-[38px] items-center gap-[9px] rounded-full bg-white/95 px-[13px] text-[15px] font-[600] leading-none text-[#202020] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition hover:bg-white hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-current">
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[11px] w-[11px]">
                    <path d="M9.8 4.2 6 8l3.8 3.8M6.5 8h4.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Back
              </button>
            )}
            <LoginPage isModal initialAuthView={initialAuthView} onAuthViewChange={setCurrentAuthView} />
          </div>
        </div>
      )}
    </>
  )
}

export default App
