# Funcionários de empresas na Pokédex

A tela de participantes permite atribuir exatamente um papel por perfil.
Para `sponsor`, exige selecionar uma empresa ativa do evento. O vínculo é salvo
em `profiles.sponsorCompanyId` na mesma transação que altera `accessRoles`,
relendo a empresa antes de salvar. Ao escolher outro papel, o vínculo é limpo.
O primeiro login na Pokédex cria o perfil que será autorizado no painel.

No formulário de missão, `companyId` identifica a empresa responsável.
Selecionar Organização do evento salva `null`. O vínculo é separado dos
pré-requisitos e permite aos funcionários validar somente missões presenciais
(`validationType: reviewer`) da sua empresa. O painel valida a existência da
empresa no evento. Ativar/desativar uma missão preserva seu vínculo.

A exclusão de empresa é recusada quando ela possui funcionários vinculados,
missões próprias ou missões que exigem sua visita como pré-requisito.
Desativar uma empresa bloqueia novas confirmações por sponsors na Pokédex.
A exclusão e suas consultas de vínculos usam a mesma transação. A criação e
a edição de missões também validam empresas e dependências na transação que
salva a missão, evitando vínculos com empresas excluídas em operações concorrentes.
A edição de empresas relê o documento na transação e não recria uma empresa
removida durante a edição.

Sponsors não recebem acesso ao painel, funções de participante ou atendimento
de tickets/brindes. Revisores e administradores mantêm validação global.
Conclusões preservam `validatedBy` e `validatedAt` para identificar a primeira
confirmação. A empresa é responsável por conferir a atividade presencial.

## Publicação

Publicar primeiro a Pokédex que reconhece `sponsor`, `sponsorCompanyId` e
`companyId`; depois publicar o painel e atribuir os acessos. Registros antigos
sem os campos novos são interpretados com vínculo nulo. Não alterar as Firestore
Rules para liberar escrita pelo cliente: as operações continuam nas APIs
administrativas autenticadas.

## Links adicionais

Qualquer tipo de missão permite até três links opcionais, cada um com texto do
botão (até 60 caracteres) e URL HTTP/HTTPS. O formulário permite adicionar e
remover links sem depender do tipo de validação. Na Pokédex, os botões aparecem
em uma linha com três colunas e abrem em nova aba, sem alterar a conclusão.

O campo `externalLinks` armazena objetos `{ label, url }`. O link antigo em
`externalUrl` é carregado como “Acessar atividade” durante a edição. Ao salvar,
a lista passa a ser usada; uma lista vazia remove os botões.
