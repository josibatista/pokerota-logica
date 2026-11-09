# Plano de testes — PokéRota Lógica

**Versão:** 1.1

## 1. Objetivo
Planejar a validação funcional do jogo educativo PokéRota Lógica, com casos BDD e automação incremental com Playwright.

## 2. Escopo
**Nesta etapa:** RF01–RF23, abrangendo autenticação, interface, movimentação, fases e persistência. Os **33 casos de teste funcionais** estão distribuídos em cinco conjuntos, disponíveis em [`casos-funcionais/`](casos-funcionais/).

**Passos futuros:** RNF01–RNF07 ficam fora da execução atual. Em etapa posterior, planejar segurança, cobertura de código, desempenho, acessibilidade, escalabilidade, compatibilidade e privacidade, com critérios e ferramentas próprios.

## 3. Estratégia
- **Níveis:** sistema/E2E e integração de fluxos relevantes.
- **Técnicas:** BDD (Dado/Quando/Então), cenários positivos/negativos, transição de estados e limites de movimentação.
- **Execução:** manual durante desenvolvimento; automação Playwright quando o módulo correspondente estiver implementado.
- **Ambiente:** Vite local, Firebase Authentication Emulator e Firestore Emulator, utilizando contas fictícias e dados de progresso isolados no projeto `demo-pokerota`. Os testes de integração com serviços reais e os demais módulos terão seus ambientes preparados conforme a implementação.
- **Ferramenta:** Playwright Test (Chromium inicial).
- **Prioridade:** seguir a prioridade declarada no documento de [requisitos](../requisitos.md).

## 4. Critérios de entrada e saída
**Entrada:** funcionalidade disponível, ambiente funcionando e dados preparados.  
**Saída:** casos planejados para a entrega executados, resultados/evidências registrados, defeitos relevantes relatados e regressão realizada. 

## 5. Priorização e riscos
**Alta:** RF01, RF02, RF04, RF08, RF09, RF11, RF12, RF13, RF15, RF20, RF21.  
**Média:** RF03, RF05, RF14, RF22, RF23.  
**Baixa:** RF06, RF07, RF10, RF16, RF17, RF18, RF19.  

**Riscos:** dependência de autenticação Google/Firebase, dados de progresso persistentes, mudanças na interface e dificuldade de inspecionar diretamente elementos desenhados em Canvas.  

## 6. Cronograma de testes

| Período | Atividade | Conjuntos de casos de teste |
|---|---|---|
| 12/10–18/10 | Testar/automatizar autenticação. | `autenticacao.md` |
| 29/10–08/11 | Testar/automatizar tela principal e personagem. | `interface.md`, `movimentacao.md`, `fases.md` |
| 09/11–15/11 | Testar/automatizar tela de jogo, movimentação, colisões e iniciar testes de persistência. | `movimentacao.md`, `fases.md`, `progresso.md` |
| 16/11–22/11 | Testar/automatizar configurações, pausa e regras; complementar testes de persistência e executar regressão. | `interface.md`, `movimentacao.md`, `fases.md`, `progresso.md` |
| 23/11–30/11 | Execução geral, regressão e documentação final. | Todos os conjuntos: `autenticacao.md`, `interface.md`, `movimentacao.md`, `fases.md` e `progresso.md` |

## 7. Artefatos
**Total:** 33 casos de teste funcionais, distribuídos em cinco conjuntos.  
Casos BDD: `casos-funcionais/*.md`; rastreabilidade: `matriz-rastreabilidade.md`; configuração: `playwright.config.js`. Registrar por execução: ID, data, ambiente, resultado (passou/falhou/bloqueado/não executado), evidência e defeito associado.


## 8. Execução dos testes automatizados

### Preparação

Na raiz do projeto, instale as dependências e o navegador utilizado:

```bash
npm install
npx playwright install chromium
```

Os emuladores são configurados em `firebase.json`, com as regras de acesso ao Firestore definidas em `firestore.rules`. Para sua execução, é necessário possuir uma versão compatível do Java instalada.

O Playwright inicia o Vite automaticamente no modo `test`, em `http://127.0.0.1:5174`, sem reutilizar um servidor de desenvolvimento já aberto.

Nesse modo, a aplicação utiliza o projeto fictício `demo-pokerota`, com os seguintes serviços:

