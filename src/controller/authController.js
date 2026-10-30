import {
    entrarComGoogle,
    excluirContaAtual,
    obterUsuarioAtual,
    observarAutenticacao,
    possuiLoginRecente,
    reautenticarComGoogle,
    sair
} from '../services/authService';
import { excluirProgresso } from './progressoController';

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

function resultadoParcial(error) {
    const detalhe = error?.message || 'Não foi possível excluir a conta de autenticação.';

    return {
        sucesso: false,
        usuario: null,
        mensagem: `O progresso foi excluído, mas a conta não pôde ser apagada. ${detalhe}`,
        codigo: 'conta/exclusao-parcial'
    };
}

async function renovarSessaoDaMesmaConta(uid) {
    const renovada = await reautenticar();

    if (!renovada.sucesso) {
        return renovada;
    }

    if (!renovada.usuario?.uid || renovada.usuario.uid !== uid) {
        return resultadoFalha({
            code: 'auth/user-mismatch',
            message: 'A conta usada na confirmação não corresponde à sessão atual.'
        });
    }

    return null;
}

export async function excluirConta({ primeiraConfirmacao, segundaConfirmacao } = {}) {
    const confirmacaoInvalida = confirmarExclusao(primeiraConfirmacao, segundaConfirmacao);

    if (confirmacaoInvalida) {
        return confirmacaoInvalida;
    }

    let uid = null;
    let progressoExcluido = false;

    try {
        const usuario = await obterUsuarioAtual();

        if (!usuario?.uid) {
            return resultadoFalha({
                code: 'auth/user-not-authenticated',
                message: 'Nenhum usuário autenticado.'
            });
        }

        uid = usuario.uid;

        // A reautenticação acontece antes de apagar dados. deleteUser remove
        // a sessão e, sem ela, o Firestore recusaria a exclusão do progresso.
        if (!(await possuiLoginRecente())) {
            const falhaRenovacao = await renovarSessaoDaMesmaConta(uid);

            if (falhaRenovacao) {
                return falhaRenovacao;
            }
        }

        const exclusaoProgresso = await excluirProgresso();

        if (!exclusaoProgresso.sucesso) {
            return resultadoFalha({
                code: exclusaoProgresso.codigo || 'progresso/falha-exclusao',
                message: `A conta não foi excluída porque o progresso não pôde ser apagado. ${exclusaoProgresso.mensagem}`
            });
        }

        progressoExcluido = true;
        await excluirContaAtual();

        return resultadoSucesso(null, 'A conta e o progresso associado foram excluídos.');
    } catch (error) {
        if (!progressoExcluido) {
            return resultadoFalha(error);
        }

        if (error?.code !== 'auth/requires-recent-login') {
            return resultadoParcial(error);
        }

        try {
            const falhaRenovacao = await renovarSessaoDaMesmaConta(uid);

            if (falhaRenovacao) {
                return resultadoParcial({
                    message: falhaRenovacao.mensagem
                });
            }

            await excluirContaAtual();
            return resultadoSucesso(null, 'A conta e o progresso associado foram excluídos.');
        } catch (erroFinal) {
            return resultadoParcial(erroFinal);
        }
    }
}
