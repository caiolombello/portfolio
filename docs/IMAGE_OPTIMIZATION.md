# 🖼️ Sistema de Otimização de Imagens

Este portfólio implementa um sistema avançado de otimização de imagens que melhora significativamente a performance e a experiência do usuário.

## 🚀 Funcionalidades

### 1. **Favicon Dinâmico**

O favicon é gerado automaticamente usando sua foto de perfil:

- **Fonte**: Sua foto de perfil configurada em `config/site.json`
- **Formato circular**: Aplica máscara circular para melhor apresentação
- **Múltiplos tamanhos**: 16x16, 32x32, 48x48, 96x96, 180x180, 192x192px
- **Fallback inteligente**: Usa logo padrão se a foto não estiver disponível
- **Cache otimizado**: 24h de cache com stale-while-revalidate

#### Endpoints do Favicon:
```
/api/favicon?size=32&format=png  # PNG 32x32
/api/favicon?format=ico          # ICO format
/api/favicon?size=180&format=png # Apple touch icon
```

### 2. **Componente de Imagem Otimizado**

**Componente**: `components/ui/optimized-image.tsx`

#### Características:
- ✅ **Loading states** com skeleton animado
- ✅ **Error handling** com placeholder visual
- ✅ **Blur placeholder** automático
- ✅ **Responsive images** com sizes otimizados
- ✅ **Format selection** (AVIF, WebP, JPEG, PNG)
- ✅ **Quality control** por imagem
- ✅ **Lazy loading** por padrão

#### Uso:
```tsx
import OptimizedImage from '@/components/ui/optimized-image';

<OptimizedImage
  src="/images/project.jpg"
  alt="Descrição"
  width={800}
  height={600}
  quality={90}
  placeholder="blur"
  priority={false} // Para above-the-fold content, use true
/>
```

### 3. **Script de Otimização Automática**

**Script**: `scripts/optimize-images.mjs`

#### O que faz:
- 🔍 Escaneia todas as imagens em `/public/images`
- 📏 Gera múltiplos tamanhos por tipo de imagem
- 🎨 Converte para formatos modernos (WebP, AVIF)
- 📊 Relatório de economia de espaço
- ⚡ Processamento em lote eficiente

#### Configurações por Tipo:

**Profile Images** (`/images/profile/`):
- 400x400px (original)
- 200x200px (-200 suffix)  
- 100x100px (-100 suffix)
- 50x50px (-50 suffix)

**Project Images** (`/images/projects/`):
- 800x600px (original)
- 400x300px (-400 suffix)
- 200x150px (-200 suffix)

**Blog Images** (`/images/blog/`):
- 1200x675px (original) 
- 800x450px (-800 suffix)
- 400x225px (-400 suffix)

**General Images**:
- 800x600px (original)
- 400x300px (-400 suffix)

#### Executar Otimização:
```bash
# Otimizar todas as imagens manualmente
npm run optimize-images

# Otimização automática no build
npm run build  # Executa optimize-images automaticamente
```

## ⚙️ Configuração do Next.js

### Configurações Aplicadas:

```javascript
// next.config.mjs
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  quality: 85,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  remotePatterns: [
    { protocol: 'https', hostname: 'github.com' },
    { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    { protocol: 'https', hostname: 'images.credly.com' },
  ],
}
```

## 📱 PWA Integration

### Manifest Dinâmico

O Web App Manifest (`/api/webmanifest`) usa automaticamente o favicon dinâmico:

```json
{
  "icons": [
    {
      "src": "/api/favicon?size=192&format=png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    // ... outros tamanhos
  ]
}
```

## 🎯 Benefícios de Performance

### Métricas Esperadas:
- **Redução do tamanho**: 50-80% menor que originais
- **Faster LCP**: Imagens carregam 2-3x mais rápido  
- **Better CLS**: Skeleton loading previne layout shift
- **Improved SEO**: Formatos modernos favorecem rankings
- **PWA Ready**: Ícones dinâmicos para instalação

### Formatos Suportados:

**Entrada**: JPG, JPEG, PNG, GIF, BMP, TIFF
**Saída**: AVIF, WebP, JPEG, PNG

**Prioridade de Formato**:
1. **AVIF** - Melhor compressão (browsers modernos)
2. **WebP** - Boa compressão (amplo suporte)  
3. **JPEG** - Fallback universal
4. **PNG** - Para transparência

## 🔧 Customização

### Adicionar Novos Tamanhos:

```javascript
// scripts/optimize-images.mjs
const SIZE_CONFIGS = {
  myCustomType: [
    { width: 1920, height: 1080, suffix: '-full' },
    { width: 960, height: 540, suffix: '-half' },
  ]
};
```

### Qualidade por Formato:

```javascript
const QUALITY_SETTINGS = {
  webp: 85,  // Boa qualidade/compressão
  avif: 80,  // Mais agressivo
  jpeg: 90,  // Conservador
  png: 95    // Lossless
};
```

### Personalizar Componente:

```tsx
// Tamanhos responsivos customizados
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
  quality={95}
  priority={true} // Para hero images
/>
```

## 🚨 Troubleshooting

### Problemas Comuns:

**1. Favicon não aparece:**
- Verifique se a foto de perfil existe em `public/images/profile-ios.png`
- Limpe cache do browser (Ctrl+F5)
- Verifique configuração em `config/site.json`

**2. Imagens não otimizam:**
- Confirme que Sharp está instalado: `npm install sharp`
- Verifique permissões do diretório `/public/images`
- Execute: `npm run optimize-images` manualmente

**3. Build falha:**
- Verifique se todas as imagens estão acessíveis
- Rode `npm run optimize-images` antes do build
- Veja logs para erros específicos

### Logs e Debug:

```bash
# Executar com logs detalhados
DEBUG=1 npm run optimize-images

# Verificar headers da API
curl -I http://localhost:3000/api/favicon?size=32&format=png
```

## 📈 Monitoramento

### Headers para Análise:
- `X-Image-Optimized`: Confirma otimização
- `X-Original-Size`: Tamanho original em bytes
- `X-Optimized-Size`: Tamanho otimizado
- `X-Compression-Ratio`: Porcentagem de economia

### Ferramentas Recomendadas:
- **Lighthouse**: Auditar performance de imagens
- **WebPageTest**: Medir tempos de carregamento
- **Chrome DevTools**: Network tab para análise
- **Next.js Analytics**: Métricas Web Vitals

---

## 🎉 Resultado

Com essas otimizações, seu portfólio oferece:
- ⚡ **Carregamento mais rápido**
- 📱 **Experiência mobile otimizada**  
- 🎯 **SEO melhorado**
- 💾 **Economia de banda**
- 🏆 **Web Vitals excelentes**
