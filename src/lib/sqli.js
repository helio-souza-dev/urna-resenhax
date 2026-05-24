export function simularQueryCPF(cpfInput, eleitores) {
  const query = `SELECT * FROM eleitores WHERE cpf = '${cpfInput}'`
  const lower = cpfInput.toLowerCase()

  let tipo = null
  if (lower.match(/'?\s*or\s*'?1'?\s*=\s*'?1/i) || lower.includes("' or '1'='1")) tipo = 'bypass'
  else if (lower.includes('union select') || lower.includes('union all select')) tipo = 'union'
  else if (lower.includes('drop table') || lower.includes('delete from') || lower.includes('truncate')) tipo = 'destrutivo'
  else if (lower.includes('--') || lower.includes('/*') || lower.includes('#')) tipo = 'comentario'

  if (tipo) return { injetado: true, tipo, query }

  return {
    injetado: false,
    query,
    eleitor: eleitores.find(e => e.cpf === cpfInput),
  }
}

export function getInjecaoMsg(tipo, eleitores) {
  switch (tipo) {
    case 'bypass':
      return {
        log: `INJECTION: OR bypass — ${eleitores.length} registros expostos`,
        flash: `⚠ SQL Injection: OR bypass\n${eleitores.length} eleitor(es) expostos:\n` + eleitores.map(e => `${e.nome} | ${e.cpf}`).join('\n'),
        destrutivo: false,
      }
    case 'union':
      return {
        log: `INJECTION: UNION SELECT — dump da tabela eleitores`,
        flash: `⚠ SQL Injection: UNION SELECT\nDump: ${eleitores.length} registros`,
        destrutivo: false,
      }
    case 'destrutivo':
      return {
        log: `INJECTION: DROP/DELETE — tabelas apagadas`,
        flash: `💀 Injeção destrutiva! Dados apagados.`,
        destrutivo: true,
      }
    case 'comentario':
      return {
        log: `INJECTION: comentário SQL — WHERE bypassado`,
        flash: `⚠ Comentário SQL: filtro ignorado`,
        destrutivo: false,
      }
    default:
      return { log: '', flash: '', destrutivo: false }
  }
}
