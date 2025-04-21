# Portfolio Website

Este é o repositório do meu portfólio profissional, construído com Next.js, TypeScript, Tailwind CSS e Decap CMS.

## Tecnologias Principais

- Next.js 14+ com App Router
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components
- i18n (Português, Inglês, Espanhol)
- pnpm para gerenciamento de pacotes
- Decap CMS para gerenciamento de conteúdo

## Estrutura do Projeto

### Componentes (`/components`)

- Server Components por padrão
- Client Components usam diretiva 'use client'
- Componentes UI seguem estes padrões:
  - Componentes base em `/components`
  - Primitivos reutilizáveis em `/components/ui` (baseados em shadcn/ui)
  - Uso de Tailwind CSS para estilização
  - Tipagem adequada com TypeScript
  - Responsivos e acessíveis
  - Seguem princípios de design atômico
  - Suportam injeção dinâmica de conteúdo
  - Compatíveis com preview do Decap CMS

### Gerenciamento de Dados

#### Fonte Primária de Dados (`/content/`)

- Arquivos JSON armazenam conteúdo principal:
  - Informações do perfil (`settings/profile.json`)
  - Experiência profissional (`experience/*.json`)
  - Detalhes educacionais (`education/*.json`)
  - Habilidades e certificações (`data/skills.json`, `certifications/*.json`)
  - Projetos (`projects/*.json`)
  - Posts do blog (`posts/*.md`)
- Cada tipo de dado tem tipos TypeScript correspondentes em `/types/`
- Validação de dados usando schemas Zod

#### Integração com CMS (`/public/admin/`)

- Decap CMS como sistema principal de gerenciamento de conteúdo
- Configuração em `/public/admin/config.yml`
- Atualizações de conteúdo em tempo real
- Versionamento de conteúdo
- Gerenciamento de assets de mídia
- Suporte a múltiplos idiomas
- Funcionalidade de preview de conteúdo
- Integração com webhooks para deploys automáticos
- Armazenamento baseado em Git

## Desenvolvimento Local

1. Clone o repositório:

```bash
git clone https://github.com/caiolombello/portifolio.git
cd portfolio
```

2. Instale as dependências:

```bash
pnpm install
```

3. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

4. Acesse o CMS em `http://localhost:3000/admin`

## Gerenciando Conteúdo

### Acessando o CMS

1. Acesse `/admin` no seu navegador
2. Faça login com suas credenciais do GitHub
3. Você terá acesso ao painel de administração

### Tipos de Conteúdo

1. **Perfil**

   - Informações pessoais e profissionais
   - Links sociais
   - Foto de perfil

2. **Habilidades**

   - Nome da habilidade
   - Categoria
   - Nível de proficiência

3. **Experiência Profissional**

   - Empresa
   - Cargo (PT/EN)
   - Período
   - Responsabilidades (PT/EN)

4. **Educação**

   - Instituição
   - Curso/Grau (PT/EN)
   - Período
   - Descrição (PT/EN)

5. **Certificações**

   - Nome da certificação
   - Emissor
   - Data
   - Descrição
   - URL da credencial

6. **Projetos**

   - ID único
   - Título (PT/EN)
   - Descrição curta (PT/EN)
   - Descrição completa (PT/EN)
   - Imagem
   - Categoria
   - Tecnologias
   - Links (GitHub, Demo)

7. **Blog Posts**
   - Título (PT/EN)
   - Resumo (PT/EN)
   - Data de publicação
   - Imagem de capa
   - Categoria
   - Tags
   - Autor
   - Corpo do post (PT/EN)

### Workflow de Edição

1. Faça login no CMS
2. Escolha o tipo de conteúdo que deseja editar
3. Faça suas alterações
4. Preview as mudanças (quando disponível)
5. Salve e publique

### Internacionalização (i18n)

- Campos com sufixos `_pt` e `_en` são para conteúdo em português e inglês
- Preencha ambos os idiomas para manter o site totalmente bilíngue
- O frontend escolherá automaticamente o idioma correto

## Testes

Execute os testes:

```bash
# Executa todos os testes
pnpm test

# Executa testes em modo watch
pnpm test:watch

# Executa testes com cobertura
pnpm test:coverage
```

## Notificações no Discord

O projeto inclui integração com Discord para notificações de alterações de conteúdo:

1. Crie um webhook no Discord:

   - Clique com o botão direito no canal > Configurações
   - Integrações > Webhooks > Novo Webhook
   - Copie a URL do webhook

2. Adicione a URL como secret no GitHub:

   - Settings > Secrets > New repository secret
   - Nome: `DISCORD_WEBHOOK_URL`
   - Valor: URL do webhook

3. As notificações serão enviadas automaticamente quando houver mudanças em `content/`

## Contribuindo

1. Crie uma branch para sua feature:

```bash
git checkout -b feature/nome-da-feature
```

2. Faça suas alterações e commit:

```bash
git commit -m "feat: descrição da alteração"
```

3. Push para o repositório:

```bash
git push origin feature/nome-da-feature
```

4. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
