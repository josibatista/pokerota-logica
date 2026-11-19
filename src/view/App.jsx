import './styles/tema.css';
import './styles/componentes.css';
import { useEffect, useState } from 'react';
import {loginComGoogle, inscreverEstadoAutenticacao, logout, excluirConta as excluirContaController} from '../controller/authController';
import { PersonagemProvider } from './context/PersonagemContext';
import Estrutura from './components/layouts/Estrutura';
import AppRoutes from './routes/AppRoutes';

const CHAVE_TEMA = 'pokerota-tema';

function lerTemaSalvo() {
    try {
        const salvo = window.localStorage.getItem(CHAVE_TEMA);
        return salvo === 'escuro' ? 'escuro' : 'claro';
    } catch {
        return 'claro';
    }
}

function gravarTema(tema) {
    try {
        window.localStorage.setItem(CHAVE_TEMA, tema);
    } catch {
        // A interface mantém o tema nesta sessão quando o navegador recusa o armazenamento.
    }
}

function App() {
    const [usuario, setUsuario] = useState(null);
    const [carregandoSessao, setCarregandoSessao] = useState(true);
    const [tema, setTema] = useState(lerTemaSalvo);
    const [telaCheia, setTelaCheia] = useState(() => (
        document.fullscreenElement === document.documentElement
    ));

    function alterarTema(proximo) {
        const temaValido = proximo === 'escuro' ? 'escuro' : 'claro';
        setTema(temaValido);
        gravarTema(temaValido);
    }

    useEffect(() => {
        const cancelarInscricao = inscreverEstadoAutenticacao((estado) => {
            setUsuario(estado.usuario);
            setCarregandoSessao(false);
        });

        return cancelarInscricao;
    }, []);

    useEffect(() => {
        function sincronizarTelaCheia() {
            setTelaCheia(document.fullscreenElement === document.documentElement);
        }

        document.addEventListener('fullscreenchange', sincronizarTelaCheia);
        return () => document.removeEventListener('fullscreenchange', sincronizarTelaCheia);
    }, []);

    useEffect(() => {
        if (carregandoSessao || usuario || !document.fullscreenElement) return undefined;

        document.exitFullscreen().catch(() => {
            // O navegador pode recusar a saída; fullscreenchange mantém o controle sincronizado.
        });

        return undefined;
    }, [usuario, carregandoSessao]);

    async function entrarComGoogle() {
        const resultado = await loginComGoogle();

        if (!resultado.sucesso) {
            const erro = new Error(resultado.mensagem);
            erro.code = resultado.codigo;
            throw erro;
        }

        setUsuario(resultado.usuario);
        return resultado.usuario;
    }
    
    async function encerrarSessao() {
        const resultado = await logout();

        if (!resultado.sucesso) {
            const erro = new Error(resultado.mensagem);
            erro.code = resultado.codigo;
            throw erro;
        }

        setUsuario(null);
    }

    async function excluirMinhaConta(confirmacoes) {
        const resultado = await excluirContaController(confirmacoes);

        if (!resultado.sucesso) {
            const erro = new Error(resultado.mensagem);
            erro.code = resultado.codigo;
            throw erro;
        }

        setUsuario(null);
    }

    return (
        <PersonagemProvider key={usuario?.uid ?? 'visitante'}>
            <Estrutura
                tema={tema}
                usuario={usuario}
                onEncerrarSessao={encerrarSessao}
            >
                <AppRoutes
                    usuario={usuario}
                    carregandoSessao={carregandoSessao}
                    tema={tema}
                    onAlterarTema={alterarTema}
                    telaCheia={telaCheia}
                    onEntrarComGoogle={entrarComGoogle}
                    onEncerrarSessao={encerrarSessao}
                    onExcluirConta={excluirMinhaConta}
                />
            </Estrutura>
        </PersonagemProvider>
    );

}

export default App;
