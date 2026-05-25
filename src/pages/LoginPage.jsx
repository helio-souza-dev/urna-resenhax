import { useState } from 'react'
import Clock from '../components/Clock'

export default function LoginPage({ eleitores, admins, onLogin, onCadastro, showFlash }) {
  const [role, setRole] = useState('eleitor')
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')

  function handleLogin(e) {
    e?.preventDefault()
    if (!usuario.trim()) { showFlash('Informe o Usuário.', 'err'); return }
    if (!senha.trim()) { showFlash('Informe a Senha.', 'err'); return }

    if (role === 'adm') {
      const adm = admins.find(a => a.usuario === usuario && a.senha === senha)
      if (!adm) { showFlash('Credenciais inválidas.', 'err'); return }
      onLogin(adm.nome, 'adm', adm.usuario)
    } else {
      const el = eleitores.find(e => e.usuario === usuario && e.senha === senha)
      if (!el) { showFlash('Usuário ou senha incorretos.', 'err'); return }
      onLogin(el.nome, 'eleitor', el.usuario)
    }
  }

  const inputCls = "w-full bg-[#161616] border border-[#2a2a2a] rounded-md px-3.5 py-2.5 text-[13px] text-[#e8e8e8] font-mono outline-none focus:border-[#333] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)] placeholder-[#444] transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <div className="w-[360px] bg-[#0f0f0f] border border-[#222] rounded-xl p-9">
        <div className="font-syne font-black text-[22px] text-[#f0f0f0] mb-1 tracking-tight">VotoSec</div>
        <div className="text-[10px] text-[#444] tracking-widest uppercase mb-7">Sistema Eleitoral</div>

        {/* Tabs */}
        <div className="flex border border-[#222] rounded-lg overflow-hidden mb-6">
          {['eleitor', 'adm'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-[11px] tracking-widest transition-all
                ${role === r ? 'bg-[#161616] text-[#f0f0f0]' : 'text-[#555] hover:text-[#aaa]'}`}
            >
              {r === 'eleitor' ? 'Eleitor' : 'Administrador'}
            </button>
          ))}
        </div>

        {/* Role info */}
        <div className="text-[10px] text-[#444] mb-4 p-3 bg-[#161616] rounded-md border border-[#222] leading-relaxed">
          {role === 'adm'
            ? 'Acesso administrativo. Usuário e senha de administrador.'
            : 'Acesso à cabine de votação. Informe seu usuário e senha.'}
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              className={inputCls}
            />
          </div>

          <div className="mb-4">
            <label className="block text-[10px] text-[#555] tracking-widest uppercase mb-1.5">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-1 bg-[#f0f0f0] text-[#080808] font-mono text-[12px] font-medium tracking-wide py-2.5 rounded-md hover:bg-[#ccc] transition-colors"
          >
            Entrar
          </button>
        </form>

        {/* Link criar conta */}
        <div className="mt-3">
          <button
            onClick={onCadastro}
            className="w-full bg-white/5 border border-[#2a2a2a] text-[#e8e8e8] font-mono text-[12px] tracking-wide py-2.5 rounded-md hover:bg-white/10 hover:border-[#444] transition-all"
          >
            Não tem conta? → Criar conta
          </button>
        </div>

        <div className="text-[10px] text-[#444] mt-3 text-center">
          Zona 001 · Seção 0042 · <Clock />
        </div>
      </div>
    </div>
  )
}
