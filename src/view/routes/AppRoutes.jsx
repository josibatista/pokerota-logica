import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Configuracoes from '../pages/Configuracoes';
import SelecaoNivel from '../pages/SelecaoNivel';
import SelecaoPersonagem from '../pages/SelecaoPersonagem';
import Jogo from '../pages/Jogo';

function AppRoutes({
    usuario,
    carregandoSessao,
    onEntrarComGoogle,
}) {
    return (
        <Routes>
            <Route path="/" element={
                    <Home
                        usuario={usuario}
                        carregandoSessao={carregandoSessao}
                        onEntrarComGoogle={onEntrarComGoogle}
                    />
                }
            />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/niveis" element={<SelecaoNivel />} />
            <Route path="/personagem" element={<SelecaoPersonagem />} />
            <Route path="/jogo" element={<Jogo />} />
        </Routes>
    );
}

export default AppRoutes;