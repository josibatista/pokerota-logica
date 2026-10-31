
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePersonagem } from '../context/PersonagemContext';
import GameCanvas from '../components/GameCanvas';
import BotoesDirecionais from '../components/BotoesDirecionais';
import FinalizacaoFase from '../components/FinalizacaoFase';
import { carregarProgresso, salvarProgresso } from '../../controller/progressoController';
import {
    associarPersonagem,
    pressionarComando,
    reiniciarPersonagem,
    soltarComando,
} from '../../controller/movimentacaoController';
import configuracoesMapas from '../../model/configuracoesMapas';
import configuracoesPersonagens from '../../model/configuracoesPersonagens';
import { obterFaseDaRota } from '../faseDaRota';
import './Jogo.css';

const PERSONAGEM_PADRAO = 'pikachu';
const TECLAS_DIRECIONAIS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

function Jogo() {
    const location = useLocation();
    const navegar = useNavigate();

    const { personagemSelecionado } = usePersonagem();

    const visitante = location.state?.visitante === true;
    const fase = obterFaseDaRota(location);

    const personagemEmJogo = visitante
        ? PERSONAGEM_PADRAO
        : personagemSelecionado;

    
    const estado = useMemo(() => {
        if (!fase || !personagemEmJogo) {
            return null;
        }

        const configuracao = configuracoesMapas[fase];

        if (!configuracao) {
            return null;
        }

        const resultado = associarPersonagem({
            jogadorId: visitante ? 'visitante' : 'jogador-local',
            personagemSelecionado: personagemEmJogo,
            personagens: configuracoesPersonagens,
            x: configuracao.personagemInicial.x,
            y: configuracao.personagemInicial.y,
        });

        if (!resultado.sucesso) {
            console.error(resultado.mensagem);
            return null;
        }

        return resultado.estado;
    }, [fase, visitante, personagemEmJogo]);

    const [faseFinalizada, setFaseFinalizada] = useState(null);
    const [proximaDisponivel, setProximaDisponivel] = useState(false);

    useEffect(() => {
        setFaseFinalizada(null);
        setProximaDisponivel(false);
    }, [fase]);

    //salva a fase concluída, sem regredir um progresso já existente
    const concluirFase = useCallback(async (numero) => {
        setFaseFinalizada(numero);

        //visitante não salva progresso; o destino dos botões ainda não foi definido
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

        //a fase seguinte já estava liberada; não grava de novo
        if (numero <= ultimoNivel) {
            setProximaDisponivel(true);
            return;
        }

        //não permite pular etapas
        if (numero !== ultimoNivel + 1) {
            return;
        }

        const salvamento = await salvarProgresso(numero);

        if (!salvamento.sucesso) {
            console.error(
                'Não foi possível salvar o progresso:',
                salvamento.mensagem
            );
            return;
        }

        setProximaDisponivel(true);
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

    const voltarAosMapas = useCallback(() => {
        if (visitante) {
            return;
        }

        navegar('/niveis');
    }, [navegar, visitante]);

    const voltarAoLogin = useCallback(() => {
        navegar('/');
    }, [navegar]);

    const abrirProximaFase = useCallback(() => {
        if (visitante || !proximaDisponivel || !configuracoesMapas[fase + 1]) {
            return;
        }

        navegar('/jogo', {
            state: { fase: fase + 1 },
        });
    }, [fase, navegar, proximaDisponivel, visitante]);

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
        if (!estado || faseFinalizada) {
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
    }, [estado, faseFinalizada]);

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

    if (!visitante && !personagemSelecionado) {
        return (
            <main className="jogo">
                <p>Nenhum personagem foi selecionado.</p>
                <button
                    type="button"
                    onClick={() => navegar('/personagem', {
                        state: { fase },
                    })}
                >
                    Escolher personagem
                </button>
            </main>
        );
    }

    return (
        <main className="jogo">
            {faseFinalizada ? (
                <FinalizacaoFase
                    fase={faseFinalizada}
                    personagemSelecionado={estado?.personagemSelecionado}
                    visitante={visitante}
                    mostrarProxima={Boolean(configuracoesMapas[fase + 1])}
                    proximaDisponivel={proximaDisponivel}
                    onVoltar={voltarAosMapas}
                    onProxima={abrirProximaFase}
                    onVoltarLogin={voltarAoLogin}
                />
            ) : (
                <>
                    <GameCanvas
                        fase={fase}
                        onConcluir={concluirFase}
                        personagemSelecionado={estado?.personagemSelecionado}
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
                </>
            )}
        </main>
    );
}

export default Jogo;
