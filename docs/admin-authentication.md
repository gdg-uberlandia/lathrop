# Autenticação e autorização administrativa

O painel usa Firebase Authentication com e-mail e senha para comprovar a
identidade. A existência da conta no Authentication não concede acesso ao
painel: a autorização é mantida separadamente na coleção `adminUsers`.

## Provisionamento

Para autorizar uma pessoa administradora:

1. crie ou localize a conta Email/Password no Firebase Authentication;
2. copie o Firebase UID da conta;
3. crie `adminUsers/{uid}` no Firestore;
4. adicione o campo booleano `isActive: true`.

```json
{
  "isActive": true
}
```

Definir `isActive: false` ou remover o documento impede novas autorizações no
painel. O documento e a coleção não são acessíveis pelo Client SDK; somente o
backend, usando Firebase Admin, consulta essa autorização.

## Primeiro login

Depois de validar o token e confirmar que o provedor da sessão é `password`, o
backend executa uma transação que lê `adminUsers/{uid}` e procura o perfil:

1. pelo Firebase UID;
2. pelo e-mail autenticado normalizado;
3. cria `profiles/{uid}` somente quando nenhuma busca encontra um perfil.

Um perfil encontrado é promovido substituindo `accessRoles` por `['admin']`.
Administradores não recebem o papel `participant`. Um perfil criado pelo painel
já nasce com `onboardingCompleted: true` e com todos os campos exigidos pelo
contrato compartilhado com a Pokedex.

Se houver mais de um perfil para o mesmo e-mail, ou conflito entre um perfil
encontrado pelo UID e outro encontrado pelo e-mail, a autorização falha sem
alterar documentos. A duplicidade deve ser resolvida manualmente antes de uma
nova tentativa.

## Integração com a Pokedex

Os projetos usam identificadores diferentes: o painel recebe o Firebase UID,
enquanto a Pokedex usa o `sub` estável da conta Google. Por isso, ambos tentam o
identificador primário e usam o e-mail normalizado como fallback controlado.

Se a Pokedex criou o perfil primeiro, o painel promove esse mesmo documento. Se
o painel criou primeiro, a Pokedex reutiliza o perfil administrativo pelo
e-mail e não cria um participante duplicado. Essa associação exige que as
contas Email/Password e Google usem o mesmo endereço de e-mail.

## Ambientes

O site usa `DEV_MODE=true` para prefixar coleções com `test_`; nesse ambiente,
cadastre a autorização em `test_adminUsers/{uid}` e confira o resultado em
`test_profiles`. Em produção, use `adminUsers/{uid}` e `profiles`.

A Pokedex usa a variável `DEVMODE=true` (sem underscore) para acessar as mesmas
coleções prefixadas durante testes integrados.

## Checklist de teste

- confirme que a conta Email/Password possui o e-mail esperado;
- crie `adminUsers/{uid}` ou `test_adminUsers/{uid}` com `isActive: true`;
- entre no painel e confirme `accessRoles: ['admin']` no perfil;
- entre na Pokedex com o mesmo e-mail Google;
- confirme que nenhum segundo perfil foi criado;
- defina `isActive: false`, encerre a sessão e confirme que o painel retorna
  acesso não autorizado.

## Gestão dos papéis na Pokedex

A seção `/admin/participants` lista os perfis do evento atual, com busca por nome
ou e-mail (ignorando acentos e maiúsculas) e paginação local. A API administrativa
`GET /api/v1/participants` consulta somente a coleção do ambiente e o evento atual.
`PATCH /api/v1/participants` recebe `id` e `accessRoles`, valida exatamente um papel
entre `participant`, `staff`, `reviewer`, `sponsor`, `editor` e `admin`, e altera somente
`accessRoles`, `sponsorCompanyId` e `updatedAt` no perfil, conferindo novamente o evento.
Quando o papel selecionado é `admin` ou o papel anterior era `admin`, a mesma
transação sincroniza a autorização em `adminUsers`.
Ambas as operações exigem autorização administrativa e não permitem cache HTTP.
A listagem é carregada inteira, como as demais listas de conteúdo do painel.

Perfis administrativos usam exclusivamente `admin`, sem acumular outros papéis.
Ao selecionar `admin`, o backend busca a conta no Firebase Authentication pelo
e-mail normalizado do perfil e cria ou reativa `adminUsers/{firebaseUid}` com
`isActive: true`. O UID da conta pode ser diferente do ID do perfil da Pokédex.
Ao substituir `admin` por outro papel, o registro existente é desativado com
`isActive: false`. A reativação preserva os dados e a data de criação existentes.
As alterações do perfil e da autorização são confirmadas na mesma transação,
respeitando o prefixo `test_` quando `DEV_MODE=true`.

A conta precisa existir no Firebase Authentication. Se a busca da conta falhar,
a alteração não é salva parcialmente. O painel continua exigindo login por
Email/Password; a mudança de papel não cria contas nem altera senhas ou provedores.

A edição usa um select de papel único e exige confirmação em modal antes da
persistência. A gravação substitui o papel anterior pelo papel selecionado.

## Acesso de funcionários de empresas

O papel `sponsor` exige uma empresa vinculada e permite somente a validação
de missões presenciais dessa empresa na Pokédex. Consulte
[Funcionários de empresas](./sponsor-missions.md) para configuração e publicação.
