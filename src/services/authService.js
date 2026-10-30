import {
    GoogleAuthProvider,
    browserLocalPersistence,
    deleteUser,
    onAuthStateChanged,
    reauthenticateWithPopup,
    setPersistence,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { auth } from './firebase';
import Usuario from '../model/usuario.js';

const provedorGoogle = new GoogleAuthProvider();
const JANELA_LOGIN_RECENTE_MS = 4 * 60 * 1000;

const mensagensPorCodigo = {
    'auth/popup-closed-by-user': 'O login foi cancelado.',
    'auth/cancelled-popup-request': 'O login foi cancelado.',
    'auth/popup-blocked': 'O navegador bloqueou a janela de login. Permita pop-ups e tente novamente.',
    'auth/network-request-failed': 'Não foi possível conectar ao serviço de autenticação. Verifique sua conexão.',
    'auth/requires-recent-login': 'É necessário entrar novamente antes de excluir a conta.',
    'auth/user-mismatch': 'A conta usada na confirmação não corresponde à sessão atual.',
    'auth/user-not-found': 'Nenhuma conta autenticada foi encontrada.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-token-expired': 'A sessão expirou. Entre novamente.',
    'auth/invalid-credential': 'Não foi possível validar a autenticação.',
    'auth/invalid-user-token': 'A sessão não é mais válida. Entre novamente.',
    'auth/too-many-requests': 'Muitas tentativas em sequência. Aguarde e tente novamente.',
    'auth/unauthorized-domain': 'Este domínio não está autorizado para login.',
    'auth/operation-not-allowed': 'O login com Google não está habilitado.',
    'auth/account-exists-with-different-credential': 'Já existe uma conta com este e-mail usando outro método de acesso.',
    'auth/credential-already-in-use': 'Esta credencial já está associada a outra conta.',
    'auth/web-storage-unsupported': 'O navegador não permite manter a sessão.',
    'auth/internal-error': 'Ocorreu uma falha interna na autenticação.',
    'auth/user-not-authenticated': 'Nenhum usuário autenticado.'
};

function criarErro(codigo, mensagem) {
    const erro = new Error(mensagem);
    erro.code = codigo;
    return erro;
}

function interpretarErro(error) {
    const codigo = typeof error?.code === 'string' ? error.code : 'auth/unknown';
    const mensagem = mensagensPorCodigo[codigo] || 'Não foi possível concluir a operação de autenticação.';
    return criarErro(codigo, mensagem);
}

function exigirUsuarioAutenticado() {
    if (!auth.currentUser) {
        throw criarErro('auth/user-not-authenticated', mensagensPorCodigo['auth/user-not-authenticated']);
    }

    return auth.currentUser;
}

let persistenciaPromise = null;

export function configurarPersistenciaSessao() {
    if (!persistenciaPromise) {
        persistenciaPromise = setPersistence(auth, browserLocalPersistence).catch((error) => {
            persistenciaPromise = null;
            throw interpretarErro(error);
        });
    }

    return persistenciaPromise;
}

async function aguardarSessao() {
    await configurarPersistenciaSessao();
    await auth.authStateReady();
}

async function executarOperacao(operacao) {
    try {
        await aguardarSessao();
        return await operacao();
    } catch (error) {
        throw interpretarErro(error);
    }
}

export function obterUsuarioAtual() {
    return executarOperacao(() => Usuario.converterUsuario(auth.currentUser));
}

export function entrarComGoogle() {
    return executarOperacao(async () => {
        const resultado = await signInWithPopup(auth, provedorGoogle);
        const usuario = Usuario.converterUsuario(resultado.user);

        if (!usuario) {
            throw criarErro('auth/user-not-authenticated', mensagensPorCodigo['auth/user-not-authenticated']);
        }

        return usuario;
    });
}

export function observarAutenticacao(ouvinte) {
    if (typeof ouvinte !== 'function') {
        throw criarErro(
            'auth/invalid-argument',
            'É necessário informar uma função para receber o estado de autenticação.'
        );
    }

    return onAuthStateChanged(
        auth,
        (user) => {
            ouvinte({
                autenticado: user !== null,
                usuario: Usuario.converterUsuario(user),
                erro: null
            });
        },
        (error) => {
            const erro = interpretarErro(error);
            ouvinte({
                autenticado: false,
                usuario: null,
                erro: {
                    codigo: erro.code,
                    mensagem: erro.message
                }
            });
        }
    );
}

export function sair() {
    return executarOperacao(async () => {
        exigirUsuarioAutenticado();
        await signOut(auth);
    });
}

export function possuiLoginRecente() {
    return executarOperacao(() => {
        const usuario = exigirUsuarioAutenticado();
        const ultimoLogin = Date.parse(usuario.metadata?.lastSignInTime ?? '');

        if (!Number.isFinite(ultimoLogin)) {
            return false;
        }

        return Date.now() - ultimoLogin < JANELA_LOGIN_RECENTE_MS;
    });
}

export function reautenticarComGoogle() {
    return executarOperacao(async () => {
        const usuario = exigirUsuarioAutenticado();
        const resultado = await reauthenticateWithPopup(usuario, provedorGoogle);
        return Usuario.converterUsuario(resultado.user);
    });
}

export function excluirContaAtual() {
    return executarOperacao(async () => {
        const usuario = exigirUsuarioAutenticado();
        await deleteUser(usuario);
    });
}
