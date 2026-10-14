# Casos funcionais — Interface

## CT-INT-001 — Exibição das opções do menu superior
**Requisito:** RF03  
**Descrição:** Verificar a presença das opções de configurações e instruções no menu superior.  
**Pré-condições:** Aplicação carregada em tela que apresenta o menu superior.  
**Entradas:** Acessar a tela e verificar as opções do menu.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário acessa uma tela com menu superior
Quando o menu é apresentado
Então as opções de configurações e instruções estão visíveis
```

## CT-INT-002 — Navegação pelo menu superior
**Requisito:** RF03  
**Descrição:** Verificar o acesso às seções de configurações e instruções por meio do menu.  
**Pré-condições:** Menu superior disponível.  
**Entradas:** Acionar as opções de configurações e instruções, uma de cada vez.  
**Saída esperada (BDD):**
```gherkin
Dado que o menu superior está disponível
Quando o usuário seleciona a opção de configurações
Então a área de configurações é exibida
Quando seleciona a opção de instruções
Então as instruções são exibidas
```

## CT-INT-003 — Exibição das opções de configurações
**Requisito:** RF05  
**Descrição:** Verificar a presença das opções exigidas na área de configurações.  
**Pré-condições:** Área de configurações acessível.  
**Entradas:** Abrir a área de configurações e verificar suas opções.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário pode acessar as configurações
Quando abre a área de configurações
Então as opções de acessibilidade, logout e exclusão de conta são apresentadas
```

## CT-INT-004 — Alteração de configuração de acessibilidade
**Requisito:** RF05  
**Descrição:** Verificar se uma opção de acessibilidade disponível aplica a alteração correspondente.  
**Pré-condições:** Área de configurações acessível e opção de acessibilidade definida e implementada.  
**Entradas:** Alterar uma opção de acessibilidade disponível.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário acessa uma opção de acessibilidade implementada
Quando altera essa opção
Então a interface aplica a configuração selecionada
```

## CT-INT-005 — Ativação e desativação da tela cheia
**Requisito:** RF06  
**Descrição:** Verificar se o usuário autenticado consegue alternar o modo de tela cheia.  
**Pré-condições:** Usuário autenticado e navegador com suporte à tela cheia.  
**Entradas:** Ativar e depois desativar o modo de tela cheia.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está autenticado
Quando ativa o modo de tela cheia
Então a aplicação é exibida em tela cheia
Quando desativa esse modo
Então a aplicação retorna à exibição anterior
```

## CT-INT-006 — Acesso à experiência prévia sem autenticação
**Requisito:** RF07  
**Descrição:** Verificar se o usuário não autenticado consegue experimentar a plataforma.  
**Pré-condições:** Usuário sem sessão ativa.  
**Entradas:** Acionar a opção de teste prévio da plataforma.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário não possui sessão ativa
Quando seleciona a opção de teste prévio
Então consegue acessar a experiência prévia sem autenticação
```

## CT-INT-007 — Exibição das instruções de movimentação
**Requisito:** RF14  
**Descrição:** Verificar se as instruções explicam o uso dos botões e das setas do teclado.  
**Pré-condições:** Instruções do jogo acessíveis.  
**Entradas:** Abrir as instruções de movimentação.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário pode acessar as instruções
Quando abre as instruções de movimentação
Então são apresentadas orientações sobre os botões direcionais
E sobre as setas do teclado
```
