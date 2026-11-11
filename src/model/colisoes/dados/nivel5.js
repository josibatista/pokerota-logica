const obstaculosNivel5 = [
    // árvores (IDs 4 e 5: base das arvoretas da fachada em y 235,2 − 20 = 215,2)
    {
        x: 0,
        y: 0,
        largura: 184.8,
        altura: 170.1,
    },
    {
        x: 588,
        y: 0,
        largura: 168,
        altura: 48.3,
    },
    {
        x: 588,
        y: 48.3,
        largura: 218.4,
        altura: 121.8,
    },
    {
        x: 0,
        y: 170.1,
        largura: 327.6,
        altura: 45.1,
    },
    {
        x: 445.2,
        y: 170.1,
        largura: 361.2,
        altura: 45.1,
    },
    {
        x: 0,
        y: 193.2,
        largura: 170.8,
        altura: 100.8,
    },
    {
        x: 602,
        y: 193.2,
        largura: 204.4,
        altura: 100.8,
    },
    {
        x: 0,
        y: 294,
        largura: 103.6,
        altura: 67.2,
    },
    {
        x: 669.2,
        y: 294,
        largura: 137.2,
        altura: 67.2,
    },
    // penhascos
    {
        x: 0,
        y: 411.6,
        largura: 179.2,
        altura: 67.2,
    },
    {
        x: 593.6,
        y: 411.6,
        largura: 212.8,
        altura: 67.2,
    },
    {
        x: 0,
        y: 478.8,
        largura: 280,
        altura: 193.2,
    },
    {
        x: 492.8,
        y: 478.8,
        largura: 313.6,
        altura: 193.2,
    },
    // construção, estátuas e pedras
    {
        x: 216.3,
        y: 0,
        largura: 12.6,
        altura: 119.7,
    },
    {
        x: 550.2,
        y: 0,
        largura: 12.6,
        altura: 119.7,
    },
    {
        x: 394.8,
        y: 147,
        largura: 23.1,
        altura: 12.6,
    },
    {
        x: 226.8,
        y: 149.1,
        largura: 2.1,
        altura: 27.3,
    },
    {
        x: 543.9,
        y: 149.1,
        largura: 2.1,
        altura: 27.3,
    },
    {
        x: 394.8,
        y: 159.6,
        largura: 18.9,
        altura: 2.1,
    },
    {
        x: 396.9,
        y: 161.7,
        largura: 16.8,
        altura: 2.1,
    },
    {
        x: 401.1,
        y: 163.8,
        largura: 12.6,
        altura: 2.1,
    },
    {
        x: 405.3,
        y: 165.9,
        largura: 8.4,
        altura: 2.1,
    },
    {
        x: 409.5,
        y: 168,
        largura: 4.2,
        altura: 2.1,
    },
    // Jardim: cada retângulo é a arte recuada 16 nas laterais, 12 em cima e
    // 20 embaixo (distância entre a hitbox de 64 e o corpo visível). Objetos
    // com até 34 de largura viram uma linha central de 0,5, como as flores da
    // fase 4. Nos corredores de um tile (33,6) cada borda foi afastada ~2 do
    // vão para deixar uma janela de 5,5 a 6,4 unidades para o centro do personagem.
    // estátuas da esquerda (arte x 268,8–302,4)
    // estátua de cima (arte y 201,6–268,8)
    {
        x: 285.35,
        y: 213.6,
        largura: 0.5,
        altura: 33.2,
    },
    // estátua do meio (arte y 302,4–369,6)
    {
        x: 287.15,
        y: 316.4,
        largura: 0.5,
        altura: 31.2,
    },
    // estátua de baixo (arte y 403,2–470,4)
    {
        x: 285.35,
        y: 417.2,
        largura: 0.5,
        altura: 33.2,
    },
    // estátuas da direita (arte x 470,4–504)
    // estátua de cima
    {
        x: 486.95,
        y: 213.6,
        largura: 0.5,
        altura: 33.2,
    },
    // estátua do meio
    {
        x: 485.65,
        y: 316.4,
        largura: 0.5,
        altura: 31.2,
    },
    // estátua de baixo
    {
        x: 486.95,
        y: 417.2,
        largura: 0.5,
        altura: 33.2,
    },
    // objetos brancos da esquerda
    // coluna de quatro objetos (arte x 203,7–235,2, y 268,8–403,2)
    {
        x: 217.2,
        y: 280.8,
        largura: 0.5,
        altura: 102.4,
    },
    // objeto de cima (arte x 237,3–268,8, y 235,2–268,8)
    {
        x: 252.8,
        y: 246.4,
        largura: 0.5,
        altura: 0.4,
    },
    // objeto de baixo (arte y 403,2–436,8)
    {
        x: 252.8,
        y: 417.2,
        largura: 0.5,
        altura: 0.4,
    },
    // objetos brancos da direita
    // coluna de quatro objetos (arte x 539,7–571,2)
    {
        x: 556.5,
        y: 280.8,
        largura: 0.5,
        altura: 102.4,
    },
    // objeto de cima (arte x 506,1–537,6)
    {
        x: 521.6,
        y: 246.4,
        largura: 0.5,
        altura: 0.4,
    },
    // objeto de baixo
    {
        x: 521.6,
        y: 417.2,
        largura: 0.5,
        altura: 0.4,
    },
    // paredes laterais da escadaria (arte x 302,4–336 e 436,8–470,4, a partir de y 436,8)
    {
        x: 318.4,
        y: 448.8,
        largura: 1.6,
        altura: 223.2,
    },
    {
        x: 452.8,
        y: 448.8,
        largura: 1.6,
        altura: 223.2,
    },
];

