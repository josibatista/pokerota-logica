import {
    carregarProgresso as consultarProgresso,
    salvarProgresso as persistirProgresso,
    excluirProgresso as removerProgresso
} from '../services/progressoService';

function resultadoSucesso(progresso, mensagem = null) {
    return {
        sucesso: true,
        progresso,
        mensagem,
        codigo: null
    };
}

function resultadoFalha(error) {
    return {
        sucesso: false,
        progresso: null,
        mensagem: error?.message || 'Não foi possível concluir a operação de progresso.',
        codigo: error?.code || 'progresso/desconhecido'
    };
}

export async function carregarProgresso() {
    try {
        const progresso = await consultarProgresso();
        return resultadoSucesso(progresso);
    } catch (error) {
        return resultadoFalha(error);
    }
}

export async function salvarProgresso(valor) {
    try {
        const progresso = await persistirProgresso(valor);
        return resultadoSucesso(progresso, 'Progresso salvo.');
    } catch (error) {
        return resultadoFalha(error);
    }
}

export async function excluirProgresso() {
    try {
        await removerProgresso();
        return resultadoSucesso(null, 'Progresso excluído.');
    } catch (error) {
        return resultadoFalha(error);
    }
}
