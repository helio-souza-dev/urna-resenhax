import { useState } from 'react'
import { gerarCPFs } from '../lib/cpf'

export default function CpfGen({ showFlash }) {
  const [qtd, setQtd] = useState(10)
  const [lista, setLista] = useState([])

  function gerar() {
    setLista(gerarCPFs(qtd))
  }

  function copiar(cpf, e) {
    navigator.clipboard.writeText(cpf).then(() => {
      const el = e.currentTarget
      const orig = el.textContent
      el.textContent = '✓ copiado'
      el.style.borderColor = 'var(--green)'
      el.style.color = 'var(--green)'
      setTimeout(() => { el.textContent = orig; el.style.borderColor = ''; el.style.color = '' }, 1200)
    })
  }

  function copiarTodos() {
    if (!lista.length) { showFlash('Gere CPFs primeiro.', 'err'); return }
    navigator.clipboard.writeText(lista.join('\n')).then(() => showFlash(`${lista.length} CPFs copiados.`, 'ok'))
  }

  return (
    <div className="p-10 max-w-[1100px]">
      <div className="mb-8 pb-5 border-b border-[#222]">
        <h1 className="font-syne font-bold text-2xl text-[#f0f0f0] tracking-tight">Gerador de CPF</h1>
        <p className="text-[11px] text-[#555] mt-1 tracking-wide">CPFs válidos para uso no cenário de teste</p>
      </div>

      <div className="bg-[#161616] border border-[#222] rounded-lg p-5 mb-6">
        <div className="text-[9px] text-[#555] tracking-widest uppercase mb-3">Gerar novos CPFs válidos</div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={qtd}
            onChange={e => setQtd(Number(e.target.value))}
            min={1} max={50}
            className="input w-20"
          />
          <span className="text-[11px] text-[#555]">quantidade</span>
          <button onClick={gerar} className="btn-primary btn-sm">Gerar</button>
          <button onClick={copiarTodos} className="btn-ghost btn-sm">Copiar todos</button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {!lista.length
            ? <span className="text-[11px] text-[#444]">Clique em Gerar para criar CPFs.</span>
            : lista.map((cpf, i) => (
              <span
                key={i}
                onClick={e => copiar(cpf, e)}
                className="text-[12px] text-[#e8e8e8] bg-[#080808] border border-[#2a2a2a] rounded px-3 py-1.5 cursor-pointer hover:border-[#333] hover:text-[#f0f0f0] transition-all tracking-widest"
              >
                {cpf}
              </span>
            ))
          }
        </div>
        <div className="text-[10px] text-[#444] mt-3">Clique em um CPF para copiar individualmente.</div>
      </div>
    </div>
  )
}
