import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';

const EMULADOR_URL = 'http://127.0.0.1:9099';
const ROTAS_PROTEGIDAS = ['/niveis', '/personagem'];
const NOME_TESTE = 'Pessoa Teste';

function respostaDoEmulador(resposta, operacao) {
    const url = new URL(resposta.url());

    return url.origin === EMULADOR_URL &&
        url.pathname.endsWith(`/accounts:${operacao}`) &&
        resposta.request().method() === 'POST';
}

function respostaDeAutenticacaoLocal(resposta) {
    return respostaDoEmulador(resposta, 'signInWithIdp');
}

function respostaDeExclusaoLocal(resposta) {
    return respostaDoEmulador(resposta, 'delete');
}

async function verificarHomeSemSessao(page) {
    await expect(page).toHaveURL(/\/$/);

    await expect(page.getByRole('heading', {
        name: 'Entre para começar sua aventura!',
    })).toBeVisible();

    await expect(page.getByRole('button', {
        name: 'Entrar com Google',
        exact: true,
    })).toBeEnabled();
}

async function verificarAreaAutenticada(page) {
    await expect(page).toHaveURL(/\/niveis$/);

    await expect(
        page.getByText(`Olá, ${NOME_TESTE}!`, { exact: true })
    ).toBeVisible();

    await expect(page.getByRole('button', {
        name: 'Sair',
        exact: true,
    })).toBeEnabled();
}

async function abrirLogin(page) {
    await page.goto('/');
    await verificarHomeSemSessao(page);

    const janelaPromise = page.waitForEvent('popup');

    await page.getByRole('button', {
        name: 'Entrar com Google',
        exact: true,
    }).click();

    const janela = await janelaPromise;

    // Confirma que a autenticação está usando o emulador local.
    await expect(janela).toHaveURL(
        /^http:\/\/127\.0\.0\.1:9099\/.*$/
    );

    await janela.waitForLoadState('load');

    await expect(janela.getByRole('button', {
        name: /Add new account/i,
    })).toBeVisible();

    return janela;
}

