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
- **Ambiente:** Vite local e Firebase Authentication Emulator para a automação de autenticação, utilizando contas fictícias no projeto `demo-pokerota`. Os demais módulos terão seus ambientes preparados conforme a implementação.
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

O emulador é configurado em `firebase.json`. O Playwright inicia o Vite
automaticamente no modo `test`, em `http://127.0.0.1:5174`, sem reutilizar
um servidor de desenvolvimento já aberto.

Nesse modo, a aplicação utiliza o Authentication Emulator em
`http://127.0.0.1:9099`, com o projeto `demo-pokerota`.

O comando habitual `npm run dev` continua utilizando a configuração
Firebase do ambiente de desenvolvimento.

### Executar a suíte

Em um terminal, inicie o emulador e mantenha-o aberto:

```bash
npx firebase emulators:start --only auth --project demo-pokerota
```

Em outro terminal, execute:

```bash
npm run test:e2e
```

Não é necessário iniciar o Vite manualmente.

Para executar apenas os testes de autenticação:

```bash
npx playwright test tests/autenticacao.spec.js
```

### Investigar falhas

Para executar em sequência, com navegador visível e registro dos passos:

```bash
npx playwright test tests/autenticacao.spec.js --headed --workers=1 --trace=on
```

Para abrir o relatório da última execução:

```bash
npx playwright show-report
```

Os resultados gerados em `test-results/` e `playwright-report/`, assim
como os logs do emulador, não devem ser versionados. As evidências
necessárias à entrega devem ser selecionadas e registradas separadamente.

### Cobertura atual

- `tests/smoke.spec.js`: carregamento inicial da Home e opções de acesso.
- `tests/autenticacao.spec.js`: CT-AUT-001 a CT-AUT-006 e duas verificações
  complementares de acesso às rotas privadas sem sessão.

O arquivo de autenticação possui nove testes: dois de proteção das
rotas, um para cada CT-AUT e uma variação adicional do CT-AUT-003,
que verifica o cancelamento nas duas confirmações.

### Particularidades e limites

As contas utilizadas são fictícias. A automação verifica a integração
da aplicação com o Authentication Emulator; a autenticação com o
serviço real do Google permanece uma verificação manual.

No CT-AUT-006, o teste reutiliza a credencial fictícia do provedor na
segunda autenticação, mantendo a mesma identidade simulada. A resposta
continua sendo produzida pelo emulador. O teste verifica a criação de
um novo cadastro com UID diferente após a exclusão.

A exclusão verificada corresponde ao Firebase Authentication. A remoção
de dados associados no Firestore não está coberta por esta automação.