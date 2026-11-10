import './styles/tema.css';
import './styles/componentes.css';
import { useEffect, useState } from 'react';
import {loginComGoogle, inscreverEstadoAutenticacao, logout, excluirConta as excluirContaController} from '../controller/authController';
import { PersonagemProvider } from './context/PersonagemContext';
import Estrutura from './components/layouts/Estrutura';
import AppRoutes from './routes/AppRoutes';

function App() {
    const [usuario, setUsuario] = useState(null);
    const [carregandoSessao, setCarregandoSessao] = useState(true);

    useEffect(() => {
        const cancelarInscricao = inscreverEstadoAutenticacao((estado) => {
            setUsuario(estado.usuario);
            setCarregandoSessao(false);
        });

        return cancelarInscricao;
    }, []);

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
                usuario={usuario}
                onEncerrarSessao={encerrarSessao}
            >
                <AppRoutes
                    usuario={usuario}
                    carregandoSessao={carregandoSessao}
                    onEntrarComGoogle={entrarComGoogle}
                    onEncerrarSessao={encerrarSessao}
                    onExcluirConta={excluirMinhaConta}
                />
            </Estrutura>
        </PersonagemProvider>
    );

}

export default App;
