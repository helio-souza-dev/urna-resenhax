import { useApp } from '../lib/store'
import Badge from '../components/Badge'

export default function Dashboard() {
  const { state } = useApp()
  const { eleitores, votos } = state
  const votaram = eleitores.filter(e => e.votou).length
  const participacao = eleitores.length ? Math.round((votaram / eleitores.length) * 100) : 0
  const ultimos = [...votos].reverse().slice(0, 8)

  return (
    <div className="p-10 max-w-[1100px]">
      <div className="mb-8 pb-5 border-b border-[#222] flex items-end justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-[#f0f0f0] tracking-tight">Dashboard</h1>
          <p className="text-[11px] text-[#555] mt-1 tracking-wide">Visão geral do sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { label: 'Eleitores',    value: eleitores.length, sub: 'cadastrados' },
          { label: 'Votos',        value: votos.length,     sub: 'computados' },
          { label: 'Participação', value: `${participacao}%`, sub: 'dos eleitores' },
        ].map(s => (
          <div key={s.label} className="bg-[#161616] border border-[#222] rounded-lg px-5 py-4">
            <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">{s.label}</div>
            <div className="font-syne font-bold text-3xl text-[#f0f0f0] leading-none">{s.value}</div>
            <div className="text-[10px] text-[#555] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="text-[9px] text-[#555] tracking-widest uppercase mb-3">Últimos votos</div>
      <div className="border border-[#222] rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#161616] border-b border-[#222]">
              {['ID', 'Eleitor', 'Candidato', 'Partido', 'Horário'].map(h => (
                <th key={h} className="px-3.5 py-2.5 text-left text-[9px] tracking-widest uppercase text-[#555] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!ultimos.length ? (
              <tr><td colSpan={5} className="text-center py-10 text-[#444] text-[11px] tracking-widest">Nenhum voto.</td></tr>
            ) : ultimos.map(v => (
              <tr key={v.id} className="border-b border-[#222] last:border-0 hover:bg-[#161616] transition-colors">
                <td className="px-3.5 py-3 text-[#555]">{v.id}</td>
                <td className="px-3.5 py-3">{v.nomeEleitor}</td>
                <td className="px-3.5 py-3">{v.nome}</td>
                <td className="px-3.5 py-3"><Badge>{v.partido}</Badge></td>
                <td className="px-3.5 py-3 text-[#555]">{v.ts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
