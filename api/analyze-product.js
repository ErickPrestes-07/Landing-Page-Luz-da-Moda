/**
 * Analisa foto de produto com visão computacional (OpenAI).
 * Configure OPENAI_API_KEY nas variáveis de ambiente do projeto na Vercel.
 */
const ALLOWED = new Set(['blusas', 'camisas', 'calcas', 'conjuntos', 'vestidos'])

function normalizePayload(parsed) {
  let category = String(parsed.category || 'blusas').toLowerCase().trim()
  if (!ALLOWED.has(category)) category = 'blusas'

  let sizes = parsed.sizes
  if (!Array.isArray(sizes)) sizes = ['P', 'M', 'G']
  sizes = sizes.map((s) => String(s).trim().toUpperCase()).filter(Boolean)
  if (!sizes.length) sizes = ['P', 'M', 'G']

  let price = String(parsed.price || 'R$ 99,90').trim()
  if (!/^R\$\s*[\d.,]+/.test(price)) price = 'R$ 99,90'

  return {
    name: String(parsed.name || 'Produto').slice(0, 120),
    category,
    description: String(parsed.description || '').slice(0, 1200),
    price,
    sizes
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(503).json({
      error: 'Servidor sem OPENAI_API_KEY. Adicione a chave nas variáveis de ambiente da Vercel (Settings → Environment Variables).'
    })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      res.status(400).json({ error: 'JSON inválido' })
      return
    }
  }

  const { imageBase64, mimeType } = body || {}
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'Envie imageBase64 (base64 da imagem).' })
    return
  }

  const mime = typeof mimeType === 'string' && mimeType.startsWith('image/') ? mimeType : 'image/jpeg'
  const dataUrl = `data:${mime};base64,${imageBase64.replace(/^data:image\/\w+;base64,/, '')}`

  const system = `Você é assistente da loja de moda feminina "Luz da Moda" (Dois Vizinhos, PR).
Analise a foto de uma peça de roupa ou conjunto e responda APENAS um objeto JSON válido (sem markdown), com as chaves:
"name": nome curto comercial em português do Brasil,
"category": exatamente uma destas strings: blusas, camisas, calcas, conjuntos, vestidos,
"description": de 2 a 4 frases em português, tom acolhedor, destacando cor/corte/tecidos quando visível,
"price": preço sugerido no formato "R$ XX,XX" (valores típicos de loja de bairro no Brasil, entre R$ 49 e R$ 299),
"sizes": array de letras, exemplo ["P","M","G"] — sugira tamanhos que normalmente existem para esse tipo de peça.

Se a imagem não for roupa, ainda assim monte um JSON plausível e indique na description que o vendedor deve conferir.`

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 700,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identifique o produto e preencha o JSON conforme instruções.'
              },
              {
                type: 'image_url',
                image_url: { url: dataUrl, detail: 'low' }
              }
            ]
          }
        ]
      })
    })

    if (!openaiRes.ok) {
      const errText = await openaiRes.text()
      console.error('OpenAI error', openaiRes.status, errText)
      res.status(502).json({
        error: 'Falha na API de IA. Verifique créditos/chave OpenAI.',
        detail: errText.slice(0, 200)
      })
      return
    }

    const data = await openaiRes.json()
    const raw = data?.choices?.[0]?.message?.content
    if (!raw) {
      res.status(502).json({ error: 'Resposta vazia da IA.' })
      return
    }

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      res.status(502).json({ error: 'IA não retornou JSON válido.' })
      return
    }

    res.status(200).json({ ok: true, product: normalizePayload(parsed) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erro interno ao analisar imagem.' })
  }
}
