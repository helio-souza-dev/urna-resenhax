const variants = {
  green: 'bg-green-500/10 text-green-400 border border-green-500/20',
  gray:  'bg-white/5 text-[#666] border border-[#2a2a2a]',
  red:   'bg-red-500/10 text-red-400 border border-red-500/20',
  blue:  'bg-blue-500/10 text-blue-400 border border-blue-500/20',
}

export default function Badge({ children, variant = 'gray' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] tracking-widest uppercase ${variants[variant]}`}>
      {children}
    </span>
  )
}
