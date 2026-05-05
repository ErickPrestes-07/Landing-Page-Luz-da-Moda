import './style.css'

const whatsappNumber = '5546999161642'
const whatsappLink = `https://wa.me/${whatsappNumber}`

const defaultProducts = [
  {
    id: 'conjunto-floral',
    category: 'conjuntos',
    image: '/images/piece-conjunto1.jpg',
    name: 'Conjunto Floral Premium',
    price: 'R$ 179,90',
    description: 'Conjunto leve com estampa floral e acabamento elegante. Ideal para trabalho e eventos sociais.',
    sizes: ['P', 'M', 'G']
  },
  {
    id: 'blusa-rosa',
    category: 'blusas',
    image: '/images/piece-blusa.jpg',
    name: 'Blusa Feminina Rosa',
    price: 'R$ 89,90',
    description: 'Blusa moderna em tecido leve, com detalhe em mangas amplas e caimento sofisticado.',
    sizes: ['P', 'M', 'G']
  },
  {
    id: 'camisa-branca',
    category: 'camisas',
    image: '/images/piece-camisa.jpg',
    name: 'Camisa Branca Casual',
    price: 'R$ 109,90',
    description: 'Camisa clássica com modelagem solta, perfeita para looks chiques e confortáveis.',
    sizes: ['P', 'M']
  },
  {
    id: 'calca-marrom',
    category: 'calcas',
    image: '/images/piece-calca.jpg',
    name: 'Calça Marrom Alfaiataria',
    price: 'R$ 129,90',
    description: 'Calça de alfaiataria com corte reto, ótima para combinar com blusas e jaquetas.',
    sizes: ['P', 'M', 'G']
  },
  {
    id: 'bermuda-casual',
    category: 'calcas',
    image: '/images/piece-bermuda.jpg',
    name: 'Bermuda Casual Marrom',
    price: 'R$ 99,90',
    description: 'Bermuda confortável com elastano, perfeita para produções modernas do dia a dia.',
    sizes: ['M']
  },
  {
    id: 'conjunto-terra',
    category: 'conjuntos',
    image: '/images/piece-conjunto2.jpg',
    name: 'Conjunto Terra',
    price: 'R$ 189,90',
    description: 'Conjunto em tons terrosos, ideal para várias ocasiões com muito estilo e conforto.',
    sizes: ['P', 'M']
  }
]

function loadStoredProducts() {
  try {
    const raw = localStorage.getItem('luzDaModaProducts')
    if (!raw) return defaultProducts
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : defaultProducts
  } catch {
    return defaultProducts
  }
}

let products = loadStoredProducts()

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

async function compressImageToJpeg(file, maxWidth = 1280, quality = 0.82) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / bitmap.width)
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  )
  if (!blob) throw new Error('Não foi possível processar a imagem.')
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(new Error('Leitura da imagem falhou.'))
    r.readAsDataURL(blob)
  })
  const base64 = String(dataUrl).split(',')[1] || ''
  return { base64, mimeType: 'image/jpeg', dataUrl: String(dataUrl) }
}

function updateImagePickerHints() {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const label = coarse
    ? 'Escolher da galeria ou fotos…'
    : 'Escolher arquivo no explorador…'
  document.querySelectorAll('[data-picker-hint]').forEach((node) => {
    node.textContent = label
  })
}

document.addEventListener('change', async (e) => {
  const el = e.target
  if (!(el instanceof HTMLInputElement) || !el.hasAttribute('data-image-file')) return
  const file = el.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem.')
    el.value = ''
    return
  }
  const index = parseInt(el.dataset.index ?? '', 10)
  if (Number.isNaN(index)) return
  const row = document.getElementById(`admin-product-${index}`)
  const urlInput = row?.querySelector('[data-field="image"]')
  if (!urlInput) return
  try {
    urlInput.value = (await compressImageToJpeg(file)).dataUrl
  } catch (err) {
    alert(err.message || 'Erro ao processar a imagem.')
  }
  el.value = ''
})

let pickerHintMediaBound = false

// Verificar se é modo admin
if (window.location.search.includes('admin')) {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
  if (isLoggedIn) {
    renderAdminInterface()
  } else {
    renderLoginInterface()
  }
} else {
  renderLandingPage()
}

