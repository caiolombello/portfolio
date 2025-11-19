# Configuração da Vercel para Open Graph Images

A imagem Open Graph já está configurada e funcionará automaticamente quando você fizer o deploy na Vercel! 🎉

## Design da Imagem

A imagem OG foi criada com um design moderno e profissional contendo:
- ✨ Gradientes modernos e efeitos de blur
- 🎯 Seu nome em destaque com efeito dourado
- 💼 Título profissional (DevOps Engineer & Cloud Architect)
- 🛠️ Tech stack (AWS, Kubernetes, Terraform, Docker, CI/CD, Python)
- 📊 Estatísticas profissionais (anos de experiência, projetos)
- 🌐 URL do seu site
- 🎨 Elementos decorativos de código

## Variáveis de Ambiente (Opcional)

Se quiser customizar a URL exibida, configure no dashboard da Vercel:

1. Acesse: https://vercel.com/[seu-usuario]/[seu-projeto]/settings/environment-variables

2. Adicione (opcional):

```
NEXT_PUBLIC_SITE_URL=https://caio.lombello.com
```

## Como Testar

### 1. Teste Local (Desenvolvimento)
```bash
npm run dev
```

Acesse: `http://localhost:3000/opengraph-image`

Você verá a imagem OG gerada.

### 2. Teste após Deploy na Vercel

Acesse: `https://seu-dominio.vercel.app/opengraph-image`

Você deve ver a imagem OG com seu design profissional.

### 3. Validar com Ferramentas de Redes Sociais

**Facebook/Meta:**
- https://developers.facebook.com/tools/debug/

**Twitter:**
- https://cards-dev.twitter.com/validator

**LinkedIn:**
- https://www.linkedin.com/post-inspector/

Cole a URL do seu site e verifique se a imagem aparece corretamente.

### 4. Teste Compartilhando

Compartilhe seu link em:
- WhatsApp (aparecerá o preview)
- Twitter/X (mostrará a imagem)
- LinkedIn (preview com a imagem)
- Facebook (card com a imagem)

## Como Personalizar

Se quiser alterar o design, edite o arquivo: `app/opengraph-image.tsx`

### Personalizações fáceis:

**1. Mudar as estatísticas:**
```tsx
// Linha ~217
<span>10+</span> // Anos de experiência
<span>50+</span> // Projetos entregues
```

**2. Mudar o tech stack:**
```tsx
// Linha ~175
{['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Python'].map((tech) => (
  // Adicione ou remova tecnologias aqui
))}
```

**3. Mudar cores:**
```tsx
// Background gradient (linha ~24)
background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'

// Cor dourada (linha ~137)
background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)'
```

**4. Mudar título/descrição:**
```tsx
// Linha ~146 - Nome
Caio Barbieri

// Linha ~161 - Título
Senior DevOps Engineer & Cloud Architect
```

## Troubleshooting

### Imagem não aparece ao compartilhar
1. Limpe o cache do validador da rede social
2. Aguarde alguns minutos para o cache do CDN expirar
3. Tente usar o validador do Facebook/Twitter para forçar atualização
4. Verifique se o site está realmente no ar (não em modo de desenvolvimento)

### Imagem aparece diferente do esperado
1. Faça um hard refresh no navegador (Ctrl+Shift+R ou Cmd+Shift+R)
2. Limpe o cache da Vercel fazendo redeploy
3. Teste em modo anônimo do navegador

### Erro ao gerar a imagem localmente
1. Certifique-se de ter todas as dependências: `npm install`
2. Reinicie o servidor de desenvolvimento
3. Verifique se não há erros no console

## Como Funciona

1. **Next.js 15** detecta automaticamente o arquivo `opengraph-image.tsx` no diretório `app/`
2. Esse arquivo gera uma imagem dinamicamente usando a **ImageResponse API** (edge runtime)
3. A Vercel cacheia essa imagem automaticamente no CDN global
4. Quando alguém compartilha seu link, as redes sociais buscam `/opengraph-image` e exibem sua imagem
5. O Next.js usa automaticamente a mesma imagem para Twitter/X (não é necessário criar `twitter-image.tsx` separado)

## Dicas Pro

### Cache e Performance
- As imagens são geradas no Edge Runtime (super rápido)
- A Vercel cacheia automaticamente por 31536000 segundos (1 ano)
- Não há custo adicional por geração de imagem na Vercel

### Múltiplas Páginas
Se quiser imagens OG diferentes para cada página:
```tsx
// app/blog/[slug]/opengraph-image.tsx
export default function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    // JSX personalizado para posts do blog
  );
}
```

### Testar antes do Deploy
```bash
npm run build
npm start
# Acesse http://localhost:3000/opengraph-image
```

