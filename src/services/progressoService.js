import { doc, getDoc, setDoc } from 'firebase/firestore';
import { obterUsuarioAtual } from './authService';
import Progresso from '../model/progresso.js';
import { db } from './firebase';

const COLECAO_PROGRESSO = 'progresso';

const mensagensPorCodigo = {
    'progresso/usuario-nao-autenticado': 'Nenhum usuário autenticado.',
    'progresso/dados-invalidos': 'O progresso informado é inválido. Informe um número inteiro entre 0 e 5.',
    'progresso/dados-armazenados-invalidos': 'O progresso armazenado está em um formato inválido.',
    'progresso/permissao-negada': 'O Firestore recusou a leitura ou a gravação deste progresso.',
    'progresso/indisponivel': 'Não foi possível conectar ao Firestore. Verifique sua conexão.',
    'progresso/falha-leitura': 'Não foi possível consultar o progresso.',
    'progresso/falha-gravacao': 'Não foi possível gravar o progresso.'
};

function criarErro(codigo, mensagem) {
    const erro = new Error(mensagem);
    erro.code = codigo;
    return erro;
}

function codigoFirestore(error) {
    if (typeof error?.code !== 'string') {
        return '';
    }

    return error.code.replace(/^firestore\//, '');
}

function interpretarErro(error, tipo) {
    const codigo = codigoFirestore(error);

    if (codigo === 'permission-denied') {
        return criarErro('progresso/permissao-negada', mensagensPorCodigo['progresso/permissao-negada']);
    }

    if (codigo === 'unauthenticated') {
        return criarErro(
            'progresso/usuario-nao-autenticado',
            mensagensPorCodigo['progresso/usuario-nao-autenticado']
        );
    }

    if (
        codigo === 'unavailable' ||
        codigo === 'deadline-exceeded' ||
        codigo === 'cancelled' ||
        codigo === 'aborted' ||
        error?.code === 'auth/network-request-failed'
    ) {
        return criarErro('progresso/indisponivel', mensagensPorCodigo['progresso/indisponivel']);
    }

    const codigoOperacao = tipo === 'gravacao' ? 'progresso/falha-gravacao' : 'progresso/falha-leitura';
    return criarErro(codigoOperacao, mensagensPorCodigo[codigoOperacao]);
}

function erroJaTratado(error) {
    return typeof error?.code === 'string' && (
        error.code.startsWith('progresso/') || error.code.startsWith('auth/')
    );
}

async function executarOperacao(operacao, tipo) {
    try {
        return await operacao();
    } catch (error) {
        if (erroJaTratado(error)) {
            throw error;
        }

        throw interpretarErro(error, tipo);
    }
}

async function obterUidAutenticado() {
    const usuario = await obterUsuarioAtual();

    if (!usuario?.uid) {
        throw criarErro(
            'progresso/usuario-nao-autenticado',
            mensagensPorCodigo['progresso/usuario-nao-autenticado']
        );
    }

    return usuario.uid;
}

function referenciaProgresso(uid) {
    return doc(db, COLECAO_PROGRESSO, uid);
}

export function carregarProgresso() {
    return executarOperacao(async () => {
        const uid = await obterUidAutenticado();
        const snapshot = await getDoc(referenciaProgresso(uid));

        if (!snapshot.exists()) {
            return Progresso.criarInicial();
        }

        return Progresso.converterDados(snapshot.data());
    }, 'leitura');
}

export function salvarProgresso(valor) {
    Progresso.validarNivel(valor);

    return executarOperacao(async () => {
        const uid = await obterUidAutenticado();

        await setDoc(
            referenciaProgresso(uid),
            { ultimoNivelConcluido: valor },
            { merge: true }
        );

        return new Progresso({
            ultimoNivelConcluido: valor
        });
    }, 'gravacao');
}
