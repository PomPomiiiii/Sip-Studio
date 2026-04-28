function StepCard({ title, emoji, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 max-w-sm w-full border border-amber-100">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-xl font-bold text-amber-900">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {children}
      </div>
    </div>
  )
}

export default StepCard