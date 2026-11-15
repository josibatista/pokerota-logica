import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import verificarColisao from '../src/model/colisoes/verificarColisao.js';
import configuracoesMapas from '../src/model/configuracoesMapas.js';

import {
    associarPersonagem,
    pressionarComando,
    soltarComando,
    atualizarMovimentacao,
} from '../src/controller/movimentacaoController.js';

// Configuração controlada para testar colisões
const LIMITES_MAPA = {
    largura: 300,
    altura: 300,
};

const OBSTACULO = {
    x: 100,
    y: 100,
    largura: 80,
    altura: 80,
};

function criarEstado(x = 150, y = 150) {
    const resultado = associarPersonagem({
        jogadorId: 'jogador-teste',
        personagemSelecionado: 'pikachu',
        personagens: { pikachu: {} },
        x,
        y,
    });

    expect(resultado.sucesso).toBe(true);

    return resultado.estado;
}

function movimentar(estado, comando, configuracao) {
    const pressionamento = pressionarComando(
        estado,
        comando,
        'teste'
    );

    expect(pressionamento.sucesso).toBe(true);

    const resultado = atualizarMovimentacao(
        estado,
        configuracao
    );

    expect(resultado.sucesso).toBe(true);

    const liberacao = soltarComando(
        estado,
        comando,
        'teste'
    );

    expect(liberacao.sucesso).toBe(true);

    return estado.obterEstado();
}

test.describe('Colisões e movimentação', () => {

    test('CT-MOV-007 — deve detectar colisão considerando a hitbox de 64px', () => {
        const configuracao = {
            obstaculos: [OBSTACULO],
        };

        // A borda direita do personagem toca o obstáculo
        // Sem sobreposição, o movimento é permitido
        expect(verificarColisao({
            x: 68,
            y: 140,
            ...configuracao,
        })).toBe(false);

        // Avança 1px, provocando sobreposição
        expect(verificarColisao({
            x: 69,
            y: 140,
            ...configuracao,
        })).toBe(true);

        // Uma posição distante permanece livre
        expect(verificarColisao({
            x: 230,
            y: 140,
            ...configuracao,
        })).toBe(false);
    });

    test('CT-MOV-007 — deve impedir movimento contra obstáculo', () => {
        const estado = criarEstado(68, 140);

        const posicaoInicial = estado.obterEstado();

        movimentar(estado, 'direita', {
            obstaculos: [OBSTACULO],
            limitesMapa: LIMITES_MAPA,
        });

        const posicaoFinal = estado.obterEstado();

        // O personagem não pode atravessar o obstáculo
        expect(posicaoFinal.x).toBe(posicaoInicial.x);
        expect(posicaoFinal.y).toBe(posicaoInicial.y);
    });

    test('CT-MOV-006 — deve movimentar nas quatro direções', () => {
        const cenarios = [
            { comando: 'ArrowUp', dx: 0, dy: -2 },
            { comando: 'ArrowDown', dx: 0, dy: 2 },
            { comando: 'ArrowLeft', dx: -2, dy: 0 },
            { comando: 'ArrowRight', dx: 2, dy: 0 },
        ];

        for (const cenario of cenarios) {
            const estado = criarEstado();

            movimentar(estado, cenario.comando, {
                obstaculos: [],
                limitesMapa: LIMITES_MAPA,
            });

            expect(estado.x).toBe(150 + cenario.dx);
            expect(estado.y).toBe(150 + cenario.dy);
        }
    });

    test('CT-MOV-008 — deve detectar colisão nos limites do mapa', () => {
        const limitesMapa = {
            largura: 200,
            altura: 200,
        };

        // A hitbox de 64px cabe exatamente nas bordas
        const posicoesPermitidas = [
            { x: 32, y: 100 },
            { x: 168, y: 100 },
            { x: 100, y: 32 },
            { x: 100, y: 168 },
        ];

        for (const posicao of posicoesPermitidas) {
            expect(verificarColisao({
                ...posicao,
                limitesMapa,
            })).toBe(false);
        }

        // Estas posições ultrapassam os limites
        const posicoesBloqueadas = [
            { x: 30, y: 100 },
            { x: 170, y: 100 },
            { x: 100, y: 30 },
            { x: 100, y: 170 },
        ];

        for (const posicao of posicoesBloqueadas) {
            expect(verificarColisao({
                ...posicao,
                limitesMapa,
            })).toBe(true);
        }
    });

    test('CT-MOV-008 — deve impedir movimento para fora do mapa', () => {
        const estado = criarEstado(32, 100);

        movimentar(estado, 'esquerda', {
            obstaculos: [],
            limitesMapa: {
                largura: 200,
                altura: 200,
            },
        });

        // Não pode ultrapassar a borda esquerda
        expect(estado.x).toBe(32);
        expect(estado.y).toBe(100);
    });
});

