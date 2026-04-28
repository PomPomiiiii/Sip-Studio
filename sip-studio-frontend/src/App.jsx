import { useState } from 'react'
import DrinkBuilder from './components/DrinkBuilder'

function App() {
  const [started, setStarted] = useState(false)

  if (started) return <DrinkBuilder onBack={() => setStarted(false)} />

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">☕</div>
        <h1 className="text-5xl font-bold text-amber-900 tracking-wide">
          Sip Studio
        </h1>
        <p className="text-amber-600 mt-3 text-lg font-light tracking-wide">
          Craft your perfect drink, one sip at a time.
        </p>
      </div>
      <div className="bg-white rounded-3xl shadow-md p-8 max-w-sm w-full text-center border border-amber-100">
        <p className="text-amber-800 text-base mb-6 leading-relaxed font-light">
          Welcome! Build your dream café drink —<br/>
          choose your base, milk, flavors, and more. 🍵
        </p>
        <button
          onClick={() => setStarted(true)}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 tracking-wide">
          Start Building ✨
        </button>
      </div>
      <p className="text-amber-400 text-sm mt-8 font-light tracking-widest uppercase">
        Made with love & caffeine ☕
      </p>
    </div>
  )
}

export default App