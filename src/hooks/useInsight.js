import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getInsight } from '@/services/aiService'

export const useInsight = (id) => {
  const isRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [insight, setInsight] = useState(() => {
    const simulation = getFormData(id)
    if (simulation?.insight) {
      return simulation.insight
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchInsight = useCallback(
    async (simulationId) => {
      const simulation = getFormData(simulationId)
      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        setInsight(data)
        if (updateSimulation) {
          updateSimulation(simulationId, { ...simulation, insight: data })
        }
        return data
      } catch (err) {
        console.error('Erro ao gerar insight:', err)
        setError(err.message || 'Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  useEffect(() => {
    if (insight || isLoading || isRequestPending.current || error) {
      return
    }

    if (id) {
      fetchInsight(id).then((data) => {
        isRequestPending.current = false
        if (!data) {
          return
        }
        setInsight(data)
      })
    }
  }, [id, insight, isLoading, error, fetchInsight])

  return { insight, isLoading, error, fetchInsight }
}
