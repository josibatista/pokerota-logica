// Montagem visual isolada: identidade e callbacks fictícios, sem alterar produção.
// A ordem dos estilos acompanha main.jsx e App.jsx.
import '../../src/index.css';
import '../../src/view/styles/tema.css';
import '../../src/view/styles/componentes.css';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Estrutura from '../../src/view/components/layouts/Estrutura';
import { PersonagemProvider } from '../../src/view/context/PersonagemContext';
import Home from '../../src/view/pages/Home';
import SelecaoNivel from '../../src/view/pages/SelecaoNivel';
import SelecaoPersonagem from '../../src/view/pages/SelecaoPersonagem';
import Jogo from '../../src/view/pages/Jogo';
import Configuracoes from '../../src/view/pages/Configuracoes';
import FinalizacaoFase from '../../src/view/components/FinalizacaoFase';

const params = new URLSearchParams(location.search);
const tela = params.get('tela') || 'home';
const tema = params.get('tema') || 'claro';
const rotas = {
    home: '/',
    niveis: '/niveis',
    personagens: '/personagem',
    jogo: '/jogo',
    conta: '/configuracoes',
    final: '/jogo',
};
const noop = () => {};
const usuario = { uid: 'visual', nome: 'Pessoa Teste' };
const entrada = {
    pathname: rotas[tela],
    state: { fase: Number(params.get('fase') || 1), visitante: tela === 'jogo' },
};

createRoot(document.getElementById('root')).render(
    <MemoryRouter initialEntries={[entrada]}>
        <PersonagemProvider>
            <Estrutura tema={tema} usuario={usuario} onEncerrarSessao={noop}>
                <Routes>
                    <Route path="/" element={
                        <Home usuario={null} carregandoSessao={false} onEntrarComGoogle={noop} />
                    } />
                    <Route path="/niveis" element={<SelecaoNivel />} />
                    <Route path="/personagem" element={<SelecaoPersonagem />} />
                    <Route path="/configuracoes" element={
                        <Configuracoes usuario={usuario} carregandoSessao={false}
                            onEncerrarSessao={noop} onExcluirConta={noop} />
                    } />
                    <Route path="/jogo" element={tela === 'final' ? (
                        <div className="jogo">
                            <FinalizacaoFase fase={1} personagemSelecionado="pikachu"
                                visitante={false} mostrarProxima={true} proximaDisponivel={false}
                                onVoltar={noop} onProxima={noop} />
                        </div>
                    ) : <Jogo />} />
                </Routes>
            </Estrutura>
        </PersonagemProvider>
    </MemoryRouter>,
);
