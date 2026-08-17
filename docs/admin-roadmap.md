# Roadmap da área administrativa

Este documento orienta a reconstrução incremental da área administrativa do
DevFest. O objetivo é oferecer um painel seguro, rápido e consistente, capaz de
gravar documentos compatíveis com os contratos consumidos pela Pokedex.

## Princípios

- A Pokedex é a referência funcional para entidades compartilhadas.
- O site mantém cópias locais e independentes dos contratos.
- Alterações na Pokedex exigem autorização prévia do responsável pelo projeto.
- `sponsors` e `companies` são domínios separados.
- O banco será iniciado do zero; não haverá compatibilidade com dados legados.
- Toda mutação administrativa passa pelas APIs do site.
- UX e UI devem permanecer consistentes em todas as entidades.
- Páginas legadas podem ser descartadas quando a reconstrução for mais segura.
- Não serão criados novos testes automatizados no repositório do site; a suíte
  existente será apenas preservada durante as alterações.

## Estado atual

- [x] Login por e-mail e senha com sessão persistente.
- [x] Validação do token Firebase nas APIs administrativas.
- [x] Contratos locais para missões, tags, companies, sorteios e recompensas.
- [x] Contratos compatíveis de palestrantes e palestras.
- [x] CRUD de missões migrado para o contrato da Pokedex.
- [x] Autorização por papel administrativo.
- [ ] Regras restritivas do Firestore.
- [ ] Fundação compartilhada de API, cache e componentes CRUD.

## Fase 1 — Segurança e fundação

### 1. Autorização administrativa

Separar autenticação de autorização. Firebase Authentication comprova a
identidade, `adminUsers/{uid}` autoriza o acesso administrativo e o perfil
materializa o papel efetivo:

```ts
{
  accessRoles: ["admin"];
}
```

Entregas:

- [x] Criar `requireAdmin()` para validar token e `adminUsers/{uid}`.
- [x] Criar ou promover o perfil administrativo no primeiro login autorizado.
- [x] Resolver perfis compartilhados por UID e e-mail sem criar duplicatas.
- [x] Substituir `requireAuth()` nas APIs administrativas.
- [x] Retornar `401` para sessão inválida e `403` para usuário sem papel.
- [x] Criar experiência de acesso não autorizado.
- [x] Atualizar a autorização quando `accessRoles` for alterado.
- [ ] Registrar operador e horário nas mutações administrativas.

Critério de aceite: somente uma conta Email/Password com
`adminUsers/{uid}.isActive == true` acessa páginas e APIs administrativas.

O primeiro login autorizado cria um perfil compatível com a Pokedex ou promove
o perfil encontrado, substituindo `accessRoles` por `["admin"]`. O fluxo está
detalhado em [Autenticação e autorização administrativa](./admin-authentication.md).

### 2. Regras do Firestore

- [x] Remover a regra global de escrita para usuários autenticados.
- [x] Bloquear escrita direta nos catálogos administrativos.
- [x] Manter somente a leitura pública do sinal mínimo do telão.
- [x] Proteger sorteios, recompensas e operações.
- [ ] Testar as regras com usuário anônimo, participante e administrador.

Critério de aceite: os catálogos só podem ser alterados pelo servidor usando o
Firebase Admin SDK.

As regras foram alinhadas à matriz de acesso documentada pela Pokedex. A
publicação no Firebase é uma etapa operacional separada e não acontece
automaticamente durante o build ou deploy de hosting.

### 3. Contratos locais

- [x] Mover os contratos de palestrantes e palestras para `src/contracts`.
- [x] Criar schemas separados de documento, criação e atualização.
- [x] Adicionar fixtures válidas para cada entidade.
- [x] Adicionar testes de compatibilidade e regras relacionais.
- [x] Centralizar a resolução do nome das coleções por ambiente.
- [x] Documentar o processo de sincronização com a Pokedex.

Critério de aceite: nenhum endpoint grava um documento sem validar seu contrato.

### 4. Cliente administrativo de API

