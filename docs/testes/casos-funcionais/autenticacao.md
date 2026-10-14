# Casos funcionais — Autenticação

## CT-AUT-001 — Autenticação com conta Google válida
**Requisito:** RF01  
**Descrição:** Verificar a autenticação de um usuário com uma conta Google válida.  
**Pré-condições:** Usuário sem sessão ativa e conta Google válida.  
**Entradas:** Iniciar e concluir a autenticação com a conta Google.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário não possui sessão ativa
E possui uma conta Google válida
Quando conclui a autenticação com essa conta
Então a sessão é iniciada
E a área autenticada é exibida
```

## CT-AUT-002 — Cancelamento da autenticação
**Requisito:** RF01  
**Descrição:** Verificar se o cancelamento da autenticação mantém o usuário deslogado.  
**Pré-condições:** Usuário sem sessão ativa.  
**Entradas:** Iniciar e cancelar a autenticação com Google.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário não possui sessão ativa
Quando inicia a autenticação com Google
E cancela o procedimento
Então nenhuma sessão autenticada é criada
```

## CT-AUT-003 — Cancelamento da exclusão de conta
**Requisito:** RF02  
**Descrição:** Verificar se o cancelamento da exclusão preserva a conta do usuário.  
**Pré-condições:** Conta de teste autenticada.  
**Entradas:** Iniciar a exclusão e cancelar antes de concluir as duas confirmações.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está autenticado
Quando inicia a exclusão da conta
E cancela o procedimento antes de concluir as duas confirmações
Então a conta permanece ativa
```

## CT-AUT-004 — Exclusão de conta com duas confirmações
**Requisito:** RF02  
**Descrição:** Verificar se a exclusão de conta exige duas confirmações e encerra a sessão.  
**Pré-condições:** Conta de teste descartável autenticada.  
**Entradas:** Realizar as duas confirmações da exclusão.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está autenticado com uma conta de teste descartável
Quando conclui as duas confirmações da exclusão
Então a conta é excluída da aplicação
E a sessão é encerrada
```

## CT-AUT-005 — Encerramento da sessão
**Requisito:** RF04  
**Descrição:** Verificar se o logout encerra a sessão e restringe o acesso às áreas autenticadas.  
**Pré-condições:** Usuário autenticado.  
**Entradas:** Acionar a opção de sair.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está autenticado
Quando aciona a opção de sair
Então a sessão é encerrada
E o acesso às áreas protegidas exige nova autenticação
```

## CT-AUT-006 — Autenticação após exclusão da conta
**Requisito:** RF01, RF02  
**Descrição:** Verificar se a mesma conta Google pode ser utilizada para acessar novamente a aplicação após a exclusão da conta anterior.  
**Pré-condições:** Conta da aplicação previamente excluída; conta Google correspondente ainda ativa.  
**Entradas:** Autenticar novamente com a mesma conta Google.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário excluiu sua conta na aplicação
E a conta Google correspondente continua ativa
Quando realiza uma nova autenticação com essa conta Google
Então consegue acessar novamente a aplicação
E uma nova conta na aplicação é criada
```
