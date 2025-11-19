# Guia Completo das Imagens Open Graph

Todas as seções do seu portfólio agora possuem imagens Open Graph personalizadas e otimizadas! 🎨

## 📂 Estrutura das Imagens

```
app/
├── opengraph-image.tsx       # Página principal (Home)
├── blog/
│   ├── opengraph-image.tsx   # Lista de posts do blog
│   └── [slug]/
│       └── opengraph-image.tsx  # Cada post individual
├── contact/
│   └── opengraph-image.tsx   # Página de contato
└── resume/
    └── opengraph-image.tsx   # Página de currículo
```

> **Nota:** O Next.js usa automaticamente `opengraph-image.tsx` para Twitter/X também. Não é necessário criar arquivos `twitter-image.tsx` separados.

## 🎨 Designs por Seção

### 🏠 Home (`/`)
**Cor Principal:** Azul escuro com dourado
- ⚡ Badge: "DEVOPS • SRE • CLOUD"
- Nome em gradiente dourado
- Título: Senior DevOps Engineer & Cloud Architect
- Tech stack: AWS, Kubernetes, Terraform, Docker, CI/CD, Python
- Badge: "PROFESSIONAL PORTFOLIO"
- URL: caio.lombello.com

**Preview:** `http://localhost:3000/opengraph-image`

---

### 📝 Blog (`/blog`)
**Cor Principal:** Roxo/Púrpura
- 📝 Ícone grande de blog
- Título: "Tech Blog"
- Subtítulo: "Articles about DevOps, Cloud, Kubernetes & More"
- Categorias: DevOps, Cloud, Kubernetes, Infrastructure, Automation
- URL: caio.lombello.com/blog

**Preview:** `http://localhost:3000/blog/opengraph-image`

---

### 📄 Posts do Blog (`/blog/[slug]`)
**Cor Principal:** Roxo/Púrpura (consistente com blog)
- Header com badge "Blog Post"
- Título do post (extraído do slug automaticamente)
- Info do autor com avatar
- Barra colorida no rodapé (gradiente roxo → rosa → laranja)
- **Dinâmico:** Cada post terá seu próprio título na imagem!

**Preview:** `http://localhost:3000/blog/seu-post-aqui/opengraph-image`

---

### 💬 Contato (`/contact`)
**Cor Principal:** Verde (representando "disponível/conectar")
- 💬 Ícone grande de mensagem
- Título: "Let's Connect"
- Subtítulo: "Ready to discuss your next project?"
- Métodos: Email, LinkedIn, GitHub
- URL: caio.lombello.com/contact

**Preview:** `http://localhost:3000/contact/opengraph-image`

---

### 📄 Currículo (`/resume`)
**Cor Principal:** Laranja/Terracota
- 📄 Ícone de documento
- Título: "Resume"
- Nome: Caio Barbieri (em dourado)
- Seções: Experience, Education, Certifications, Skills
- Badge: "AVAILABLE FOR DOWNLOAD"
- Elementos decorativos: `{ pdf: true }`, `<CV />`
- URL: caio.lombello.com/resume

**Preview:** `http://localhost:3000/resume/opengraph-image`

---

## 🧪 Como Testar

### Teste Local
```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse cada imagem diretamente:
http://localhost:3000/opengraph-image
http://localhost:3000/blog/opengraph-image
http://localhost:3000/blog/meu-primeiro-post/opengraph-image
http://localhost:3000/contact/opengraph-image
http://localhost:3000/resume/opengraph-image
```

### Teste em Produção (Vercel)
```
https://seu-dominio.vercel.app/opengraph-image
https://seu-dominio.vercel.app/blog/opengraph-image
https://seu-dominio.vercel.app/contact/opengraph-image
https://seu-dominio.vercel.app/resume/opengraph-image
```

### Validadores de Redes Sociais

**Facebook/Meta:**
- URL: https://developers.facebook.com/tools/debug/
- Cole a URL da página e clique em "Debug"
- Verifique a imagem que aparece

**Twitter/X:**
- URL: https://cards-dev.twitter.com/validator
- Cole a URL e veja o preview do card

**LinkedIn:**
- URL: https://www.linkedin.com/post-inspector/
- Insira a URL para ver o preview

**WhatsApp:**
- Basta compartilhar o link em uma conversa
- O preview aparecerá automaticamente

---

## ✏️ Personalizações

### Mudar Tech Stack (Home)
```tsx
// app/opengraph-image.tsx - linha ~175
{['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Python'].map((tech) => (
  // Adicione ou remova tecnologias aqui
))}
```

