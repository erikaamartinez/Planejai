import {
  ArrowRight,
  CheckCircle2,
  Goal,
  PiggyBank,
  PlusCircle,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

const statusStyles = {
  viable: {
    label: 'Meta viável',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  needs_adjustment: {
    label: 'Ajuste necessário',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  unfeasible: {
    label: 'Meta inviável',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export function HistoryPage() {
  const navigate = useNavigate()
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(() => getAllSimulations())
  const [deletedId, setDeletedId] = useState(null)

  const handleDelete = (e, id) => {
    e.stopPropagation()
    const updated = deleteSimulation(id)
    setSimulations(updated)
    setDeletedId(id)
    setTimeout(() => setDeletedId(null), 3000)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-8">
        <div>
          <PageHero
            title="Histórico de Simulações"
            subtitle="Visualize, analise e gerencie todos os seus planejamentos financeiros salvos."
          />
        </div>
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate('/')}
          className="self-start sm:self-auto shrink-0 shadow-lg shadow-primary/20"
        >
          Nova Simulação
        </Button>
      </div>

      {deletedId && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400 border border-green-500/20 transition-all">
          <CheckCircle2 size={18} />
          <span>Simulação excluída com sucesso!</span>
        </div>
      )}

      {simulations.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] border border-border">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-primary mb-4">
            <PiggyBank size={32} />
          </div>
          <h3 className="text-foreground text-xl font-semibold mb-2">
            Nenhuma simulação encontrada
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Você ainda não possui metas ou simulações salvas no histórico. Comece uma nova simulação para receber diagnósticos financeiros com inteligência artificial.
          </p>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => navigate('/')}
          >
            Começar minha primeira simulação
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {simulations.map((item, index) => {
            const savings = calcMonthlySavings(item)
            const status = item.insight?.feasibility?.status
              ? statusStyles[item.insight.feasibility.status]
              : null

            return (
              <div
                key={item.id || index}
                onClick={() => navigate(`/resultado/${item.id}`)}
                className="group bg-card hover:border-primary/50 cursor-pointer rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] transition-all duration-300 border border-border flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl text-primary transition-colors">
                        <Goal size={24} />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-lg leading-tight line-clamp-1">
                          {item.goalName || 'Meta sem nome'}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          Prazo: {item.goalDeadline} meses
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Excluir simulação"
                      onClick={(e) => handleDelete(e, item.id)}
                      className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors cursor-pointer"
                      title="Excluir do histórico"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {status && (
                    <div className="mb-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-border mb-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Custo da Meta:</span>
                      <span className="font-semibold text-foreground text-sm">{item.goalAmount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Economia Mensal:</span>
                      <span className="font-semibold text-primary text-sm">
                        {savings.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Renda Mensal:</span>
                      <span className="text-foreground font-medium">{item.income}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Custos + Dívidas:</span>
                      <span className="text-foreground font-medium">
                        {item.expenses} / {item.debts}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Ver detalhes e insights</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
