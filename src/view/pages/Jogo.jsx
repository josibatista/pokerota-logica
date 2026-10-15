
import { useLocation, useNavigate } from 'react-router-dom';
import GameCanvas from '../components/GameCanvas';
import './Jogo.css';

function Jogo() {
    const location = useLocation();
    const navegar = useNavigate();

    const fase = location.state?.fase;

    if (!fase) {
        return (
            <main className="jogo">
                <p>Nenhuma fase foi selecionada.</p>
                <button
                    type="button"
                    onClick={() => navegar('/niveis')}
                >
                    Voltar para seleção de fases
                </button>
            </main>
        );
    }

    return (
        <main className="jogo">
            <h1>Fase {fase}</h1>
            <GameCanvas />
        </main>
    );
}

export default Jogo;
