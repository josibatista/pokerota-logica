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
