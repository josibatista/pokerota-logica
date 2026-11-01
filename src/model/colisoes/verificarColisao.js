const AREA_COLISAO_PADRAO = {
    largura: 64,
    altura: 64,
    deslocamentoX: 0,
    deslocamentoY: 0,
};

function retangulosSobrepostos(a, b) {
    return (
        a.x < b.x + b.largura &&
        a.x + a.largura > b.x &&
        a.y < b.y + b.altura &&
        a.y + a.altura > b.y
    );
}

/**
 * Retorna true se a posição informada estiver bloqueada.
 *
 * @param {Object} parametros
 * @param {number} parametros.x - Próxima posição X do personagem.
 * @param {number} parametros.y - Próxima posição Y do personagem.
 * @param {Array} parametros.obstaculos - Regiões bloqueadas.
 * @param {Object|null} parametros.limitesMapa - Dimensões do mapa.
 * @param {Object} parametros.hitbox - Área de colisão do personagem.
 *
 * @returns {boolean}
 */

export function verificarColisao({
    x,
    y,
    obstaculos = [],
    limitesMapa = null,
    hitbox = AREA_COLISAO_PADRAO,
}) {
    const {
        largura,
        altura,
        deslocamentoX = 0,
        deslocamentoY = 0,
    } = hitbox;

    // Calcula o retângulo ocupado pelo personagem.
    const personagem = {
        x: x + deslocamentoX - largura / 2,
        y: y + deslocamentoY - altura / 2,
        largura,
        altura,
    };

    // Verifica os limites externos, quando fornecidos.
    if (limitesMapa) {
        const foraDosLimites =
            personagem.x < 0 ||
            personagem.y < 0 ||
            personagem.x + personagem.largura > limitesMapa.largura ||
            personagem.y + personagem.altura > limitesMapa.altura;

        if (foraDosLimites) {
            return true;
        }
    }

    // Verifica a colisão com os obstáculos do mapa.
    return obstaculos.some((obstaculo) =>
        retangulosSobrepostos(personagem, obstaculo)
    );
}

export default verificarColisao;
