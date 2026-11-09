import { expect } from '@playwright/test';
import { entrarComContaTeste } from './autenticacao.js';

const AUTH_URL = 'http://127.0.0.1:9099';
const FIRESTORE_URL = 'http://127.0.0.1:8080';
const PROJETO = 'demo-pokerota';

const BASE_DOCUMENTOS =
    `${FIRESTORE_URL}/v1/projects/${PROJETO}` +
    '/databases/(default)/documents/progresso';

// Retorna a URL do progresso associado ao UID.
function urlProgresso(uid) {
    return `${BASE_DOCUMENTOS}/${encodeURIComponent(uid)}`;
}

// Autentica com uma conta fictícia e identifica o usuário.
export async function entrarComUsuarioTeste(page) {
    const respostaPromise = page.waitForResponse((resposta) => {
        const url = new URL(resposta.url());

        return url.origin === AUTH_URL &&
            url.pathname.endsWith('/accounts:signInWithIdp') &&
            resposta.request().method() === 'POST';
    });

    await entrarComContaTeste(page);

    const resposta = await respostaPromise;

    expect(resposta.status()).toBe(200);

    const dados = await resposta.json();

    expect(dados.localId).toEqual(expect.any(String));
    expect(dados.idToken).toEqual(expect.any(String));

    await verificarProgressoNaTela(page, 0);

    return {
        uid: dados.localId,
        idToken: dados.idToken,
    };
}

// Verifica o progresso apresentado na interface.
export async function verificarProgressoNaTela(page, nivel) {
    await expect(page.getByText(
        `Fases concluídas: ${nivel} de 5`,
        { exact: true }
    )).toBeVisible();
}

// Executa o controlador real da aplicação no navegador.
// Não simula a chegada do personagem ao objetivo do mapa.
export async function salvarProgressoPelaAplicacao(page, nivel) {
    const resultado = await page.evaluate(async (valor) => {
        const { salvarProgresso } = await import(
            '/src/controller/progressoController.js'
        );

        return salvarProgresso(valor);
    }, nivel);

    expect(resultado.sucesso, resultado.mensagem).toBe(true);

    expect(resultado.progresso.ultimoNivelConcluido).toBe(nivel);

    return resultado;
}

// Prepara dados de teste diretamente no Firestore Emulator.
export async function prepararProgresso(
    request,
    usuario,
    nivel
) {
    const resposta = await request.patch(
        urlProgresso(usuario.uid),
        {
            headers: {
                Authorization: `Bearer ${usuario.idToken}`,
            },
            data: {
                fields: {
                    ultimoNivelConcluido: {
                        integerValue: String(nivel),
                    },
                },
            },
        }
    );

    expect(resposta.status(), await resposta.text()).toBe(200);
}

// Consulta um documento usando a identidade informada.
export async function consultarDocumentoProgresso(
    request,
    usuario,
    uid = usuario.uid
) {
    return request.get(urlProgresso(uid), {
        headers: {
            Authorization: `Bearer ${usuario.idToken}`,
        },
    });
}

// Confirma que o valor foi realmente armazenado no Firestore.
export async function verificarProgressoNoBanco(
    request,
    usuario,
    nivel
) {
    const resposta = await consultarDocumentoProgresso(
        request,
        usuario
    );

    expect(resposta.status(), await resposta.text()).toBe(200);

    const documento = await resposta.json();

    expect(
        Number(documento.fields.ultimoNivelConcluido.integerValue)
    ).toBe(nivel);
}
