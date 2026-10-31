# Refatoração dos estilos — PokéRota Lógica

Data: 31/10/2026. Base: `main` em `554ed0a31da04cabc26fbf6f3bbbc08e002be4b4`.
Branch de revisão: [refactor/padronizacao-css](https://github.com/josibatista/pokerota-logica/tree/refactor/padronizacao-css).

A refatoração foi executada, sem alterações nos modelos, controladores ou serviços. O build passou. Há duas pendências anteriores de lint e limitações de autenticação neste ambiente, detalhadas abaixo. Não foi realizado merge nem aberto PR.

## Diagnóstico

- `index.css` e `App.css` ainda continham o CSS do template Vite: contador, hero, links de documentação e redes sociais, variáveis roxas e estilos de código. Esses elementos não existem na aplicação.
- `#root` tinha definições concorrentes nos dois arquivos. O tema do sistema operacional também definia cores globais, independentemente do tema do layout.
- Home, seleção de personagem, conta e conclusão repetiam dimensões, tipografia, bordas, estados e espaçamento de botões.
- Cabeçalho e controles direcionais repetiam os botões circulares e dimensões dos ícones.
- As duas seleções repetiam containers, cartões, fundos, bordas e estados de seleção.
- Cores fixas deixavam títulos, descrições e nomes com pouco contraste no tema escuro; o diálogo permanecia branco.
- O grid mobile de fases tinha duas colunas, mas os cartões mantinham `span 2` e posicionamentos de um grid de seis colunas. O resultado eram cartões com larguras diferentes e colunas implícitas.
- O lockfile continha trechos duplicados e malformados de `@types/react`, `csstype` e `minimatch`, impedindo `npm ci` antes de qualquer alteração visual.

## Organização adotada

| Arquivo | Responsabilidade |
| --- | --- |
| `src/index.css` | Tipografia base, margem do body, estrutura do root e reset de parágrafos restrito à aplicação |
| `src/view/styles/tema.css` | Variáveis semânticas dos temas e cores existentes da marca e das ações |
| `src/view/styles/componentes.css` | Bases opt-in de botões, variantes, ícones, áreas de ações, containers e cartões de seleção e títulos de página |
| `src/view/components/layouts/estrutura.css` | Layout, painel, cabeçalho e logo |
| `src/view/components/BotoesDirecionais.css` | Grid e estados próprios dos controles direcionais |
| CSS das páginas e demais componentes | Composição, espaçamento, imagens e particularidades locais |

Os estilos compartilhados são importados em `App.jsx`, antes dos componentes que importam os estilos locais. As classes BEM específicas continuam nos componentes. As bases compartilhadas são aplicadas explicitamente, sem regras globais para todos os botões ou imagens.

Variantes de botão: painel, primário, Google, confirmar seleção, secundário, perigo com contorno, destrutivo e ícone. A variante Google mantém fundo branco e a cor vermelha; os botões de seleção e exclusão preservam seus tons anteriores. Variáveis locais controlam diferenças necessárias de foco, tamanho e opacidade. O reinício sobreposto ao mapa continua com suas regras próprias.

Não foi criado um componente React genérico com novas props: as classes compartilhadas resolvem a repetição visual sem modificar handlers, navegação ou contratos existentes. Não há biblioteca nova de estilos.

## Arquivos

Criados:

- `src/view/styles/tema.css`
- `src/view/styles/componentes.css`
- `src/view/components/BotoesDirecionais.css`
- `tests/estilos.spec.js`
- `tests/fixtures/estilos.html`
- `tests/fixtures/estilos.jsx`
- `scripts/capturar-estilos.mjs`
- `scripts/medir-css.mjs`
- Este relatório e registros em `docs/refatoracao-css/`; comparações de imagem geradas localmente.

Removido: `src/view/App.css`, após retirar os seletores não utilizados e consolidar a estrutura do root.

Modificados:

- `package-lock.json`: reparo estrutural e normalização pelo npm, preservando as versões originalmente registradas; `package.json` não foi alterado.
- `playwright.config.js`: import explícito de `process`, porta padrão 5174 e opções de ambiente.
- `src/index.css` e `src/view/App.jsx`.
- `src/view/components/{BotoesDirecionais,CartaoFase,CartaoPersonagem,FinalizacaoFase}.jsx` e `FinalizacaoFase.css`.
- `src/view/components/conta/{ConfirmacaoExclusao,GerenciamentoConta}.{jsx,css}`.
- `src/view/components/layouts/Cabecalho.jsx` e `estrutura.css`.
- `src/view/pages/Configuracoes.jsx`.
- `src/view/pages/{Home,Jogo,SelecaoNivel,SelecaoPersonagem}.{jsx,css}`.

Nos JSX de produção, as alterações são de classes de apresentação e da cor da estrela decorativa. Não foram alterados movimentação, colisões, autenticação, persistência, progresso ou navegação.

## Duplicações e métricas

| Métrica em `src/**/*.css` | Antes | Depois | Variação |
| --- | ---: | ---: | ---: |
| Arquivos | 10 | 12 | +2 |
| Linhas | 1.441 | 1.079 | −362 (25,1%) |
| Declarações textuais | 806 | 606 | −200 |
| Repetições exatas excedentes de propriedade/valor | 390 | 241 | −149 (38,2%) |

Reprodução: `node scripts/medir-css.mjs 554ed0a`.

A última métrica soma `ocorrências - 1` para cada par textual de propriedade/valor. Não representa 149 regras necessariamente removíveis: repetições em contextos ou media queries distintos podem ser corretas. O ganho principal é haver uma fonte compartilhada para componentes equivalentes, preservando suas diferenças.

Foram centralizados tipografia/bordas/estados de botões, controles circulares, ícones de 20 px, áreas de ações, containers das seleções, superfícies dos cartões e bordas de seleção. Foram removidos o template Vite, o subtítulo da Home e o placeholder de personagem sem uso, uma mensagem de jogo sem referência e regras redundantes do canvas. O `!important` que neutraliza o tamanho inline do p5 foi preservado, assim como unidades de container, proporção 8:5, palco, limites e sobreposição do reinício.

## Comparação visual

Foram capturados 61 cenários por versão: sete estados/telas × quatro viewports × dois temas, um personagem selecionado e os mapas 2–5 em desktop. Houve ainda oito capturas por versão do Hall da Fama. Viewports: 1366×900, 768×1024, 390×844 e 844×390.

A versão anterior foi executada em um checkout separado, com a mesma ordem de estilos da aplicação e as mesmas dependências reparadas. Os tamanhos e posições dos elementos medidos coincidem, exceto pelos cartões de fases no mobile, corrigidos intencionalmente. Não houve overflow horizontal do documento nos 61 cenários principais de cada versão. O conteúdo maior que o painel continua acessível pela rolagem interna, e telas baixas mantêm rolagem vertical da página.

As sete capturas desktop no tema claro (Home, fases, personagens, jogo, conta, exclusão e conclusão) ficaram idênticas pixel a pixel em PNG. As comparações WebP foram reduzidas para facilitar a revisão; a igualdade foi medida nas capturas PNG originais, antes da conversão. As imagens foram inspecionadas e permanecem no ambiente de trabalho, fora da branch pública. A revisão automática bloqueou o upload de uma imagem binária ao GitHub por não reconhecer autorização específica para essa divulgação. A publicação foi limitada a código, relatório textual e registros de verificação; as imagens podem ser apresentadas na conversa e as capturas atuais podem ser reproduzidas pelo script.

| Comparação | Resultado |
| --- | --- |
| Home clara | Sem mudança visual |
| Home escura | Título e texto auxiliar legíveis |
| Seleção de fases no mobile | Duas colunas reais, cartões de mesma largura |
| Personagens | Aparência clara preservada |
| Jogo no mobile | Canvas, proporção e controles preservados |
| Exclusão no tema escuro | Diálogo e ações acompanham o tema |
| Hall no tema escuro | Avisos acompanham o tema; posicionamento preservado |
| Conclusão | Aparência clara preservada |

Os temas foram exercitados pelo tema do layout na montagem de teste. A aplicação já tinha essas classes e a prop `tema`; não foi implementado um novo seletor de tema.

### Limites da validação visual

Home e demonstração foram acessadas na aplicação real. Para revisar fases, personagens, conta, exclusão e conclusão de forma estável, a montagem isolada em `tests/fixtures/` renderiza os componentes e páginas reais com identidade/callbacks fictícios. O serviço de progresso é substituído apenas no navegador de teste. Não se trata de validação de leitura ou gravação real no Firestore nem de login real.

Os cinco mapas renderizaram, e a transição ao Hall foi percorrida por eventos de teclado para conferir os avisos. A conclusão também foi inspecionada isoladamente. Isso não equivale a uma execução completa das regras dos cinco mapas.

Botões de recuperação que antes usavam a aparência padrão do navegador receberam a variante de painel. Essa é uma padronização visual intencional dos estados de erro.

## Validação técnica

| Verificação | Resultado |
| --- | --- |
| `npm ci` | Passou após reparar o lockfile |
| `npm run build` | Passou; permanece o aviso anterior de chunk JS acima de 500 kB |
| `npm run lint` | Duas falhas preexistentes; nenhuma nova falha de lint |
| Oito testes de estilos | Todos passaram nos dois temas e quatro viewports |
| Suíte completa `npm run test:e2e -- --fully-parallel --workers=3` | 11 passaram, 7 falharam na abertura do popup de autenticação |
| `git diff --check` | Sem erros |
| Porta da aplicação e testes | 5174, com `--strictPort` |

O lint original tinha quatro erros. O import de `process` no arquivo de configuração resolveu dois. Permanecem:

1. `PersonagemContext.jsx`: `react-refresh/only-export-components`.
2. `Jogo.jsx`: `react-hooks/set-state-in-effect`, no efeito que redefine a conclusão ao trocar de fase.

Esses pontos não foram suprimidos nem refatorados, pois não pertencem ao CSS e o segundo envolve o estado do jogo.

Os sete testes de autenticação falharam esperando o evento `popup`, antes de validar os estilos das telas autenticadas. Os dois testes de proteção de rotas e o smoke passaram. Os casos de entrada (`CT-AUT-001`) e cancelamento (`CT-AUT-002`) foram repetidos na versão original em checkout separado e falharam no mesmo ponto. Há, portanto, evidência de uma limitação anterior às mudanças de estilo neste ambiente; a causa de infraestrutura não foi isolada completamente e os fluxos autenticados não são declarados aprovados.

Os novos testes conferem ausência de overflow horizontal, grid mobile, seleção e estado disabled, foco por teclado, hover dos botões da Home e direcionais e preservação do fundo do botão Cancelar, canvas contido com proporção preservada, quatro controles direcionais, duas confirmações de exclusão e botão de próxima fase desabilitado. A montagem não altera o código de produção e não exclui contas reais.

Registros completos: [verificacao/](verificacao/), incluindo resultados, métricas e medidas antes/depois.

### Ambiente e reprodução

A aplicação foi iniciada com:

```bash
npm run dev -- --host 0.0.0.0 --port 5174 --strictPort --mode test
```

O modo `test` é o já previsto pelo projeto para usar o Firebase Auth Emulator sem credenciais de produção. Fora dos testes, o comando solicitado permanece:

```bash
npm run dev -- --host 0.0.0.0 --port 5174 --strictPort
```

Para a suíte completa, iniciar o emulador conforme o projeto e executar `npm run test:e2e`. Para somente a validação de estilos: `npm run test:e2e -- tests/estilos.spec.js`. Para novas capturas, com o servidor em modo `test` ativo: `node scripts/capturar-estilos.mjs`.

Opções de configuração dos testes: `PLAYWRIGHT_PORT` (padrão 5174), `PLAYWRIGHT_BASE_URL`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` e `PLAYWRIGHT_PROXY_SERVER`. Se mudar a porta do servidor, configure também a base URL de forma compatível. Não há mudança silenciosa para 5173 e o servidor de testes não reutiliza outro servidor.

Neste container, processos iniciados em chamadas distintas não compartilham a rede local. Por isso, servidor, navegador e emulador foram executados juntos em cada verificação. O Vite também precisou de um adaptador temporário, fora do repositório, para sua consulta a interfaces de rede; isso só afeta a impressão das URLs, sem trocar a porta ou o endereço de bind. O download padrão do Chromium retornou um arquivo inválido, e foi usado um Chromium local obtido pelo pacote de registro npm `@sparticuz/chromium`, sem adicioná-lo às dependências do projeto.

## Commits e entrega

- `fix: reparar estrutura invalida do lockfile`
- `refactor: centralizar temas e padronizar componentes visuais`
- `test: validar estilos nos dois temas e em quatro tamanhos de tela`
- `test: organizar captura visual e metricas de css`
- `test: conferir hover dos botoes compartilhados`
- `docs: registrar resultados e comparacoes da refatoracao css`

A publicação utiliza a integração GitHub, pois o Git local não dispõe de credencial HTTPS. A sequência de commits é mantida e as árvores publicadas são comparadas às árvores locais. Os hashes de commits gerados pela integração diferem dos hashes locais por metadados de autoria/data. A branch é criada sem sobrescrever uma referência anterior e sem force push.

Commits publicados antes do commit deste relatório:

| Hash no GitHub | Responsabilidade |
| --- | --- |
| `cf92123` | fix: reparar estrutura invalida do lockfile |
| `e290601` | refactor: centralizar temas e padronizar componentes visuais |
| `fc3ba2e` | test: validar estilos nos dois temas e em quatro tamanhos de tela |
| `d682bc7` | test: organizar captura visual e metricas de css |
| `e0ca196` | test: conferir hover dos botoes compartilhados |

## Pendências e melhorias futuras
- Reexecutar os testes de autenticação em um ambiente que consiga abrir o popup do emulador; eles não estão aprovados nesta entrega.
- Tratar os dois erros restantes de lint em trabalho separado, com revisão do estado do jogo.
- A configuração de tema já existia, mas ainda depende do valor passado ao layout; a tela atual não implementa troca de tema.
- Avaliar separadamente carregamento de assets/chunks e o aviso de bundle. Isso não foi misturado à refatoração de estilos.
- Manter cores e bases comuns nos arquivos compartilhados; reservar os CSS locais para composição e comportamentos específicos.

A verificação adicional de hover passou nos oito cenários, com as imagens da Home aguardadas antes da interação.

Não há regressão visual conhecida nas telas inspecionadas. A branch está preparada para revisão com as ressalvas de lint e autenticação acima, sem afirmar aprovação integral da suíte.
