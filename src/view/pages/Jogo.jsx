
import { useLocation, useNavigate } from 'react-router-dom';
import GameCanvas from '../components/GameCanvas';
import { useCallback } from 'react';
import { carregarProgresso, salvarProgresso } from '../../controller/progressoController';
import './Jogo.css';

function Jogo() {
    const location = useLocation();
    const navegar = useNavigate();

    const visitante = location.state?.visitante === true;
    const fase = location.state?.fase ?? (visitante ? 1 : null);

    //salva a fase concluída, sem regredir um progresso já existente
    const concluirFase = useCallback(async (numero) => {
        //visitante não salva progresso
        if (visitante) return;

        const resultado = await carregarProgresso();

        if (!resultado.sucesso) {
            console.error(
                'Não foi possível consultar o progresso:',
                resultado.mensagem
            );
            return;
        }

        const ultimoNivel = resultado.progresso.ultimoNivelConcluido;

        //não altera fases já concluídas nem permite pular etapas
        if (numero <= ultimoNivel || numero !== ultimoNivel + 1) {
            return;
        }

        const salvamento = await salvarProgresso(numero);

        if (!salvamento.sucesso) {
            console.error(
                'Não foi possível salvar o progresso:',
                salvamento.mensagem
            );
        }
    }, [visitante]);

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
            <GameCanvas 
                fase={fase}
                onConcluir={concluirFase} 
            />  
        </main>
    );
}

export default Jogo;
