import { parseCurrency } from './currency'

export function calcMonthlySavings(data) {
  if (!data) return 0

  return (
    parseCurrency(data.income) -
    parseCurrency(data.expenses) -
    parseCurrency(data.debts)
  )
}
