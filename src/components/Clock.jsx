import { useState, useEffect } from 'react'

export default function Clock({ className = '' }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR'))
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('pt-BR')), 1000)
    return () => clearInterval(t)
  }, [])
  return <span className={className}>{time}</span>
}
