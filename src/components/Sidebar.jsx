import Clock from './Clock'

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-6 py-2.5 text-xs tracking-wide transition-all border-l-2 text-left
      ${active
        ? 'text-[#f0f0f0] border-l-[#f0f0f0] bg-[#161616]'
        : 'text-[#666] border-l-transparent hover:text-[#e8e8e8] hover:bg-[#161616]'
      }`}
  >
    <span className="w-4 text-center text-sm">{icon}</span>
    {label}
  </button>
)

const NavSep = ({ label }) => (
  <div className="px-6 pt-4 pb-1.5 text-[9px] text-[#444] tracking-widest uppercase">{label}</div>
)

export default function Sidebar({ currentPage, onNav, role, onLogout, userName }) {
  return (
    <aside className="w-[220px] min-w-[220px] bg-[#080808] border-r border-[#222] flex flex-col py-7">
      {/* Logo */}
      <div className="px-6 pb-6 border-b border-[#222] mb-4">
        <div className="font-syne font-black text-lg text-[#f0f0f0] tracking-tight">VotoSec</div>
        <div className="text-[10px] text-[#444] tracking-widest uppercase mt-1">Sistema Eleitoral</div>
      </div>

      {/* Admin nav */}
      {role === 'adm' && (
        <nav>
          <NavSep label="Admin" />
          <NavItem icon="◈" label="Dashboard"        active={currentPage === 'dashboard'}           onClick={() => onNav('dashboard')} />
          <NavItem icon="＋" label="Candidatos"       active={currentPage === 'cadastro-candidato'}  onClick={() => onNav('cadastro-candidato')} />
          <NavItem icon="✎" label="Eleitores"        active={currentPage === 'cadastro-eleitor'}    onClick={() => onNav('cadastro-eleitor')} />
          <NavItem icon="≡" label="Lista Eleitores"  active={currentPage === 'eleitores'}           onClick={() => onNav('eleitores')} />
          <NavItem icon="▦" label="Resultados"       active={currentPage === 'resultados'}          onClick={() => onNav('resultados')} />
          <NavSep label="Geral" />
        </nav>
      )}

      <nav>
        <NavItem icon="◎" label="Votar"    active={currentPage === 'votar'}    onClick={() => onNav('votar')} />
        <NavItem icon="⊕" label="Gerar CPF" active={currentPage === 'cpf-gen'} onClick={() => onNav('cpf-gen')} />
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-6 pt-4 border-t border-[#222]">
        <div className="flex items-center gap-1.5 text-[10px] text-green-400 tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          SISTEMA ATIVO
        </div>
        <Clock className="text-[10px] text-[#444] mt-1 block" />
        <button
          onClick={onLogout}
          className="text-[10px] text-[#555] mt-2.5 hover:text-[#e8e8e8] transition-colors"
        >
          → Sair ({userName})
        </button>
      </div>
    </aside>
  )
}