- **Authentication Emulator:** `http://127.0.0.1:9099`, utilizado para autenticação com contas fictícias.
- **Firestore Emulator:** `http://127.0.0.1:8080`, utilizado para armazenamento, consulta e exclusão dos dados de progresso.
- **Emulator Suite UI:** `http://127.0.0.1:4000`, utilizada para inspeção dos serviços e dados locais.

O comando habitual `npm run dev` continua utilizando a configuração Firebase do ambiente de desenvolvimento.

### Executar a suíte

Em um terminal, inicie os emuladores e mantenha-os abertos:

```bash
npx firebase emulators:start --only auth,firestore --project demo-pokerota
```

Em outro terminal, execute a suíte completa:

```bash
npm run test:e2e
```

Não é necessário iniciar o Vite manualmente.

Para executar separadamente os conjuntos de testes:

```bash
npx playwright test tests/autenticacao.spec.js
npx playwright test tests/smoke.spec.js
npx playwright test tests/fases.spec.js
npx playwright test tests/personagem.spec.js
npx playwright test tests/progresso.spec.js
```

### Investigar falhas

Para executar os testes em sequência, com navegador visível e registro dos passos:

```bash
npx playwright test --headed --workers=1 --trace=on
```

Para abrir o relatório da última execução:

```bash
npx playwright show-report
```

Os resultados gerados em `test-results/` e `playwright-report/`, assim como os logs dos emuladores, não devem ser versionados. As evidências necessárias à entrega devem ser selecionadas e registradas separadamente.

### Cobertura atual

A suíte contempla 26 testes automatizados, distribuídos em cinco arquivos:

- `tests/smoke.spec.js`: 1 teste de carregamento inicial da Home e opções de acesso.
- `tests/autenticacao.spec.js`: 9 testes, abrangendo CT-AUT-001 a CT-AUT-006 e verificações complementares de proteção das rotas privadas e cancelamento da exclusão.
- `tests/fases.spec.js`: 4 testes, abrangendo CT-FAS-001, CT-FAS-002, CT-FAS-005 e uma verificação complementar de navegação.
- `tests/personagem.spec.js`: 5 testes, abrangendo CT-MOV-002 e verificações complementares de exibição, seleção, troca, manutenção da escolha e bloqueio da confirmação sem fase definida.
- `tests/progresso.spec.js`: 7 testes, abrangendo CT-PRO-001 a CT-PRO-005, CT-FAS-003 e CT-FAS-004.

As funções compartilhadas de autenticação e preparação, consulta e verificação do progresso estão organizadas em `tests/utils/`.

A quantidade de testes executáveis não representa percentual de cobertura de código. A mensuração desse indicador exige instrumentação específica.

### Particularidades e limites

As contas utilizadas são fictícias, e os dados de progresso são manipulados exclusivamente no Firestore Emulator, sem utilização do banco de produção.

A automação de autenticação verifica a integração com o Authentication Emulator. A autenticação com o serviço real do Google permanece uma verificação manual.

No CT-AUT-006, o teste reutiliza a credencial fictícia do provedor na segunda autenticação, mantendo a mesma identidade simulada. A resposta continua sendo produzida pelo emulador. O teste verifica a criação de um novo cadastro com UID diferente após a exclusão.

A operação de exclusão do progresso também é executada no Firestore Emulator. Entretanto, a remoção efetiva do documento após a exclusão da conta ainda necessita de uma verificação automatizada específica.

Nos testes de persistência, são utilizadas consultas diretas ao Firestore Emulator e chamadas ao controlador real da aplicação para verificar armazenamento, recuperação, atualização e isolamento do progresso entre usuários.

Os CT-PRO-001, CT-PRO-005 e CT-FAS-003 verificam a integração com o salvamento do progresso, mas não reproduzem a conclusão efetiva de uma fase por meio da movimentação do personagem no Canvas. Essa integração permanece pendente de validação.

O CT-PRO-002 verifica a recuperação do progresso após recarregar a aplicação com a sessão autenticada. A recuperação após logout e novo login ainda não é verificada especificamente.

A seleção de personagens utiliza React Context, preservando a escolha durante a navegação na aplicação. A persistência do personagem entre sessões não faz parte da implementação atual.