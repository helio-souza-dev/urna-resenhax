import { useState } from 'react'
import { useApp } from '../lib/store'
import { supabase } from '../lib/supabase'
import Badge from '../components/Badge'

export default function ListaEleitores({ showFlash }) {
  const { state, actions } = useApp()
  const [busca, setBusca] = useState('')

  const lista = state.eleitores.filter(e =>
    e.nome.toLowerCase().includes(busca.toLowerCase()) || e.cpf.includes(busca)
  )

  return (
    <div className="p-10 max-w-[1100px]">
      <div className="mb-8 pb-5 border-b border-[#222] flex items-end justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-[#f0f0f0] tracking-tight">Eleitores</h1>
          <p className="text-[11px] text-[#555] mt-1 tracking-wide">Todos os eleitores cadastrados</p>
        </div>
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar..."
          className="input w-48"
        />
      </div>

      <div className="border border-[#222] rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#161616] border-b border-[#222]">
              {['Nome', 'CPF', 'Título', 'Zona', 'Status', ''].map((h, i) => (
                <th key={i} className="px-3.5 py-2.5 text-left text-[9px] tracking-widest uppercase text-[#555] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!lista.length ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#444] text-[11px] tracking-widest">Nenhum resultado.</td></tr>
            ) : lista.map(e => (
              <tr key={e.id} className="border-b border-[#222] last:border-0 hover:bg-[#161616] transition-colors">
                <td className="px-3.5 py-3">{e.nome}</td>
                <td className="px-3.5 py-3 text-[#555]">{e.cpf}</td>
                <td className="px-3.5 py-3 text-[#555]">{e.titulo || '—'}</td>
                <td className="px-3.5 py-3 text-[#555]">{e.zona || '—'}</td>
                <td className="px-3.5 py-3">
                  {e.votou ? <Badge variant="green">Votou</Badge> : <Badge>Pendente</Badge>}
                </td>
                <td className="px-3.5 py-3">
                  <button onClick={async () => {
                    const { error } = await supabase.from('eleitores').delete().eq('id', e.id);
                    if (!error) {
                      actions.removeEleitor(e.id);
                      showFlash('Eleitor removido.', 'warn');
                    } else {
                      showFlash('Erro ao remover.', 'err');
                    }
                  }} className="btn-danger btn-sm">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
