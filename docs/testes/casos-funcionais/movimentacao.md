# Casos funcionais — Movimentação

## CT-MOV-001 — Exibição do personagem e do mapa
**Requisito:** RF08, RF09  
**Descrição:** Verificar se a área de movimentação apresenta o personagem e o mapa.  
**Pré-condições:** Fase disponível para execução.  
**Entradas:** Iniciar uma fase e acessar a área de movimentação.  
**Saída esperada (BDD):**
```gherkin
Dado que uma fase está disponível
Quando o usuário inicia a fase
Então o mapa é exibido na área de movimentação
E o personagem é apresentado no mapa
```

## CT-MOV-002 — Seleção de personagem
**Requisito:** RF10  
**Descrição:** Verificar se o personagem selecionado é utilizado na fase.  
**Pré-condições:** Tela de seleção acessível e personagens disponíveis.  
**Entradas:** Selecionar um personagem e iniciar uma fase.  
**Saída esperada (BDD):**
```gherkin
Dado que há personagens disponíveis para seleção
Quando o usuário seleciona um personagem
E inicia uma fase
Então o personagem escolhido é exibido na área de movimentação
```

## CT-MOV-003 — Disponibilidade dos controles direcionais
**Requisito:** RF11  
**Descrição:** Verificar se os quatro controles direcionais estão disponíveis durante a fase.  
**Pré-condições:** Fase iniciada e interface de movimentação carregada.  
**Entradas:** Verificar a apresentação e a disponibilidade dos controles.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está em uma fase iniciada
Quando a interface de movimentação é apresentada
Então os controles de frente, trás, direita e esquerda estão visíveis
E estão disponíveis para interação
```

## CT-MOV-004 — Movimentação por botões
**Requisito:** RF12, RF13  
**Descrição:** Verificar se um botão direcional movimenta o personagem e atualiza sua posição visualmente.  
**Pré-condições:** Fase iniciada, posição inicial conhecida e caminho livre na direção escolhida.  
**Entradas:** Acionar um botão direcional com movimento permitido.  
**Saída esperada (BDD):**
```gherkin
Dado que o personagem está em uma posição conhecida
E o caminho está livre na direção escolhida
Quando o usuário aciona o botão direcional
Então o personagem se desloca na direção correspondente
E a nova posição é apresentada visualmente
```

## CT-MOV-005 — Movimentação pelo teclado
**Requisito:** RF12, RF13  
**Descrição:** Verificar se uma seta do teclado movimenta o personagem e atualiza sua posição visualmente.  
**Pré-condições:** Fase iniciada, posição inicial conhecida e caminho livre na direção escolhida.  
**Entradas:** Pressionar uma seta do teclado com movimento permitido.  
**Saída esperada (BDD):**
```gherkin
Dado que o personagem está em uma posição conhecida
E o caminho está livre na direção escolhida
Quando o usuário pressiona a seta correspondente
Então o personagem se desloca na direção correspondente
E a nova posição é apresentada visualmente
```

## CT-MOV-006 — Movimentação nas quatro direções
**Requisito:** RF12  
**Descrição:** Verificar se cada direção executa o deslocamento correspondente.  
**Pré-condições:** Fase iniciada e cenário preparado com movimentos permitidos nas quatro direções.  
**Entradas:** Executar separadamente os comandos de frente, trás, direita e esquerda.  
**Saída esperada (BDD):**
```gherkin
Dado que o cenário permite movimentos nas quatro direções
Quando o usuário executa separadamente cada comando direcional
Então cada comando desloca o personagem na direção correspondente
```

## CT-MOV-007 — Bloqueio de movimento contra obstáculo
**Requisito:** RF15  
**Descrição:** Verificar se o personagem não atravessa obstáculos.  
**Pré-condições:** Fase iniciada e personagem posicionado ao lado de um obstáculo.  
**Entradas:** Acionar movimento em direção ao obstáculo.  
**Saída esperada (BDD):**
```gherkin
Dado que o personagem está ao lado de um obstáculo
Quando o usuário tenta movimentá-lo na direção do obstáculo
Então o movimento é impedido
E a posição do personagem permanece inalterada
```

## CT-MOV-008 — Bloqueio de movimento fora do mapa
**Requisito:** RF15  
**Descrição:** Verificar se o personagem não ultrapassa os limites do mapa.  
**Pré-condições:** Fase iniciada e personagem posicionado em uma borda do mapa.  
**Entradas:** Acionar movimento para fora dos limites do mapa.  
**Saída esperada (BDD):**
```gherkin
Dado que o personagem está em uma borda do mapa
Quando o usuário tenta movimentá-lo para fora dos limites
Então o movimento é impedido
E a posição do personagem permanece inalterada
```
