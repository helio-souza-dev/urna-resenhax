-- ====================================================
--  VotoSec — Schema Supabase (PostgreSQL)
--  Execute no SQL Editor do seu projeto Supabase
-- ====================================================

-- CANDIDATOS
create table if not exists candidatos (
  id        serial primary key,
  numero    text unique not null,
  nome      text not null,
  partido   text not null,
  bio       text,
  projetos  text[], -- array de strings
  foto_url  text,
  created_at timestamptz default now()
);

-- ELEITORES
create table if not exists eleitores (
  id        serial primary key,
  nome      text not null,
  cpf       text unique not null,
  nasc      date,
  titulo    text,
  zona      text,
  email     text,
  votou     boolean default false,
  created_at timestamptz default now()
);

-- VOTOS
create table if not exists votos (
  id             serial primary key,
  cpf_eleitor    text not null references eleitores(cpf),
  nome_eleitor   text not null,
  numero_cand    text not null,
  nome_cand      text not null,
  partido_cand   text,
  ts             timestamptz default now()
);

-- ====================================================
--  RLS (Row Level Security)
-- ====================================================
alter table candidatos enable row level security;
alter table eleitores  enable row level security;
alter table votos      enable row level security;

-- Admins (via service_role) têm acesso total
-- Anon pode ler candidatos
create policy "candidatos_read" on candidatos
  for select using (true);

-- Anon NÃO pode ler eleitores (dados sensíveis)
create policy "eleitores_insert" on eleitores
  for insert with check (true);  -- somente admin insere na prática

-- Eleitores autenticados lêem apenas seu próprio registro
-- (para um app com auth de eleitor via Supabase Auth, ajuste aqui)

-- ====================================================
--  FUNÇÕES AUXILIARES
-- ====================================================

-- Conta votos por candidato
create or replace function contagem_votos()
returns table(numero text, nome text, partido text, total bigint) as $$
  select numero_cand, nome_cand, partido_cand, count(*) as total
  from votos
  where numero_cand != 'BRANCO'
  group by numero_cand, nome_cand, partido_cand
  order by total desc;
$$ language sql security definer;

-- Participação
create or replace function participacao()
returns json as $$
  select json_build_object(
    'total_eleitores', (select count(*) from eleitores),
    'total_votos',     (select count(*) from votos),
    'votaram',         (select count(*) from eleitores where votou = true),
    'brancos',         (select count(*) from votos where numero_cand = 'BRANCO')
  );
$$ language sql security definer;
