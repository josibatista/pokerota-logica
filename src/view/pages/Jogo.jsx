
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameCanvas from '../components/GameCanvas';
import BotoesDirecionais from '../components/BotoesDirecionais';
import { carregarProgresso, salvarProgresso } from '../../controller/progressoController';
import {
    associarPersonagem,
    pressionarComando,
    reiniciarPersonagem,
    soltarComando,
} from '../../controller/movimentacaoController';
import configuracoesMapas from '../../model/configuracoesMapas';
import configuracoesPersonagens from '../../model/configuracoesPersonagens';
import './Jogo.css';

const PERSONAGEM_PADRAO = 'pikachu';
const TECLAS_DIRECIONAIS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

function Jogo() {
    const location = useLocation();
    const navegar = useNavigate();

    const visitante = location.state?.visitante === true;
    const fase = location.state?.fase ?? (visitante ? 1 : null);

    const estado = useMemo(() => {
        if (!fase) {
            return null;
        }

        const configuracao = configuracoesMapas[fase];

        if (!configuracao) {
            return null;
        }

        const resultado = associarPersonagem({
            jogadorId: visitante ? 'visitante' : 'jogador-local',
            personagemSelecionado: PERSONAGEM_PADRAO,
            personagens: configuracoesPersonagens,
            x: configuracao.personagemInicial.x,
            y: configuracao.personagemInicial.y,
        });

        if (!resultado.sucesso) {
            console.error(resultado.mensagem);
            return null;
        }

        return resultado.estado;
    }, [fase, visitante]);

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

    const pressionarBotao = useCallback((comando) => {
        if (!estado) {
            return;
        }

        pressionarComando(estado, comando, 'botao');
    }, [estado]);

    const soltarBotao = useCallback((comando) => {
        if (!estado) {
            return;
        }

        soltarComando(estado, comando, 'botao');
    }, [estado]);

    const [reinicio, setReinicio] = useState(0);

    const reiniciarEstado = useCallback(() => {
        const configuracao = configuracoesMapas[fase];

        if (!estado || !configuracao) {
            return;
        }

        reiniciarPersonagem(estado, {
            x: configuracao.personagemInicial.x,
            y: configuracao.personagemInicial.y,
        });
        setReinicio((valor) => valor + 1);
    }, [estado, fase]);

    useEffect(() => {
        if (!estado) {
            return undefined;
        }

        function liberarTeclado() {
            TECLAS_DIRECIONAIS.forEach((tecla) => {
                soltarComando(estado, tecla, 'teclado');
            });
        }

        function aoPressionarTecla(evento) {
            if (!TECLAS_DIRECIONAIS.includes(evento.key)) {
                return;
            }

            evento.preventDefault();

            if (evento.repeat) {
                return;
            }

            pressionarComando(estado, evento.key, 'teclado');
        }

        function aoSoltarTecla(evento) {
            if (!TECLAS_DIRECIONAIS.includes(evento.key)) {
                return;
            }

            evento.preventDefault();
            soltarComando(estado, evento.key, 'teclado');
        }

        window.addEventListener('keydown', aoPressionarTecla);
        window.addEventListener('keyup', aoSoltarTecla);
        window.addEventListener('blur', liberarTeclado);

        return () => {
            window.removeEventListener('keydown', aoPressionarTecla);
            window.removeEventListener('keyup', aoSoltarTecla);
            window.removeEventListener('blur', liberarTeclado);
            liberarTeclado();
        };
    }, [estado]);

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
                personagemSelecionado={PERSONAGEM_PADRAO}
                estado={estado}
                reinicio={reinicio}
                onReiniciarEstado={reiniciarEstado}
            />
            <div className="jogo__acoes">
                <BotoesDirecionais
                    key={reinicio}
                    onPressionar={pressionarBotao}
                    onSoltar={soltarBotao}
                />
            </div>
        </main>
    );
}

export default Jogo;
