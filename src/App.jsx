import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

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
      <MainLayout onLoginClick={() => setIsLoginOpen(true)}>
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
            <button
              type="button"
              aria-label="Close login"
              onClick={() => setIsLoginOpen(false)}
              className="absolute left-[18px] top-[18px] z-10 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/95 text-[24px] leading-none text-[#202020] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              x
            </button>
            <LoginPage isModal />
          </div>
        </div>
      )}
    </>
  )
}

export default App
