import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/input'
import { formatCurrencyMask } from '@/utils/currency'

export function FormStep({
  icon: Icon,
  title,
  question,
  inputProps,
  submitButtonProps,
  hideBackButton,
  onBack,
  onNext,
}) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!inputValue) {
      return
    }

    onNext(inputValue)
  }

  const handleInputChange = (e) => {
    const isCurrency = inputProps?.prefix === 'R$'
    const value = e.target.value
    setInputValue(isCurrency ? formatCurrencyMask(value) : value)
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8">
      <div className="bg-primary mb-4 flex h-15 w-15 items-center justify-center rounded-xl">
        <Icon size={32} className="text-primary-foreground" />
      </div>
      <h2 className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
        {title}
      </h2>
      <h3 className="text-foreground mb-6 text-xl leading-snug font-semibold sm:text-2xl">
        {question}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          {...inputProps}
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          {!hideBackButton && (
            <Button
              type="button"
              variant="ghost"
              className="order-2 flex-1 justify-center rounded-xl py-3 sm:order-1"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="order-1 flex-1 sm:order-2"
            disabled={!inputValue}
          >
            {submitButtonProps?.label ?? 'Próximo'}
            {submitButtonProps?.emojiIcon ?? <ArrowRight size={16} />}
          </Button>
        </div>
      </form>
    </div>
  )
}
