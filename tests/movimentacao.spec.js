import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import verificarColisao from '../src/model/colisoes/verificarColisao.js';
import configuracoesMapas from '../src/model/configuracoesMapas.js';
import { entrarComContaTeste } from './utils/autenticacao.js';

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


async function iniciarJogo(page, personagem = 'Pikachu') {
    await entrarComContaTeste(page);

    // Seleciona a primeira fase disponível.
    await page.getByRole('button', {
        name: 'Fase 1, disponível',
        exact: true,
    }).click();

    await expect(page).toHaveURL(/\/personagem$/);

    // Seleciona e confirma o personagem.
    await page.getByRole('button', {
        name: personagem,
        exact: true,
    }).click();

    await page.getByRole('button', {
        name: 'Selecionar',
        exact: true,
    }).click();

    await expect(page).toHaveURL(/\/jogo$/);

    const canvas = page.locator('.jogo__canvas-area canvas');

    await expect(canvas).toHaveCount(1);
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Aguarda conteúdo gráfico efetivamente renderizado.
    await aguardarRenderizacao(canvas);

    return canvas;
}

async function aguardarRenderizacao(canvas) {
    await expect.poll(async () => {
        return canvas.evaluate((elemento) => {
            const contexto = elemento.getContext('2d');

            if (!contexto) return 0;

            const { width, height } = elemento;

            const pixels = contexto.getImageData(
                0, 0, width, height
            ).data;

            let amostras = 0;
            let coloridas = 0;

            // Amostragem da superfície para diferenciar o mapa renderizado de um canvas vazio.
            for (let y = 12; y < height; y += 24) {
                for (let x = 12; x < width; x += 24) {
                    const indice = (y * width + x) * 4;

                    const r = pixels[indice];
                    const g = pixels[indice + 1];
                    const b = pixels[indice + 2];

                    amostras++;

                    if (Math.max(r, g, b) > 30) {
                        coloridas++;
                    }
                }
            }

            return coloridas / amostras;
        });
    }, {
        timeout: 15000,
        message: 'O mapa não foi renderizado no Canvas.',
    }).toBeGreaterThan(0.1);
}

async function observarCoordenadasDoCanvas(page) {
    // Observa o texto desenhado pelo Canvas sem modificar as funções de movimentação da aplicação.
    await page.addInitScript(() => {
        const desenharTextoOriginal =
            CanvasRenderingContext2D.prototype.fillText;

        CanvasRenderingContext2D.prototype.fillText = function (texto, ...argumentos) {
            const resultado = desenharTextoOriginal.call(
                this,
                texto,
                ...argumentos
            );

            const coordenadas =
                /^X:\s*(-?\d+)\s*\|\s*Y:\s*(-?\d+)$/
                    .exec(String(texto));

            if (coordenadas) {
                window.__pokerotaCoordenadas = {
                    x: Number(coordenadas[1]),
                    y: Number(coordenadas[2]),
                };
            }

            return resultado;
        };
    });
}

async function obterCoordenadasDoCanvas(page) {
    return page.evaluate(() =>
        window.__pokerotaCoordenadas ?? null
    );
}

async function aguardarCoordenadasDoCanvas(page) {
    await expect.poll(
        () => obterCoordenadasDoCanvas(page),
        {
            message: 'As coordenadas não foram desenhadas no Canvas.',
            timeout: 15000,
        }
    ).not.toBeNull();

    return obterCoordenadasDoCanvas(page);
}

async function verificarDeslocamento(page, inicial, eixo, sinal) {
    await expect.poll(async () => {
        const atual = await obterCoordenadasDoCanvas(page);

        if (!atual) return false;

        return sinal > 0
            ? atual[eixo] > inicial[eixo]
            : atual[eixo] < inicial[eixo];
    }, {
        timeout: 5000,
        message: `O personagem não se deslocou no eixo ${eixo}.`,
    }).toBe(true);
}

