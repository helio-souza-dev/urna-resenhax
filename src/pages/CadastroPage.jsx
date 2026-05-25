import { useState } from 'react'
import { useApp } from '../lib/store'
import { supabase } from '../lib/supabase'
import Clock from '../components/Clock'

export default function CadastroPage({ onBack, showFlash }) {
  const { state, actions } = useApp()
  const [role, setRole] = useState('eleitor')

  // Eleitor form
  const [nomeE, setNomeE] = useState('')
  const [usuarioE, setUsuarioE] = useState('')
  const [senhaE, setSenhaE] = useState('')
  const [nascE, setNascE] = useState('')
  const [emailE, setEmailE] = useState('')

  async function cadastrarEleitor(e) {
    e?.preventDefault()
    if (!nomeE.trim()) { showFlash('Informe seu nome.', 'err'); return }
    if (!usuarioE.trim()) { showFlash('Informe um usuário.', 'err'); return }
    if (!senhaE || senhaE.length < 4) { showFlash('Senha muito curta.', 'err'); return }
    if (state.eleitores.find(el => el.usuario === usuarioE)) { showFlash('Usuário já cadastrado.', 'err'); return }

    const novoEleitor = { nome: nomeE, usuario: usuarioE, senha: senhaE, nasc: nascE || null, email: emailE || null, titulo: '', zona: '001', votou: false }
    
    const { data, error } = await supabase.from('eleitores').insert([novoEleitor]).select()
    
    if (error) {
      showFlash('Erro ao salvar no banco de dados.', 'err')
      return
    }

    actions.addEleitor(data[0])
    showFlash(`Conta criada com sucesso!`, 'ok')
    onBack()
  }

  function cadastrarAdmin(e) {
    e?.preventDefault()
    if (!nomeA.trim()) { showFlash('Informe seu nome.', 'err'); return }
    if (!senhaA || senhaA.length < 6) { showFlash('Senha deve ter ao menos 6 caracteres.', 'err'); return }
    if (senhaA !== senhaConf) { showFlash('As senhas não coincidem.', 'err'); return }
    if (state.admins.find(a => a.cpf === cpfA)) { showFlash('CPF já cadastrado.', 'err'); return }

    actions.addAdmin({ nome: nomeA, cpf: cpfA, senha: senhaA })
    showFlash(`Conta admin criada! Seu CPF: ${cpfA}`, 'ok')
    onBack()
  }

  const inputCls = "w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3.5 py-2.5 text-[13px] text-[#e8e8e8] font-mono outline-none focus:border-[#333] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)] placeholder-[#444] transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <div className="w-[400px] bg-[#0f0f0f] border border-[#222] rounded-xl p-9">

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="font-syne font-black text-[22px] text-[#f0f0f0] tracking-tight">VotoSec</div>
          <button onClick={onBack} className="text-[11px] text-[#444] hover:text-[#aaa] transition-colors mt-1">← voltar</button>
        </div>
        <div className="text-[10px] text-[#444] tracking-widest uppercase mb-7">Criar conta</div>

        {/* Tabs */}
        

        {/* ── ELEITOR ── */}
        {role === 'eleitor' && (
          <form onSubmit={cadastrarEleitor}>
            <div className="mb-3">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Usuário</label>
              <input
                type="text"
                value={usuarioE}
                onChange={e => setUsuarioE(e.target.value)}
                placeholder="Seu usuário"
                className={inputCls}
              />
            </div>

            <div className="mb-3">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Senha</label>
              <input
                type="password"
                value={senhaE}
                onChange={e => setSenhaE(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            <div className="mb-3">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Nome completo</label>
              <input
                type="text"
                value={nomeE}
                onChange={e => setNomeE(e.target.value)}
                placeholder="Seu nome"
                className={inputCls}
              />
            </div>

            <div className="mb-3">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Data de nascimento</label>
              <input
                type="date"
                value={nascE}
                onChange={e => setNascE(e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="mb-5">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">E-mail (opcional)</label>
              <input
                type="email"
                value={emailE}
                onChange={e => setEmailE(e.target.value)}
                placeholder="email@dominio.com"
                className={inputCls}
              />
            </div>

            <button type="submit" className="w-full bg-[#f0f0f0] text-[#080808] font-mono text-[12px] font-medium tracking-wide py-2.5 rounded-md hover:bg-[#ccc] transition-colors">
              Criar conta de Eleitor
            </button>
          </form>
        )}

        <div className="text-[10px] text-[#444] mt-5 text-center">
          Zona 001 · Seção 0042 · <Clock />
        </div>
      </div>
    </div>
  )
}
