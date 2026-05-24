import { useState, useCallback, useRef } from 'react'

export function useFlash() {
  const [flash, setFlash] = useState(null) // { msg, tipo }
  const timer = useRef(null)

  const showFlash = useCallback((msg, tipo = 'ok') => {
    clearTimeout(timer.current)
    setFlash({ msg, tipo })
    timer.current = setTimeout(() => setFlash(null), 3600)
  }, [])

  return { flash, showFlash }
}
