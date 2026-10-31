import { test, expect } from '@playwright/test';

// Somente a montagem visual substitui o serviço; os testes de autenticação
// continuam usando a aplicação e o emulador reais.
test.beforeEach(async ({ page }) => {
    await page.route('**/src/services/progressoService*', route => route.fulfill({
        contentType: 'application/javascript',
        body: `export async function carregarProgresso() { return { ultimoNivelConcluido: 0 }; }
               export async function salvarProgresso(v) { return { ultimoNivelConcluido: v }; }
               export async function excluirProgresso() {}`,
    }));
});

for (const viewport of [
    { width: 1366, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
]) {
    for (const tema of ['claro', 'escuro']) {
        test(`estilos — ${viewport.width}x${viewport.height} — ${tema}`, async ({ page }) => {
            await page.setViewportSize(viewport);
            for (const tela of ['home', 'niveis', 'personagens', 'jogo', 'conta', 'final']) {
                await page.goto(`/tests/fixtures/estilos.html?tela=${tela}&tema=${tema}`);
                await expect(page.locator('.painel')).toBeVisible();
                expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

                if (tela === 'niveis') {
                    const cartoes = page.locator('.mapa-fase');
                    await expect(cartoes).toHaveCount(5);
                    if (viewport.width <= 600) {
                        const primeiro = await cartoes.nth(0).boundingBox();
                        const segundo = await cartoes.nth(1).boundingBox();
                        expect(segundo.y).toBe(primeiro.y);
                        expect(segundo.x).toBeGreaterThan(primeiro.x);
                    }
                }
                if (tela === 'personagens') {
                    const selecionar = page.getByRole('button', { name: 'Selecionar', exact: true });
                    await expect(selecionar).toBeDisabled();
                    await page.getByRole('button', { name: 'Eevee', exact: true }).click();
                    await expect(selecionar).toBeEnabled();
                    await page.keyboard.press('Tab');
                    await page.keyboard.press('Shift+Tab');
                    await expect(page.locator('.selecao-personagem__cartao:focus-visible')).toHaveCSS('outline-style', 'solid');
                }
                if (tela === 'jogo') {
                    const canvas = page.locator('canvas');
                    await expect(canvas).toBeVisible();
                    const desenho = await canvas.boundingBox();
                    const area = await page.locator('.jogo__canvas-container').boundingBox();
                    expect(desenho.width).toBeLessThanOrEqual(area.width + 1);
                    expect(desenho.height).toBeLessThanOrEqual(area.height + 1);
                    expect(desenho.width / desenho.height).toBeCloseTo(1.6, 1);
                    await expect(page.locator('.botoes-direcionais__botao')).toHaveCount(4);
                }
                if (tela === 'conta') {
                    await page.getByRole('button', { name: 'Apagar minha conta', exact: true }).click();
                    await expect(page.getByRole('dialog')).toBeVisible();
                    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
                    await expect(page.getByRole('dialog', { name: 'Tem certeza?' })).toBeVisible();
                    await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
                    await expect(page.getByRole('dialog')).not.toBeVisible();
                }
                if (tela === 'final') {
                    await expect(page.getByRole('button', { name: 'Próxima fase', exact: true })).toBeDisabled();
                }
            }
        });
    }
}
