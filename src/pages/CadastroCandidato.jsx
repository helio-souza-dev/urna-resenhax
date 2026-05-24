import { useState, useRef } from 'react'
import { useApp } from '../lib/store'
import Badge from '../components/Badge'
import { supabase } from '../lib/supabase'

export default function CadastroCandidato({ showFlash }) {
  const { state, actions } = useApp()
  const [numero, setNumero] = useState('')
  const [nome, setNome] = useState('')
  const [partido, setPartido] = useState('')
  const [bio, setBio] = useState('')
  const [projetos, setProjetos] = useState('')
  const [foto, setFoto] = useState(null)
  const [modalId, setModalId] = useState(null)
  const fileRef = useRef()

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const r = new FileReader()
    r.onload = ev => setFoto(ev.target.result)
    r.readAsDataURL(file)
  }

  function limpar() {
    setNumero(''); setNome(''); setPartido(''); setBio(''); setProjetos(''); setFoto(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function cadastrar() {
  if (!numero || !nome || !partido) { showFlash('Número, nome e partido são obrigatórios.', 'err'); return }
  
  const { data, error } = await supabase
    .from('candidatos')
    .insert([{ numero, nome, partido, bio, projetos: projetos ? projetos.split('\n') : [], foto_url: foto }])
    .select()

  if (error) {
    showFlash('Erro ao cadastrar: ' + error.message, 'err')
  } else {
    actions.addCandidato(data[0])
    showFlash(`Candidato ${nome} cadastrado.`, 'ok')
    limpar()
  }
}

  const modalCand = modalId ? state.candidatos.find(c => c.id === modalId) : null

  return (
    <div className="p-10 max-w-[1100px]">
      <div className="mb-8 pb-5 border-b border-[#222]">
        <h1 className="font-syne font-bold text-2xl text-[#f0f0f0] tracking-tight">Candidatos</h1>
        <p className="text-[11px] text-[#555] mt-1 tracking-wide">Gerenciar candidatos do pleito</p>
      </div>

      {/* Form */}
      <div className="flex gap-7 items-start mb-7">
        {/* Foto */}
        <div className="flex flex-col items-center gap-2 pt-5">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-[90px] h-[90px] border border-dashed border-[#2a2a2a] rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#333] transition-all bg-[#161616]"
          >
            {foto
              ? <img src={foto} className="w-full h-full object-cover" alt="foto" />
              : <span className="text-[10px] text-[#444] text-center leading-relaxed px-2">Clique para<br />adicionar foto</span>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          <span className="text-[10px] text-[#444]">JPG / PNG</span>
        </div>

        {/* Inputs */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3.5 mb-3.5">
            <Field label="Número">
              <input value={numero} onChange={e => setNumero(e.target.value)} maxLength={4} placeholder="10" className="input" />
            </Field>
            <Field label="Partido">
              <input value={partido} onChange={e => setPartido(e.target.value)} placeholder="PT" className="input" />
            </Field>
            <Field label="Nome Completo" full>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do candidato" className="input" />
            </Field>
            <Field label="Bio / Apresentação" full>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Breve histórico..." className="input resize-y min-h-[70px] leading-relaxed" />
            </Field>
            <Field label="Projetos de Lei (um por linha)" full>
              <textarea value={projetos} onChange={e => setProjetos(e.target.value)} placeholder="PL 001/2024 — Reforma tributária" className="input resize-y min-h-[80px] leading-relaxed" />
            </Field>
          </div>
          <div className="flex gap-2">
            <button onClick={cadastrar} className="btn-primary">Salvar Candidato</button>
            <button onClick={limpar} className="btn-ghost">Limpar</button>
          </div>
        </div>
      </div>

      <hr className="border-t border-[#222] my-6" />
      <div className="text-[9px] text-[#555] tracking-widest uppercase mb-3">Candidatos cadastrados</div>

      <div className="border border-[#222] rounded-lg overflow-hidden">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#161616] border-b border-[#222]">
              {['#', 'Foto', 'Nome', 'Partido', ''].map((h, i) => (
                <th key={i} className="px-3.5 py-2.5 text-left text-[9px] tracking-widest uppercase text-[#555] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!state.candidatos.length ? (
              <tr><td colSpan={5} className="text-center py-10 text-[#444] text-[11px] tracking-widest">Nenhum candidato.</td></tr>
            ) : state.candidatos.map(c => (
              <tr key={c.id} className="border-b border-[#222] last:border-0 hover:bg-[#161616] transition-colors">
                <td className="px-3.5 py-3 text-[#555]">{c.numero}</td>
                <td className="px-3.5 py-3">
                  {c.foto_url
                    ? <img src={c.foto_url} className="w-8 h-8 rounded-full object-cover border border-[#2a2a2a]" alt="" />
                    : <div className="w-8 h-8 rounded-full bg-[#222] border border-[#2a2a2a] flex items-center justify-center text-[9px] text-[#444]">sem</div>
                  }
                </td>
                <td className="px-3.5 py-3">{c.nome}</td>
                <td className="px-3.5 py-3"><Badge>{c.partido}</Badge></td>
                <td className="px-3.5 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => setModalId(c.id)} className="btn-ghost btn-sm">Ver</button>
                    <button onClick={async () => { 
                      const { error } = await supabase.from('candidatos').delete().eq('id', c.id);
                      if (!error) { actions.removeCandidato(c.id); showFlash('Candidato removido.', 'warn'); } 
                    }} className="btn-danger btn-sm">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalCand && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={e => { if (e.target === e.currentTarget) setModalId(null) }}>
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-7 w-[500px] max-w-[95vw] max-h-[85vh] overflow-y-auto">
            <div className="font-syne font-bold text-base text-[#f0f0f0] mb-5 pb-3.5 border-b border-[#222]">
              {modalCand.numero} — {modalCand.nome}
            </div>
            <div className="flex gap-4 items-start mb-4">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-[#2a2a2a] flex-shrink-0 bg-[#222] flex items-center justify-center">
                {modalCand.foto_url ? <img src={modalCand.foto_url} className="w-full h-full object-cover" alt="" /> : <span className="text-[10px] text-[#444]">sem foto</span>}
              </div>
              <div>
                <div className="font-syne font-black text-[22px] text-[#f0f0f0] leading-none">{modalCand.numero}</div>
                <div className="text-sm text-[#e8e8e8] mt-1">{modalCand.nome}</div>
                <Badge className="mt-1.5">{modalCand.partido}</Badge>
              </div>
            </div>
            {modalCand.bio && (
              <div className="mb-4">
                <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">Bio</div>
                <div className="text-xs text-[#aaa] leading-relaxed">{modalCand.bio}</div>
              </div>
            )}
            {modalCand.projetos?.length > 0 && (
              <div>
                <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">Projetos de Lei</div>
                {modalCand.projetos.map((p, i) => (
                  <div key={i} className="text-[11px] text-[#aaa] px-3 py-2 bg-[#080808] border border-[#222] rounded mb-1.5 leading-relaxed">{p}</div>
                ))}
              </div>
            )}
            <button onClick={() => setModalId(null)} className="mt-4 btn-ghost btn-sm">Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children, full }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? 'col-span-2' : ''}`}>
      <label className="text-[10px] text-[#555] tracking-widest uppercase">{label}</label>
      {children}
    </div>
  )
}
