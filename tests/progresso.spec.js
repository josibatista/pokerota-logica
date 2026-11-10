import { test, expect } from '@playwright/test';

import {
    entrarComUsuarioTeste,
    verificarProgressoNaTela,
    salvarProgressoPelaAplicacao,
    prepararProgresso,
    consultarDocumentoProgresso,
    verificarProgressoNoBanco,
} from './utils/progresso.js';

test.describe('Persistência do progresso', () => {
    test('CT-PRO-001 — deve armazenar progresso pelo controlador', async ({
        page,
        request,
    }) => {
        const usuario = await entrarComUsuarioTeste(page);

        // Solicita o salvamento real pela aplicação.
        await salvarProgressoPelaAplicacao(page, 1);

        // Confirma a gravação no Firestore Emulator.
        await verificarProgressoNoBanco(request, usuario, 1);

        // Confirma a leitura do progresso após recarregar.
        await page.reload();

        await verificarProgressoNaTela(page, 1);
    });

    test('CT-PRO-002 — deve recuperar o progresso após novo acesso', async ({
        page,
        request,
    }) => {
        const usuario = await entrarComUsuarioTeste(page);

        // Prepara um progresso conhecido no emulador.
        await prepararProgresso(request, usuario, 2);

        await verificarProgressoNoBanco(request, usuario, 2);

        // Recarrega a aplicação mantendo a sessão.
        await page.reload();

        await verificarProgressoNaTela(page, 2);

        await expect(page.getByRole('button', {
            name: 'Fase 3, disponível',
            exact: true,
        })).toBeEnabled();
    });

    test('CT-PRO-003 — deve isolar o progresso entre usuários', async ({
        page,
        browser,
        request,
    }) => {
        // Usuário A utiliza o contexto padrão do teste.
        const usuarioA = await entrarComUsuarioTeste(page);

        // Browser.newPage cria outro contexto isolado.
        const paginaB = await browser.newPage();

        try {
            const usuarioB = await entrarComUsuarioTeste(paginaB);

            // Confirma que não são a mesma conta.
            expect(usuarioA.uid).not.toBe(usuarioB.uid);

            // Cada usuário recebe um progresso diferente.
            await prepararProgresso(request, usuarioA, 1);
            await prepararProgresso(request, usuarioB, 3);

            // Verifica os respectivos documentos.
            await verificarProgressoNoBanco(request, usuarioA, 1);
            await verificarProgressoNoBanco(request, usuarioB, 3);

            // Recupera os dados nas duas interfaces.
            await page.reload();
            await paginaB.reload();

            await verificarProgressoNaTela(page, 1);
            await verificarProgressoNaTela(paginaB, 3);

            // Usuário A não deve conseguir ler o documento de B.
            const acessoIndevido = await consultarDocumentoProgresso(
                request,
                usuarioA,
                usuarioB.uid
            );

            expect(acessoIndevido.status()).toBe(403);
        } finally {
            await paginaB.close();
        }
    });

    test('CT-PRO-004 — deve exibir o progresso correspondente', async ({
        page,
        request,
    }) => {
        const usuario = await entrarComUsuarioTeste(page);

        await prepararProgresso(request, usuario, 3);

        await page.reload();

        await verificarProgressoNaTela(page, 3);

        // As três primeiras fases devem estar concluídas.
        for (let numero = 1; numero <= 3; numero++) {
            await expect(page.getByRole('button', {
                name: `Fase ${numero}, concluída`,
                exact: true,
            })).toBeEnabled();
        }

        // A próxima fase deve estar disponível.
        await expect(page.getByRole('button', {
            name: 'Fase 4, disponível',
            exact: true,
        })).toBeEnabled();

        // A última fase deve continuar bloqueada.
        await expect(page.getByRole('button', {
            name: 'Fase 5, bloqueada',
            exact: true,
        })).toBeDisabled();
    });

    test('CT-PRO-005 — deve atualizar o progresso armazenado', async ({
        page,
        request,
    }) => {
        const usuario = await entrarComUsuarioTeste(page);

        // Estado inicial previamente armazenado.
        await prepararProgresso(request, usuario, 1);

        await page.reload();

        await verificarProgressoNaTela(page, 1);

        // Atualiza o progresso pelo controlador da aplicação.
        await salvarProgressoPelaAplicacao(page, 2);

        // O documento deve conter o novo valor.
        await verificarProgressoNoBanco(request, usuario, 2);

        await page.reload();

        await verificarProgressoNaTela(page, 2);

        await expect(page.getByRole('button', {
            name: 'Fase 3, disponível',
            exact: true,
        })).toBeEnabled();
    });
});

test.describe('Seleção de fases com progresso armazenado', () => {
    test('CT-FAS-003 — deve desbloquear a próxima fase após registrar progresso', async ({
        page,
        request,
    }) => {
        const usuario = await entrarComUsuarioTeste(page);

        // Antes da conclusão, a fase 2 está bloqueada.
        await expect(page.getByRole('button', {
            name: 'Fase 2, bloqueada',
            exact: true,
        })).toBeDisabled();

        // Registra a conclusão da fase 1 pelo controlador.
        await salvarProgressoPelaAplicacao(page, 1);

        await verificarProgressoNoBanco(request, usuario, 1);

        // Atualiza a seleção de níveis.
        await page.reload();

        await verificarProgressoNaTela(page, 1);

        // A fase 2 deve estar liberada.
        await expect(page.getByRole('button', {
            name: 'Fase 2, disponível',
            exact: true,
        })).toBeEnabled();

        // A fase 3 permanece bloqueada.
        await expect(page.getByRole('button', {
            name: 'Fase 3, bloqueada',
            exact: true,
        })).toBeDisabled();
    });

    test('CT-FAS-004 — deve permitir acessar uma fase concluída', async ({
        page,
        request,
    }) => {
        const usuario = await entrarComUsuarioTeste(page);

        // Prepara um usuário com duas fases concluídas.
        await prepararProgresso(request, usuario, 2);

        await page.reload();

        await verificarProgressoNaTela(page, 2);

        const faseConcluida = page.getByRole('button', {
            name: 'Fase 2, concluída',
            exact: true,
        });

        await expect(faseConcluida).toBeEnabled();

        // Primeiro clique destaca a fase 2.
        await faseConcluida.click();

        await expect(faseConcluida).toHaveClass(
            /mapa-fase--destaque/
        );

        // Segundo clique avança à seleção do personagem.
        await faseConcluida.click();

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

        // Verifica que a fase selecionada foi preservada.
        await expect(page.getByText('Fase 2', {
            exact: true,
        })).toBeVisible();
    });
});
