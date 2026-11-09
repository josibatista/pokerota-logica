import { test, expect } from '@playwright/test';
import { entrarComContaTeste } from './utils/autenticacao.js';

const PERSONAGENS = [
    'Bulbasaur',
    'Charmander',
    'Squirtle',
    'Pikachu',
    'Eevee',
];

test.describe('Seleção de personagens', () => {
    test.beforeEach(async ({ page }) => {
        // Autentica e acessa a seleção da primeira fase.
        await entrarComContaTeste(page);

        await expect(page.getByRole('button', {
            name: 'Fase 1, disponível',
            exact: true,
        })).toBeEnabled();

        await page.getByRole('button', {
            name: 'Fase 1, disponível',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/personagem$/);

        await expect(page.getByRole('heading', {
            name: 'Seleção de personagem',
        })).toBeVisible();
    });

    test('deve apresentar os cinco personagens disponíveis', async ({ page }) => {
        await expect(
            page.locator('.selecao-personagem__cartao')
        ).toHaveCount(5);

        for (const nome of PERSONAGENS) {
            const cartao = page.getByRole('button', {
                name: nome,
                exact: true,
            });

            await expect(cartao).toBeVisible();
            await expect(cartao).toBeEnabled();
            await expect(cartao).toHaveAttribute(
                'aria-pressed',
                'false'
            );
        }

        // Não permite confirmar sem selecionar personagem.
        await expect(page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        })).toBeDisabled();
    });

    test('deve permitir selecionar e trocar o personagem', async ({ page }) => {
        const bulbasaur = page.getByRole('button', {
            name: 'Bulbasaur',
            exact: true,
        });

        const charmander = page.getByRole('button', {
            name: 'Charmander',
            exact: true,
        });

        await bulbasaur.click();

        await expect(bulbasaur).toHaveAttribute(
            'aria-pressed',
            'true'
        );

        await expect(bulbasaur).toHaveClass(
            /selecao-personagem__cartao--selecionado/
        );

        await expect(page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        })).toBeEnabled();

        // Troca a escolha antes de confirmar.
        await charmander.click();

        await expect(charmander).toHaveAttribute(
            'aria-pressed',
            'true'
        );

        await expect(bulbasaur).toHaveAttribute(
            'aria-pressed',
            'false'
        );

        // Apenas um personagem deve permanecer selecionado.
        await expect(page.locator(
            '.selecao-personagem__cartao[aria-pressed="true"]'
        )).toHaveCount(1);
    });

    test('CT-MOV-002 — deve confirmar personagem e iniciar a fase', async ({ page }) => {
        const squirtle = page.getByRole('button', {
            name: 'Squirtle',
            exact: true,
        });

        await squirtle.click();

        await expect(squirtle).toHaveAttribute(
            'aria-pressed',
            'true'
        );

        await page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        }).click();

        // Verifica a navegação para o jogo.
        await expect(page).toHaveURL(/\/jogo$/);

        await expect(page.getByText('Fase 1', {
            exact: true,
        })).toBeVisible();

        // Verifica a criação da área de jogo.
        await expect(
            page.locator('.jogo__canvas-area canvas')
        ).toBeVisible({ timeout: 15000 });
    });

    test('deve manter a escolha ao retornar à seleção de personagens', async ({ page }) => {
        const eevee = page.getByRole('button', {
            name: 'Eevee',
            exact: true,
        });

        await eevee.click();

        await expect(eevee).toHaveAttribute(
            'aria-pressed',
            'true'
        );

        await page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/jogo$/);

        // Retorna à seleção de fases.
        await page.getByRole('button', {
            name: 'Voltar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/niveis$/);

        // Seleciona novamente a primeira fase.
        await page.getByRole('button', {
            name: 'Fase 1, disponível',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/personagem$/);

        // A escolha deve permanecer no React Context.
        await expect(page.getByRole('button', {
            name: 'Eevee',
            exact: true,
        })).toHaveAttribute('aria-pressed', 'true');

        await expect(page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        })).toBeEnabled();
    });

    test('não deve iniciar o jogo sem uma fase definida', async ({ page }) => {
        // Acesso direto, sem receber a fase pela navegação.
        await page.goto('/');
        await page.goto('/personagem');

        await expect(page.getByRole('heading', {
            name: 'Seleção de personagem',
        })).toBeVisible();

        await page.getByRole('button', {
            name: 'Bulbasaur',
            exact: true,
        }).click();

        // Selecionar um personagem não é suficiente sem a fase.
        await expect(page.getByRole('button', {
            name: 'Selecionar',
            exact: true,
        })).toBeDisabled();

        await expect(page).toHaveURL(/\/personagem$/);
    });
});
