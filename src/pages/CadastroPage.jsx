import { useState } from 'react'
import { gerarCPF } from '../lib/cpf'
import { useApp } from '../lib/store'
import Clock from '../components/Clock'

export default function CadastroPage({ onBack, showFlash }) {
  const { state, actions } = useApp()
  const [role, setRole] = useState('eleitor')

  // Eleitor form
  const [nomeE, setNomeE] = useState('')
  const [cpfE] = useState(() => gerarCPF()) // gerado uma vez, fixo
  const [nascE, setNascE] = useState('')
  const [emailE, setEmailE] = useState('')

  // Admin form
  const [nomeA, setNomeA] = useState('')
  const [cpfA] = useState(() => gerarCPF())
  const [senhaA, setSenhaA] = useState('')
  const [senhaConf, setSenhaConf] = useState('')

  function copiarCPF(cpf) {
    navigator.clipboard.writeText(cpf)
    showFlash('CPF copiado!', 'ok')
  }

  function cadastrarEleitor(e) {
    e?.preventDefault()
    if (!nomeE.trim()) { showFlash('Informe seu nome.', 'err'); return }
    if (state.eleitores.find(el => el.cpf === cpfE)) { showFlash('CPF já cadastrado.', 'err'); return }

    actions.addEleitor({ nome: nomeE, cpf: cpfE, nasc: nascE, email: emailE, titulo: '', zona: '001' })
    showFlash(`Conta criada! Seu CPF de acesso: ${cpfE}`, 'ok')
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
        <div className="flex border border-[#222] rounded-lg overflow-hidden mb-6">
          {[
            { key: 'eleitor', label: 'Eleitor' },
            { key: 'adm',    label: 'Administrador' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setRole(t.key)}
              className={`flex-1 py-2 text-[11px] tracking-widest transition-all
                ${role === t.key ? 'bg-[#161616] text-[#f0f0f0]' : 'text-[#555] hover:text-[#aaa]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── ELEITOR ── */}
        {role === 'eleitor' && (
          <form onSubmit={cadastrarEleitor}>
            {/* CPF gerado */}
            <div className="mb-4 p-3.5 bg-[#161616] border border-[#222] rounded-lg">
              <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">Seu CPF gerado automaticamente</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[15px] text-[#f0f0f0] tracking-widest">{cpfE}</span>
                <button
                  type="button"
                  onClick={() => copiarCPF(cpfE)}
                  className="text-[10px] text-[#555] hover:text-[#aaa] transition-colors border border-[#2a2a2a] rounded px-2 py-1 shrink-0"
                >
                  copiar
                </button>
              </div>
              <div className="text-[10px] text-[#444] mt-2 leading-relaxed">
                ⚠ Guarde esse CPF — você vai precisar dele para votar.
              </div>
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

        {/* ── ADMIN ── */}
        {role === 'adm' && (
          <form onSubmit={cadastrarAdmin}>
            {/* CPF gerado */}
            <div className="mb-4 p-3.5 bg-[#161616] border border-[#222] rounded-lg">
              <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">Seu CPF gerado automaticamente</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[15px] text-[#f0f0f0] tracking-widest">{cpfA}</span>
                <button
                  type="button"
                  onClick={() => copiarCPF(cpfA)}
                  className="text-[10px] text-[#555] hover:text-[#aaa] transition-colors border border-[#2a2a2a] rounded px-2 py-1 shrink-0"
                >
                  copiar
                </button>
              </div>
              <div className="text-[10px] text-[#444] mt-2 leading-relaxed">
                ⚠ Guarde esse CPF — você vai usá-lo junto com sua senha para entrar.
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Nome completo</label>
              <input
                type="text"
                value={nomeA}
                onChange={e => setNomeA(e.target.value)}
                placeholder="Seu nome"
                className={inputCls}
              />
            </div>

            <div className="mb-3">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Senha</label>
              <input
                type="password"
                value={senhaA}
                onChange={e => setSenhaA(e.target.value)}
                placeholder="Mín. 6 caracteres"
                className={inputCls}
              />
            </div>

            <div className="mb-5">
              <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Confirmar senha</label>
              <input
                type="password"
                value={senhaConf}
                onChange={e => setSenhaConf(e.target.value)}
                placeholder="Repita a senha"
                className={inputCls}
              />
            </div>

            <button type="submit" className="w-full bg-[#f0f0f0] text-[#080808] font-mono text-[12px] font-medium tracking-wide py-2.5 rounded-md hover:bg-[#ccc] transition-colors">
              Criar conta de Administrador
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