const obstaculosHallDaFama = [
    // paredes
    {
        x: 0,
        y: 0,
        largura: 369.6,
        altura: 75.6,
    },
    {
        x: 0,
        y: 75.6,
        largura: 25.2,
        altura: 2.1,
    },
    {
        x: 159.6,
        y: 75.6,
        largura: 50.4,
        altura: 10.5,
    },
    {
        x: 344.4,
        y: 75.6,
        largura: 25.2,
        altura: 2.1,
    },
    {
        x: 0,
        y: 77.7,
        largura: 21,
        altura: 2.1,
    },
    {
        x: 348.6,
        y: 77.7,
        largura: 21,
        altura: 2.1,
    },
    {
        x: 0,
        y: 79.8,
        largura: 16.8,
        altura: 2.1,
    },
    {
        x: 352.8,
        y: 79.8,
        largura: 16.8,
        altura: 2.1,
    },
    {
        x: 0,
        y: 81.9,
        largura: 12.6,
        altura: 2.1,
    },
    {
        x: 357,
        y: 81.9,
        largura: 12.6,
        altura: 2.1,
    },
    {
        x: 0,
        y: 84,
        largura: 8.4,
        altura: 2.1,
    },
    {
        x: 361.2,
        y: 84,
        largura: 8.4,
        altura: 2.1,
    },
    {
        x: 0,
        y: 86.1,
        largura: 6.3,
        altura: 315,
    },
    {
        x: 161.7,
        y: 86.1,
        largura: 46.2,
        altura: 2.1,
    },
    {
        x: 363.3,
        y: 86.1,
        largura: 6.3,
        altura: 315,
    },
    {
        x: 172.2,
        y: 88.2,
        largura: 25.2,
        altura: 18.9,
    },
    {
        x: 170.1,
        y: 107.1,
        largura: 29.4,
        altura: 31.5,
    },
    {
        x: 172.2,
        y: 138.6,
        largura: 25.2,
        altura: 2.1,
    },
    {
        x: 174.3,
        y: 140.7,
        largura: 21,
        altura: 2.1,
    },
    {
        x: 180.6,
        y: 142.8,
        largura: 8.4,
        altura: 4.2,
    },
    {
        x: 182.7,
        y: 147,
        largura: 4.2,
        altura: 2.1,
    },
    {
        x: 0,
        y: 401.1,
        largura: 8.4,
        altura: 2.1,
    },
    {
        x: 361.2,
        y: 401.1,
        largura: 8.4,
        altura: 2.1,
    },
    {
        x: 0,
        y: 403.2,
        largura: 12.6,
        altura: 2.1,
    },
    {
        x: 357,
        y: 403.2,
        largura: 12.6,
        altura: 2.1,
    },
    {
        x: 0,
        y: 405.3,
        largura: 16.8,
        altura: 2.1,
    },
    {
        x: 352.8,
        y: 405.3,
        largura: 16.8,
        altura: 2.1,
    },
    {
        x: 0,
        y: 407.4,
        largura: 21,
        altura: 2.1,
    },
    {
        x: 348.6,
        y: 407.4,
        largura: 21,
        altura: 2.1,
    },
    {
        x: 0,
        y: 409.5,
        largura: 25.2,
        altura: 2.1,
    },
    {
        x: 344.4,
        y: 409.5,
        largura: 25.2,
        altura: 2.1,
    },
    {
        x: 0,
        y: 411.6,
        largura: 126,
        altura: 16.8,
    },
    {
        x: 243.6,
        y: 411.6,
        largura: 126,
        altura: 16.8,
    },
    {
        x: 0,
        y: 428.4,
        largura: 128.1,
        altura: 2.1,
    },
    {
        x: 241.5,
        y: 428.4,
        largura: 128.1,
        altura: 2.1,
    },
    {
        x: 0,
        y: 430.5,
        largura: 130.2,
        altura: 2.1,
    },
    {
        x: 239.4,
        y: 430.5,
        largura: 130.2,
        altura: 2.1,
    },
    {
        x: 0,
        y: 432.6,
        largura: 132.3,
        altura: 2.1,
    },
    {
        x: 237.3,
        y: 432.6,
        largura: 132.3,
        altura: 2.1,
    },
    {
        x: 0,
        y: 434.7,
        largura: 134.4,
        altura: 2.1,
    },
    {
        x: 235.2,
        y: 434.7,
        largura: 134.4,
        altura: 2.1,
    },
    // pilares e máquina de registro
    {
        x: 75.6,
        y: 111.3,
        largura: 16.8,
        altura: 50.4,
    },
    {
        x: 277.2,
        y: 111.3,
        largura: 16.8,
        altura: 50.4,
    },
    {
        x: 75.6,
        y: 212.1,
        largura: 16.8,
        altura: 50.4,
    },
    {
        x: 277.2,
        y: 212.1,
        largura: 16.8,
        altura: 50.4,
    },
    {
        x: 75.6,
        y: 312.9,
        largura: 16.8,
        altura: 50.4,
    },
    {
        x: 277.2,
        y: 312.9,
        largura: 16.8,
        altura: 50.4,
    },
];
export { obstaculosHallDaFama };
export default obstaculosNivel5;
