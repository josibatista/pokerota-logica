import './BotoesDirecionais.css';
import { useEffect, useState } from 'react';

const DIRECOES = [
    { comando: 'cima', rotulo: 'Mover para frente', rotacao: 90 },
    { comando: 'esquerda', rotulo: 'Mover para a esquerda', rotacao: 0 },
    { comando: 'baixo', rotulo: 'Mover para trás', rotacao: 270 },
    { comando: 'direita', rotulo: 'Mover para a direita', rotacao: 180 },
];

function Seta({ rotacao }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className="icone-controle botoes-direcionais__icone"
            aria-hidden="true"
            focusable="false"
            style={{ transform: `rotate(${rotacao}deg)` }}
        >
            <path
                d="M15 5 8 12l7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function BotoesDirecionais({ onPressionar, onSoltar }) {
    const [ativos, setAtivos] = useState(() => new Set());

    useEffect(() => {
        return () => {
            DIRECOES.forEach((direcao) => {
                onSoltar?.(direcao.comando);
            });
        };
    }, [onSoltar]);

    function marcar(comando, ativo) {
        setAtivos((atual) => {
            const proximo = new Set(atual);

            if (ativo) {
                proximo.add(comando);
            } else {
                proximo.delete(comando);
            }

            return proximo;
        });
    }

    function pressionar(comando) {
        marcar(comando, true);
        onPressionar?.(comando);
    }

    function soltar(comando) {
        marcar(comando, false);
        onSoltar?.(comando);
    }

    function aoPressionarPonteiro(evento, comando) {
        if (evento.pointerType === 'mouse' && evento.button !== 0) {
            return;
        }

        evento.preventDefault();

        try {
            evento.currentTarget.setPointerCapture(evento.pointerId);
        } catch {
            //segue com os eventos do próprio botão quando a captura não está disponível
        }

        pressionar(comando);
    }

    function aoSoltarPonteiro(evento, comando) {
        if (evento.currentTarget.hasPointerCapture?.(evento.pointerId)) {
            evento.currentTarget.releasePointerCapture(evento.pointerId);
        }

        soltar(comando);
    }

    function aoSair(evento, comando) {
        if (evento.currentTarget.hasPointerCapture?.(evento.pointerId)) {
            return;
        }

        soltar(comando);
    }

    function aoTeclaPressionar(evento, comando) {
        if (evento.key !== 'Enter' && evento.key !== ' ') {
            return;
        }

        evento.preventDefault();

        if (evento.repeat) {
            return;
        }

        pressionar(comando);
    }

    function aoTeclaSoltar(evento, comando) {
        if (evento.key !== 'Enter' && evento.key !== ' ') {
            return;
        }

        evento.preventDefault();
        soltar(comando);
    }

    return (
        <div
            className="botoes-direcionais"
            role="group"
            aria-label="Controles de movimentação"
        >
            {DIRECOES.map((direcao) => (
                <button
                    key={direcao.comando}
                    type="button"
                    className={`botao botao--icone botoes-direcionais__botao botoes-direcionais__botao--${direcao.comando}${
                        ativos.has(direcao.comando) ? ' botoes-direcionais__botao--ativo' : ''
                    }`}
                    aria-label={direcao.rotulo}
                    aria-pressed={ativos.has(direcao.comando)}
                    onPointerDown={(evento) => aoPressionarPonteiro(evento, direcao.comando)}
                    onPointerUp={(evento) => aoSoltarPonteiro(evento, direcao.comando)}
                    onPointerCancel={(evento) => aoSoltarPonteiro(evento, direcao.comando)}
                    onPointerLeave={(evento) => aoSair(evento, direcao.comando)}
                    onBlur={() => soltar(direcao.comando)}
                    onKeyDown={(evento) => aoTeclaPressionar(evento, direcao.comando)}
                    onKeyUp={(evento) => aoTeclaSoltar(evento, direcao.comando)}
                    onContextMenu={(evento) => evento.preventDefault()}
                >
                    <Seta rotacao={direcao.rotacao} />
                </button>
            ))}
        </div>
    );
}

export default BotoesDirecionais;
