
import { test, expect } from '@playwright/test';
import { entrarComContaTeste } from './utils/autenticacao.js';

test.describe('Interface — menu e configurações', () => {
    test.beforeEach(async ({ page }) => {
        // Cada teste utiliza uma conta fictícia independente.
        await entrarComContaTeste(page);
    });

    test('CT-INT-001 — deve exibir as opções do menu superior', async ({ page }) => {
        const instrucoes = page.getByRole('button', {
            name: 'Instruções',
            exact: true,
        });

        const configuracoes = page.getByRole('button', {
            name: 'Configurações',
            exact: true,
        });

        await expect(instrucoes).toBeVisible();
        await expect(instrucoes).toBeEnabled();

        await expect(configuracoes).toBeVisible();
        await expect(configuracoes).toBeEnabled();
    });

    test('CT-INT-002 — deve navegar pelas opções do menu superior', async ({ page }) => {
        // Acessa as configurações pelo menu.
        await page.getByRole('button', {
            name: 'Configurações',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/configuracoes$/);

        await expect(page.getByRole('heading', {
            name: 'Aparência e acessibilidade',
        })).toBeVisible();

        // Retorna à tela de origem.
        await page.getByRole('button', {
            name: 'Voltar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/niveis$/);

        // Abre as instruções pelo menu.
        await page.getByRole('button', {
            name: 'Instruções',
            exact: true,
        }).click();

        const dialogo = page.getByRole('dialog', {
            name: 'Instruções',
        });

        await expect(dialogo).toBeVisible();

        // Fecha as instruções e confirma o retorno.
        await dialogo.getByRole('button', {
            name: 'Fechar',
            exact: true,
        }).click();

        await expect(dialogo).not.toBeVisible();
        await expect(page).toHaveURL(/\/niveis$/);
    });

    test('CT-INT-003 — deve exibir as opções de configurações', async ({ page }) => {
        await page.getByRole('button', {
            name: 'Configurações',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/configuracoes$/);

        // Verifica as opções de aparência e acessibilidade.
        await expect(page.getByRole('heading', {
            name: 'Aparência e acessibilidade',
        })).toBeVisible();

        await expect(page.getByRole('radio', {
            name: 'Claro',
        })).toBeVisible();

        await expect(page.getByRole('radio', {
            name: 'Escuro',
        })).toBeVisible();

        await expect(page.getByRole('switch', {
            name: 'Tela cheia',
        })).toBeVisible();

        // Verifica as opções de gerenciamento de conta.
        await expect(page.getByRole('heading', {
            name: 'Conta',
            exact: true,
        })).toBeVisible();

        await expect(page.getByRole('button', {
            name: 'Sair da minha conta',
            exact: true,
        })).toBeEnabled();

        await expect(page.getByRole('button', {
            name: 'Apagar minha conta',
            exact: true,
        })).toBeEnabled();
    });

    test('CT-INT-004 — deve aplicar e manter a configuração de acessibilidade', async ({ page }) => {
        await page.getByRole('button', {
            name: 'Configurações',
            exact: true,
        }).click();

        const temaClaro = page.getByRole('radio', {
            name: 'Claro',
        });

        const temaEscuro = page.getByRole('radio', {
            name: 'Escuro',
        });

        const estrutura = page.locator('.estrutura');

        // Verifica o tema inicial.
        await expect(temaClaro).toBeChecked();
        await expect(estrutura).toHaveClass(/temaClaro/);

        // Altera para o tema escuro.
        await temaEscuro.check();

        await expect(temaEscuro).toBeChecked();
        await expect(estrutura).toHaveClass(/temaEscuro/);

        // Confirma que a preferência foi armazenada.
        await expect.poll(() => page.evaluate(() =>
            localStorage.getItem('pokerota-tema')
        )).toBe('escuro');

        // Recarrega para verificar a persistência.
        await page.reload();

        await expect(temaEscuro).toBeChecked();
        await expect(estrutura).toHaveClass(/temaEscuro/);

        // Volta ao tema claro.
        await temaClaro.check();

        await expect(temaClaro).toBeChecked();
        await expect(estrutura).toHaveClass(/temaClaro/);

        await expect.poll(() => page.evaluate(() =>
            localStorage.getItem('pokerota-tema')
        )).toBe('claro');
    });

    test('CT-INT-005 — deve ativar e desativar a tela cheia', async ({ page }) => {
        await page.getByRole('button', {
            name: 'Configurações',
            exact: true,
        }).click();

        // Confere a disponibilidade real da API do navegador.
        const suportada = await page.evaluate(() =>
            document.fullscreenEnabled === true &&
            typeof document.documentElement.requestFullscreen === 'function' &&
            typeof document.exitFullscreen === 'function'
        );

        test.skip(
            !suportada,
            'O navegador de teste não oferece suporte à API Fullscreen.'
        );

        const interruptor = page.getByRole('switch', {
            name: 'Tela cheia',
        });

        await expect(interruptor).toBeEnabled();
        await expect(interruptor).toHaveAttribute(
            'aria-checked',
            'false'
        );

        // Ativa a tela cheia por interação real.
        await interruptor.click();

        await expect.poll(() => page.evaluate(() =>
            document.fullscreenElement === document.documentElement
        )).toBe(true);

        await expect(interruptor).toHaveAttribute(
            'aria-checked',
            'true'
        );

        // Desativa a tela cheia.
        await interruptor.click();

        await expect.poll(() => page.evaluate(() =>
            document.fullscreenElement === null
        )).toBe(true);

        await expect(interruptor).toHaveAttribute(
            'aria-checked',
            'false'
        );
    });

    test('CT-INT-007 — deve exibir as instruções de movimentação', async ({ page }) => {
        await page.getByRole('button', {
            name: 'Instruções',
            exact: true,
        }).click();

        const dialogo = page.getByRole('dialog', {
            name: 'Instruções',
        });

        await expect(dialogo).toBeVisible();

        await expect(dialogo.getByRole('heading', {
            name: 'Movimentação',
            exact: true,
        })).toBeVisible();

        // Confirma que a explicação contempla teclado e tela.
        await expect(dialogo.getByText(
            /funcionam do mesmo jeito no teclado e na tela/i
        )).toBeVisible();

        const direcoes = [
            'Seta para cima:',
            'Seta para baixo:',
            'Seta para a esquerda:',
            'Seta para a direita:',
        ];

        for (const direcao of direcoes) {
            await expect(dialogo.getByText(direcao, {
                exact: true,
            })).toBeVisible();
        }

        // Verifica orientações sobre a interação.
        await expect(dialogo.getByText(
            /quando solta, ele para/i
        )).toBeVisible();

        await dialogo.getByRole('button', {
            name: 'Fechar',
            exact: true,
        }).click();

        await expect(dialogo).not.toBeVisible();
    });
});

test.describe('Interface — experiência sem autenticação', () => {
    test('CT-INT-006 — deve permitir experimentar o jogo sem autenticação', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('button', {
            name: 'Experimente',
            exact: true,
        })).toBeEnabled();

        // Acessa a experiência sem criar uma sessão.
        await page.getByRole('button', {
            name: 'Experimente',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/jogo$/);

        await expect(page.getByText('Fase 1', {
            exact: true,
        })).toBeVisible();

        // Verifica que a área do jogo foi disponibilizada.
        const canvas = page.locator('.jogo__canvas-area canvas');

        await expect(canvas).toBeVisible({
            timeout: 15000,
        });

        await expect(page.getByRole('group', {
            name: 'Controles de movimentação',
        })).toBeVisible();

        // Confirma que a experiência não criou uma sessão.
        await page.getByRole('button', {
            name: 'Voltar',
            exact: true,
        }).click();

        await expect(page).toHaveURL(/\/$/);

        await expect(page.getByRole('button', {
            name: 'Entrar com Google',
            exact: true,
        })).toBeEnabled();
    });
});