- [x] Centralizar obtenção e renovação do token.
- [x] Centralizar headers e serialização.
- [x] Tratar `401`, `403` e erros de validação.
- [x] Cancelar requisições obsoletas.
- [x] Remover clientes Axios duplicados por feature.

Estrutura sugerida:

```text
src/lib/admin-api/
  client.ts
  errors.ts
  missions.ts
  speakers.ts
  talks.ts
```

### 5. Cache e sincronização de estado

Adotar TanStack Query ou SWR. TanStack Query é a preferência inicial.

- [x] Compartilhar cache entre páginas.
- [x] Deduplicar requisições.
- [x] Invalidar queries depois de mutations.
- [x] Definir retry e stale time.
- [x] Evitar loaders globais para operações locais.
- [x] Definir estratégia de invalidação do cache da Pokedex.

Critério de aceite: navegar entre listagem e formulário não recarrega dados que
ainda estão válidos.

## Fase 2 — Estrutura de UX/UI

### 6. Layout administrativo

- [x] Usar uma única estratégia de layout em todas as páginas.
- [x] Destacar a rota ativa na sidebar.
- [x] Adicionar breadcrumbs.
- [x] Melhorar responsividade da sidebar e das tabelas.
- [x] Padronizar sessão carregando, acesso negado e erro.
- [x] Remover imports, comentários e itens de menu obsoletos.

### 7. Componentes CRUD compartilhados

- [x] `AdminPageHeader`.
- [ ] `AdminDataTable`.
- [x] `AdminFormPage`.
- [ ] `AdminFormSection`.
- [x] `AdminEmptyState`.
- [x] `AdminErrorState`.
- [x] `AdminLoadingState`.
- [x] `AdminDeleteDialog`.
- [x] `AdminStatusBadge`.
- [ ] `AdminImageField`.
- [ ] `AdminSlugField`.

Critério de aceite: todas as entidades seguem a mesma hierarquia visual e os
mesmos estados de interação.

### 8. Feedback e formulários

- [x] Toasts de sucesso e erro.
- [ ] Mensagens da API junto aos campos quando aplicável.
- [x] Bloqueio contra submissão duplicada.
- [x] Preservação dos dados quando a gravação falhar.
- [x] Aviso de alterações não salvas.
- [x] Foco automático no primeiro erro.
- [ ] Labels acessíveis em todos os botões.
- [ ] Padronização integral dos textos em português.

## Fase 3 — Entidades

### 9. Missões

- [x] Adotar o contrato compatível com a Pokedex.
- [x] Suportar QR, reviewer e progresso automático.
- [x] Suportar ordem, XP, status e pré-requisitos.
- [x] Trocar IDs digitados por seletores de missões e companies.
- [x] Impedir dependências circulares.
- [x] Exibir e permitir baixar o QR público.
- [x] Adicionar filtros e ativação rápida.
- [ ] Adicionar testes do CRUD completo.

### 10. Tags

- [x] Criar CRUD de tags.
- [x] Gerar UUID público.
- [x] Suportar imagem, XP, ordem e status.
- [x] Exibir e permitir baixar o QR público.
- [x] Adicionar busca, filtros e testes.

### 11. Palestrantes

- [x] Migrar a tela para a estrutura CRUD comum.
- [x] Padronizar identificador, foto, biografia e redes sociais.
- [x] Adicionar busca e filtro por visibilidade.
- [x] Impedir exclusão enquanto houver palestras relacionadas.
- [x] Adicionar testes relacionais.

### 12. Palestras

- [x] Migrar a tela para a estrutura CRUD comum.
- [x] Melhorar seleção de palestrantes.
- [x] Filtrar por formato, avaliação e status.
- [x] Manter relacionamentos por `speakerIds`.
- [x] Adicionar testes relacionais.

### 13. Patrocinadores

Sponsors permanecem separados de companies.

