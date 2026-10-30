# Ambientes e operações no banco

- O projeto Firebase de produção é **`devfest-triangulo-2026`**. **`devdex-22728` não é produção**, mesmo usando coleções sem prefixo. O nome do projeto e o modo precisam ser conferidos juntos.
- Neste workspace, `.env` contém a configuração de produção; `.env.local` aponta para `devdex-22728` e pode sobrescrever `.env` quando carregado automaticamente. Para operações de produção, leia explicitamente `.env`, sem mesclar `.env.local`, e valide o projeto `devfest-triangulo-2026` antes de qualquer escrita.

- Produção significa `DEV_MODE=false` explícito. Teste significa `DEV_MODE=true`.
- Em produção, as coleções não têm prefixo: `rewards`, `profiles`, `adminUsers` etc. Em teste, recebem `test_`.
- Nunca use o ambiente local como indicação de qual ambiente o usuário pediu: a configuração local pode estar em teste.
- Antes de gravar dados, configure explicitamente o modo solicitado e confira o projeto Firebase, o evento e a coleção resolvida por `getFirestoreCollectionName`. Não exponha credenciais.
- Depois de gravar, releia os registros no mesmo ambiente e confira as quantidades. Não replique, mova ou apague dados entre ambientes sem verificar onde estão e sem autorização correspondente.
- A Pokédex usa a variável `DEVMODE` (sem sublinhado); o site usa `DEV_MODE`. O significado de `false` e `true` é o mesmo.
- Estoque oficial de brindes do DevFest Triângulo 2026: 300 doces, 17 canetas avulsas, 91 blocos, 35 chaveiros, 274 copos, 163 cadernos, 58 garrafas, 53 kits de bloco + caneta e 33 camisetas. Total: 1.024 brindes, contando cada kit como um item.
