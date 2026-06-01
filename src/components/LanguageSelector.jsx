import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const languages = ['English', 'Deutch', 'Nederland', 'Portuguese', 'Indonesia', 'Turkey']

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const frameRef = useRef(0)
  const listboxId = useId()

  const updateMenuPosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect()

    if (!rect) {
      return
    }

    const menuWidth = 216
    const menuHeight = menuRef.current?.offsetHeight || 252
    const viewportPadding = 12
    const centeredLeft = rect.left + (rect.width / 2) - (menuWidth / 2)
    const maxLeft = Math.max(viewportPadding, window.innerWidth - menuWidth - viewportPadding)
    const left = Math.min(Math.max(viewportPadding, centeredLeft), maxLeft)
    const topBelow = rect.bottom + 8
    const topAbove = rect.top - menuHeight - 8
    const top = topBelow + menuHeight + viewportPadding <= window.innerHeight
      ? topBelow
      : Math.max(viewportPadding, topAbove)

    setMenuPosition((current) =>
      current.left === left && current.top === top
        ? current
        : { left, top },
    )
  }, [])

  const scheduleMenuPositionUpdate = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      updateMenuPosition()
    })
  }, [updateMenuPosition])

  useEffect(() => {
    setIsMounted(true)

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    if (isOpen) {
      updateMenuPosition()
    }
  }, [isOpen, updateMenuPosition])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    updateMenuPosition()

    const handlePointerDown = (event) => {
      if (
        buttonRef.current?.contains(event.target)
        || menuRef.current?.contains(event.target)
      ) {
        return
      }

      setIsOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    window.addEventListener('resize', scheduleMenuPositionUpdate)
    window.addEventListener('scroll', scheduleMenuPositionUpdate, true)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', scheduleMenuPositionUpdate)
      window.removeEventListener('scroll', scheduleMenuPositionUpdate, true)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, scheduleMenuPositionUpdate, updateMenuPosition])

  const handleSelect = (language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
  }

  const menu = isOpen && isMounted ? createPortal(
    <div
      ref={menuRef}
      id={listboxId}
      role="listbox"
      aria-label="Language options"
      className="motion-dropdown fixed z-[9999] w-[216px] rounded-[8px] bg-mint py-[3px] text-left shadow-[0_10px_22px_rgba(0,0,0,0.08)]"
      style={{ left: `${menuPosition.left}px`, top: `${menuPosition.top}px` }}
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
    </div>,
    document.body,
  ) : null

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => {
          updateMenuPosition()
          setIsOpen((current) => !current)
        }}
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

      {menu}
    </div>
  )
}

export default LanguageSelector
