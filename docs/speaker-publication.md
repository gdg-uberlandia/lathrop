# Publicação agendada de palestrantes

## Uso no painel

Para agendar, mantenha o palestrante oculto. No cadastro ou edição, o campo opcional
**Publicar em** aceita uma data futura, no horário de Brasília, com minutos
`:00` ou `:30`. O horário independe do fuso configurado no dispositivo do admin.

- Sem data: a publicação continua manual.
- Com data: permanece oculto, com indicação **Agendado** e data na listagem.
- Reagendar: alterar a data e salvar.
- Cancelar: usar **Cancelar agendamento** e salvar; permanece oculto.
- Publicar antecipadamente: marcar **Visível** e salvar, ou clicar no status
  da listagem. Isso remove o agendamento.
- Excluir o palestrante também remove seu agendamento, respeitando o bloqueio
  existente para palestrantes vinculados a palestras.

A rotina é acionada às `:00` e `:30` de cada hora. A execução pode levar alguns
segundos e sofrer atrasos de infraestrutura. Agendamentos vencidos são
recuperados na execução seguinte, sem depender de alguém abrir o site.
Um palestrante publicado e depois ocultado manualmente não será republicado
por um agendamento já executado.

A publicação muda somente a visibilidade do palestrante. Não ativa palestras,
não abre avaliações e não publica a programação do evento.

## Dados e consistência

O documento compartilhado `speakers/{id}` mantém o contrato atual da Pokédex.
O agendamento fica em `speakerPublications/{speakerId}`:

- `speakerId`: ID do palestrante;
- `eventId`: evento responsável;
- `publishAt`: instante em UTC, como string ISO 8601;
- `updatedAt`: timestamp da última edição.

Em `DEV_MODE=true`, o site usa `test_speakers` e `test_speakerPublications`.
A função deve usar o prefixo correspondente, conforme a configuração abaixo.
As regras atuais do Firestore bloqueiam acesso direto do Client SDK; cadastro,
edição e leitura do agendamento exigem a API administrativa autenticada.

Cadastro e edição gravam palestrante e agendamento na mesma transação. A função
relê ambos dentro de uma transação antes de publicar; assim, cancelamentos e
reagendamentos concorrentes são respeitados. Ela atualiza `isVisible` e
`updatedAt` e exclui a pendência atomicamente. Reexecuções são idempotentes.
A consulta usa apenas igualdade por `eventId` e não requer índice composto.

As páginas públicas com palestrantes e a API de detalhes usam
`Cache-Control: private, no-store`. Isso evita a janela anterior de cache e
stale-while-revalidate após publicação ou ocultação, mas aumenta as leituras
no servidor. Imagens e demais arquivos estáticos mantêm seu cache. Páginas já
abertas precisam ser atualizadas para mostrar o novo estado. Pessoas ocultas
não são enviadas nas propriedades públicas das páginas.

## Ativação no Firebase

O código da função está em `functions/src/index.ts`, no codebase
`speaker-publication`, configurado no `firebase.json`. O deploy normal do
App Hosting **não implanta esta função**. É necessário implantar o site e a
função no mesmo projeto Firebase, com acesso ao mesmo Firestore.

1. Instalar as dependências da função:

   ```sh
   npm ci --prefix functions
   npm run build:scheduler
   ```

2. Definir os parâmetros da função em `functions/.env.<PROJECT_ID>` (arquivo
   local, ignorado pelo Git):

   ```dotenv
   SPEAKER_PUBLICATION_EVENT_ID=devfest-triangulo-2026
   SPEAKER_PUBLICATION_COLLECTION_PREFIX=
   ```

   Para o catálogo de testes, usar `SPEAKER_PUBLICATION_COLLECTION_PREFIX=test_`.
   O valor precisa corresponder ao `DEV_MODE` do site. Produção e testes devem
   usar implantações separadas; uma execução nunca processa os dois catálogos.

3. Implantar somente este codebase, informando explicitamente o projeto:

   ```sh
   firebase deploy --only functions:speaker-publication --project <PROJECT_ID>
   ```

   A CLI cria a função `publishScheduledSpeakers` e seu Cloud Scheduler com
   cron `0,30 * * * *`, fuso `America/Sao_Paulo`, na região `us-east1`.
   O projeto precisa estar habilitado para funções agendadas. Consulte a
   [documentação oficial de funções agendadas](https://firebase.google.com/docs/functions/schedule-functions).

4. Depois do deploy do site e da função, confirmar no Cloud Scheduler o job
   ativo e o intervalo. No ambiente de testes, agendar um palestrante para o
   próximo horário, verificar que está oculto antes e visível depois. Verificar
   também cancelamento, reagendamento e publicação manual antecipada.

A função registra a quantidade publicada por execução. Em falhas, há até três
retentativas com espera entre 60 e 300 segundos; isso não altera a frequência
normal de 30 minutos. Verificar logs de `publishScheduledSpeakers` se um
agendamento permanecer pendente após o horário.

A configuração foi preparada no repositório; o recurso só fica ativo no ambiente
após esses deploys. Não há publicação automática executada pelo navegador.

## Validação local

```sh
npm test
npm run lint
npm run build:scheduler
npm run build
```

Os testes cobrem fuso, horários inválidos e passados, contrato administrativo,
publicação no limite, recuperação de atrasados, cancelamento e reagendamento
entre consulta e transação, reexecução, exclusão e isolamento entre eventos e
coleções de teste. Os testes da rotina usam uma implementação em memória da
interface de persistência; a validação final do Cloud Scheduler é feita no
ambiente implantado.
