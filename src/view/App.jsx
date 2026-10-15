import { useEffect, useState } from 'react';
import {
    loginComGoogle,
    inscreverEstadoAutenticacao,
} from '../controller/authController';
import Estrutura from './components/layouts/Estrutura';
import AppRoutes from './routes/AppRoutes';
import './App.css';

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

    return (
        <Estrutura>
            <AppRoutes
                usuario={usuario}
                carregandoSessao={carregandoSessao}
                onEntrarComGoogle={entrarComGoogle}
            />
        </Estrutura>
    );
}

export default App;
