# VotoSec

Sistema eleitoral com interface moderna em React + Vite, pronto para deploy na **Vercel** com banco de dados no **Supabase**.

## Stack

- **React 18** + **Vite** — frontend
- **Tailwind CSS v3** — estilização
- **@supabase/supabase-js** — cliente Supabase
- **Vercel** — hospedagem

---

## 1. Instalar

```bash
npm install
```

---

## 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o arquivo `supabase-schema.sql`
3. Copie a **URL** e a **Anon Key** (Settings → API)

```bash
cp .env.example .env
# edite com suas chaves
```

---

## 3. Desenvolvimento local

```bash
npm run dev
```

---

## 4. Deploy na Vercel

```bash
npm i -g vercel && vercel --prod
```

Ou conecte o repositório GitHub no painel da Vercel e adicione as env vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 5. Credenciais Admin

| CPF | Senha |
|-----|-------|
| 111.111.111-11 | admin123 |
| 222.222.222-22 | admin456 |

---

## 6. Supabase em produção

O store usa estado local por padrão (demo). Para persistência real, use o cliente em `src/lib/supabase.js`:

```js
const { data } = await supabase.from('candidatos').select('*')
await supabase.from('votos').insert({ ... })
```
