# Setup do Supabase para o Panora MVP

Este e o caminho recomendado para testar o MVP com cerca de 5 usuarios.

## 1. Criar o projeto

1. Acesse o painel do Supabase.
2. Crie um novo projeto.
3. Guarde:
   - `Project URL`
   - `anon public key`

## 2. Configurar autenticacao

No painel do Supabase:

1. Abra `Authentication`.
2. Em `Providers`, deixe `Email` habilitado.
3. Para um teste pequeno, a configuracao minima recomendada e:
   - `Enable email provider`: ligado
   - `Confirm email`: desligado para acelerar onboarding de teste
   - `Reset password`: mantenha habilitado para o usuario conseguir recuperar o acesso
4. Em `URL Configuration`, adicione:
   - `Site URL`: a URL onde o app vai rodar
   - para ambiente local, pode usar `http://localhost:5173`

## 3. Configurar o banco

Abra o `SQL Editor` e rode o conteudo de [workspaces.sql](C:/Users/Natacha/OneDrive/Documentos/Projetos/Panaro/panaro-app/supabase/workspaces.sql).

Isso cria:

- tabela `public.workspaces`
- relacao com `auth.users`
- politicas para cada usuario ler e alterar apenas o proprio workspace

## 4. Configurar o app

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

## 5. Rodar o projeto

```bash
npm install
npm run dev
```

## 6. Checklist para 5 usuarios testarem

1. Criar 5 contas com e-mails diferentes.
2. Confirmar que cada usuario entra no proprio workspace.
3. Criar pelo menos:
   - 1 projeto
   - 2 tarefas
   - 1 nota
   - 1 evento
4. Sair e entrar novamente para validar persistencia.
5. Testar em outro navegador ou outro computador com a mesma conta.
6. Confirmar que os dados aparecem iguais.
7. Confirmar que uma conta nao enxerga os dados da outra.

## 7. Quando usar fallback local

Use `localStorage` apenas quando:

- voce estiver prototipando sozinho
- ainda nao tiver criado o projeto Supabase
- quiser testar layout sem depender de backend

Para teste real com usuarios, prefira sempre `Supabase`.
