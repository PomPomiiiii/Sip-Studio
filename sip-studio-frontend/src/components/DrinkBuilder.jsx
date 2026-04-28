import { useState } from 'react'
import StepCard from './StepCard'

const drinkTypes = ['Coffee', 'Tea', 'Smoothie', 'Matcha']

const bases = {
  Coffee: ['Espresso', 'Americano', 'Cold Brew'],
  Tea: ['Earl Grey', 'Chamomile', 'Oolong'],
  Smoothie: ['Banana', 'Mango', 'Mixed Berry'],
  Matcha: ['Classic Matcha', 'Ceremonial Matcha'],
}

const milks = ['Whole Milk', 'Oat Milk', 'Almond Milk', 'Coconut Milk', 'None']
const syrups = ['Vanilla', 'Caramel', 'Hazelnut', 'Brown Sugar', 'None']
const extras = ['Whipped Cream', 'Extra Shot', 'Foam', 'Drizzle', 'None']
const sizes = ['Small', 'Medium', 'Large']
const temps = ['Hot', 'Iced', 'Blended']

const drinkEmoji = { Coffee: '☕', Tea: '🍵', Smoothie: '🥤', Matcha: '🍃' }

function DrinkBuilder({ onBack }) {
  const [step, setStep] = useState(1)
  const [drink, setDrink] = useState({
    type: '', base: '', milk: '', syrup: '',
    extra: '', size: '', temp: '', name: ''
  })
  const [ordering, setOrdering] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [orderTime, setOrderTime] = useState(null)
  const [copied, setCopied] = useState(false)

  const update = (key, value) => setDrink(prev => ({ ...prev, [key]: value }))
  const next = () => setStep(s => s + 1)
  const back = () => step === 1 ? onBack() : setStep(s => s - 1)

  const totalSteps = 8

  const placeOrder = async () => {
    setOrdering(true)
    try {
      const res = await fetch('https://sip-studio-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drink_name: drink.name,
          type: drink.type,
          base: drink.base,
          milk: drink.milk,
          syrup: drink.syrup,
          extra: drink.extra,
          size: drink.size,
          temp: drink.temp
        })
      })
      const data = await res.json()
      if (data.success) {
        setOrdered(true)
        setOrderId(data.orderId)
        setOrderTime(new Date().toLocaleString())
      }
    } catch (err) {
      console.error(err)
    }
    setOrdering(false)
  }

  const siteUrl = window.location.origin
  const shareText = `☕ I just crafted my dream drink at Sip Studio!\n\n"${drink.name}"\n\n🍹 ${drink.type} · ${drink.base}\n🥛 ${drink.milk}\n🍯 ${drink.syrup}\n🌟 ${drink.extra}\n📏 ${drink.size} · ${drink.temp}\n\n✨ Come build your own at:\n${siteUrl}\n\n#SipStudio #CraftYourDrink`
  
  const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Sip Studio Drink 🍵',
        text: shareText,
        url: siteUrl
      })
    } catch (err) {
      console.log('Share cancelled')
    }
  } else {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
}

  const reset = () => {
    setOrdered(false)
    setOrderId(null)
    setOrderTime(null)
    setCopied(false)
    setStep(1)
    setDrink({ type: '', base: '', milk: '', syrup: '', extra: '', size: '', temp: '', name: '' })
  }

  // Floating drink preview
  const DrinkPreview = () => (
    <div className="text-center mb-4 animate-bounce-slow">
      <div className="text-5xl">
        {drinkEmoji[drink.type] || '🥤'}
      </div>
      {drink.name && (
        <p className="text-xs text-amber-500 mt-1 font-light italic">"{drink.name}"</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4 py-10">

      {/* Header */}
      {!ordered && (
        <div className="text-center mb-6">
          <DrinkPreview />
          <h1 className="text-3xl font-bold text-amber-900">Build Your Drink</h1>
          <p className="text-amber-500 text-sm mt-1 font-light tracking-wide">
            Step {step} of {totalSteps}
          </p>
          <div className="mt-3 w-64 h-2 bg-amber-100 rounded-full mx-auto">
            <div
              className="h-2 bg-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      {step === 1 && (
        <StepCard title="What are you feeling?" emoji="🍹">
          {drinkTypes.map(t => (
            <button key={t} onClick={() => { update('type', t); next() }}
              className={`option-btn ${drink.type === t ? 'bg-amber-700 text-white' : ''}`}>
              {drinkEmoji[t]} {t}
            </button>
          ))}
        </StepCard>
      )}

      {step === 2 && (
        <StepCard title="Choose your base" emoji="✨">
          {(bases[drink.type] || []).map(b => (
            <button key={b} onClick={() => { update('base', b); next() }}
              className={`option-btn ${drink.base === b ? 'bg-amber-700 text-white' : ''}`}>
              {b}
            </button>
          ))}
        </StepCard>
      )}

      {step === 3 && (
        <StepCard title="Pick your milk" emoji="🥛">
          {milks.map(m => (
            <button key={m} onClick={() => { update('milk', m); next() }}
              className={`option-btn ${drink.milk === m ? 'bg-amber-700 text-white' : ''}`}>
              {m}
            </button>
          ))}
        </StepCard>
      )}

      {step === 4 && (
        <StepCard title="Add a syrup" emoji="🍯">
          {syrups.map(s => (
            <button key={s} onClick={() => { update('syrup', s); next() }}
              className={`option-btn ${drink.syrup === s ? 'bg-amber-700 text-white' : ''}`}>
              {s}
            </button>
          ))}
        </StepCard>
      )}

      {step === 5 && (
        <StepCard title="Any extras?" emoji="🌟">
          {extras.map(e => (
            <button key={e} onClick={() => { update('extra', e); next() }}
              className={`option-btn ${drink.extra === e ? 'bg-amber-700 text-white' : ''}`}>
              {e}
            </button>
          ))}
        </StepCard>
      )}

      {step === 6 && (
        <StepCard title="Size & temperature" emoji="🌡️">
          <p className="text-amber-700 text-sm mb-2 font-light w-full text-center">Size</p>
          <div className="flex gap-2 mb-4 justify-center">
            {sizes.map(s => (
              <button key={s} onClick={() => update('size', s)}
                className={`option-btn ${drink.size === s ? 'bg-amber-700 text-white' : ''}`}>
                {s}
              </button>
            ))}
          </div>
          <p className="text-amber-700 text-sm mb-2 font-light w-full text-center">Temperature</p>
          <div className="flex gap-2 justify-center">
            {temps.map(t => (
              <button key={t} onClick={() => update('temp', t)}
                className={`option-btn ${drink.temp === t ? 'bg-amber-700 text-white' : ''}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={next}
            disabled={!drink.size || !drink.temp}
            className="mt-6 w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold transition-colors">
            Next →
          </button>
        </StepCard>
      )}

      {step === 7 && (
        <StepCard title="Name your creation" emoji="📝">
          <input
            type="text"
            placeholder="e.g. My Cozy Oat Latte"
            value={drink.name}
            onChange={e => update('name', e.target.value)}
            className="w-full border border-amber-200 rounded-xl px-4 py-3 text-amber-900 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
          />
          <button onClick={next}
            disabled={!drink.name}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold transition-colors">
            Review My Drink ☕
          </button>
        </StepCard>
      )}

      {step === 8 && !ordered && (
        <StepCard title="Your creation is ready!" emoji="☕">
          <div className="w-full text-left space-y-2">
            <p className="text-amber-900 font-bold text-lg text-center mb-4">"{drink.name}"</p>
            <div className="bg-amber-50 rounded-2xl p-4 space-y-2 text-sm text-amber-800 font-light">
              <p>🍹 <span className="font-semibold">Type:</span> {drink.type}</p>
              <p>✨ <span className="font-semibold">Base:</span> {drink.base}</p>
              <p>🥛 <span className="font-semibold">Milk:</span> {drink.milk}</p>
              <p>🍯 <span className="font-semibold">Syrup:</span> {drink.syrup}</p>
              <p>🌟 <span className="font-semibold">Extra:</span> {drink.extra}</p>
              <p>📏 <span className="font-semibold">Size:</span> {drink.size}</p>
              <p>🌡️ <span className="font-semibold">Temp:</span> {drink.temp}</p>
            </div>
            <button
              onClick={placeOrder}
              disabled={ordering}
              className="mt-4 w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold transition-colors">
              {ordering ? 'brewing your order... ☕' : 'Place Order ☕'}
            </button>
          </div>
        </StepCard>
      )}

      {/* Option B+C+D — Order confirmation + share + animations */}
      {ordered && (
        <div className="bg-white rounded-3xl shadow-md p-8 max-w-sm w-full border border-amber-100 text-center animate-fade-in">

          {/* Big emoji */}
          <div className="text-6xl mb-3 animate-pop">🎉</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-amber-900 mb-1">Order Placed!</h2>
          <p className="text-amber-500 text-sm font-light mb-6">Your drink is being crafted with love 🍵</p>

          {/* Receipt card */}
          <div className="bg-amber-50 rounded-2xl p-5 text-left space-y-2 text-sm border border-amber-100 mb-6">

            {/* Order meta */}
            <div className="flex justify-between text-xs text-amber-400 font-light mb-3 pb-2 border-b border-amber-100">
              <span>Order #{orderId || '—'}</span>
              <span>{orderTime}</span>
            </div>

            {/* Drink name */}
            <p className="text-amber-900 font-bold text-base text-center mb-3">
              {drinkEmoji[drink.type]} "{drink.name}"
            </p>

            <p>🍹 <span className="font-semibold text-amber-800">Type:</span> <span className="text-amber-700 font-light">{drink.type}</span></p>
            <p>✨ <span className="font-semibold text-amber-800">Base:</span> <span className="text-amber-700 font-light">{drink.base}</span></p>
            <p>🥛 <span className="font-semibold text-amber-800">Milk:</span> <span className="text-amber-700 font-light">{drink.milk}</span></p>
            <p>🍯 <span className="font-semibold text-amber-800">Syrup:</span> <span className="text-amber-700 font-light">{drink.syrup}</span></p>
            <p>🌟 <span className="font-semibold text-amber-800">Extra:</span> <span className="text-amber-700 font-light">{drink.extra}</span></p>
            <p>📏 <span className="font-semibold text-amber-800">Size:</span> <span className="text-amber-700 font-light">{drink.size}</span></p>
            <p>🌡️ <span className="font-semibold text-amber-800">Temp:</span> <span className="text-amber-700 font-light">{drink.temp}</span></p>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-full mb-3 bg-amber-100 hover:bg-amber-200 text-amber-800 py-3 rounded-2xl font-semibold transition-colors text-sm">
            {copied ? '✅ Copied to clipboard!' : '🔗 Share My Drink'}
          </button>

          {/* Build another */}
          <button
            onClick={reset}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-2xl font-semibold transition-colors">
            Build Another Drink ✨
          </button>

        </div>
      )}

      {/* Back button */}
      {!ordered && (
        <button onClick={back}
          className="mt-4 text-amber-500 hover:text-amber-700 text-sm font-light transition-colors">
          ← Go back
        </button>
      )}

    </div>
  )
}

export default DrinkBuilder