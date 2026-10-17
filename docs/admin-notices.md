# Avisos da Pokedex

A seção `/admin/notices` reúne publicação e histórico. O formulário recebe título,
mensagem, caminho interno opcional e a opção de enviar push. Uma prévia em modal
exige confirmação antes da publicação. Somente contas autorizadas por
`requireAdmin` podem consultar ou publicar pela API `GET/POST /api/v1/notices`.

O aviso é salvo primeiro em `notices/{uuid}` com o evento atual, horário e UID do
autor. A Pokedex consulta essa mesma coleção para manter o conteúdo acessível,
mesmo quando o push é dispensado. Não há edição, exclusão ou agendamento nesta
versão. Um UUID estável impede novo disparo ao repetir uma publicação; o UUID
permanece no formulário até a resposta de sucesso. Se a resposta se perder,
consulte a lista antes de iniciar outra publicação.

## Push

Instale as dependências e gere as chaves com `npx web-push generate-vapid-keys`.
Configure no servidor do site:

- `PUSH_ENABLED=true`;
- `VAPID_PUBLIC_KEY`;
- `VAPID_PRIVATE_KEY`;
- `VAPID_SUBJECT`, um contato `mailto:` válido.

Configure somente a mesma chave pública no servidor da Pokedex. Nunca publique
a chave privada. Com `PUSH_ENABLED=true` e sem chaves VAPID, o formulário permite avisos sem push.
Os dois projetos devem compartilhar Firebase, evento e ambiente de coleções:
`DEV_MODE=true` no site corresponde a `DEVMODE=true` na Pokedex (`test_`).

A Pokedex registra cada dispositivo em `pushSubscriptions`, com `eventId`,
`userId`, `endpoint`, `keys` e `updatedAt`. O envio seleciona dispositivos do
evento cujo perfil possui `participant`. O Service Worker abre o aviso pelo ID;
o link opcional é apresentado dentro dele, como um botão.

O envio usa `web-push` dentro da requisição, aguardado em grupos de até 25, com
limite de socket de 5 segundos. Após 40 segundos não começa outro grupo; os
restantes são contados como não processados. A plataforma precisa permitir uma
requisição de pelo menos 60 segundos. Não há fila ou tentativas automáticas.
Push expira no provedor depois de uma hora. Inscrições expiradas (404/410) são
removidas sem apagar registros atualizados simultaneamente.

A lista informa `sending`, `completed`, `partial` ou `disabled`, com números de
envios aceitos, falhas e não processados. Se o processo for encerrado pelo host,
`sending` pode permanecer com contagens parciais; o aviso salvo continua disponível.
Envio aceito não comprova entrega nem leitura. O botão Atualizar resultados
consulta novamente os dados persistidos.

As regras atuais negam acesso via Firebase Client SDK a essas coleções; somente
os backends autenticados acessam os dados. Não há alteração de Firestore Rules.
As leituras individuais ficam na Pokedex em
`noticeReaders/{sha256(eventId:userId)}/reads/{noticeId}` e nunca são modificadas
pelo painel. Dados do evento devem ser eliminados no prazo de retenção de dois
anos, incluindo essas subcoleções.

## Teste integrado

Publique em ambiente de teste, confirme o histórico na Pokedex, ative push no
dispositivo, publique com push e teste clique, dispensa e desativação. Confirme
que dois participantes mantêm leituras independentes. Sem permissão do navegador,
o histórico deve continuar acessível. Não enviar testes ao público de produção.

## Controle global

`PUSH_ENABLED=true` habilita push; `false` ou variável ausente desabilita, mesmo
com chaves válidas. Configure a variável nos dois projetos e reinicie os
serviços ou faça novo deploy. O site bloqueia envios no servidor e desabilita a
opção no formulário; a Pokedex bloqueia novas inscrições e oculta a ativação.
Com a variável desativada, a seção Avisos é ocultada do menu e da busca do
painel, e o acesso direto à página e à API retorna 404. A publicação fica
indisponível, inclusive sem push. O histórico já publicado na Pokedex continua
disponível. As inscrições e chaves
são preservadas para reativação. Push já aceito pelo provedor pode ser entregue
mesmo depois da desativação.

A sessão administrativa informa `pushEnabled`, derivado do ambiente do servidor,
para controlar a navegação sem expor variáveis ou segredos no cliente. Após
alterar a variável, reinicie o servidor e recarregue o painel.
