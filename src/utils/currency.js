export function formatCurrencyMask(value) {
  const digits = String(value).replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const number = parseInt(digits, 10) / 100

  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseCurrency(value) {
  if (typeof value === 'number') return value
  if (!value) return 0

  return (
    parseFloat(
      String(value)
        .replace(/\./g, '')
        .replace(',', '.')
        .replace('R$', '')
        .trim(),
    ) || 0
  )
}
