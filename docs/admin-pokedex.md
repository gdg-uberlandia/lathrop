# Painel administrativo da Pokédex

O menu separa Site e Pokédex. O header não oferece cadastro genérico; cada tela
mantém suas próprias ações de criação. O dashboard da Pokédex não oferece filtros
de período ou papel: os endpoints fixam a base em `participant`, com ações a partir
de 31/10/2026 às 08h de Brasília. Pré-cadastros permanecem na base e saldos são
referências atuais; movimentos anteriores à abertura entram somente no saldo inicial.

Tabelas de dados possuem ordenação antes da paginação. Números, percentuais e datas
brasileiros são comparados por valor, não pela representação textual. Imagens,
seleção e botões de ação não são critérios de ordenação. O mapa de calor é uma
visualização cronológica e mantém seus eixos de horário fixos.

As abas Afinidade e Rede de conexões, seus endpoints e análises específicas foram
removidos. Os totais de conexões e os históricos individuais permanecem. Avaliações
usam tabelas, distribuição por nota e comentários, sem gráfico de dispersão. A seção
de qualidade dos dados foi removida.

Relatórios CSV/PDF podem conter uma aba, todas as abas ou uma empresa. Cada seção
traz seus dados e sua metodologia; PDFs usam páginas A4 horizontais, tabelas com
cabeçalhos repetidos, gráficos de barras e mapas de calor. Cada aba inicia em folha
separada; páginas de continuação também são A4 horizontais. Os nomes dos arquivos
CSV/PDF acompanham o tipo da análise ou o nome da empresa. A aba Ganhadores inclui
nome e e-mail, com acesso administrativo. O catálogo atual e os resgates históricos
são tratados separadamente.

## Exclusão de tipos de brinde

`DELETE /api/v1/rewards/:id` exige administrador e `expectedUpdatedAt`. A exclusão
é transacional: marca `active=false`, `deletedAt`, `deletedBy` e `updatedAt` no
documento existente. Se o item foi alterado ou resgatado, a versão precisa ser
recarregada antes de excluir. Repetir uma exclusão já concluída é idempotente.

O item deixa de aparecer no CRUD e nos novos resgates da Pokédex. O nome e os
registros permanecem para auditoria e análise dos resgates anteriores. Não há
exclusão ou compensação automática de tickets, histórico ou estoque. Um ID
arquivado não pode ser reutilizado por criação nem reativado por edição.

A pontuação e os níveis do participante são definidos no repositório da Pokédex,
em `config/scores.ts`, `config/levels.ts` e `modules/progression`.
