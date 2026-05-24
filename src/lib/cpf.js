function gerarDigito(arr) {
  const soma = arr.reduce((acc, v, i) => acc + v * (arr.length + 1 - i), 0)
  const r = soma % 11
  return r < 2 ? 0 : 11 - r
}

export function gerarCPF() {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))
  const d1 = gerarDigito(n)
  const d2 = gerarDigito([...n, d1])
  const cpf = [...n, d1, d2]
  return `${cpf.slice(0, 3).join('')}.${cpf.slice(3, 6).join('')}.${cpf.slice(6, 9).join('')}-${cpf.slice(9).join('')}`
}

export function gerarCPFs(qtd = 10) {
  return Array.from({ length: Math.min(50, Math.max(1, qtd)) }, () => gerarCPF())
}