function renderLandingPage() {
  const productCards = products.map(product => `
    <article class="product" data-category="${escapeAttr(product.category)}">
      <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" />
      <div class="product-body">
        <h3>${escapeHtml(product.name)}</h3>
        <p class="price">${escapeHtml(product.price)}</p>
        <p class="product-desc">${escapeHtml(product.description)}</p>
        <p class="sizes"><strong>Tamanhos:</strong> ${escapeHtml(product.sizes.join(', '))}</p>
      </div>
    </article>
  `).join('')

  const app = document.querySelector('#app')
  app.innerHTML = `
    <header class="hero">
      <div class="hero-content">
        <span class="eyebrow">Luz da Moda</span>
        <h1>Moda feminina com estilo e atendimento local</h1>
        <p>Peças selecionadas para você, com entrega condicional em Dois Vizinhos e região.</p>
        <div class="hero-actions">
          <a href="${whatsappLink}" class="cta-button">Peça pelo WhatsApp</a>
          <a href="#catalog" class="secondary-button">Ver catálogo</a>
        </div>
        <p class="hero-note">Entregas condicionais sob consulta. Retirada em loja e atendimento rápido pelo WhatsApp.</p>
      </div>
      <div class="hero-image-wrap">
        <img src="/images/piece-blusa.jpg" alt="Peças femininas da Luz da Moda" class="hero-image" />
      </div>
    </header>

    <section class="location">
      <div>
        <h2>Localização da loja</h2>
        <p>Centro de Dois Vizinhos - PR</p>
        <p>Atendimento presencial e retirada na loja. Agende sua visita pelo WhatsApp.</p>
      </div>
    </section>

    <section id="catalog" class="catalog">
      <div class="catalog-header">
        <h2>Catálogo por peça</h2>
        <p>Escolha sua peça ideal e confira tamanhos, descrição e valores.</p>
      </div>
      <div class="filters">
        <button class="filter-btn active" data-category="all">Todos</button>
        <button class="filter-btn" data-category="vestidos">Vestidos</button>
        <button class="filter-btn" data-category="blusas">Blusas</button>
        <button class="filter-btn" data-category="camisas">Camisas</button>
        <button class="filter-btn" data-category="calcas">Calças</button>
        <button class="filter-btn" data-category="conjuntos">Conjuntos</button>
      </div>
      <div class="products">
        ${productCards}
      </div>
    </section>

    <section class="testimonials">
      <h2>O que nossas clientes falam</h2>
      <div class="testimonial-grid">
        <article class="testimonial-card">
          <p>"Amei a qualidade e o atendimento da Luz da Moda. Entrega rápida e de confiança."</p>
          <cite>- Juliana, Dois Vizinhos</cite>
        </article>
        <article class="testimonial-card">
          <p>"Peças lindas e ótimo caimento. Recomendo para quem busca moda elegante e confortável."</p>
          <cite>- Camila, PR</cite>
        </article>
      </div>
    </section>

    <section class="contact">
      <div class="contact-info-panel">
        <h2>Entre em contato</h2>
        <p>Peça pelo WhatsApp ou preencha o formulário para atendimento personalizado.</p>
        <p><strong>WhatsApp:</strong> (46) 99916-1642</p>
        <p><strong>Instagram:</strong> @lusdamodastore</p>
      </div>
      <form id="contact-form" class="contact-form">
        <div class="field">
          <label for="contact-name">Nome <span class="req" aria-hidden="true">*</span></label>
          <input type="text" id="contact-name" name="name" placeholder="Digite seu nome" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="contact-email">E-mail <span class="req" aria-hidden="true">*</span></label>
          <input type="email" id="contact-email" name="email" placeholder="seu@email.com" autocomplete="email" inputmode="email" required>
        </div>
        <div class="field">
          <label for="contact-message">Mensagem <span class="req" aria-hidden="true">*</span></label>
          <textarea id="contact-message" name="message" placeholder="Como podemos ajudar?" rows="5" autocomplete="off" required></textarea>
        </div>
        <button type="submit">Enviar mensagem</button>
      </form>
    </section>

    <footer class="footer">
      <div>
        <p>Luz da Moda - Centro, Dois Vizinhos, PR</p>
        <p>Entrega condicional e agendamento via WhatsApp.</p>
      </div>
      <div class="social-links">
        <a href="https://instagram.com/lusdamodastore">Instagram</a>
        <a href="${whatsappLink}">WhatsApp</a>
      </div>
    </footer>

    <a href="${whatsappLink}" class="whatsapp-float" aria-label="Ir para WhatsApp">💬</a>
  `

  const filterButtons = document.querySelectorAll('.filter-btn')
  const productCardsElements = document.querySelectorAll('.product')

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category
      filterButtons.forEach(btn => btn.classList.remove('active'))
      button.classList.add('active')

      productCardsElements.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
          product.style.display = 'grid'
        } else {
          product.style.display = 'none'
        }
      })
    })
  })

  const contactForm = document.getElementById('contact-form')
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(contactForm)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()
    if (!name || !email || !message) return
    const whatsappMessage = `Olá, meu nome é ${name}. E-mail: ${email}. Mensagem: ${message}`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  })
}

