import EstadoPersonagem from '../model/estadoPersonagem.js';

const COMANDOS = {
    cima: 'cima',
    baixo: 'baixo',
    esquerda: 'esquerda',
    direita: 'direita',
    frente: 'cima',
    tras: 'baixo',
    'trás': 'baixo',
    arrowup: 'cima',
    arrowdown: 'baixo',
    arrowleft: 'esquerda',
    arrowright: 'direita',
};

function resultadoSucesso(estado, mensagem = null, extras = {}) {
    return {
        sucesso: true,
        estado,
        mensagem,
        codigo: null,
        ...extras,
    };
}

function resultadoFalha(error, estado = null) {
    return {
        sucesso: false,
        estado,
        mensagem: error?.message || 'Não foi possível atualizar a movimentação.',
        codigo: error?.code || 'movimentacao/desconhecido',
    };
}

function garantirEstado(estado) {
    if (!(estado instanceof EstadoPersonagem)) {
        const erro = new Error('O estado do personagem é inválido.');
        erro.code = 'movimentacao/estado-invalido';
        throw erro;
    }
}

function normalizarComando(comando) {
    if (typeof comando !== 'string') {
        return null;
    }

    return COMANDOS[comando] || COMANDOS[comando.toLowerCase()] || null;
}

function alterarComando(estado, comando, ativo, origem) {
    try {
        garantirEstado(estado);

        const direcao = normalizarComando(comando);

        if (!direcao) {
            const erro = new Error('O comando de movimentação não é válido.');
            erro.code = 'movimentacao/comando-invalido';
            throw erro;
        }

        estado.definirComando(direcao, ativo, origem);
        return resultadoSucesso(estado);
    } catch (error) {
        return resultadoFalha(
            error,
            estado instanceof EstadoPersonagem ? estado : null
        );
    }
}

export function associarPersonagem({
    jogadorId,
    personagemSelecionado,
    personagens,
    x,
    y,
    direcao,
}) {
    try {
        const estado = new EstadoPersonagem({
            jogadorId,
            personagemSelecionado,
            personagens,
            x,
            y,
            direcao,
        });

        return resultadoSucesso(estado);
    } catch (error) {
        return resultadoFalha(error);
    }
}

export function consultarPersonagem(estado) {
    try {
        garantirEstado(estado);

        return resultadoSucesso(estado, null, {
            personagemSelecionado: estado.consultarPersonagem(),
        });
    } catch (error) {
        return resultadoFalha(
            error,
            estado instanceof EstadoPersonagem ? estado : null
        );
    }
}

export function pressionarComando(estado, comando, origem = 'comando') {
    return alterarComando(estado, comando, true, origem);
}

export function soltarComando(estado, comando, origem = 'comando') {
    return alterarComando(estado, comando, false, origem);
}

export function definirPosicao(estado, x, y) {
    try {
        garantirEstado(estado);
        estado.definirPosicao(x, y);
        return resultadoSucesso(estado);
    } catch (error) {
        return resultadoFalha(
            error,
            estado instanceof EstadoPersonagem ? estado : null
        );
    }
}

export function reiniciarPersonagem(estado, posicao) {
    try {
        garantirEstado(estado);
        estado.reiniciar(posicao);
        return resultadoSucesso(estado);
    } catch (error) {
        return resultadoFalha(
            error,
            estado instanceof EstadoPersonagem ? estado : null
        );
    }
}

export function atualizarMovimentacao(estado) {
    try {
        garantirEstado(estado);
        estado.atualizar();
        return resultadoSucesso(estado);
    } catch (error) {
        return resultadoFalha(
            error,
            estado instanceof EstadoPersonagem ? estado : null
        );
    }
}
