# Cache da área administrativa

O painel usa um único `QueryClient` enquanto o usuário navega pelas rotas
administrativas. As chaves seguem o formato `["admin", entidade]`, permitindo
compartilhar e invalidar dados sem acoplar páginas e formulários.

## Política local

- Dados permanecem frescos por 60 segundos (`staleTime`).
- Queries inativas permanecem no cache por 10 minutos (`gcTime`).
- Trocar o foco da janela não dispara uma nova leitura automaticamente.
- Falhas transitórias recebem uma nova tentativa.
- Erros `400`, `401`, `403` e `422` não recebem retry.
- O `AbortSignal` fornecido pelo TanStack Query cancela leituras substituídas.
- Mutations atualizam o cache diretamente quando a resposta é suficiente.
- Entidades agrupadas ou ordenadas pelo servidor são invalidadas e recarregadas
  após mutations.

## Sincronização com a Pokedex

O cache do site e o cache da Pokedex são independentes. Uma gravação feita pelo
admin atualiza imediatamente o cache do site, mas não pode invalidar diretamente
o `unstable_cache` mantido pela Pokedex.

Por enquanto, a Pokedex observa as mudanças após o tempo de revalidação definido
por ela. O site não chama rotas internas nem importa código da Pokedex. Caso seja
necessária consistência imediata, será preciso combinar um endpoint autenticado
de invalidação ou um evento assinado entre os responsáveis pelos dois projetos
antes de qualquer alteração na Pokedex.
