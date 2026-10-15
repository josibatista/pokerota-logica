import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Configuracoes from '../pages/Configuracoes';
import SelecaoNivel from '../pages/SelecaoNivel';
import SelecaoPersonagem from '../pages/SelecaoPersonagem';
import Jogo from '../pages/Jogo';

function RotaProtegida({ usuario, carregandoSessao, children }) {
    if (carregandoSessao) {
        return <p role="status">Carregando sua sessão…</p>;
    }
    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AppRoutes({
    usuario,
    carregandoSessao,
    onEntrarComGoogle,
}) {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Home
                        usuario={usuario}
                        carregandoSessao={carregandoSessao}
                        onEntrarComGoogle={onEntrarComGoogle}
                    />
                }
            />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route
                path="/niveis"
                element={
                    <RotaProtegida
                        usuario={usuario}
                        carregandoSessao={carregandoSessao}
                    >
                        <SelecaoNivel />
                    </RotaProtegida>
                }
            />
            <Route
                path="/personagem"
                element={
                    <RotaProtegida
                        usuario={usuario}
                        carregandoSessao={carregandoSessao}
                    >
                        <SelecaoPersonagem />
                    </RotaProtegida>
                }
            />
            <Route path="/jogo" element={<Jogo />} />
            <Route path="*" element={<Navigate to="/" replace />} /> 
        </Routes>
    );
}

export default AppRoutes;