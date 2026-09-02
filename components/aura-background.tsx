export function AuraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        className="animate-aura-float absolute -left-24 -top-24 h-72 w-72 rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle, var(--aura-violet), transparent 70%)',
          opacity: 0.45,
        }}
      />
      <div
        className="animate-aura-float absolute -right-28 top-1/3 h-80 w-80 rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, var(--aura-teal), transparent 70%)',
          opacity: 0.35,
          animationDelay: '3s',
        }}
      />
      <div
        className="animate-aura-float absolute -bottom-32 left-1/4 h-72 w-72 rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, var(--aura-rose), transparent 70%)',
          opacity: 0.25,
          animationDelay: '6s',
        }}
      />
    </div>
  )
}
