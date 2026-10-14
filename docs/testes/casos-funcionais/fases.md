# Casos funcionais — Fases

## CT-FAS-001 — Exibição dos cinco mapas
**Requisito:** RF17  
**Descrição:** Verificar se a tela principal apresenta cinco mapas distintos.  
**Pré-condições:** Tela principal acessível.  
**Entradas:** Abrir a tela principal e verificar os mapas disponíveis.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário acessa a tela principal
Quando a seleção de fases é apresentada
Então são exibidos cinco mapas distintos
```

## CT-FAS-002 — Bloqueio de fase não liberada
**Requisito:** RF18  
**Descrição:** Verificar se uma fase permanece bloqueada antes da conclusão da anterior.  
**Pré-condições:** Usuário com fase anterior ainda não concluída.  
**Entradas:** Tentar acessar a fase seguinte.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário ainda não concluiu a fase anterior
Quando tenta acessar a fase seguinte
Então o acesso à fase seguinte permanece bloqueado
```

## CT-FAS-003 — Desbloqueio da fase seguinte
**Requisito:** RF18  
**Descrição:** Verificar se a conclusão de uma fase libera a próxima.  
**Pré-condições:** Fase atual disponível e fase seguinte bloqueada.  
**Entradas:** Concluir a fase atual e consultar a fase seguinte.  
**Saída esperada (BDD):**
```gherkin
Dado que a fase seguinte está bloqueada
Quando o usuário conclui a fase atual
Então a fase seguinte é desbloqueada
```

## CT-FAS-004 — Acesso a fase já concluída
**Requisito:** RF19  
**Descrição:** Verificar se uma fase concluída pode ser selecionada novamente.  
**Pré-condições:** Usuário com ao menos uma fase concluída.  
**Entradas:** Selecionar uma fase anteriormente concluída.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário já concluiu uma fase
Quando seleciona essa fase novamente
Então consegue acessá-la
```

## CT-FAS-005 — Saída do jogo para a tela principal
**Requisito:** RF22  
**Descrição:** Verificar se a opção de sair retorna o usuário à tela principal.  
**Pré-condições:** Fase em execução.  
**Entradas:** Acionar a opção de sair do jogo.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está em uma fase
Quando aciona a opção de sair do jogo
Então retorna à tela principal
```

## CT-FAS-006 — Reinício da fase atual
**Requisito:** RF16  
**Descrição:** Verificar se o reinício restaura a posição inicial do personagem sem trocar de fase.  
**Pré-condições:** Fase iniciada e personagem deslocado da posição inicial.  
**Entradas:** Acionar a opção de reiniciar a fase.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está em uma fase
E o personagem foi deslocado da posição inicial
Quando o usuário aciona a opção de reiniciar
Então permanece na mesma fase
E o personagem retorna à posição inicial
```

## CT-FAS-007 — Pausa e retomada da fase
**Requisito:** RF23  
**Descrição:** Verificar se a pausa impede a movimentação e se a retomada preserva a posição do personagem.  
**Pré-condições:** Fase em execução e posição do personagem conhecida.  
**Entradas:** Pausar, tentar movimentar o personagem e retomar a fase.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está em uma fase em execução
Quando aciona a opção de pausar
Então a fase entra em estado de pausa
E os comandos de movimentação não alteram a posição do personagem
Quando o usuário aciona a opção de continuar
Então a fase é retomada
E o personagem permanece na posição anterior à pausa
```
