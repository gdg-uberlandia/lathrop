# Contratos de dados da Pokedex

Este diretório mantém a cópia local dos contratos de documentos que o
`site-devfest` grava e a Pokedex consome. Os repositórios são independentes: não
há importação de código da Pokedex em tempo de build ou execução.

## Fonte de referência

Ao alterar uma entidade compartilhada, compare o schema local com o arquivo
correspondente no repositório da Pokedex:

| Entidade          | Fonte na Pokedex                      |
| ----------------- | ------------------------------------- |
| Company           | `modules/companies/company.schema.ts` |
| Missão            | `modules/missions/mission.schema.ts`  |
| Tag               | `modules/tags/tag.schema.ts`          |
| Prêmio de sorteio | `modules/raffles/raffle.schema.ts`    |
| Recompensa        | `modules/rewards/reward.schema.ts`    |
| Palestrante       | `modules/talks/speaker.schema.ts`     |
| Palestra          | `modules/talks/talk.schema.ts`        |

Palestrantes e palestras possuem contratos locais em `src/contracts`, seguindo
o mesmo formato dos contratos da Pokedex.

## Processo de atualização

Os contratos não são publicados como pacote e não criam dependência entre os
repositórios. A sincronização é manual e deve acontecer em uma alteração
dedicada, fácil de revisar.

1. Registrar o commit da Pokedex usado como referência na descrição do PR.
2. Comparar o schema indicado na tabela acima com sua cópia neste diretório.
3. Classificar a mudança como compatível ou incompatível com documentos já
   gravados.
4. Copiar campos, enums, nulabilidade, limites, valores padrão, refinamentos e
   regras relacionais.
5. Manter no site schemas de criação e atualização separados do schema completo
   do documento. Esses schemas locais não devem ampliar o formato persistido.
6. Atualizar ou criar uma fixture completa em `fixtures.ts`.
7. Adicionar casos válidos e inválidos em `contracts.test.ts`.
8. Atualizar primeiro a API do servidor e somente depois formulários e páginas.
9. Executar as validações abaixo antes de solicitar revisão.

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```

## Checklist de revisão

- [ ] O documento gravado contém somente campos aceitos pela Pokedex.
- [ ] Datas persistidas são timestamps e chegam ao schema como `Date`.
- [ ] IDs, referências e `eventId` seguem o mesmo significado nos dois projetos.
- [ ] Valores padrão não criam diferenças entre leitura e gravação.
- [ ] A fixture representa um documento completo, não apenas o payload do form.
- [ ] Regras relacionais possuem ao menos um teste de rejeição.
- [ ] O commit de referência da Pokedex está registrado no PR.

Se a Pokedex mudar primeiro, o site deve receber uma cópia compatível antes de
começar a gravar o novo formato. Se o site precisar propor um campo novo, a
mudança deve ser combinada com o responsável pela Pokedex antes da implementação
naquele repositório.

Não adicione metadados, como `schemaVersion`, diretamente aos documentos sem
combinar a mudança com a Pokedex: alguns schemas consumidores são estritos.
