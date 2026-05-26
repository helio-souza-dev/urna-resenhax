import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

const AppContext = createContext(null)

const savedUser = JSON.parse(localStorage.getItem('votosec_user') || 'null')

const initialState = {
  candidatos: [],
  eleitores: [],
  votos: [],
  admins: [
    { id: 1, usuario: 'admin', senha: '123', nome: 'Administrador' },
    { id: 2, usuario: 'super', senha: '123', nome: 'Supervisor' },
  ],
  currentUser: savedUser?.nome || null,
  currentRole: savedUser?.role || null,
  currentUsuario: savedUser?.usuario || null,
  idC: 1,
  idE: 1,
  idV: 1,
  idA: 3,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.user, currentRole: action.role, currentUsuario: action.usuario ?? null }
    case 'LOGOUT':
      return { ...state, currentUser: null, currentRole: null, currentUsuario: null }

    case 'ADD_ADMIN':
      return { ...state, admins: [...state.admins, { ...action.payload, id: state.idA }], idA: state.idA + 1 }

    case 'ADD_CANDIDATO':
      return { ...state, candidatos: [...state.candidatos, action.payload] }
    case 'REMOVE_CANDIDATO':
      return { ...state, candidatos: state.candidatos.filter(c => c.id !== action.id) }

    case 'ADD_ELEITOR':
      return { ...state, eleitores: [...state.eleitores, action.payload] }
    case 'REMOVE_ELEITOR':
      return { ...state, eleitores: state.eleitores.filter(e => e.id !== action.id) }
    case 'MARK_VOTED':
      return { ...state, eleitores: state.eleitores.map(e => e.id === action.id ? { ...e, votou: true } : e) }

    case 'SET_ALL':
      return { ...state, eleitores: action.payload.eleitores, candidatos: action.payload.candidatos, votos: action.payload.votos }

    case 'ADD_VOTO':
      return { ...state, votos: [...state.votos, action.payload] }
    case 'RESET_VOTACAO':
      return { ...state, votos: [], eleitores: state.eleitores.map(e => ({...e, votou: false})) }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('votosec_user', JSON.stringify({
        nome: state.currentUser,
        role: state.currentRole,
        usuario: state.currentUsuario
      }))
    } else {
      localStorage.removeItem('votosec_user')
    }
  }, [state.currentUser, state.currentRole, state.currentUsuario])

  const actions = {
    setUser: useCallback((user, role, usuario) => dispatch({ type: 'SET_USER', user, role, usuario }), []),
    logout: useCallback(() => dispatch({ type: 'LOGOUT' }), []),
    addAdmin: useCallback((payload) => dispatch({ type: 'ADD_ADMIN', payload }), []),
    addCandidato: useCallback((payload) => dispatch({ type: 'ADD_CANDIDATO', payload }), []),
    removeCandidato: useCallback((id) => dispatch({ type: 'REMOVE_CANDIDATO', id }), []),
    addEleitor: useCallback((payload) => dispatch({ type: 'ADD_ELEITOR', payload }), []),
    removeEleitor: useCallback((id) => dispatch({ type: 'REMOVE_ELEITOR', id }), []),
    markVoted: useCallback((id) => dispatch({ type: 'MARK_VOTED', id }), []),
    addVoto: useCallback((payload) => dispatch({ type: 'ADD_VOTO', payload }), []),
    resetVotacao: useCallback(() => dispatch({ type: 'RESET_VOTACAO' }), []),
    setAll: useCallback((payload) => dispatch({ type: 'SET_ALL', payload }), []),
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