function renderLoginInterface() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="login-container">
      <div class="login-form">
        <h1>Painel Administrativo</h1>
        <p>Luz da Moda - Acesso Restrito</p>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Usuário:</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Senha:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="login-btn">Entrar</button>
        </form>
        <button id="back-to-site" class="back-btn">Voltar ao Site</button>
      </div>
    </div>
  `

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    if (username === 'Admin' && password === 'Admin') {
      localStorage.setItem('adminLoggedIn', 'true')
      renderAdminInterface()
    } else {
      alert('Usuário ou senha incorretos!')
    }
  })

  document.getElementById('back-to-site').addEventListener('click', () => {
    window.location.search = ''
  })
}

function renderAdminInterface() {
  const app = document.querySelector('#app')
  const activeTab = sessionStorage.getItem('adminTab') || 'list'

  const productRows = products.map((product, index) => `
          <div class="admin-product" data-index="${index}" id="admin-product-${index}">
            <div class="admin-product-header">
              <h3>${escapeHtml(product.name)}</h3>
              <button type="button" class="delete-product" data-index="${index}" id="delete-${index}">Excluir</button>
            </div>
            <div class="admin-product-form">
              <label>Nome: <input type="text" value="${escapeAttr(product.name)}" data-field="name"></label>
              <label>Categoria:
                <select data-field="category">
                  <option value="blusas" ${product.category === 'blusas' ? 'selected' : ''}>Blusas</option>
                  <option value="camisas" ${product.category === 'camisas' ? 'selected' : ''}>Camisas</option>
                  <option value="calcas" ${product.category === 'calcas' ? 'selected' : ''}>Calças</option>
                  <option value="conjuntos" ${product.category === 'conjuntos' ? 'selected' : ''}>Conjuntos</option>
                  <option value="vestidos" ${product.category === 'vestidos' ? 'selected' : ''}>Vestidos</option>
                </select>
              </label>
              <div class="admin-image-field">
                <span class="admin-image-field-title">Imagem</span>
                <p class="admin-image-field-help">Cole uma URL ou importe um arquivo. No celular abre a galeria; no computador, o explorador de arquivos.</p>
                <input type="text" class="admin-image-url-input" value="${escapeAttr(product.image)}" data-field="image" placeholder="https://… ou /images/foto.jpg" />
                <div class="admin-image-import">
                  <input type="file" id="admin-image-file-${index}" class="visually-hidden-input" accept="image/*" data-image-file data-index="${index}" tabindex="-1" />
                  <label for="admin-image-file-${index}" class="file-import-btn" data-picker-hint>Escolher arquivo…</label>
                </div>
              </div>
              <label>Preço: <input type="text" value="${escapeAttr(product.price)}" data-field="price"></label>
              <label>Descrição: <textarea data-field="description">${escapeHtml(product.description)}</textarea></label>
              <label>Tamanhos (separados por vírgula): <input type="text" value="${escapeAttr(product.sizes.join(', '))}" data-field="sizes"></label>
            </div>
          </div>
        `).join('')

  app.innerHTML = `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Painel Administrativo - Luz da Moda</h1>
        <div class="admin-header-actions">
          <button type="button" id="logout" class="secondary-button">Sair</button>
          <button type="button" id="back-to-site" class="secondary-button">Voltar ao Site</button>
        </div>
      </header>

      <div class="admin-tabs" role="tablist" aria-label="Seções do painel">
        <button type="button" role="tab" id="tab-btn-list" class="admin-tab ${activeTab === 'list' ? 'active' : ''}" aria-selected="${activeTab === 'list'}">Lista de produtos</button>
        <button type="button" role="tab" id="tab-btn-ai" class="admin-tab ${activeTab === 'ai' ? 'active' : ''}" aria-selected="${activeTab === 'ai'}">Cadastro com IA (foto)</button>
      </div>

      <div id="panel-list" class="admin-tab-panel" role="tabpanel" ${activeTab !== 'list' ? 'hidden' : ''}>
        <div class="admin-actions">
          <button type="button" id="add-product" class="cta-button">Adicionar Novo Produto</button>
          <button type="button" id="save-changes" class="cta-button">Salvar Alterações</button>
          <button type="button" id="export-data" class="secondary-button">Exportar Dados</button>
          <button type="button" id="import-data" class="secondary-button">Importar Dados</button>
        </div>
        <div id="products-list" class="products-list">
          ${productRows}
        </div>
      </div>

      <div id="panel-ai" class="admin-tab-panel" role="tabpanel" ${activeTab !== 'ai' ? 'hidden' : ''}>
        <section class="admin-ia-card" aria-labelledby="ia-heading">
          <h2 id="ia-heading">Cadastrar produto pela foto</h2>
          <p class="admin-ia-intro">Escolha uma foto da galeria ou tire uma foto. A IA lê a imagem e preenche nome, categoria, descrição, preço sugerido e tamanhos. Revise e clique em <strong>Salvar alterações</strong> na aba Lista.</p>
          <p class="admin-ia-note">É necessário configurar a chave <code>OPENAI_API_KEY</code> no projeto na Vercel (Variáveis de ambiente).</p>
          <div class="admin-ia-controls">
            <div class="admin-ia-file-import">
              <input type="file" id="ia-photo" class="visually-hidden-input" accept="image/*" tabindex="-1" />
              <label for="ia-photo" class="file-import-btn file-import-btn--primary" data-picker-hint>Escolher arquivo…</label>
            </div>
            <button type="button" id="ia-analyze" class="cta-button" disabled>Gerar dados com IA</button>
          </div>
          <div id="ia-preview-wrap" class="ia-preview-wrap is-hidden">
            <img id="ia-preview-img" alt="Pré-visualização do produto" width="200" height="200" />
          </div>
          <p id="ia-status" class="ia-status" role="status" aria-live="polite"></p>
        </section>
      </div>
    </div>
  `

  const setTab = (tab) => {
    sessionStorage.setItem('adminTab', tab)
    const listBtn = document.getElementById('tab-btn-list')
    const aiBtn = document.getElementById('tab-btn-ai')
    const panelList = document.getElementById('panel-list')
    const panelAi = document.getElementById('panel-ai')
    const isList = tab === 'list'
    listBtn.classList.toggle('active', isList)
    aiBtn.classList.toggle('active', !isList)
    listBtn.setAttribute('aria-selected', String(isList))
    aiBtn.setAttribute('aria-selected', String(!isList))
    panelList.hidden = !isList
    panelAi.hidden = isList
  }

  document.getElementById('tab-btn-list').addEventListener('click', () => setTab('list'))
  document.getElementById('tab-btn-ai').addEventListener('click', () => setTab('ai'))

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn')
    sessionStorage.removeItem('adminTab')
    renderLoginInterface()
  })

  document.getElementById('back-to-site').addEventListener('click', () => {
    window.location.search = ''
  })

  document.getElementById('add-product').addEventListener('click', () => {
    const newProduct = {
      id: Date.now().toString(),
      category: 'blusas',
      image: '/images/placeholder.jpg',
      name: 'Novo Produto',
      price: 'R$ 0,00',
      description: 'Descrição do produto',
      sizes: ['P', 'M', 'G']
    }
    products.push(newProduct)
    sessionStorage.setItem('adminTab', 'list')
    renderAdminInterface()
    requestAnimationFrame(() => {
      document.getElementById(`admin-product-${products.length - 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  })

  document.getElementById('save-changes').addEventListener('click', () => {
    const productElements = document.querySelectorAll('.admin-product')
    productElements.forEach((el, index) => {
      const fields = el.querySelectorAll('[data-field]')
      fields.forEach(field => {
        const fieldName = field.dataset.field
        let value = field.value
        if (fieldName === 'sizes') {
          value = value.split(',').map(s => s.trim()).filter(Boolean)
        }
        products[index][fieldName] = value
      })
    })
    localStorage.setItem('luzDaModaProducts', JSON.stringify(products))
    alert('Alterações salvas com sucesso!')
  })

  document.getElementById('export-data').addEventListener('click', () => {
    const dataStr = JSON.stringify(products, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'luz-da-moda-products.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  })

  document.getElementById('import-data').addEventListener('click', () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = event => {
        try {
          const importedProducts = JSON.parse(event.target.result)
          products = importedProducts
          localStorage.setItem('luzDaModaProducts', JSON.stringify(products))
          renderAdminInterface()
          alert('Dados importados com sucesso!')
        } catch (error) {
          alert('Erro ao importar dados: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-product')) {
      const index = parseInt(e.target.dataset.index, 10)
      if (Number.isNaN(index)) return
      if (confirm('Tem certeza que deseja excluir este produto?')) {
        products.splice(index, 1)
        renderAdminInterface()
      }
    }
  })

  const iaPhoto = document.getElementById('ia-photo')
  const iaAnalyze = document.getElementById('ia-analyze')
  const iaPreviewWrap = document.getElementById('ia-preview-wrap')
  const iaPreviewImg = document.getElementById('ia-preview-img')
  const iaStatus = document.getElementById('ia-status')
  let lastFile = null
  let lastCompressed = null

  iaPhoto.addEventListener('change', () => {
    iaStatus.textContent = ''
    const file = iaPhoto.files?.[0]
    lastFile = file || null
    lastCompressed = null
    if (!file) {
      iaAnalyze.disabled = true
      iaPreviewWrap.classList.add('is-hidden')
      return
    }
    if (!file.type.startsWith('image/')) {
      iaStatus.textContent = 'Selecione um arquivo de imagem.'
      iaAnalyze.disabled = true
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      iaPreviewImg.src = reader.result
      iaPreviewWrap.classList.remove('is-hidden')
      iaAnalyze.disabled = false
    }
    reader.readAsDataURL(file)
  })

  iaAnalyze.addEventListener('click', async () => {
    if (!lastFile) return
    iaAnalyze.disabled = true
    iaStatus.textContent = 'Comprimindo imagem…'
    try {
      lastCompressed = await compressImageToJpeg(lastFile)
    } catch (err) {
      iaStatus.textContent = err.message || 'Erro ao processar a imagem.'
      iaAnalyze.disabled = false
      return
    }

    iaStatus.textContent = 'Enviando para a IA (pode levar alguns segundos)…'
    try {
      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: lastCompressed.base64,
          mimeType: lastCompressed.mimeType
        })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        iaStatus.textContent = data.error || `Erro ${res.status}. Verifique a chave OPENAI_API_KEY na Vercel ou use "npm run dev:api" para testar com API local.`
        iaAnalyze.disabled = false
        return
      }
      if (!data.ok || !data.product) {
        iaStatus.textContent = 'Resposta inválida da IA.'
        iaAnalyze.disabled = false
        return
      }

      const p = data.product
      const newProduct = {
        id: `ia-${Date.now()}`,
        category: p.category,
        image: lastCompressed.dataUrl,
        name: p.name,
        price: p.price,
        description: p.description,
        sizes: p.sizes
      }
      products.push(newProduct)
      try {
        localStorage.setItem('luzDaModaProducts', JSON.stringify(products))
      } catch {
        products.pop()
        iaStatus.textContent = 'A imagem ficou grande demais para o armazenamento do navegador. Tente outra foto ou cadastre com URL de imagem na lista.'
        iaAnalyze.disabled = false
        return
      }
      sessionStorage.setItem('adminTab', 'list')
      renderAdminInterface()

      const idx = products.length - 1
      requestAnimationFrame(() => {
        document.getElementById(`admin-product-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })

      const catalogUrl = new URL(window.location.origin + '/')
      catalogUrl.hash = 'catalog'
      window.open(catalogUrl.toString(), '_blank', 'noopener,noreferrer')
    } catch {
      iaStatus.textContent = 'Falha na rede. Em desenvolvimento use `npm run dev:api` (Vercel CLI) para expor /api.'
      iaAnalyze.disabled = false
    }
  })

  updateImagePickerHints()
  if (!pickerHintMediaBound) {
    pickerHintMediaBound = true
    window.matchMedia('(pointer: coarse)').addEventListener('change', updateImagePickerHints)
  }
}