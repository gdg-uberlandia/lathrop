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
