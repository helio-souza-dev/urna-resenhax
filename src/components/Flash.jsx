export default function Flash({ flash }) {
  if (!flash) return null

  const colors = {
    ok: 'bg-green-500/10 border border-green-500/30 text-green-400',
    err: 'bg-red-500/10 border border-red-500/30 text-red-400',
    warn: 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400',
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-xs tracking-wide max-w-xs leading-relaxed whitespace-pre-wrap flash-show ${colors[flash.tipo] ?? colors.ok}`}
    >
      {flash.msg}
    </div>
  )
}
