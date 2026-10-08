# TODO — Transcendence

Backlog do projeto organizado por área. Cada item tem uma GitHub Issue correspondente.

---

## Módulos escolhidos — 15 pontos

| Módulo | Categoria | Tipo | Pts |
|--------|-----------|------|-----|
| Use framework frontend (Next.js) + backend (FastAPI) | Web | Major | 2 |
| Use ORM (SQLAlchemy) | Web | Minor | 1 |
| Public API documentada com rate limiting e 5+ endpoints | Web | Major | 2 |
| Sistema de notificações | Web | Minor | 1 |
| Standard user management (perfil, avatar, amigos, online status) | User Management | Major | 2 |
| OAuth 2.0 (Google ou GitHub) | User Management | Minor | 1 |
| Analytics dashboard avançado (stats de filmes, usuários, reviews) | Data & Analytics | Major | 2 |
| GDPR compliance (exportar/deletar dados) | Data & Analytics | Minor | 1 |
| Sistema de recomendações baseado nas notas por categoria | Modules of choice | Minor | 1 |
| Suporte a múltiplos idiomas (PT, EN, ES) | Accessibility | Minor | 1 |
| **Total** | | | **15** |

---

## Requisitos obrigatórios do subject (independente de módulos)

- [ ] Frontend responsivo e acessível em todos os dispositivos — `#1`
- [ ] CSS framework (Tailwind já no Next.js) — `#2`
- [ ] Suporte a múltiplos usuários simultâneos sem race conditions — `#3`
- [ ] HTTPS no backend — `#4`
- [ ] Validação de inputs no frontend E no backend — `#5`
- [ ] Página de Privacy Policy acessível (footer) com conteúdo real — `#6`
- [ ] Página de Terms of Service acessível (footer) com conteúdo real — `#7`
- [ ] Sem warnings ou erros no console do Chrome — `#8`
- [ ] `docker compose up` funcionando com um único comando — `#9`
- [ ] README completo com todas as seções exigidas pelo subject — `#10`

> ⚠️ Privacy Policy e Terms of Service vazias ou placeholder = rejeição imediata do projeto

---

## Infrastructure - ANDRE

