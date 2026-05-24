import { useState, useEffect } from 'react'
import { AppProvider, useApp } from './lib/store'
import { useFlash } from './hooks/useFlash'
import { supabase } from './lib/supabase'
import Flash from './components/Flash'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import CadastroPage from './pages/CadastroPage'
import Dashboard from './pages/Dashboard'
import CadastroCandidato from './pages/CadastroCandidato'
import CadastroEleitor from './pages/CadastroEleitor'
import ListaEleitores from './pages/ListaEleitores'
import Resultados from './pages/Resultados'
import Votar from './pages/Votar'
import CpfGen from './pages/CpfGen'

function AppInner() {
  const { state, actions } = useApp()
  const { flash, showFlash } = useFlash()
  const [page, setPage] = useState('votar')
  const [screen, setScreen] = useState('login') // 'login' | 'cadastro' | 'app'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [resC, resE, resV] = await Promise.all([
        supabase.from('candidatos').select('*'),
        supabase.from('eleitores').select('*'),
        supabase.from('votos').select('*')
      ])
      
      if (resC.error || resE.error || resV.error) {
        showFlash('Erro ao carregar dados do banco.', 'err')
      } else {
        actions.setAll({
          candidatos: resC.data,
          eleitores: resE.data,
          votos: resV.data
        })
      }
      setLoading(false)
    }
    loadData()
  }, [])


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080808] text-[#f0f0f0] font-mono text-sm tracking-widest">CARREGANDO DADOS...</div>
  }

  const isLoggedIn = !!state.currentUser

  function handleLogin(nome, role, cpf) {
    actions.setUser(nome, role, cpf)
    setScreen('app')
    setPage(role === 'adm' ? 'dashboard' : 'votar')
  }

  function handleLogout() {
    actions.logout()
    setScreen('login')
    setPage('votar')
  }

  const pageProps = { showFlash }

  if (screen === 'cadastro') {
    return (
      <>
        <Flash flash={flash} />
        <CadastroPage onBack={() => setScreen('login')} showFlash={showFlash} />
      </>
    )
  }

  if (screen === 'login' || !isLoggedIn) {
    return (
      <>
        <Flash flash={flash} />
        <LoginPage
          eleitores={state.eleitores}
          admins={state.admins}
          onLogin={handleLogin}
          onCadastro={() => setScreen('cadastro')}
          showFlash={showFlash}
        />
      </>
    )
  }

  return (
    <>
      <Flash flash={flash} />
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          currentPage={page}
          onNav={setPage}
          role={state.currentRole}
          onLogout={handleLogout}
          userName={state.currentUser}
        />
        <main className="flex-1 overflow-y-auto bg-[#080808]">
          {page === 'dashboard'          && <Dashboard {...pageProps} />}
          {page === 'cadastro-candidato' && <CadastroCandidato {...pageProps} />}
          {page === 'cadastro-eleitor'   && <CadastroEleitor {...pageProps} />}
          {page === 'eleitores'          && <ListaEleitores {...pageProps} />}
          {page === 'resultados'         && <Resultados {...pageProps} />}
          {page === 'votar'              && <Votar {...pageProps} />}
        </main>
      </div>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