### Mudar Categorias do Blog
```tsx
// app/blog/opengraph-image.tsx - linha ~113
{['DevOps', 'Cloud', 'Kubernetes', 'Infrastructure', 'Automation'].map((cat) => (
  // Adicione ou remova categorias aqui
))}
```

### Mudar Métodos de Contato
```tsx
// app/contact/opengraph-image.tsx - linha ~133
// Edite os badges de Email, LinkedIn, GitHub
```

### Mudar Seções do Currículo
```tsx
// app/resume/opengraph-image.tsx - linha ~156
{[
  { icon: '💼', label: 'Experience' },
  { icon: '🎓', label: 'Education' },
  { icon: '🏆', label: 'Certifications' },
  { icon: '🛠️', label: 'Skills' },
].map((item) => (
  // Adicione ou remova seções aqui
))}
```

### Mudar Cores

**Home (Azul escuro):**
```tsx
background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
```

**Blog (Roxo):**
```tsx
background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
```

**Contato (Verde):**
```tsx
background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
```

**Currículo (Laranja):**
```tsx
background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)'
```

---

## 🚀 Deploy na Vercel

### Passo 1: Commit e Push
```bash
git add .
git commit -m "feat: add custom OG images for all sections"
git push
```

### Passo 2: Vercel faz o resto!
- A Vercel detecta automaticamente os arquivos `opengraph-image.tsx`
- Gera as imagens no Edge Runtime
- Cacheia no CDN global
- Pronto! 🎉

### Passo 3: Verificar
Aguarde 1-2 minutos após o deploy e teste:
```
https://seu-dominio.com/opengraph-image
https://seu-dominio.com/blog/opengraph-image
https://seu-dominio.com/contact/opengraph-image
https://seu-dominio.com/resume/opengraph-image
```

---

## 📊 Especificações Técnicas

### Dimensões
- **Tamanho:** 1200x630px (padrão Open Graph)
- **Formato:** PNG
- **Runtime:** Edge (ultra rápido)

### Performance
- ⚡ Geração: <100ms
- 🌍 CDN: Cache global automático
- 💰 Custo: Zero (incluído na Vercel)
- ♻️ Cache: 1 ano (automático)

### Compatibilidade
- ✅ Facebook/Meta
- ✅ Twitter/X
- ✅ LinkedIn
- ✅ WhatsApp
- ✅ Telegram
- ✅ Discord
- ✅ Slack
- ✅ iMessage

---

## 🐛 Troubleshooting

### Imagem não aparece ao compartilhar
1. **Limpar cache da rede social:**
   - Facebook: Use o debugger
   - Twitter: Use o validator
   - LinkedIn: Use o post inspector

2. **Aguardar propagação:**
   - CDN pode levar alguns minutos
   - Cache de redes sociais: até 7 dias

3. **Forçar atualização:**
   ```bash
   # No validador do Facebook, clique em "Scrape Again"
   # No Twitter, limpe e teste novamente
   ```

### Imagem aparece cortada
- As dimensões 1200x630 são as ideais
- Mantenha conteúdo importante no centro
- Evite texto muito próximo das bordas

### Título do post não aparece correto
- O título é extraído do `slug` automaticamente
- Exemplo: `meu-primeiro-post` → "Meu Primeiro Post"
- Para customizar, edite `app/blog/[slug]/opengraph-image.tsx`

### Erro ao gerar localmente
```bash
# Limpar cache e reinstalar
rm -rf .next
npm install
npm run dev
```

---

## 💡 Dicas Pro

### 1. Teste Antes de Compartilhar
Sempre use os validadores antes de compartilhar publicamente

### 2. Cache de Redes Sociais
- Facebook cacheia por ~7 dias
- Twitter cacheia por ~1-2 dias
- WhatsApp cacheia indefinidamente (até limpeza manual)

### 3. Imagens Dinâmicas para Posts
O título de cada post é automaticamente incluído na imagem OG!

### 4. SEO Boost
Imagens OG melhoram significativamente o CTR (Click-Through Rate)

### 5. Consistência Visual
Todas as imagens seguem o mesmo estilo visual do seu site

---

## 📚 Recursos Adicionais

- [Next.js OG Image Generation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

---

## ✅ Checklist Pós-Deploy

- [ ] Testar imagem da home
- [ ] Testar imagem do blog
- [ ] Testar imagem de um post específico
- [ ] Testar imagem de contato
- [ ] Testar imagem do currículo
- [ ] Validar no Facebook Debugger
- [ ] Validar no Twitter Card Validator
- [ ] Compartilhar em WhatsApp para teste
- [ ] Verificar no LinkedIn Post Inspector

---

**Criado com 💛 para um portfólio profissional incrível!**

