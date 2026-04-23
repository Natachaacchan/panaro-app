
# Panora MVP

Panora e um MVP de organizacao pessoal e de trabalho com:

- autenticacao por conta
- workspace isolado por usuario
- tarefas, projetos, notas e eventos
- persistencia em `Supabase` quando configurado
- fallback local para desenvolvimento rapido

## Como o armazenamento funciona

O projeto usa dois modos:

1. `Supabase`
   Quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estao configurados, os dados do workspace sao salvos na tabela `public.workspaces`.
   Esse modo tambem permite recuperacao de senha por e-mail.

2. `localStorage`
   Quando o Supabase nao esta configurado, o app continua funcionando localmente no navegador.
   Nesse modo, a conta existe apenas no navegador atual. A redefinicao de senha tambem so funciona nesse mesmo navegador e nao substitui recuperacao real por e-mail.

Para testar com ate 5 usuarios reais, o modo recomendado e `Supabase`.

## Setup rapido

1. Instale as dependencias:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
copy .env.example .env
```

3. Preencha no `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

4. No Supabase, rode o SQL de [supabase/workspaces.sql](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/supabase/workspaces.sql).

5. Inicie o projeto:

```bash
npm run dev
```

## Validacao local

```bash
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run build
```

## Estrutura importante

- [src/app/context/auth.tsx](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/src/app/context/auth.tsx)
- [src/app/context/workspace.tsx](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/src/app/context/workspace.tsx)
- [src/app/services/workspaceStore.ts](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/src/app/services/workspaceStore.ts)
- [src/app/services/supabaseClient.ts](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/src/app/services/supabaseClient.ts)
- [supabase/workspaces.sql](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/supabase/workspaces.sql)

## Guia de publicacao para teste

Use o passo a passo completo em [supabase/SETUP.md](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/supabase/SETUP.md).

## Publicacao no GitHub Pages

O projeto ja esta configurado para publicar em:

`https://natachaacchan.github.io/panaro-app/`

O que foi alinhado:

- `vite.config.ts` usa `base: "/panaro-app/"` em producao
- o router usa `createHashRouter`, que funciona bem no GitHub Pages
- existe um workflow em [.github/workflows/deploy-github-pages.yml](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/.github/workflows/deploy-github-pages.yml)

Para ativar:

1. Suba o codigo para a branch `main`.
2. No GitHub, abra `Settings > Pages`.
3. Em `Source`, selecione `GitHub Actions`.
4. Em `Settings > Secrets and variables > Actions`, crie:
   `VITE_SUPABASE_URL`
   `VITE_SUPABASE_ANON_KEY`
5. Rode o workflow ou faça um novo push na `main`.

Depois disso, o link publicado passa a usar o build correto do Pages.
  
