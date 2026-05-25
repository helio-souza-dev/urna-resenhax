import { useState, useEffect } from 'react'
import { useApp } from '../lib/store'
import { supabase } from '../lib/supabase'

function LogPanel({ logs }) {
  return (
    <div className="bg-[#080808] border border-[#222] rounded-md p-3.5 text-[11px] h-32 overflow-y-auto mt-4">
      {logs.map((l, i) => (
        <div key={i} className="flex gap-2 mb-0.5">
          <span className="text-[#444]">[{l.ts}]</span>
          <span className={l.nivel === 'err' ? 'text-red-400' : l.nivel === 'warn' ? 'text-yellow-400' : 'text-green-400'}>{l.msg}</span>
        </div>
      ))}
    </div>
  )
}

function SelBox({ cand }) {
  if (!cand) return (
    <div className="bg-[#161616] border border-[#222] rounded-lg p-5 sticky top-6">
      <div className="text-[9px] text-[#555] tracking-widest uppercase mb-3">Candidato Selecionado</div>
      <div className="text-[11px] text-[#444] text-center py-5">Clique em um candidato no mural</div>
    </div>
  )

  return (
    <div className="bg-[#161616] border border-[#222] rounded-lg p-5 sticky top-6">
      <div className="text-[9px] text-[#555] tracking-widest uppercase mb-3.5">Candidato Selecionado</div>
      <div className="flex gap-3.5 items-start mb-4 pb-4 border-b border-[#222]">
        <div className="w-[72px] h-[72px] rounded-full border border-[#2a2a2a] overflow-hidden flex items-center justify-center flex-shrink-0 bg-[#222]">
          {cand.foto_url ? <img src={cand.foto_url} className="w-full h-full object-cover" alt="" /> : <span className="text-[10px] text-[#444] text-center leading-relaxed">sem<br />foto</span>}
        </div>
        <div>
          <div className="font-syne font-black text-[22px] text-[#f0f0f0] leading-none">{cand.numero}</div>
          <div className="text-sm text-[#e8e8e8] mt-1">{cand.nome}</div>
          <div className="text-[9px] text-[#555] tracking-widest uppercase mt-1">{cand.partido}</div>
        </div>
      </div>
      {cand.bio && (
        <div className="mb-3.5">
          <div className="text-[9px] text-[#555] tracking-widest uppercase mb-1.5">Bio</div>
          <div className="text-[11px] text-[#aaa] leading-relaxed">{cand.bio}</div>
        </div>
      )}
      {cand.projetos?.length > 0 && (
        <div>
          <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">Projetos de Lei</div>
          <div className="flex flex-col gap-1.5">
            {cand.projetos.map((p, i) => (
              <div key={i} className="text-[11px] text-[#aaa] px-2.5 py-1.5 bg-[#080808] border border-[#222] rounded leading-relaxed">{p}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Votar({ showFlash }) {
  const { state, actions } = useApp()
  const [numeroInput, setNumeroInput] = useState('')
  const [sel, setSel] = useState(null)
  const [logs, setLogs] = useState([{ ts: 'sistema', msg: 'pronto para receber votos.', nivel: 'ok' }])
  useEffect(() => {
    if (!numeroInput) {
      setSel(null)
      return
    }
    const c = state.candidatos.find(cand => cand.numero === numeroInput)
    setSel(c || null)
  }, [numeroInput, state.candidatos])

  function addLog(msg, nivel = 'ok') {
    const ts = new Date().toLocaleTimeString('pt-BR')
    setLogs(l => [...l, { ts, msg, nivel }])
  }

  function limpar() {
    setNumeroInput('')
    setSel(null)
  }

  function handleKeypad(num) {
    if (numeroInput.length < 4) {
      setNumeroInput(prev => prev + num)
    }
  }

  async function confirmarVoto() {
    const usuario = state.currentUsuario
    if (!usuario) { showFlash('Erro: Usuário não identificado.', 'err'); return }
    if (!sel && numeroInput !== 'BRANCO') { showFlash('Número de candidato inválido ou não selecionado.', 'err'); return }

    const el = state.eleitores.find(e => e.usuario === usuario)
    if (!el) { addLog(`Eleitor não encontrado no banco local`, 'err'); showFlash('Erro de sessão do eleitor.', 'err'); return }
    if (el.votou) { addLog(`${el.nome} já votou`, 'err'); showFlash(`${el.nome} já registrou seu voto.`, 'err'); return }

    const isBranco = numeroInput === 'BRANCO'
    
    const novoVoto = {
      usuario_eleitor: usuario,
      nome_eleitor: el.nome,
      numero_cand: isBranco ? 'BRANCO' : sel.numero,
      nome_cand: isBranco ? 'BRANCO' : sel.nome,
      partido_cand: isBranco ? '—' : sel.partido,
      ts: new Date().toISOString()
    }

    // Grava no supabase
    const { error: errVoto } = await supabase.from('votos').insert([novoVoto]).select()
    const { error: errEl } = await supabase.from('eleitores').update({ votou: true }).eq('id', el.id)

    if (errVoto || errEl) {
      showFlash('Erro ao processar voto no banco.', 'err')
      return
    }

    actions.markVoted(el.id)
    actions.addVoto({ ...novoVoto, ts: new Date().toLocaleTimeString('pt-BR') })
    
    if (isBranco) {
      addLog(`VOTO: ${el.nome} → BRANCO`, 'ok')
      showFlash('✓ Voto em BRANCO registrado.', 'ok')
    } else {
      addLog(`VOTO: ${el.nome} → ${sel.nome} (${sel.partido})`, 'ok')
      showFlash(`✓ Voto registrado!\n${sel.nome} — ${sel.partido}`, 'ok')
    }
    limpar()
  }

  async function votarBranco() {
    setNumeroInput('BRANCO')
    setSel(null)
    // Para confirmar o branco o usuário precisa apertar CONFIRMA depois.
    // Ou podemos confirmar direto. Vamos confirmar direto para simplificar a usabilidade.
  }



  return (
    <div className="p-10 max-w-[1100px]">
      <div className="mb-8 pb-5 border-b border-[#222]">
        <h1 className="font-syne font-bold text-2xl text-[#f0f0f0] tracking-tight">Votação</h1>
        <p className="text-[11px] text-[#555] mt-1 tracking-wide">Escolha um candidato e confirme seu voto</p>
      </div>

      {/* Mural */}
      <div className="text-[9px] text-[#555] tracking-widest uppercase mb-3">Candidatos</div>
      <div className="grid gap-3.5 mb-7" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
        {!state.candidatos.length ? (
          <div className="col-span-full text-[#444] text-[11px] tracking-widest py-6">
            Nenhum candidato cadastrado. Peça ao administrador.
          </div>
        ) : state.candidatos.map(c => {
          const votos = state.votos.filter(v => v.numero === c.numero).length
          const isSel = sel?.numero === c.numero
          return (
            <div
              key={c.id}
              onClick={() => {
                setSel(isSel ? null : c)
                setNumeroInput(isSel ? '' : c.numero)
              }}
              className={`bg-[#161616] border rounded-xl p-5 cursor-pointer transition-all relative overflow-hidden hover:-translate-y-px hover:shadow-2xl
                ${isSel ? 'border-green-500 bg-green-500/[0.04]' : 'border-[#222] hover:border-[#333]'}`}
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all ${isSel ? 'bg-green-500' : 'bg-[#222]'}`} />
              <div className="absolute top-3 right-3 text-[9px] text-[#444]">{votos} voto{votos !== 1 ? 's' : ''}</div>
              <div className="w-14 h-14 rounded-full bg-[#222] border border-[#2a2a2a] flex items-center justify-center overflow-hidden mb-3">
                {c.foto_url ? <img src={c.foto_url} className="w-full h-full object-cover" alt="" /> : <span className="text-[10px] text-[#444] text-center leading-relaxed">sem<br />foto</span>}
              </div>
              <div className="font-syne font-black text-[26px] text-[#f0f0f0] leading-none tracking-tight">{c.numero}</div>
              <div className="text-[13px] text-[#e8e8e8] mt-1">{c.nome}</div>
              <div className="text-[9px] text-[#555] tracking-widest uppercase mt-1">{c.partido}</div>
              {isSel && (
                <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[11px] text-black font-bold">✓</div>
              )}
            </div>
          )
        })}
      </div>

      <hr className="border-t border-[#222] my-6" />

      {/* Urna Area */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 350px' }}>
        
        {/* Painel da Urna (Teclado) */}
        <div className="bg-[#111] border-[4px] border-[#2a2a2a] rounded-xl p-6 flex flex-col items-center">
          <div className="bg-[#e8e8e8] w-full max-w-[280px] h-20 rounded shadow-inner mb-6 flex flex-col justify-center items-end px-5 border border-[#ccc]">
            <div className="text-[10px] text-[#555] font-bold tracking-widest uppercase mb-1">Número</div>
            <div className="font-mono text-4xl text-[#080808] tracking-widest font-bold">
              {numeroInput || '____'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5 w-full max-w-[260px]">
            {['1','2','3','4','5','6','7','8','9'].map(num => (
              <button 
                key={num} 
                onClick={() => handleKeypad(num)}
                className="bg-[#1a1a1a] border-b-4 border-[#0a0a0a] active:border-b-0 active:translate-y-1 text-[#f0f0f0] font-bold text-xl py-3 rounded hover:bg-[#222] transition-all"
              >
                {num}
              </button>
            ))}
            <div className="col-start-2">
              <button 
                onClick={() => handleKeypad('0')}
                className="w-full bg-[#1a1a1a] border-b-4 border-[#0a0a0a] active:border-b-0 active:translate-y-1 text-[#f0f0f0] font-bold text-xl py-3 rounded hover:bg-[#222] transition-all"
              >
                0
              </button>
            </div>
          </div>

          <div className="flex gap-2 w-full max-w-[320px] mt-2">
            <button 
              onClick={() => { setNumeroInput('BRANCO'); setSel(null); }}
              className="flex-1 bg-white border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 text-black font-bold text-[11px] uppercase tracking-widest py-3 rounded hover:bg-gray-200 transition-all"
            >
              Branco
            </button>
            <button 
              onClick={limpar}
              className="flex-1 bg-[#ff4d4d] border-b-4 border-[#cc0000] active:border-b-0 active:translate-y-1 text-white font-bold text-[11px] uppercase tracking-widest py-3 rounded hover:bg-[#ff6666] transition-all"
            >
              Corrige
            </button>
            <button 
              onClick={confirmarVoto}
              className="flex-1 bg-[#00cc44] border-b-4 border-[#009933] active:border-b-0 active:translate-y-1 text-white font-bold text-[11px] uppercase tracking-widest py-3 rounded hover:bg-[#33dd66] transition-all"
            >
              Confirma
            </button>
          </div>

          <div className="w-full mt-6">
            <LogPanel logs={logs} />
          </div>
        </div>

        {/* Selected Info */}
        <SelBox cand={sel} />
      </div>
    </div>
  )
}
