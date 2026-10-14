import {
    entrarComGoogle,
    excluirContaAtual,
    obterUsuarioAtual,
    observarAutenticacao,
    reautenticarComGoogle,
    sair
} from '../services/authService';

function resultadoSucesso(usuario = null, mensagem = null) {
    return {
        sucesso: true,
        usuario,
        mensagem,
        codigo: null
    };
}

function resultadoFalha(error) {
    return {
        sucesso: false,
        usuario: null,
        mensagem: error?.message || 'Não foi possível concluir a operação de autenticação.',
        codigo: error?.code || 'auth/unknown'
    };
}

function confirmarExclusao(primeiraConfirmacao, segundaConfirmacao) {
    if (primeiraConfirmacao === true && segundaConfirmacao === true) {
        return null;
    }

    return resultadoFalha({
        code: 'auth/missing-confirmation',
        message: 'A exclusão da conta exige duas confirmações explícitas.'
    });
}

export async function loginComGoogle() {
    try {
        const usuario = await entrarComGoogle();
        return resultadoSucesso(usuario);
    } catch (error) {
        return resultadoFalha(error);
    }
}

export function obterUsuarioAutenticado() {
    return obterUsuarioAtual();
}

export function inscreverEstadoAutenticacao(ouvinte) {
    return observarAutenticacao(ouvinte);
}

export async function logout() {
    try {
        await sair();
        return resultadoSucesso(null, 'Sessão encerrada.');
    } catch (error) {
        return resultadoFalha(error);
    }
}

export async function reautenticar() {
    try {
        const usuario = await reautenticarComGoogle();
        return resultadoSucesso(usuario);
    } catch (error) {
        return resultadoFalha(error);
    }
}

export async function excluirConta({ primeiraConfirmacao, segundaConfirmacao } = {}) {
    const confirmacaoInvalida = confirmarExclusao(primeiraConfirmacao, segundaConfirmacao);

    if (confirmacaoInvalida) {
        return confirmacaoInvalida;
    }

    try {
        if (!(await obterUsuarioAtual())) {
            return resultadoFalha({
                code: 'auth/user-not-authenticated',
                message: 'Nenhum usuário autenticado.'
            });
        }

        await excluirContaAtual();
        return resultadoSucesso(null, 'A conta de autenticação foi excluída.');
    } catch (error) {
        if (error?.code !== 'auth/requires-recent-login') {
            return resultadoFalha(error);
        }
    }

    try {
        await reautenticarComGoogle();

        if (!(await obterUsuarioAtual())) {
            return resultadoFalha({
                code: 'auth/user-not-authenticated',
                message: 'Nenhum usuário autenticado.'
            });
        }

        await excluirContaAtual();
        return resultadoSucesso(null, 'A conta de autenticação foi excluída.');
    } catch (error) {
        return resultadoFalha(error);
    }
}
