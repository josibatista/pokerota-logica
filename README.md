# 🎮 PokéRota Lógica


## 🏷️ Badges

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![p5.js](https://img.shields.io/badge/P5.JS-ED225D?style=for-the-badge&logo=p5dotjs&logoColor=white)
![Firebase](https://img.shields.io/badge/FIREBASE-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Cloud Firestore](https://img.shields.io/badge/FIRESTORE-039BE5?style=for-the-badge&logo=firebase&logoColor=white)
![Playwright](https://img.shields.io/badge/PLAYWRIGHT-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)


## 📖 Sobre o projeto

**PokéRota Lógica** é um jogo educativo desenvolvido em **JavaScript/p5.js**, com temática inspirada no universo Pokémon, no qual o usuário controla um personagem em um mapa, avançando por fases de dificuldade crescente. A proposta é oferecer uma ferramenta lúdica de ensino de lógica, permitindo que a criança visualize, em tempo real, a ação sendo executada no cenário conforme o comando que ela mesma emitiu. O progresso é salvo por usuário autenticado via conta Google.

> ⚠️ **Nota sobre propriedade intelectual:** Utilizou-se a temática inspirada no universo Pokémon, dando os devidos créditos à Nintendo, Game Freak e The Pokémon Company, detentoras dos direitos sobre a marca. Não há qualquer objetivo de obtenção de benefícios comerciais, monetários ou similares com este projeto, visto que se trata de trabalho acadêmico destinado à avaliação da disciplina de Oficina de Integração do curso de Engenharia de Software da UTFPR-CP.

### 🎯 Público-alvo

Crianças do Ensino Fundamental I (aproximadamente 6 a 10 anos) em fase de desenvolvimento do pensamento lógico. O jogo busca estimular a compreensão de sequências de comandos e suas consequências, auxiliando o usuário a associar uma ação executada (movimentação do personagem) à resposta correspondente do sistema — fortalecendo noções básicas de causa e efeito e planejamento de rotas.


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
| RNF08 | 🔄 Recuperação | O sistema deve preservar o estado do código e da posição do personagem em caso de queda de conexão, permitindo a retomada da sessão sem perda do trabalho do usuário. |


## 🏗️ Arquitetura

> ⏳ Pendente.

## 🛠️ Tecnologias de desenvolvimento

| Tecnologia | Aplicação |
|---|---|
| 🎨 p5.js | Biblioteca JavaScript utilizada para o desenvolvimento do jogo, facilitando a criação de elementos gráficos, animações, interações e movimentação do personagem por meio de funções pré-definidas. |
| 🖼️ Canvas API | API utilizada para a renderização dos elementos gráficos no elemento HTML `<canvas>`. O p5.js é construído sobre a Canvas API, abstraindo sua sintaxe e facilitando a criação de gráficos, animações e interações. |
| 🟨 JavaScript | Linguagem utilizada na implementação da lógica e da interatividade do projeto, incluindo a movimentação do personagem pelo teclado, as regras do labirinto e a integração com os serviços de autenticação. |
| 📄 HTML | Linguagem de marcação utilizada para estruturar a página, servindo como base para o elemento `<canvas>` e para os demais componentes da interface. |
| 🎯 CSS | Linguagem utilizada para a estilização da página e dos componentes da interface, definindo aspectos como posicionamento, dimensões, fontes e apresentação visual. |
| 🔑 Firebase Authentication | Serviço de autenticação utilizado para gerenciar o cadastro e o login dos usuários por conta Google, evitando a necessidade de implementar manualmente um servidor de autenticação. |
| 🗄️ Cloud Firestore | Banco de dados NoSQL utilizado em conjunto com o Firebase Authentication para armazenar informações associadas aos usuários, como o progresso no jogo e o histórico de ações realizadas. |

## 📦 Como executar o projeto

> ⏳ Pendente. 

## 🧪 Estratégia de Testes

- **Ferramenta:** Playwright
- **Meta de cobertura:** mínimo de 70% do código (RNF02)
- Disponível em: 

### 📨 Como executar a suíte de testes

> ⏳ Pendente. 

## 🗓️ Cronograma de Implementação

| Período | Atividade |
|---|---|
| 21/09 à 27/09 | |
| 28/09 à 04/10 | |
| 05/10 à 11/10 | |
| 12/10 à 18/10 | |
| 19/10 à 25/10 | |
| 26/10 à 01/11 | |
| 02/11 à 08/11 | |
| 09/11 à 15/11 | |
| 16/11 à 22/11 | |
| 23/11 à 30/11 | |


## 👥 Equipe

Josiane Mariane Batista, Maria Clara Nascimento de Jesus e Pamela Berti Braz.
