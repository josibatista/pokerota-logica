# Requisitos do PokéRota Lógica

## 🧩 Requisitos Funcionais

| ID | Descrição | Prioridade |
|---|---|---|
| RF01 | O sistema deve permitir o cadastro e login de usuários por meio de uma conta Google. | Alta |
| RF02 | O sistema deve permitir a exclusão da conta do usuário mediante confirmação em duas etapas. | Alta |
| RF03 | O sistema deve apresentar um menu superior incluindo configurações e instruções de jogo. | Média |
| RF04 | O sistema deve permitir que o usuário encerre sua sessão, realizando o logout da conta. | Alta |
| RF05 | O sistema deve fornecer uma área de configurações com opções de acessibilidade, logout e exclusão de conta. | Média |
| RF06 | O sistema deve permitir que o usuário ative e desative o modo de tela cheia após autenticado. | Baixa |
| RF07 | O sistema deve permitir que usuário não autenticado faça um teste prévio da plataforma. | Baixa |
| RF08 | O sistema deve apresentar um personagem em uma área de movimentação. | Alta |
| RF09 | O sistema deve fornecer um mapa para receber o personagem na área de movimentação. | Alta |
| RF10 | O sistema deve fornecer opção de seleção do personagem que percorrerá o percurso do mapa quando iniciar a fase. | Baixa |
| RF11 | O sistema deve disponibilizar botões na interface para os comandos frente, trás, direita e esquerda. | Alta |
| RF12 | O sistema deve permitir a movimentação do personagem nas direções frente, trás, direita e esquerda, por meio dos botões na tela ou pelas setas do teclado. | Alta |
| RF13 | O sistema deve atualizar visualmente a posição do personagem após a execução de um comando de movimentação. | Alta |
| RF14 | O sistema deve apresentar instruções de como utilizar os botões/setas para movimentar o personagem. | Média |
| RF15 | O sistema deve impedir movimentações que não sejam permitidas pelas regras definidas para o cenário. | Alta |
| RF16 | O sistema deve permitir reiniciar a posição do personagem, na mesma fase, para a configuração inicial. | Baixa |
| RF17 | O sistema deve exibir na tela principal cinco mapas distintos, representando cada fase de dificuldade do jogo. | Baixa |
| RF18 | O sistema deve desbloquear o mapa (fase) seguinte somente após a conclusão da fase anterior. | Baixa |
| RF19 | O sistema deve permitir ao usuário selecionar qualquer fase já concluída. | Baixa |
| RF20 | O sistema deve armazenar o progresso do usuário nas fases. | Alta |
| RF21 | O sistema deve apresentar o progresso do usuário na tela. | Alta |
| RF22 | O sistema deve fornecer uma opção para sair do jogo e retornar à tela principal. | Média |


## ⚙️ Requisitos Não Funcionais

| ID | Tipo | Descrição |
|---|---|---|
| RNF01 | 🔐 Segurança | O sistema deve realizar autenticação via protocolo OAuth 2.0 com o Google, sem armazenar senhas de usuários no banco de dados.  |
| RNF02 | 🧪 Testabilidade | O sistema deve possuir suíte de testes automatizados, visando atingir uma cobertura de no mínimo 70% de código, medida pela ferramenta de teste Playwright. |
| RNF03 | ⚡ Desempenho | O sistema deve possuir um tempo de resposta inferior a 200ms ao executar a movimentação do personagem com navegador em versão suportada. |
| RNF04 | ♿ Usabilidade/Acessibilidade | O sistema deve utilizar uma interface com fontes legíveis, alto contraste e elementos visuais complementares (como ícones, símbolos ou textos). |
| RNF05 | 📈 Escalabilidade | O sistema deve suportar no mínimo 50 requisições simultâneas de execução e salvamento de estado sem perda de desempenho. |
| RNF06 | 🌐 Portabilidade | O sistema deve ser compatível com os principais navegadores (Chrome, Firefox, Edge, Opera). |
| RNF07 | 🛡️ Privacidade | O sistema deve coletar e armazenar apenas os dados pessoais estritamente necessários à autenticação (nome, email e identificador do provedor), em conformidade com a LGPD. |
