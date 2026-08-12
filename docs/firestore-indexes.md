# Índices do Firestore para o admin

Os CRUDs reconstruídos usam o ID do documento para leitura, atualização e
exclusão. As listagens filtram apenas por `eventId`, coberto pelos índices
automáticos de campo único do Firestore.

A programação consulta `eventId` ao validar conflitos de horário por trilha,
coberto pelo índice automático desse campo.

A proteção relacional de palestras consulta `schedule.activity.talkId` e a de
palestrantes consulta `talks.speakerIds` com `array-contains`; ambas usam
índices automáticos de campo único.

Não desative índices para `eventId`, `activity.talkId` ou `speakerIds`.
Os nomes reais das coleções podem receber o sufixo de ambiente definido por
`getFirestoreCollectionName()`.