- [x] Docker Compose com PostgreSQL + Backend
- [x] Healthcheck no banco antes de subir o backend
- [x] Hot reload no backend (volume montado)
- [x] Configurar Alembic para migrations — `#11`
- [x] Criar primeira migration a partir dos models atuais — `#12` _(depende de #11)_
- [x] Adicionar frontend (Next.js) ao Docker Compose — `#13`
- [x] HTTPS via certificado self-signed ou Let's Encrypt — `#4`

---

## Authentication - BRUNO


- [x] `POST /register` — cadastro com bcrypt
- [x] `POST /login` — geração de JWT
- [x] Middleware de autenticação JWT (dependency do FastAPI) — `#14`
- [ ] Proteger rotas que exigem login — `#15` _(depende de #14)_
- [ ] OAuth 2.0 com Google ou GitHub — `#16` _(módulo User Management Minor)_

---

## Users / Profile - ANDRE
_(módulo: Standard user management — Major 2pts)_

- [x] `GET /users/{id}` — perfil público — `#17`
- [x] `PATCH /users/me` — editar perfil (bio) — `#18` _(depende de #14)_
- [x] Upload de avatar com default caso não tenha — `#19` _(depende de #18)_
- [ ] Sistema de amigos (adicionar, remover, ver lista) — `#20` _(depende de #14)_
- [ ] Online status dos usuários — `#21` _(depende de #20)_
- [ ] `GET /users/{id}/reviews` — reviews de um usuário — `#22`
- [ ] `GET /users/{id}/stats` — estatísticas do usuário — `#23`

---

## Media / Movies & Games - BRUNO

- [x] `GET /search?title=X` — busca na TMDB e salva sem duplicatas
- [ ] `GET /media/{id}` — detalhes de uma mídia — `#24`
- [ ] `GET /media/{id}/reviews` — listar reviews de uma mídia — `#25`
- [ ] Buscar e salvar gêneros da TMDB no campo `genres` — `#26`
- [ ] Suporte a jogos via IGDB API — `#27`

---

## Reviews / Ratings - LUIZ

- [ ] `POST /reviews` — criar review com notas por categoria (requer login) — `#28` _(depende de #14)_
- [ ] `GET /reviews/{id}` — ver review — `#29`
- [ ] `PATCH /reviews/{id}` — editar própria review — `#30` _(depende de #14)_
- [ ] `DELETE /reviews/{id}` — deletar própria review — `#31` _(depende de #14)_
- [ ] Calcular média das notas por categoria automaticamente no backend — `#32` _(depende de #28)_
- [ ] `POST /reviews/{id}/like` — dar like — `#33` _(depende de #14)_

---

## Social - LUIZ

- [ ] `POST /users/{id}/follow` — seguir usuário — `#34` _(depende de #14)_
- [ ] `DELETE /users/{id}/follow` — deixar de seguir — `#35` _(depende de #34)_
- [ ] `GET /users/{id}/followers` e `GET /users/{id}/following` — `#36`
- [ ] `GET /feed` — feed de atividades dos usuários que você segue — `#37` _(depende de #34)_

---

## Public API - BRUNO
_(módulo: Web Major — 2pts)_

- [ ] Documentação automática via FastAPI `/docs` — `#38`
- [ ] Rate limiting nas rotas públicas — `#39`
- [ ] API key para acesso externo — `#40`
- [ ] Garantir 5+ endpoints públicos com GET, POST, PUT, DELETE — `#41`

---

## Notifications - LUIZ
_(módulo: Web Minor — 1pt)_

- [ ] Notificação quando alguém segue você — `#42`
- [ ] Notificação quando alguém curte sua review — `#43`
- [ ] Marcar notificações como lidas — `#44`

---

## Analytics Dashboard - ANDRE
_(módulo: Data & Analytics Major — 2pts)_

- [ ] Dashboard com gráficos: filmes mais avaliados, média por gênero, etc. — `#45`
- [ ] Estatísticas do usuário: gênero favorito, média geral, evolução mensal — `#46`
- [ ] Exportação dos dados em CSV/PDF — `#47`
- [ ] Filtros por data e categoria — `#48`

---

## GDPR Compliance - BRUNO
_(módulo: Data & Analytics Minor — 1pt)_

- [ ] `GET /users/me/export` — exportar todos os dados do usuário — `#49`
- [ ] `DELETE /users/me` — deletar conta e todos os dados — `#50`
- [ ] Email de confirmação para operações de dados — `#51`

---

## Recomendações - ANDRE
_(módulo: Modules of choice Minor — 1pt)_

- [ ] Recomendar filmes baseado nas categorias com notas altas do usuário — `#52`
- [ ] `GET /users/me/recommendations` — endpoint de recomendações — `#53`
- [ ] Justificativa do módulo no README.md — `#54`

---

## Internacionalização - ANDRE
_(módulo: Accessibility Minor — 1pt)_

- [ ] Setup de i18n no Next.js (PT, EN, ES) — `#55`
- [ ] Traduções de todos os textos da UI — `#56`
- [ ] Seletor de idioma na interface — `#57`

---

## Frontend - ANDRE

- [x] Setup Next.js com Tailwind no Docker — `#13`
- [x] Página de login e cadastro — `#58`
- [x] Página home / descoberta de filmes — `#59`
- [ ] Página de detalhes de um filme/jogo — `#60`
- [ ] Modal de review (notas por categoria) — `#61`
- [x] Página de perfil do usuário — `#62`
- [ ] Feed de atividades — `#63`
- [ ] Dashboard de analytics — `#64`
- [x] Página de Privacy Policy — `#6`
- [x] Página de Terms of Service — `#7`
- [ ] Integração com JWT (armazenar token, enviar nas requisições) — `#65`

---

## Deployment / Polish - OS DOIS

- [ ] HTTPS no backend — `#4`
- [ ] README completo com todas as seções do subject — `#10`
- [ ] `.env.example` atualizado — `#66`
- [ ] Testar tudo no Chrome sem erros de console — `#8`
- [ ] `docker compose up` do zero funcionando — `#9`

---

## Ordem sugerida de implementação

```
#11 → #12 → #13 → #14 → #15 → #17 → #18 → #19 → #20 → #28 → #32 →
#24 → #25 → #34 → #37 → #38 → #45 → #52 → #55 → Frontend → #4 → #6 → #7 → #10
```
