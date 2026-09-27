# 🎨 MediaHub - Design System

> Versão: 1.0.0

Este documento define toda a identidade visual do MediaHub.

Todo componente desenvolvido deverá seguir este guia.

---

# Objetivos

- Consistência visual.
- Componentes reutilizáveis.
- Fácil manutenção.
- Escalabilidade.
- Acessibilidade.
- Responsividade.

---

# Stack

- Tailwind CSS v4
- class-variance-authority (CVA)
- clsx
- tailwind-merge
- Lucide React

---

# Estrutura

src/

styles/

globals.css

theme.css

animations.css

---

# Identidade

O MediaHub possui uma identidade inspirada em plataformas de entretenimento modernas como:

- Letterboxd
- Steam
- IMDb
- Backloggd

Sem copiar nenhuma delas.

A proposta é utilizar uma interface escura com elementos vibrantes.

---

# Paleta de cores

## Background

```css
#09090B
```

Utilizado no fundo da aplicação.

---

## Surface

```css
#18181B
```

Containers principais.

---

## Card

```css
#27272A
```

Cards, Modais e elementos elevados.

---

## Primary

```css
#84CC16
```

Botões principais.

Links.

Ações positivas.

---

## Secondary

```css
#06B6D4
```

Ações secundárias.

Filtros.

Informações.

---

## Accent

```css
#F59E0B
```

Destaques.

Badges.

Favoritos.

---

## Success

```css
#22C55E
```

---

## Warning

```css
#FACC15
```

---

## Danger

```css
#EF4444
```

---

## Border

```css
#3F3F46
```

---

## Text

```css
#FAFAFA
```

---

## Muted

```css
#A1A1AA
```

---

# Tipografia

Fonte principal

Geist Sans

Fonte mono

Geist Mono

---

## Hierarquia

Display

Heading

Subheading

Body

Caption

---

# Radius

sm

6px

md

8px

lg

12px

xl

16px

---

# Sombras

sm

md

lg

---

# Espaçamento

Utilizar exclusivamente a escala do Tailwind.

```text
1
2
3
4
6
8
10
12
16
20
24
32
40
48
64
```

Nunca utilizar valores arbitrários.

---

# Animações

Padrão

150ms

200ms

300ms

Easing

ease-in-out

---

# Ícones

Biblioteca

Lucide React

Todos os ícones serão exportados por

src/lib/icons.ts

Nunca importar diretamente de:

lucide-react

---

# Componentes

Todos os componentes deverão seguir a estrutura:

component/

Component.tsx

component.types.ts

component.variants.ts

index.ts

---

# Estados

Todos os componentes deverão suportar:

Default

Hover

Focus

Disabled

Loading (quando aplicável)

---

# Responsividade

Mobile First.

Breakpoints padrão do Tailwind.

---

# Acessibilidade

Todos os componentes deverão possuir:

aria-label quando necessário

focus-visible

contraste mínimo recomendado WCAG AA

suporte para navegação via teclado

---

# Convenções

## Componentes

PascalCase

```tsx
MediaCard.tsx
```

---

## Pastas

kebab-case

```text
media-card/

password-input/

watchlist-button/
```

---

## Hooks

camelCase

```ts
useAuth()

useSearch()

useMedia()
```

---

## Services

Uma responsabilidade por arquivo.

Exemplo:

```text
services/

media/

search.ts

details.ts

trending.ts
```

---

# Objetivo Final

Criar um Design System consistente, reutilizável e escalável para toda a aplicação.

Nenhuma página deverá conter estilos próprios quando existir um componente reutilizável correspondente.