// ##### Testes das configurações dos mapas ######

const IMAGENS = {
    nivel1: new URL('../src/view/assets/mapas/nivel1.png', import.meta.url),
    nivel2: new URL('../src/view/assets/mapas/nivel2.png', import.meta.url),
    nivel3: new URL('../src/view/assets/mapas/nivel3.png', import.meta.url),
    nivel4: new URL('../src/view/assets/mapas/nivel4.png', import.meta.url),
    nivel5: new URL('../src/view/assets/mapas/nivel5-parte1.png', import.meta.url),
    hallDaFama: new URL('../src/view/assets/mapas/nivel5-parte2.png', import.meta.url),
};

// Obtém as dimensões reais 
function obterLimitesMapa(configuracao) {
    const caminho = IMAGENS[configuracao.mapa];

    expect(caminho).toBeDefined();

    const arquivo = readFileSync(caminho);
    const larguraOriginal = arquivo.readUInt32BE(16);
    const alturaOriginal = arquivo.readUInt32BE(20);

    expect(configuracao.escala).toBeGreaterThan(0);

    return {
        largura: larguraOriginal * configuracao.escala,
        altura: alturaOriginal * configuracao.escala,
    };
}

// Confirma que a hitbox de 64px cabe na posição e não colide
function verificarPosicaoLivre(posicao, configuracao, descricao) {
    expect(Number.isFinite(posicao.x)).toBe(true);
    expect(Number.isFinite(posicao.y)).toBe(true);

    const limitesMapa = obterLimitesMapa(configuracao);

    const bloqueada = verificarColisao({
        x: posicao.x,
        y: posicao.y,
        obstaculos: configuracao.obstaculos,
        limitesMapa,
    });

    expect(
        bloqueada,
        `${descricao}: posição (${posicao.x}, ${posicao.y}) bloqueada.`
    ).toBe(false);
}

// Verifica se um obstáculo real é reconhecido como bloqueado
function verificarObstaculoDetectado(obstaculos) {
    const obstaculo = obstaculos.find((item) =>
        Number.isFinite(item.x) &&
        Number.isFinite(item.y) &&
        item.largura > 0 &&
        item.altura > 0
    );

    expect(obstaculo).toBeDefined();

    const centro = {
        x: obstaculo.x + obstaculo.largura / 2,
        y: obstaculo.y + obstaculo.altura / 2,
    };

    // Não passa limitesMapa para isolar a colisão com o obstáculo
    expect(verificarColisao({
        ...centro,
        obstaculos: [obstaculo],
    })).toBe(true);
}

// Testes aplicados aos cinco níveis
test.describe('Validação das colisões dos mapas', () => {
    for (const [numero, configuracao] of Object.entries(configuracoesMapas)) {

        test(`CT-MOV-008 (complementar) — nível ${numero} deve iniciar em posição livre e dentro do mapa`, () => {
            verificarPosicaoLivre(
                configuracao.personagemInicial,
                configuracao,
                `Nível ${numero}`
            );
        });

        test(`CT-MOV-007 — nível ${numero} deve reconhecer obstáculos bloqueados`, () => {
            verificarObstaculoDetectado(
                configuracao.obstaculos
            );
        });
    }
});
