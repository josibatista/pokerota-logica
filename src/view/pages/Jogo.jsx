
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameCanvas from '../components/GameCanvas';
import {
    carregarProgresso,
    salvarProgresso
} from '../../controller/progressoController';
import './Jogo.css';

function Jogo() {
    const location = useLocation();
    const navegar = useNavigate();

    const fase = location.state?.fase;

    const [reinicio, setReinicio] = useState(0);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState('');

    async function concluirFaseTeste() {
        setSalvando(true);
        setMensagem('');

        const resultadoAtual = await carregarProgresso();

        if (!resultadoAtual.sucesso) {
            setMensagem(resultadoAtual.mensagem);
            setSalvando(false);
            return;
        }

        const maiorNivel = Math.max(
            fase,
            resultadoAtual.progresso.ultimoNivelConcluido
        );

        const resultado = await salvarProgresso(maiorNivel);

        if (!resultado.sucesso) {
            setMensagem(resultado.mensagem);
        } else {
            setMensagem(`Fase ${fase} concluída! Progresso salvo.`);
        }

        setSalvando(false);
    }

    function reiniciarFase() {
        setReinicio((valor) => valor + 1);
        setMensagem('Fase reiniciada.');
    }

    if (!fase) {
        return (
            <main>
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
        <main>
            <h1>Fase {fase}</h1>

            <GameCanvas reinicio={reinicio} />

            <div className="jogo__acoes">
                <button
                    type="button"
                    onClick={concluirFaseTeste}
                    disabled={salvando}
                >
                    {salvando
                        ? 'Salvando...'
                        : 'Concluir fase (teste)'}
                </button>

                <button
                    type="button"
                    onClick={reiniciarFase}
                >
                    Reiniciar fase
                </button>

                <button
                    type="button"
                    onClick={() => navegar('/niveis')}
                >
                    Voltar às fases
                </button>
            </div>

            {mensagem && <p role="status">{mensagem}</p>}
        </main>
    );
}

export default Jogo;
