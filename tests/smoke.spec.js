import { test, expect } from '@playwright/test';

test('deve carregar a página inicial', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Home' })
  ).toBeVisible();
});
