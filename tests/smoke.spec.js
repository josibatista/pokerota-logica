import { test, expect } from '@playwright/test';

test('deve carregar a Home com as opções de acesso', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', {
            name: 'Entre para começar sua aventura!',
        })
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Entrar com Google' })
    ).toBeEnabled();

    await expect(
        page.getByRole('button', { name: 'Experimente', exact: true })
    ).toBeEnabled();
});