const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY || '')

// Lista de modelos compatíveis em ordem de preferência (com fallback automático se um estiver sobrecarregado)
const FALLBACK_MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const callGeminiWithModel = async (modelName, contents) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMsg = errorData?.error?.message || `Erro HTTP ${response.status}`
    const isOverloaded =
      response.status === 503 ||
      response.status === 429 ||
      errorMsg.toLowerCase().includes('high demand') ||
      errorMsg.toLowerCase().includes('overloaded') ||
      errorMsg.toLowerCase().includes('resource exhausted')

    const error = new Error(errorMsg)
    error.isOverloaded = isOverloaded
    error.status = response.status
    throw error
  }

  return await response.json()
}

const callGeminiWithFallback = async (contents) => {
  if (!API_KEY || API_KEY === 'sua_chave_aqui') {
    throw new Error(
      'Chave de API do Gemini (VITE_GEMINI_API_KEY) não configurada no arquivo .env.local.',
    )
  }

  let lastError = null

  for (const model of FALLBACK_MODELS) {
    try {
      return await callGeminiWithModel(model, contents)
    } catch (err) {
      lastError = err
      if (err.isOverloaded) {
        // Se o modelo estiver com alta demanda momentânea, tenta o próximo modelo após uma breve pausa
        await delay(800)
        continue
      }
      // Se não for sobrecarga (ex: prompt inválido), propaga o erro
      throw err
    }
  }

  throw (
    lastError ||
    new Error('Não foi possível se conectar aos servidores do Google Gemini.')
  )
}

export const getInsight = async (prompt) => {
  const contents = [{ parts: [{ text: prompt }] }]
  const response = await callGeminiWithFallback(contents)
  let text = response?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Nenhum diagnóstico retornado pela IA.')
  }

  // Remove formatação de código caso o modelo retorne ```json ... ```
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim()

  return JSON.parse(text)
}

export const askEducatorQuestion = async (simulation, history, newQuestion) => {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation || {}

  const systemContext = `Você é o Educador Financeiro do app Planej.ai. 
Você é empático, didático e especialista em finanças pessoais.
O usuário realizou uma simulação com os seguintes dados:
- Renda mensal: ${income}
- Custos fixos essenciais: ${expenses}
- Dívidas / parcelas: ${debts}
- Meta: ${goalName}
- Custo da meta: ${goalAmount}
- Prazo: ${goalDeadline} meses

Diretrizes:
- Fale em português do Brasil em tom encorajador e consultivo.
- Dê orientações práticas, realistas e fáceis de aplicar no dia a dia.
- Mantenha as respostas concisas e agradáveis de ler.`

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `${systemContext}\n\nOlá, gostaria de tirar algumas dúvidas sobre a minha simulação financeira.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'Olá! Estou aqui para te ajudar a entender cada detalhe do seu planejamento e tirar qualquer dúvida. Como posso te orientar hoje?',
        },
      ],
    },
    ...(history || []).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: newQuestion }],
    },
  ]

  const response = await callGeminiWithFallback(contents)
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Não foi possível obter resposta da IA.')
  }

  return text
}
