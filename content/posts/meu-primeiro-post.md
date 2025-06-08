---
title_pt: "Meu Primeiro Post"
title_en: "My First Post"
title_es: "Mi Primera Publicación"
summary_pt: "Este é um exemplo de como criar posts em markdown de forma simples"
summary_en: "This is an example of how to create posts in markdown in a simple way"  
summary_es: "Este es un ejemplo de cómo crear publicaciones en markdown de forma simple"
publicationDate: "2024-01-15"
category: "Tutorial"
tags: ["markdown", "blog", "tutorial", "desenvolvimento", "escrita", "cms"]
published: true
author:
  name: "Caio Lombello"
  avatar: ""
---

# Meu Primeiro Post

Este é o conteúdo do meu primeiro post escrito em **markdown**! 

## Como funciona

Você pode escrever seus posts em markdown puro e eles serão renderizados automaticamente. O sistema suporta:

- **Negrito** e *itálico*
- Links: [exemplo](https://example.com)
- Listas numeradas e com marcadores
- Código inline: `console.log('Hello')`
- Blocos de código:

```javascript
function helloWorld() {
  console.log('Hello, World!');
}
```

## Frontmatter

No topo do arquivo, você define os metadados em YAML:

- `title_pt/en/es`: Títulos nos 3 idiomas
- `summary_pt/en/es`: Resumos nos 3 idiomas  
- `publicationDate`: Data de publicação
- `category`: Categoria do post
- `tags`: Array de tags
- `published`: Se o post está publicado
- `coverImage`: URL da imagem de capa (opcional)

## Resultado

O sistema automaticamente:
1. Gera os slugs baseados no título
2. Renderiza o markdown como HTML
3. Aplica os estilos do seu tema
4. Suporta todos os 3 idiomas configurados

Simples assim! 🚀 