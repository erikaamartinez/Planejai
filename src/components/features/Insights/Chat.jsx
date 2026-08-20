import { AlertCircle, Bot, Loader2, Send, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { askEducatorQuestion } from '@/services/aiService'

export function Chat({ simulationId }) {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const [simulation, setSimulation] = useState(() => getFormData(simulationId))
  const [messages, setMessages] = useState(() => simulation?.messages || [])
  const [inputQuestion, setInputQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const question = inputQuestion.trim()
    if (!question || isLoading) return

    const currentSimulation = getFormData(simulationId)
    const userMsg = { id: crypto.randomUUID(), role: 'user', text: question, timestamp: new Date().toISOString() }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    setInputQuestion('')
    setIsLoading(true)
    setError(null)

    try {
      const aiReplyText = await askEducatorQuestion(
        currentSimulation,
        messages,
        question,
      )

      const aiMsg = {
        id: crypto.randomUUID(),
        role: 'model',
        text: aiReplyText,
        timestamp: new Date().toISOString(),
      }

      const finalMessages = [...updatedMessages, aiMsg]
      setMessages(finalMessages)

      // Salva todo o histórico da conversa no localStorage
      updateSimulation(simulationId, {
        ...currentSimulation,
        messages: finalMessages,
      })
      setSimulation({ ...currentSimulation, messages: finalMessages })
    } catch (err) {
      console.error('Erro no chat com educador:', err)
      setError(err.message || 'Erro ao obter resposta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-foreground text-sm font-semibold">
              Converse com o Educador Financeiro
            </h4>
            <p className="text-muted-foreground text-xs">
              Tire dúvidas ou peça dicas sobre o seu planejamento
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <span className="text-xs text-muted-foreground bg-secondary-button px-2.5 py-1 rounded-full border border-border">
            {messages.length} {messages.length === 1 ? 'mensagem' : 'mensagens'}
          </span>
        )}
      </div>

      {/* Histórico de Mensagens */}
      {messages.length > 0 && (
        <div className="mb-4 max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin [scrollbar-color:var(--border)_transparent]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-1">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-secondary-button text-foreground border border-border rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <div className="bg-secondary-button text-muted-foreground border border-border flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-1">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {/* Feedback de carregamento */}
          {isLoading && (
            <div className="flex items-center gap-2.5 justify-start">
              <div className="bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full animate-pulse">
                <Bot size={14} />
              </div>
              <div className="bg-secondary-button border border-border rounded-2xl rounded-tl-none px-4 py-3 text-xs text-muted-foreground flex items-center gap-2 shadow-sm">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span>O Educador Financeiro está pensando na resposta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Formulário de Pergunta */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ex: Como posso economizar mais rápido para essa meta?"
          disabled={isLoading}
          className="bg-input text-foreground placeholder:text-muted-foreground flex-1 rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          className="bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-md shadow-primary/20"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Perguntar</span>
              <Send size={15} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
