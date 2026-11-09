import { randomUUID } from 'node:crypto';
import { expect } from '@playwright/test';

const NOME_TESTE = 'Pessoa Teste';

export async function verificarHomeSemSessao(page) {
    await expect(page).toHaveURL(/\/$/);

    await expect(page.getByRole('heading', {
        name: 'Entre para começar sua aventura!',
    })).toBeVisible();

    await expect(page.getByRole('button', {
        name: 'Entrar com Google',
        exact: true,
    })).toBeEnabled();
}

export async function verificarAreaAutenticada(page) {
    await expect(page).toHaveURL(/\/niveis$/);

    await expect(
        page.getByText(`Olá, ${NOME_TESTE}!`, { exact: true })
    ).toBeVisible();

    await expect(page.getByRole('button', {
        name: 'Sair',
        exact: true,
    })).toBeEnabled();
}

export async function abrirLogin(page) {
    await page.goto('/');
    await verificarHomeSemSessao(page);

    const janelaPromise = page.waitForEvent('popup');

    await page.getByRole('button', {
        name: 'Entrar com Google',
        exact: true,
    }).click();

    const janela = await janelaPromise;

    // Confirma que o login utiliza o emulador local.
    await expect(janela).toHaveURL(
        /^http:\/\/127\.0\.0\.1:9099\/.*$/
    );

    await janela.waitForLoadState('load');

    await expect(janela.getByRole('button', {
        name: /Add new account/i,
    })).toBeVisible();

    return janela;
}

export async function entrarComContaTeste(
    page,
    email = `pokerota-${randomUUID()}@example.com`
) {
    const janela = await abrirLogin(page);

    await janela.getByRole('button', {
        name: /Add new account/i,
    }).click();

    await janela.locator('#email-input').fill(email);
    await janela.locator('#display-name-input').fill(NOME_TESTE);

    await janela.getByRole('button', {
        name: /Sign in with Google\.com/i,
    }).click();

    await verificarAreaAutenticada(page);

    return email;
}