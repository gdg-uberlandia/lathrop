# DevFest 2025 Site

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Visao Geral

Este projeto utiliza Next.js e possui integracao com Firebase para execucao e deploy.

## Getting Started

Siga os passos abaixo para configurar o projeto localmente.

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Env File

```bash
cp .env.example .env.local
```

### 3. Add Service Account to root of the project

Add values of environment variables that you can find on:

1. Download the key
   Project Settings -> Service Accounts -> Generate new private Key
2. Rename to `serviceAccount.json` in root of project

Adicione o `serviceAccount.json` na raiz do projeto.

## Execucao Local

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
# or
yarn dev
```

### un Local

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploy Inicial

Antes de iniciar o processo de deploy no Firebase, garanta tambem os seguintes pre-requisitos:

- O artifact precisa estar adicionado/configurado.
- A `Cloud Build API` precisa estar habilitada no projeto.
- Cloud Run Admin API precisa estar habilitado no projeto

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Configurar projeto experimental

```bash
firebase experiments:enable webframeworks
```

### 3. Configure seu projeto Firebase

```bash
firebase use --add {nome do projeto}
```

### 4. Inicializar o Hosting

```bash
firebase init hosting
```

Adicione o `serviceAccount.json` a raiz do projeto.

### 5. Realizar deploy de producao

```bash
npm run deploy_prod
```

## Problems

### lockfileVersion

`This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@3.`

Instale a versao do global pelo npm.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Obs

Para funcionar a busca de revisores, e necessario adicionar indices para os campos `profiles.user.email` e `profiles.user.name` no Firestore.
