import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { simulationFormSteps } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

import { FormStep } from './FormStep'
import { StepProgress } from './Progress'

export const SimulationForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const { saveFormData } = useSimulationStorage()
  const navigate = useNavigate()

  const totalSteps = simulationFormSteps.length
  const currentStep = simulationFormSteps[currentStepIndex]

  const handleNextStep = (value) => {
    const updatedFormData = { ...formData, [currentStep.id]: value }
    setFormData(updatedFormData)

    if (currentStepIndex + 1 > totalSteps - 1) {
      const id = saveFormData(updatedFormData)
      navigate(`/resultado/${id}`)
      return
    }

    setCurrentStepIndex((prev) => prev + 1)
  }

  const handlePreviousStep = () => {
    if (currentStepIndex === 0) {
      return
    }

    setCurrentStepIndex((prev) => prev - 1)
  }

  return (
    <>
      <StepProgress
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
      />
      <FormStep
        {...currentStep}
        key={currentStep.id}
        hideBackButton={currentStepIndex === 0}
        onBack={handlePreviousStep}
        onNext={handleNextStep}
      />
    </>
  )
}
