import { useState } from 'react'
import { useApp } from '../lib/store'
import { supabase } from '../lib/supabase'

export default function CadastroEleitor({ showFlash }) {
  const { actions } = useApp()
  const [form, setForm] = useState({ nome: '', usuario: '', senha: '', nasc: '', titulo: '', zona: '', email: '' })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function limpar() { setForm({ nome: '', usuario: '', senha: '', nasc: '', titulo: '', zona: '', email: '' }) }

  async function cadastrar() {
    const { nome, usuario, senha, nasc, titulo, zona, email } = form
    if (!nome || !usuario || !senha) { showFlash('Nome, Usuário e Senha são obrigatórios.', 'err'); return }
    
    const novoEleitor = {
      nome, usuario, senha,
      nasc: nasc || null,
      titulo: titulo || null,
      zona: zona || null,
      email: email || null,
      votou: false
    }

    const { data, error } = await supabase.from('eleitores').insert([novoEleitor]).select()
    
    if (error) {
      showFlash('Erro ao salvar no banco: ' + error.message, 'err')
      return
    }

    actions.addEleitor(data[0])
    showFlash(`Eleitor "${nome}" cadastrado.`, 'ok')
    limpar()
  }

  const fields = [
    { key: 'nome', label: 'Nome Completo', placeholder: 'Nome do eleitor', full: true, type: 'text' },
    { key: 'usuario', label: 'Usuário', placeholder: 'usuario123', type: 'text' },
    { key: 'senha', label: 'Senha', placeholder: '••••••••', type: 'password' },
    { key: 'nasc', label: 'Data de Nascimento', type: 'date' },
    { key: 'titulo', label: 'Título de Eleitor', placeholder: '0000 0000 0000', type: 'text' },
    { key: 'zona', label: 'Zona Eleitoral', placeholder: '001', type: 'text' },
    { key: 'email', label: 'E-mail', placeholder: 'email@dominio.com', full: true, type: 'email' },
  ]

  return (
    <div className="p-10 max-w-[1100px]">
      <div className="mb-8 pb-5 border-b border-[#222]">
        <h1 className="font-syne font-bold text-2xl text-[#f0f0f0] tracking-tight">Cadastrar Eleitor</h1>
        <p className="text-[11px] text-[#555] mt-1 tracking-wide">Registrar novo eleitor no sistema</p>
      </div>

      <div className="max-w-[540px]">
        <div className="grid grid-cols-2 gap-3.5 mb-4">
          {fields.map(f => (
            <div key={f.key} className={`flex flex-col gap-1.5 ${f.full ? 'col-span-2' : ''}`}>
              <label className="text-[10px] text-[#555] tracking-widest uppercase">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="input"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={cadastrar} className="btn-primary">Cadastrar</button>
          <button onClick={limpar} className="btn-ghost">Limpar</button>
        </div>
      </div>
    </div>
  )
}
