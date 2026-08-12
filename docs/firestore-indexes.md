# Índices do Firestore para o admin

Os CRUDs reconstruídos usam o ID do documento para leitura, atualização e
exclusão. As listagens filtram apenas por `eventId`, coberto pelos índices
automáticos de campo único do Firestore.

A programação consulta `eventId` e `date` ao validar conflitos. Caso o console
do Firebase solicite um índice composto para essa consulta, crie:

| Coleção    | Campos                    | Uso                        |
| ---------- | ------------------------- | -------------------------- |
| `schedule` | `eventId ASC`, `date ASC` | conflito de sala e horário |

A proteção relacional de palestras consulta `schedule.activity.talkId` e a de
palestrantes consulta `talks.speakerIds` com `array-contains`; ambas usam
índices automáticos de campo único.

Não desative índices para `eventId`, `date`, `activity.talkId` ou `speakerIds`.
Os nomes reais das coleções podem receber o sufixo de ambiente definido por
`getFirestoreCollectionName()`.