async function entrarComContaTeste(
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

async function iniciarExclusao(page) {
    await page.getByRole('button', {
        name: 'Configurações',
        exact: true,
    }).click();

    await page.getByRole('button', {
        name: 'Apagar minha conta',
        exact: true,
    }).click();

    await expect(page.getByRole('dialog', {
        name: 'Quer apagar sua conta?',
    })).toBeVisible();
}

async function avancarParaSegundaConfirmacao(page) {
    await page.getByRole('dialog', {
        name: 'Quer apagar sua conta?',
    }).getByRole('button', {
        name: 'Continuar',
        exact: true,
    }).click();

    await expect(page.getByRole('dialog', {
        name: 'Tem certeza?',
    })).toBeVisible();
}

async function confirmarExclusao(page) {
    const exclusaoPromise = page.waitForResponse(
        respostaDeExclusaoLocal
    );

    await page.getByRole('dialog', {
        name: 'Tem certeza?',
    }).getByRole('button', {
        name: 'Sim, apagar minha conta',
        exact: true,
    }).click();

    // Confere a resposta real do emulador, além da mudança de tela.
    const resposta = await exclusaoPromise;

    expect(resposta.status()).toBe(200);

    await verificarHomeSemSessao(page);
}

async function verificarRotasBloqueadas(page) {
    for (const rota of ROTAS_PROTEGIDAS) {
        await page.goto(rota);
        await verificarHomeSemSessao(page);
    }
}

test.describe('Autenticação — proteção das rotas', () => {
    // Verificações complementares, sem atribuir IDs de outros casos.
    for (const rota of ROTAS_PROTEGIDAS) {
        test(`deve impedir acesso sem sessão a ${rota}`, async ({ page }) => {
            await page.goto(rota);
            await verificarHomeSemSessao(page);
        });
    }
});

test.describe('Autenticação — login', () => {
    test('CT-AUT-001 — deve autenticar e manter a sessão após atualizar', async ({ page }) => {
        await entrarComContaTeste(page);

        await page.reload();

        await verificarAreaAutenticada(page);
    });

    test('CT-AUT-002 — deve permanecer sem sessão ao cancelar o login', async ({ page }) => {
        const janela = await abrirLogin(page);

        await janela.close();

        await expect(page.getByText(
            'Você cancelou a entrada. Pode tentar de novo quando quiser.',
            { exact: true }
        )).toBeVisible({ timeout: 15000 });

        await verificarHomeSemSessao(page);

        await page.goto('/niveis');

        await verificarHomeSemSessao(page);
    });
});

test.describe('Autenticação — gerenciamento da conta', () => {
    for (const etapa of [1, 2]) {
        test(`CT-AUT-003 — deve preservar a conta ao cancelar na confirmação ${etapa}`, async ({ page }) => {
            await entrarComContaTeste(page);
            await iniciarExclusao(page);

            if (etapa === 2) {
                await avancarParaSegundaConfirmacao(page);
            }

            await page.getByRole('dialog').getByRole('button', {
                name: 'Cancelar',
                exact: true,
            }).click();

            await expect(page.getByRole('dialog')).not.toBeVisible();

            await expect(page.getByRole('button', {
                name: 'Apagar minha conta',
                exact: true,
            })).toBeEnabled();

            await page.goto('/niveis');
            await page.reload();

            await verificarAreaAutenticada(page);
        });
    }

    test('CT-AUT-004 — deve excluir a conta após duas confirmações', async ({ page }) => {
        await entrarComContaTeste(page);
        await iniciarExclusao(page);

        // A exclusão definitiva não está disponível na primeira etapa.
        await expect(page.getByRole('dialog', {
            name: 'Quer apagar sua conta?',
        }).getByRole('button', {
            name: 'Sim, apagar minha conta',
            exact: true,
        })).toHaveCount(0);

        await avancarParaSegundaConfirmacao(page);
        await confirmarExclusao(page);

        await page.reload();

        await verificarHomeSemSessao(page);
        await verificarRotasBloqueadas(page);
    });

    test('CT-AUT-005 — deve encerrar a sessão e bloquear as rotas privadas', async ({ page }) => {
        await entrarComContaTeste(page);

        await page.getByRole('button', {
            name: 'Sair',
            exact: true,
        }).click();

        await verificarHomeSemSessao(page);

        await page.reload();

        await verificarHomeSemSessao(page);
        await verificarRotasBloqueadas(page);
    });

    test('CT-AUT-006 — deve criar novo cadastro ao entrar com a mesma identidade após excluir a conta', async ({ page }) => {
        const primeiroLoginPromise = page.waitForResponse(
            respostaDeAutenticacaoLocal
        );

        const email = await entrarComContaTeste(page);
        const primeiroLogin = await primeiroLoginPromise;

        expect(primeiroLogin.status()).toBe(200);

        const cadastroAnterior = await primeiroLogin.json();

        expect(cadastroAnterior.localId).toEqual(expect.any(String));
        expect(cadastroAnterior.email).toBe(email);

        // Guarda a credencial fictícia do Google, não a sessão Firebase.
        const requisicaoOriginal = primeiroLogin.request().postDataJSON();
        const credencialOriginal = new URL(
            requisicaoOriginal.requestUri
        ).searchParams;

        expect(credencialOriginal.get('providerId')).toBe('google.com');
        expect(credencialOriginal.get('id_token')).toBeTruthy();

        await iniciarExclusao(page);
        await avancarParaSegundaConfirmacao(page);
        await confirmarExclusao(page);
        await verificarRotasBloqueadas(page);

        const destinoLogin = (url) =>
            url.origin === EMULADOR_URL &&
            url.pathname.endsWith('/accounts:signInWithIdp');

        // "Add new account" gera outra identidade no emulador.
        // Reutiliza a credencial original para representar o mesmo Google.
        // A resposta continua vindo do emulador, sem ser simulada.
        let identidadeReutilizada = false;

        const manterIdentidade = async (route) => {
            const requisicao = route.request();

            if (requisicao.method() !== 'POST') {
                await route.continue();
                return;
            }

            const dados = requisicao.postDataJSON();

            identidadeReutilizada = true;

            await route.continue({
                postData: JSON.stringify({
                    ...dados,
                    requestUri: requisicaoOriginal.requestUri,
                    postBody: requisicaoOriginal.postBody,
                }),
            });
        };

        await page.route(destinoLogin, manterIdentidade);

        try {
            const novoLoginPromise = page.waitForResponse(
                respostaDeAutenticacaoLocal
            );

            await entrarComContaTeste(page, email);

            const novoLogin = await novoLoginPromise;

            expect(novoLogin.status()).toBe(200);

            const novoCadastro = await novoLogin.json();

            expect(identidadeReutilizada).toBe(true);
            expect(novoCadastro.email).toBe(email);
            expect(novoCadastro.isNewUser).toBe(true);
            expect(novoCadastro.localId).toEqual(expect.any(String));

            // O novo cadastro deve ter outro UID.
            expect(novoCadastro.localId).not.toBe(
                cadastroAnterior.localId
            );

            await page.reload();

            await verificarAreaAutenticada(page);
        } finally {
            await page.unroute(destinoLogin, manterIdentidade);
        }
    });
});