# Casos funcionais — Progresso

## CT-PRO-001 — Armazenamento da conclusão de fase
**Requisito:** RF20  
**Descrição:** Verificar se a conclusão de uma fase é armazenada no progresso do usuário.  
**Pré-condições:** Usuário autenticado e fase ainda não concluída.  
**Entradas:** Concluir a fase.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário está autenticado
E ainda não concluiu a fase atual
Quando conclui essa fase
Então a conclusão é armazenada em seu progresso
```

## CT-PRO-002 — Recuperação do progresso após novo acesso
**Requisito:** RF20  
**Descrição:** Verificar se o progresso armazenado é recuperado ao retornar à aplicação.  
**Pré-condições:** Usuário com progresso previamente salvo.  
**Entradas:** Recarregar ou reabrir a aplicação com o mesmo usuário.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário possui progresso salvo
Quando retorna à aplicação com a mesma conta
Então o progresso anteriormente armazenado é recuperado
```

## CT-PRO-003 — Isolamento do progresso por usuário
**Requisito:** RF20  
**Descrição:** Verificar se contas diferentes acessam somente seus respectivos progressos.  
**Pré-condições:** Duas contas de teste com progressos distintos armazenados.  
**Entradas:** Acessar separadamente cada conta e consultar seu progresso.  
**Saída esperada (BDD):**
```gherkin
Dado que duas contas possuem progressos diferentes
Quando cada usuário acessa sua própria conta
Então o progresso recuperado corresponde à respectiva conta
```

## CT-PRO-004 — Exibição do progresso do usuário
**Requisito:** RF21  
**Descrição:** Verificar se a interface apresenta o progresso correspondente ao usuário.  
**Pré-condições:** Usuário com progresso armazenado e conhecido.  
**Entradas:** Abrir a visualização do progresso.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário possui progresso armazenado
Quando acessa a visualização de progresso
Então a informação exibida corresponde ao progresso salvo
```

## CT-PRO-005 — Atualização do progresso após nova conclusão
**Requisito:** RF20, RF21  
**Descrição:** Verificar se uma nova conclusão atualiza o progresso armazenado e exibido.  
**Pré-condições:** Usuário com progresso conhecido e outra fase disponível.  
**Entradas:** Concluir outra fase e consultar o progresso.  
**Saída esperada (BDD):**
```gherkin
Dado que o usuário possui progresso anteriormente armazenado
Quando conclui outra fase
Então o progresso armazenado é atualizado
E a interface apresenta o progresso atualizado
```
