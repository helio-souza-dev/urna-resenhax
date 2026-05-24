import { useState } from 'react'
import { AppProvider, useApp } from './lib/store'
import { useFlash } from './hooks/useFlash'
import Flash from './components/Flash'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
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

  const isLoggedIn = !!state.currentUser

  function handleLogin(nome, role) {
    actions.setUser(nome, role)
    setPage(role === 'adm' ? 'dashboard' : 'votar')
  }

  function handleLogout() {
    actions.logout()
    setPage('votar')
  }

  const pageProps = { showFlash }

  return (
    <>
      <Flash flash={flash} />
      {!isLoggedIn ? (
        <LoginPage eleitores={state.eleitores} onLogin={handleLogin} showFlash={showFlash} />
      ) : (
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
            {page === 'cpf-gen'            && <CpfGen {...pageProps} />}
          </main>
        </div>
      )}
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