test.describe('Interface da tela de jogo', () => {

    test('CT-MOV-001 — deve exibir o mapa e a área de movimentação', async ({ page }) => {
        const canvas = await iniciarJogo(page);

        // Confirma a fase iniciada.
        await expect(page.getByText('Fase 1', {
            exact: true,
        })).toBeVisible();

        // Confirma as dimensões reais do Canvas.
        await expect(canvas).toHaveAttribute('width', '800');
        await expect(canvas).toHaveAttribute('height', '500');

        // A função iniciarJogo já verifica que o mapa possui conteúdo gráfico renderizado.
    });

    test('CT-MOV-002 — deve utilizar o personagem selecionado na fase', async ({ page }) => {
        // Inicia com Pikachu.
        const canvas = await iniciarJogo(page, 'Pikachu');

        const imagemPikachu = await canvas.screenshot();

        // Retorna à seleção de fases.
        await page.getByRole('button', {
            name: 'Voltar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/niveis$/);

        // Acessa novamente a seleção de personagem.
        await page.getByRole('button', {
            name: 'Fase 1, disponível',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/personagem$/);

        // Escolhe outro personagem.
        await page.getByRole('button', {
            name: 'Eevee',
            exact: true,
        }).click();

        await page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/jogo$/);

        const novoCanvas = page.locator('.jogo__canvas-area canvas');

        await expect(novoCanvas).toBeVisible({ timeout: 15000 });

        await aguardarRenderizacao(novoCanvas);

        const imagemEevee = await novoCanvas.screenshot();

        // Na mesma fase e posição inicial, trocar o personagem deve produzir uma imagem diferente no Canvas.
        expect(imagemPikachu.equals(imagemEevee)).toBe(false);
    });

    test('CT-MOV-003 — deve disponibilizar os quatro controles direcionais', async ({ page }) => {
        await iniciarJogo(page);

        const controles = page.getByRole('group', {
            name: 'Controles de movimentação',
        });

        await expect(controles).toBeVisible();

        const direcoes = [
            'Mover para frente',
            'Mover para trás',
            'Mover para a esquerda',
            'Mover para a direita',
        ];

        for (const direcao of direcoes) {
            const botao = controles.getByRole('button', {
                name: direcao,
                exact: true,
            });

            await expect(botao).toBeVisible();
            await expect(botao).toBeEnabled();
            await expect(botao).toHaveAttribute(
                'aria-pressed',
                'false'
            );
        }

        // Exatamente quatro botões direcionais.
        await expect(
            controles.getByRole('button')
        ).toHaveCount(4);
    });
});

test.describe('Movimentação por comandos na interface', () => {

    test('CT-MOV-004 — deve movimentar o personagem por botão direcional', async ({ page }) => {
        await observarCoordenadasDoCanvas(page);
        await iniciarJogo(page);

        const inicial = await aguardarCoordenadasDoCanvas(page);

        const botao = page.getByRole('button', {
            name: 'Mover para a direita',
            exact: true,
        });

        await expect(botao).toBeEnabled();

        // Mantém o botão pressionado enquanto verifica o movimento.
        await botao.hover();
        await page.mouse.down();

        try {
            await expect(botao).toHaveAttribute(
                'aria-pressed',
                'true'
            );

            await verificarDeslocamento(
                page,
                inicial,
                'x',
                1
            );
        } finally {
            await page.mouse.up();
        }

        await expect(botao).toHaveAttribute(
            'aria-pressed',
            'false'
        );

        const final = await obterCoordenadasDoCanvas(page);

        // O comando para a direita não deve alterar o eixo Y.
        expect(final.y).toBe(inicial.y);
        expect(final.x).toBeGreaterThan(inicial.x);
    });

    test('CT-MOV-005 — deve movimentar o personagem pelas setas do teclado', async ({ page }) => {
        await observarCoordenadasDoCanvas(page);
        await iniciarJogo(page);

        const inicial = await aguardarCoordenadasDoCanvas(page);

        // Simula uma seta pressionada no teclado.
        await page.keyboard.down('ArrowLeft');

        try {
            await verificarDeslocamento(
                page,
                inicial,
                'x',
                -1
            );
        } finally {
            await page.keyboard.up('ArrowLeft');
        }

        const final = await obterCoordenadasDoCanvas(page);

        expect(final.x).toBeLessThan(inicial.x);
        expect(final.y).toBe(inicial.y);
    });

    test('CT-MOV-006 — deve movimentar nas quatro direções pela interface', async ({ page }) => {
        await observarCoordenadasDoCanvas(page);
        await iniciarJogo(page);

        const inicial = await aguardarCoordenadasDoCanvas(page);

        const direcoes = [
            { tecla: 'ArrowUp', eixo: 'y', sinal: -1 },
            { tecla: 'ArrowDown', eixo: 'y', sinal: 1 },
            { tecla: 'ArrowLeft', eixo: 'x', sinal: -1 },
            { tecla: 'ArrowRight', eixo: 'x', sinal: 1 },
        ];

        for (const direcao of direcoes) {
            // Cada direção parte da mesma posição inicial.
            await page.getByRole('button', {
                name: 'Reiniciar fase',
                exact: true,
            }).click();

            await expect.poll(
                () => obterCoordenadasDoCanvas(page)
            ).toEqual(inicial);

            await page.keyboard.down(direcao.tecla);

            try {
                await verificarDeslocamento(
                    page,
                    inicial,
                    direcao.eixo,
                    direcao.sinal
                );
            } finally {
                await page.keyboard.up(direcao.tecla);
            }

            const final = await obterCoordenadasDoCanvas(page);

            const outroEixo = direcao.eixo === 'x' ? 'y' : 'x';

            // Cada comando movimenta apenas no eixo esperado.
            expect(final[outroEixo]).toBe(inicial[outroEixo]);
        }
    });
});
