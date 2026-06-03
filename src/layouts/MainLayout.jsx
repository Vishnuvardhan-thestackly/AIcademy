import Navbar from '../components/Navbar'

function MainLayout({ children, onLoginClick, onSignupClick }) {
  return (
    <div className="motion-root h-svh overflow-hidden bg-[#fdfdfd]">
      <div className="flex h-svh w-full flex-col bg-[#fdfdfd]">
        <Navbar onLoginClick={onLoginClick} onSignupClick={onSignupClick} />
        {children}
      </div>
    </div>
  )
}

export default MainLayout
