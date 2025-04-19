# Portfolio - Next.js + Decap CMS

Este projeto é um portfólio profissional construído com Next.js, TypeScript, Tailwind CSS e gerenciamento de conteúdo via Decap CMS (Netlify CMS).

## Como funciona

- **Conteúdo**: Todos os dados (posts, projetos, perfil, etc) ficam em arquivos Markdown/JSON na pasta `/content`.
- **Administração**: O painel de edição está em `/public/admin` (Decap CMS). Ao editar, o CMS faz commit direto no repositório Git.
- **Build**: O Next.js lê os arquivos de `/content` durante o build (SSG/ISR). Não há mais APIs customizadas para conteúdo.
- **Imagens**: Uploads vão para `/public/uploads` (configurável no Decap CMS).

## Estrutura

- `/content/posts/` — Posts em Markdown (`.md`)
- `/content/projects/` — Projetos em JSON (`.json`)
- `/content/settings/`, `/content/data/` — Dados únicos (perfil, skills, etc)
- `/public/admin/` — Painel do Decap CMS (`index.html`, `config.yml`)
- `/public/uploads/` — Imagens enviadas pelo CMS

## Como rodar localmente

```bash
pnpm install
pnpm dev
```

Acesse `/admin` para o painel de edição.

## Como publicar conteúdo

1. Faça login no `/admin`
2. Edite/crie conteúdo normalmente
3. O CMS faz commit no GitHub (ou GitLab/Bitbucket)
4. O Vercel/Netlify faz deploy automático

## Como adicionar novos tipos de conteúdo

- Edite o arquivo `/public/admin/config.yml` para criar novas coleções/campos.
- Crie os arquivos/pastas correspondentes em `/content`.

## Como remover APIs antigas

- Todas as rotas em `/app/api/public/*` e `/app/api/admin/*` relacionadas a conteúdo podem ser removidas.
- O arquivo `/lib/blob-storage.ts` pode ser removido.

## Como migrar dados

- Todos os dados antigos de `/public/data` devem ser migrados para `/content` e os arquivos antigos removidos.

## Dúvidas?

Abra uma issue ou consulte a [documentação do Decap CMS](https://decapcms.org/docs/intro/). 