- [ ] Substituir arrays por um documento por patrocinador.
- [ ] Adicionar `eventId`, status, ordem e timestamps.
- [ ] Agrupar por nível somente na apresentação.
- [x] Adicionar busca, filtros e paginação.
- [ ] Corrigir métricas e estado após mutations.
- [ ] Adicionar testes.

### 14. Prêmios de sorteio

- [x] Criar CRUD para o catálogo `raffles`.
- [x] Cadastrar nome, descrição, imagem, ordem e status.
- [x] Inicializar campos operacionais de forma segura.
- [x] Impedir edição manual de vencedor e dados do sorteio.
- [x] Manter a execução do sorteio sob responsabilidade da Pokedex.
- [x] Adicionar testes.

### 15. Recompensas

Recompensas trocadas por tickets são diferentes de prêmios de sorteio.

- [ ] Confirmar se o gerenciamento fará parte deste admin.
- [ ] Criar CRUD separado, se aprovado.
- [ ] Suportar custo, estoque, limite, status e ordem.

### 16. Companies

Companies permanecem separadas de patrocinadores.

- [x] Confirmar se o gerenciamento fará parte deste admin.
- [x] Criar CRUD compatível com a Pokedex.
- [x] Integrar a seleção de companies aos pré-requisitos de missões.
- [x] Impedir exclusão de company usada por uma missão.

### 17. Programação

A implementação atual pode ser descartada.

- [x] Definir um contrato local sem dependência de legado.
- [x] Referenciar palestras por `talkId`.
- [x] Modelar as trilhas fixas e sua ordem automática.
- [x] Modelar intervalos, abertura e encerramento com união discriminada.
- [x] Tratar abertura, intervalo e encerramento como slots gerais sem trilha.
- [x] Associar abertura e encerramento ao catálogo de palestras.
- [x] Usar data e timestamps, não apenas strings de horário.
- [x] Detectar conflitos de horário.
- [x] Remover tipos `any` da programação administrativa.
- [x] Remover delays artificiais.
- [x] Criar visualização prévia da agenda.
- [x] Adicionar testes do contrato.

## Fase 4 — Desempenho e operação

### 18. APIs e Firestore

- [x] Usar consultas diretas por ID nos CRUDs reconstruídos.
- [x] Remover varreduras completas dos CRUDs reconstruídos.
- [x] Adicionar paginação e filtros nas listagens administrativas.
- [x] Documentar índices necessários.
- [ ] Usar transações em alterações relacionais.
- [x] Retornar status HTTP corretos nos CRUDs reconstruídos.
- [x] Nunca converter falha em resposta `200` com `null` nos CRUDs reconstruídos.
- [x] Evitar arrays crescentes nos novos documentos.

### 19. Dashboard

- [ ] Consumir dados do cache compartilhado.
- [x] Corrigir contagem de patrocinadores.
- [x] Exibir cadastros incompletos e conflitos.
- [x] Exibir palestras sem programação.
- [x] Exibir contagens de entidades ativas.
- [x] Remover carregamentos e recursos decorativos desnecessários.

### 20. Testes e observabilidade

- [x] Testar contratos e fixtures.
- [ ] Testar criação, atualização e exclusão.
- [x] Testar `requireAdmin()`.
- [x] Testar acesso sem token e sem papel.
- [ ] Testar relacionamentos e timestamps.
- [ ] Testar nomes de coleção por ambiente.
- [ ] Adicionar logs estruturados de mutações administrativas.
- [ ] Registrar operador, entidade, ID e horário.

## Ordem de execução

1. Autorização administrativa.
2. Regras do Firestore.
3. Contratos e testes.
4. Cliente de API e cache.
5. Layout e componentes CRUD.
6. Missões.
7. Tags.
8. Palestrantes e palestras.
9. Patrocinadores.
10. Prêmios de sorteio.
11. Programação.
12. Dashboard, desempenho e observabilidade.

Cada item deve ser implementado, validado e revisado antes do próximo. Mudanças
de contrato que afetem a Pokedex devem ser discutidas antes de qualquer alteração
no outro repositório.
