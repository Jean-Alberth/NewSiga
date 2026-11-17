# Novo SIGA — Fatec · versão 0.1

Extensão acadêmica para Google Chrome baseada nos PDFs do projeto Novo Siga.
Aplica uma nova aparência ao portal oficial depois do login, preservando o HTML,
os dados, os formulários e os eventos de navegação do SIGA.

## Instalação no Chrome

1. Extraia este ZIP para uma pasta fixa, por exemplo `Documentos/novo-siga`.
2. No Chrome, abra `chrome://extensions`.
3. Ative **Modo do desenvolvedor**, no canto superior direito.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta que contém `manifest.json`, `content.js` e `skin.css`.
6. Acesse https://siga.cps.sp.gov.br/sigaaluno/app.aspx e faça login normalmente.
7. Se o portal já estiver aberto, atualize a página com F5.

Não selecione o ZIP: selecione a pasta extraída que contém o manifest.
Não é necessário instalar Node, executar servidor ou informar senha à extensão.
Depois de editar o código, clique em **Atualizar** na extensão e atualize o SIGA.

## O que está implementado

- Menu lateral: início, meu curso, disciplinas, notas, frequência, horários e histórico.
- Estilo dos cartões de disciplinas, notas e faltas.
- Estilo de aulas, bibliografia, materiais, abas da disciplina e perfil em Meu curso.
- Atualização do menu após mudanças de tela por AJAX.
- Atalhos acionam os elementos originais do SIGA. Quando necessário, abrem Meu curso
  e aguardam a atualização para acionar o segundo botão.
- Botão **Ver portal original** / **Ativar Novo SIGA**.
- Regras de adaptação para janelas menores e impressão.
- Não modifica a tela de login; sem coleta, armazenamento ou envio de dados.

## Limites desta primeira versão

É uma implementação inicial da linguagem visual dos PDFs, não uma reprodução
integral de todas as telas do Figma. Dados do aluno continuam na área Meu curso;
não existe ainda uma página exclusiva de perfil. Calendário pessoal, anotações,
resumo integrado de notas e faltas e nova tela de detalhes unificada ficam para
uma próxima etapa. Não há notas nem avaliações fictícias.

A extensão exibe o que a tela oficial carregou. Ela não consulta automaticamente
outras telas nem calcula média com uma fórmula que não foi confirmada.
Zeros do portal são mantidos como zeros: não são convertidos em "pendente".

A navegação não executa chamadas diretas a uma API privada: usa os cliques já
existentes. Atalhos inexistentes na tela ficam desabilitados; telas não fornecidas
podem exigir ajustes. Mudanças no HTML oficial podem afetar seletores e estilos.
A preferência por desativar o tema vale para a página atual e reinicia após F5.

## Verificação no seu Chrome

Após instalar, confira:

1. Login preservado e tema aplicado depois do acesso.
2. Meu curso, disciplinas e retorno pelos botões originais.
3. Notas: compare os valores e pesos com a aparência original.
4. Faltas: compare aulas, presenças, ausências e frequência.
5. Horários, aulas e bibliografia sem conteúdo faltante.
6. Download de um material pelo botão oficial.
7. Alternância para o portal original e reativação.
8. Sair pelo menu lateral (aciona o botão original).

Para relatar um problema, envie nome da tela, print e mensagens de erro da aba
Console do F12. Não envie senha, cookies, tokens ou conteúdo de requisições.

## Estrutura e execução

`manifest.json`: Manifest V3, acesso restrito a `sigaaluno/app.aspx`.
`content.js`: menu, detecção do login, cliques nativos e MutationObserver.
`skin.css`: regras visuais limitadas a `body.ns-active` e `#ns-panel`.

Não há bibliotecas externas, scripts remotos, permissões de cookies ou backend.
Os arquivos enviados como referência e seus dados pessoais não estão neste pacote.

Projeto acadêmico independente, sem vínculo institucional com o CPS.

## Validação realizada

Sintaxe JavaScript e manifest conferidos. Testes em DOM simulado sobre as 13 telas
fornecidas verificaram preservação integral do formulário original, chamadas aos
handlers nativos (com o sistema GeneXus simulado), alternância do tema, ausência
de menu duplicado, navegação em duas etapas após atualização e login preservado.
Isso não substitui teste visual nem teste de integração no SIGA autenticado.
Não foi possível executar um navegador gráfico neste ambiente.
