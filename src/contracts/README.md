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

1. Identificar se a mudança é retrocompatível.
2. Copiar campos, enums, nulabilidade, limites e regras relacionais.
3. Atualizar primeiro o schema do servidor e depois o formulário.
4. Validar um documento completo com o schema, incluindo timestamps.
5. Confirmar com o responsável pela Pokedex antes de introduzir um campo que o
   schema estrito dela ainda não reconheça.

Não adicione metadados, como `schemaVersion`, diretamente aos documentos sem
combinar a mudança com a Pokedex: alguns schemas consumidores são estritos.
