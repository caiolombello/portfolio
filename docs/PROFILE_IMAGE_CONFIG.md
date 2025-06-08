# 📸 Configuração de Imagem de Perfil

Este portfólio suporta múltiplas fontes para sua imagem de perfil, com sistema de fallback automático.

## 🎯 Tipos de Fonte Suportados

### 1. **GitHub Avatar** (`type: "github"`)
Usa automaticamente sua foto de perfil do GitHub.

```json
{
  "site": {
    "profileImage": {
      "type": "github",
      "source": "caiolombello"
    }
  }
}
```

**Vantagens:**
- ✅ Sempre atualizada automaticamente
- ✅ Otimizada pelo GitHub (múltiplos tamanhos)
- ✅ CDN global do GitHub
- ✅ Não ocupa espaço no projeto

### 2. **Arquivo Local** (`type: "local"`)
Usa uma imagem armazenada no seu projeto.

```json
{
  "site": {
    "profileImage": {
      "type": "local",
      "source": "/images/profile/profile.jpg"
    }
  }
}
```

**Vantagens:**
- ✅ Controle total sobre a imagem
- ✅ Funciona offline
- ✅ Sem dependências externas
- ✅ Privacidade total

### 3. **URL Externa** (`type: "external"`)
Usa uma imagem de qualquer URL externa.

```json
{
  "site": {
    "profileImage": {
      "type": "external",
      "source": "https://example.com/your-photo.jpg"
    }
  }
}
```

**Vantagens:**
- ✅ Flexibilidade máxima
- ✅ Pode usar CDNs otimizados
- ✅ Integração com outros serviços

## 🔄 Sistema de Fallback

Configure múltiplas opções com prioridade automática:

```json
{
  "site": {
    "profileImage": {
      "type": "github",
      "source": "caiolombello",
      "fallbacks": [
        {
          "type": "local",
          "source": "/images/profile-ios.png"
        },
        {
          "type": "external",
          "source": "https://avatars.githubusercontent.com/u/12345?v=4"
        }
      ]
    }
  }
}
```

**Como funciona:**
1. 🎯 Tenta carregar do GitHub (`caiolombello`)
2. 🔄 Se falhar, tenta imagem local (`/images/profile-ios.png`)
3. 🔄 Se falhar, tenta URL externa
4. 🎨 Se tudo falhar, usa favicon gerado com inicial

## 🛠️ Configurações Recomendadas

### Para Desenvolvedores/Profissionais
```json
{
  "type": "github",
  "source": "seu-username",
  "fallbacks": [
    {
      "type": "local",
      "source": "/images/profile/professional.jpg"
    }
  ]
}
```

### Para Máxima Velocidade
```json
{
  "type": "local",
  "source": "/images/profile/profile.webp"
}
```

### Para Máxima Disponibilidade
```json
{
  "type": "github",
  "source": "seu-username",
  "fallbacks": [
    {
      "type": "external",
      "source": "https://cdn.example.com/profile.jpg"
    },
    {
      "type": "local",
      "source": "/images/profile/backup.png"
    }
  ]
}
```

## 📏 Especificações de Imagem

### Tamanhos Recomendados:
- **Mínimo**: 200x200px
- **Recomendado**: 400x400px ou maior
- **Máximo**: 2000x2000px (será redimensionada)

### Formatos Suportados:
- ✅ **PNG** - Melhor para fotos com transparência
- ✅ **JPG/JPEG** - Menor tamanho de arquivo
- ✅ **WebP** - Melhor compressão (moderno)
- ✅ **AVIF** - Compressão superior (muito moderno)
- ✅ **SVG** - Vetorial (para logos)

### Aspectos:
- 📐 **Quadrada** (1:1) - Recomendado
- 📐 **Retrato** - Será cortada para quadrada
- 📐 **Paisagem** - Será cortada para quadrada

## 🎨 Processamento Automático

Todas as imagens passam por:

1. **Redimensionamento** - Para tamanho ideal
2. **Máscara circular** - Para favicons e avatares
3. **Otimização** - Compressão automática
4. **Cache** - Armazenamento otimizado

## 🚀 Onde é Usada

Sua imagem de perfil aparece em:

- 🌟 **Favicon** (ícone do navegador)
- 📱 **PWA Icons** (ícone do app)
- 🏠 **Header** (navegação)
- 👤 **About page** (seção principal)
- 📞 **Contact page** (header)
- 📱 **Mobile menu** (avatar)
- 🌐 **Open Graph** (compartilhamento social)

## 🧪 Testando Configurações

### Verificar Favicon:
```bash
# Testar favicon com sua configuração
curl -I http://localhost:3000/api/favicon?size=32&format=png

# Verificar headers de fonte
curl -v http://localhost:3000/api/favicon?size=64
```

### Debug no Browser:
1. Abra **DevTools** → **Network**
2. Acesse `http://localhost:3000/api/favicon`
3. Verifique header `X-Favicon-Source`

### Valores do Header:
- `github:username` - Carregou do GitHub
- `local:/path` - Carregou arquivo local
- `external:url` - Carregou URL externa
- `fallback` - Usou fallback padrão
- `error-fallback` - Erro total

## ⚡ Performance

### GitHub Avatar:
- 🌍 **CDN Global**: Entrega otimizada
- 📏 **Múltiplos tamanhos**: `?s=200` para diferentes tamanhos
- ⚡ **Cache agressivo**: 24h+ de cache
- 🔄 **Auto-updated**: Sempre sincronizada

### Imagem Local:
- 💾 **Zero latência**: Sem requisições externas
- 🎯 **Controle total**: Qualidade garantida
- 📦 **Bundle size**: Adiciona ao projeto
- 🔧 **Otimização manual**: Você controla

### URL Externa:
- 🌐 **Flexibilidade**: Qualquer fonte
- ⚠️ **Dependência**: Requer serviço externo
- 🔄 **Latência variável**: Depende do serviço
- 📊 **Monitoramento**: Pode falhar

## 🔧 Migração

### De String Simples:
```json
// ❌ Formato antigo
"profileImage": "/images/profile.jpg"

// ✅ Formato novo
"profileImage": {
  "type": "local",
  "source": "/images/profile.jpg"
}
```

### Compatibilidade:
O sistema mantém **compatibilidade total** com configurações antigas. Strings simples são automaticamente convertidas para `type: "local"`.

---

## 💡 Dicas Pro

1. **Use GitHub** para máxima simplicidade
2. **Combine local + GitHub** para redundância
3. **WebP/AVIF** para melhor performance
4. **400x400px** é o sweet spot
5. **Teste todos os fallbacks** antes do deploy 