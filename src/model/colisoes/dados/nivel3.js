const obstaculosNivel3 = [
    // árvores
    {
        x: 413.7,
        y: 0,
        largura: 1400.7,
        altura: 121.8,
    },
    {
        x: 816.9,
        y: 121.8,
        largura: 79.8,
        altura: 604.8,
    },
    {
        x: 1724.1,
        y: 121.8,
        largura: 90.3,
        altura: 478.8,
    },
    {
        x: 1085.7,
        y: 264.6,
        largura: 483,
        altura: 193.2,
    },
    {
        x: 0,
        y: 331.8,
        largura: 90.3,
        altura: 806.4,
    },
    {
        x: 279.3,
        y: 331.8,
        largura: 79.8,
        altura: 529.2,
    },
    // terceira coluna (captura em X 584 | Y 353): copa de x 539,7 a 636,3,
    // ponta da copa em y 357 e último tronco em y 861; recuo 16/12/20
    {
        x: 555.7,
        y: 369,
        largura: 64.6,
        altura: 472,
    },
    // árvore entre a base da terceira coluna e o grupo de baixo
    // (arte x 625,8–703,5, y 793,8–865,2); a metade direita não tinha colisão
    {
        x: 641.8,
        y: 805.8,
        largura: 45.7,
        altura: 39.4,
    },
    {
        x: 1522.5,
        y: 600.6,
        largura: 291.9,
        altura: 193.2,
    },
    {
        x: 1119.3,
        y: 667.8,
        largura: 180.6,
        altura: 201.6,
    },
    {
        x: 1724.1,
        y: 793.8,
        largura: 90.3,
        altura: 747.6,
    },
    // grupo abaixo da terceira coluna: a primeira árvore começa em x 606,9;
    // o trecho de capim entre 548,1 e 606,9 era bloqueado sem árvore
    {
        x: 622.9,
        y: 869.4,
        largura: 677,
        altura: 126,
    },
    {
        x: 816.9,
        y: 995.4,
        largura: 483,
        altura: 210,
    },
    {
        x: 1488.9,
        y: 1003.8,
        largura: 79.8,
        altura: 394.8,
    },
    {
        x: 0,
        y: 1138.2,
        largura: 594.3,
        altura: 67.2,
    },
    {
        x: 0,
        y: 1205.4,
        largura: 1299.9,
        altura: 58.8,
    },
    {
        x: 0,
        y: 1264.2,
        largura: 90.3,
        altura: 210,
    },
    {
        x: 615.3,
        y: 1264.2,
        largura: 684.6,
        altura: 134.4,
    },
    {
        x: 1119.3,
        y: 1398.6,
        largura: 180.6,
        altura: 403.2,
    },
    {
        x: 0,
        y: 1474.2,
        largura: 392.7,
        altura: 327.6,
    },
    {
        x: 581.7,
        y: 1541.4,
        largura: 281.4,
        altura: 260.4,
    },
    {
        x: 1522.5,
        y: 1541.4,
        largura: 291.9,
        altura: 260.4,
    },
    {
        x: 0,
        y: 1801.8,
        largura: 90.3,
        altura: 277.2,
    },
    {
        x: 1724.1,
        y: 1801.8,
        largura: 90.3,
        altura: 277.2,
    },
    {
        x: 951.3,
        y: 1843.8,
        largura: 79.8,
        altura: 58.8,
    },
    {
        x: 0,
        y: 2079,
        largura: 892.5,
        altura: 31.5,
    },
    {
        x: 1123.5,
        y: 2079,
        largura: 690.9,
        altura: 58.8,
    },
    {
        x: 0,
        y: 2110.5,
        largura: 795.9,
        altura: 207.9,
    },
    {
        x: 1182.3,
        y: 2137.8,
        largura: 632.1,
        altura: 180.6,
    },
    // construções
    {
        x: 0,
        y: 0,
        largura: 359.1,
        altura: 342.3,
    },
    {
        x: 212.1,
        y: 413.7,
        largura: 12.6,
        altura: 12.6,
    },
    {
        x: 816.9,
        y: 2118.9,
        largura: 348.6,
        altura: 199.5,
    },
    // flores
    {
        x: 205.8,
        y: 413.7,
        largura: 8.4,
        altura: 8.4,
    },
    {
        x: 222.6,
        y: 413.7,
        largura: 8.4,
        altura: 8.4,
    },
    // duas estacas à esquerda da entrada. A madeira tem 12,6 de largura, menos
    // que o corpo (32); com largura negativa (como a cerca da fase 1) o bloqueio
    // fica do tamanho da arte: x = início + 16, largura = 12,6 − 32
    {
        x: 118.9,
        y: 352.2,
        largura: -19.4,
        altura: 26.8,
    },
    {
        x: 135.7,
        y: 390,
        largura: -19.4,
        altura: 22.6,
    },
    // placas (madeira de 29,4 × 31,5). x e y mantêm o lado esquerdo e o topo, que
    // já encostavam; largura e altura negativas trazem a direita e a base para
    // a borda da madeira (antes o corpo parava 7,6 à direita e 9,5 embaixo)
    {
        x: 321.3,
        y: 987,
        largura: -4.2,
        altura: -1.1,
    },
    {
        x: 959.7,
        y: 1491,
        largura: -4.2,
        altura: -1.1,
    },
    {
        x: 1463.7,
        y: 886.2,
        largura: -4.2,
        altura: -1.1,
    },
    {
        x: 1329.3,
        y: 1995,
        largura: -4.2,
        altura: -1.1,
    },
    {
        x: 1060.5,
        y: 2028.6,
        largura: -4.2,
        altura: -1.1,
    },
];
export default obstaculosNivel3;
