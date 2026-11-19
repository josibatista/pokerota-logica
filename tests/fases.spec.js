import { test, expect } from '@playwright/test';
import { entrarComContaTeste } from './utils/autenticacao.js';

test.describe('Seleção de fases', () => {
    test.beforeEach(async ({ page }) => {
        // Cada teste utiliza uma conta fictícia independente.
        await entrarComContaTeste(page);

        // Aguarda a consulta do progresso inicial ao Firestore.
        await expect(page.getByText(
            'Fases concluídas: 0 de 5',
            { exact: true }
        )).toBeVisible();
    });

    test('CT-FAS-001 — deve exibir cinco mapas distintos', async ({ page }) => {
        const listaMapas = page.locator('.selecao-nivel__mapas');

        await expect(
            listaMapas.locator('button.mapa-fase')
        ).toHaveCount(5);

        const imagens = [];

        for (let numero = 1; numero <= 5; numero++) {
            const estado = numero === 1
                ? 'disponível'
                : 'bloqueada';

            const cartao = page.getByRole('button', {
                name: `Fase ${numero}, ${estado}`,
                exact: true,
            });

            await expect(cartao).toBeVisible();

            const imagem = cartao.locator('img');

            await expect(imagem).toHaveAttribute(
                'alt',
                `Mapa da fase ${numero}`
            );

            const caminhoImagem = await imagem.getAttribute('src');

            expect(caminhoImagem).toBeTruthy();
            imagens.push(caminhoImagem);
        }

        // Cada fase deve utilizar um arquivo de imagem diferente.
        expect(new Set(imagens).size).toBe(5);
    });

    test('CT-FAS-002 — deve bloquear fases ainda não liberadas', async ({ page }) => {
        const primeiraFase = page.getByRole('button', {
            name: 'Fase 1, disponível',
            exact: true,
        });

        await expect(primeiraFase).toBeEnabled();

        for (let numero = 2; numero <= 5; numero++) {
            const fase = page.getByRole('button', {
                name: `Fase ${numero}, bloqueada`,
                exact: true,
            });

            await expect(fase).toBeDisabled();

            await expect(fase).toHaveClass(
                /mapa-fase--bloqueada/
            );
        }

        await expect(page).toHaveURL(/\/niveis$/);
    });

    test('deve permitir iniciar a seleção da primeira fase', async ({ page }) => {
        const primeiraFase = page.getByRole('button', {
            name: 'Fase 1, disponível',
            exact: true,
        });

        await expect(primeiraFase).toHaveClass(
            /mapa-fase--destaque/
        );

        // A fase 1 já inicia selecionada.
        await primeiraFase.click();

        await expect(page).toHaveURL(/\/personagem$/);

        await expect(page.getByRole('heading', {
            name: 'Seleção de personagem',
        })).toBeVisible();

        // Verifica o retorno à seleção de níveis.
        await page.getByRole('button', {
            name: 'Voltar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/niveis$/);

        await expect(page.getByText(
            'Fases concluídas: 0 de 5',
            { exact: true }
        )).toBeVisible();
    });

    test('CT-FAS-005 — deve retornar do jogo à seleção de fases', async ({ page }) => {
        await page.getByRole('button', {
            name: 'Fase 1, disponível',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/personagem$/);

        await page.getByRole('button', {
            name: 'Pikachu',
            exact: true,
        }).click();

        await page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/jogo$/);

        await expect(page.getByText('Fase 1', {
            exact: true,
        })).toBeVisible();

        await page.getByRole('button', {
            name: 'Voltar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/niveis$/);

        await expect(page.getByText(
            'Fases concluídas: 0 de 5',
            { exact: true }
        )).toBeVisible();
    });
});

//Reinício e pausa das fases

const POSICAO_INICIAL_FASE_1 = { x: 550, y: 485 };

// Observa as coordenadas desenhadas pelo Canvas, sem alterar a implementação da movimentação da aplicação.
async function observarCoordenadasDoCanvas(page) {
    await page.evaluate(() => {
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

// Aguarda quadros reais da animação para verificar a estabilidade da posição.
async function aguardarQuadros(page, quantidade = 12) {
    await page.evaluate(async (total) => {
        for (let i = 0; i < total; i++) {
            await new Promise((resolve) => {
                requestAnimationFrame(resolve);
            });
        }
    }, quantidade);
}

// Inicia uma fase usando o fluxo real da interface.
async function iniciarPrimeiraFase(page) {
    await page.getByRole('button', {
        name: 'Fase 1, disponível',
        exact: true,
    }).click();

    await expect(page).toHaveURL(/\/personagem$/);

    await page.getByRole('button', {
        name: 'Pikachu',
        exact: true,
    }).click();

    await page.getByRole('button', {
        name: 'Selecionar',
        exact: true,
    }).click();

    await expect(page).toHaveURL(/\/jogo$/);

    const canvas = page.locator('.jogo__canvas-area canvas');

    await expect(canvas).toBeVisible({
        timeout: 15000,
    });

    // Confirma que o personagem começou na posição prevista.
    await expect.poll(
        () => obterCoordenadasDoCanvas(page),
        { timeout: 15000 }
    ).toEqual(POSICAO_INICIAL_FASE_1);
}

// Movimenta o personagem e devolve a nova posição.
async function moverParaDireita(page, posicaoAnterior) {
    await page.keyboard.down('ArrowRight');

    try {
        await expect.poll(async () => {
            const atual = await obterCoordenadasDoCanvas(page);
            return atual?.x;
        }, {
            timeout: 5000,
        }).toBeGreaterThan(posicaoAnterior.x);
    } finally {
        await page.keyboard.up('ArrowRight');
    }

    // Aguarda a liberação do comando ser refletida no Canvas.
    await aguardarQuadros(page, 4);

    return obterCoordenadasDoCanvas(page);
}

test.describe('Controles da fase — reinício e pausa', () => {
    test.beforeEach(async ({ page }) => {
        // Prepara uma conta e inicia a primeira fase.
        await entrarComContaTeste(page);

        // Instala o observador antes da criação do Canvas.
        await observarCoordenadasDoCanvas(page);

        await iniciarPrimeiraFase(page);
    });

    test('CT-FAS-006 — deve reiniciar a fase e restaurar a posição inicial', async ({ page }) => {
        const inicial = await obterCoordenadasDoCanvas(page);

        expect(inicial).toEqual(POSICAO_INICIAL_FASE_1);

        // Movimenta o personagem para outra posição.
        const deslocada = await moverParaDireita(page, inicial);

        expect(deslocada.x).toBeGreaterThan(inicial.x);
        expect(deslocada.y).toBe(inicial.y);

        // Solicita o reinício pelo controle do jogo.
        await page.getByRole('button', {
            name: 'Reiniciar fase',
            exact: true,
        }).click();

        // Verifica o retorno à posição inicial.
        await expect.poll(
            () => obterCoordenadasDoCanvas(page),
            {
                timeout: 15000,
                message: 'O personagem não retornou à posição inicial.',
            }
        ).toEqual(POSICAO_INICIAL_FASE_1);

        // Confirma que a fase não foi trocada.
        await expect(page).toHaveURL(/\/jogo$/);

        await expect(page.getByText('Fase 1', {
            exact: true,
        })).toBeVisible();

        await expect(
            page.locator('.jogo__canvas-area canvas')
        ).toBeVisible();
    });

    test('CT-FAS-007 — deve impedir movimento durante a pausa e retomar a fase', async ({ page }) => {
        const inicial = await obterCoordenadasDoCanvas(page);

        // Movimenta o personagem antes de pausar.
        const antesPausa = await moverParaDireita(page, inicial);

        expect(antesPausa.x).toBeGreaterThan(inicial.x);

        // Pausa a partida.
        await page.getByRole('button', {
            name: 'Pausar jogo',
            exact: true,
        }).click();

        const painelPausa = page.getByRole('dialog', {
            name: 'Jogo pausado',
        });

        await expect(painelPausa).toBeVisible();

        // Tenta movimentar o personagem durante a pausa.
        await page.keyboard.down('ArrowRight');

        try {
            await aguardarQuadros(page, 20);

            const durantePausa =
                await obterCoordenadasDoCanvas(page);

            // A posição deve permanecer inalterada.
            expect(durantePausa).toEqual(antesPausa);
        } finally {
            await page.keyboard.up('ArrowRight');
        }

        // Retoma a partida pelo painel.
        await painelPausa.getByRole('button', {
            name: 'Continuar jogando',
            exact: true,
        }).click();

        await expect(painelPausa).not.toBeVisible();

        // A retomada deve preservar a posição anterior.
        expect(
            await obterCoordenadasDoCanvas(page)
        ).toEqual(antesPausa);

        // Verifica que a movimentação voltou a funcionar.
        const depoisRetomada = await moverParaDireita(
            page,
            antesPausa
        );

        expect(depoisRetomada.x).toBeGreaterThan(
            antesPausa.x
        );

        await expect(page).toHaveURL(/\/jogo$/);
    });
});
