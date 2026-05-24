import { createContext, useContext, useReducer, useCallback } from 'react'

const AppContext = createContext(null)

const initialState = {
  candidatos: [],
  eleitores: [],
  votos: [],
  currentUser: null,
  currentRole: null,
  idC: 1,
  idE: 1,
  idV: 1,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.user, currentRole: action.role }
    case 'LOGOUT':
      return { ...state, currentUser: null, currentRole: null }

    case 'ADD_CANDIDATO':
      return { ...state, candidatos: [...state.candidatos, { ...action.payload, id: state.idC }], idC: state.idC + 1 }
    case 'REMOVE_CANDIDATO':
      return { ...state, candidatos: state.candidatos.filter(c => c.id !== action.id) }

    case 'ADD_ELEITOR':
      return { ...state, eleitores: [...state.eleitores, { ...action.payload, id: state.idE, votou: false }], idE: state.idE + 1 }
    case 'REMOVE_ELEITOR':
      return { ...state, eleitores: state.eleitores.filter(e => e.id !== action.id) }
    case 'MARK_VOTED':
      return { ...state, eleitores: state.eleitores.map(e => e.id === action.id ? { ...e, votou: true } : e) }

    case 'ADD_VOTO':
      return { ...state, votos: [...state.votos, { ...action.payload, id: state.idV }], idV: state.idV + 1 }
    case 'CLEAR_ELEITORES_VOTOS':
      return { ...state, eleitores: [], votos: [] }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const actions = {
    setUser: useCallback((user, role) => dispatch({ type: 'SET_USER', user, role }), []),
    logout: useCallback(() => dispatch({ type: 'LOGOUT' }), []),
    addCandidato: useCallback((payload) => dispatch({ type: 'ADD_CANDIDATO', payload }), []),
    removeCandidato: useCallback((id) => dispatch({ type: 'REMOVE_CANDIDATO', id }), []),
    addEleitor: useCallback((payload) => dispatch({ type: 'ADD_ELEITOR', payload }), []),
    removeEleitor: useCallback((id) => dispatch({ type: 'REMOVE_ELEITOR', id }), []),
    markVoted: useCallback((id) => dispatch({ type: 'MARK_VOTED', id }), []),
    addVoto: useCallback((payload) => dispatch({ type: 'ADD_VOTO', payload }), []),
    clearEleitoresVotos: useCallback(() => dispatch({ type: 'CLEAR_ELEITORES_VOTOS' }), []),
  }

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
