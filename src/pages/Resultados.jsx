import { useApp } from '../lib/store'
import Badge from '../components/Badge'

export default function Resultados() {
  const { state } = useApp()
  const { votos, eleitores } = state

  const total = votos.length
  const brancos = votos.filter(v => v.numero === 'BRANCO').length

  const cnt = {}
  votos.filter(v => v.numero !== 'BRANCO').forEach(v => {
    cnt[v.numero] = cnt[v.numero] || { nome: v.nome, partido: v.partido, numero: v.numero, votos: 0 }
    cnt[v.numero].votos++
  })
  const lista = Object.values(cnt).sort((a, b) => b.votos - a.votos)
  const max = lista[0]?.votos ?? 0

  return (
    <div className="p-10 max-w-[1100px]">
      <div className="mb-8 pb-5 border-b border-[#222] flex items-end justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-[#f0f0f0] tracking-tight">Resultados</h1>
          <p className="text-[11px] text-[#555] mt-1 tracking-wide">Apuração parcial em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { label: 'Total Votos',    value: total },
          { label: 'Votos em Branco', value: brancos },
          { label: 'Eleitores Aptos', value: eleitores.length },
        ].map(s => (
          <div key={s.label} className="bg-[#161616] border border-[#222] rounded-lg px-5 py-4">
            <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">{s.label}</div>
            <div className="font-syne font-bold text-3xl text-[#f0f0f0] leading-none">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="border border-[#222] rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#161616] border-b border-[#222]">
              {['#', 'Candidato', 'Partido', 'Votos', '%'].map((h, i) => (
                <th key={i} className={`px-3.5 py-2.5 text-left text-[9px] tracking-widest uppercase text-[#555] font-normal ${i === 4 ? 'w-44' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!lista.length ? (
              <tr><td colSpan={5} className="text-center py-10 text-[#444] text-[11px] tracking-widest">Sem votos computados.</td></tr>
            ) : lista.map(c => {
              const pct = total ? ((c.votos / total) * 100).toFixed(1) : '0.0'
              const w = max ? Math.round((c.votos / max) * 100) : 0
              return (
                <tr key={c.numero} className="border-b border-[#222] last:border-0 hover:bg-[#161616] transition-colors">
                  <td className="px-3.5 py-3 text-[#555]">{c.numero}</td>
                  <td className="px-3.5 py-3">
                    <div>{c.nome}</div>
                    <div className="h-0.5 bg-[#161616] rounded mt-1 overflow-hidden w-full">
                      <div className="h-full bg-[#f0f0f0] res-bar-fill" style={{ width: `${w}%` }} />
                    </div>
                  </td>
                  <td className="px-3.5 py-3"><Badge>{c.partido}</Badge></td>
                  <td className="px-3.5 py-3 font-syne font-bold text-sm">{c.votos}</td>
                  <td className="px-3.5 py-3 text-[#555]">{pct}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
