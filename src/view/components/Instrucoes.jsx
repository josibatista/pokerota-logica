import { useEffect, useRef } from 'react';
import './Instrucoes.css';
import {
    Pause, 
    Play,
    RotateCcw,
    DoorOpen, 
    Maximize2,
    Minimize2
} from 'lucide-react'

export const ID_INSTRUCOES = 'instrucoes-jogo';

const SETAS = [
    { nome: 'Seta para cima', movimento: 'mover para frente', rotacao: 90 },
    { nome: 'Seta para baixo', movimento: 'mover para trás', rotacao: 270 },
    { nome: 'Seta para a esquerda', movimento: 'mover para a esquerda', rotacao: 0 },
    { nome: 'Seta para a direita', movimento: 'mover para a direita', rotacao: 180 },
];

const BOTOES = [
    { nome: 'Botão para frente', movimento: 'mover para frente', rotacao: 90 },
    { nome: 'Botão para trás', movimento: 'mover para trás', rotacao: 270 },
    { nome: 'Botão para a esquerda', movimento: 'mover para a esquerda', rotacao: 0 },
    { nome: 'Botão para a direita', movimento: 'mover para a direita', rotacao: 180 },
];

const CONTROLES_PARTIDA = [
    {
        nome: 'Pausar',
        atalho: 'Tecla P ou botão de pausa',
        descricao: 'Interrompe temporariamente a partida e abre o painel de pausa.',
        Icone: Pause,
    },
    {
        nome: 'Continuar',
        atalho: 'Tecla P ou botão de continuar',
        descricao: 'Fecha o painel de pausa e retoma a partida.',
        Icone: Play,
    },
    {
        nome: 'Reiniciar',
        descricao: 'Retorna o personagem ao ponto inicial da fase.',
        Icone: RotateCcw,
    },
    {
        nome: 'Sair',
        descricao: 'Sai da fase e retorna à tela correspondente.',
        Icone: DoorOpen,
    },
    {
        nome: 'Ampliar',
        descricao: 'Expande o mapa para ocupar a tela inteira.',
        Icone: Maximize2,
    },
    {
        nome: 'Reduzir',
        descricao: 'Retorna o mapa ao tamanho normal.',
        Icone: Minimize2,
    },
];

function Seta({ rotacao }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className="icone-controle"
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

function ListaComandos({ comandos }) {
    return (
        <ul className="instrucoes__lista">
            {comandos.map((comando) => (
                <li key={comando.nome} className="instrucoes__item">
                    <span className="instrucoes__simbolo">
                        <Seta rotacao={comando.rotacao} />
                    </span>
                    <span>
                        <strong>{comando.nome}:</strong> {comando.movimento}.
                    </span>
                </li>
            ))}
        </ul>
    );
}

function ListaControles() {
    return (
        <ul className="instrucoes__lista">
            {CONTROLES_PARTIDA.map((controle) => {
                const Icone = controle.Icone;

                return (
                    <li key={controle.nome} className="instrucoes__item">
                        <span className="instrucoes__simbolo">
                            <Icone
                                size={22}
                                aria-hidden="true"
                            />
                        </span>

                        <span>
                            <strong>{controle.nome}:</strong>{' '}
                            {controle.descricao}
                            {controle.atalho && (
                                <>
                                    {' '}({controle.atalho}).
                                </>
                            )}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

function Instrucoes({ aberta = false, onFechar }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;

        if (aberta && !dialog.open) {
            dialog.showModal();
            dialog.scrollTop = 0;
            dialog.focus();
        }
        if (!aberta && dialog.open) dialog.close();

        return () => {
            if (dialog.open) dialog.close();
        };
    }, [aberta]);

    return (
        <dialog
            id={ID_INSTRUCOES}
            ref={dialogRef}
            className="instrucoes"
            tabIndex={-1}
            aria-labelledby="instrucoes-titulo"
            aria-describedby="instrucoes-descricao"
            onCancel={(evento) => {
                evento.preventDefault();
                onFechar?.();
            }}
        >
            <h2 id="instrucoes-titulo" className="instrucoes__titulo">Instruções</h2>
            <p id="instrucoes-descricao" className="instrucoes__intro">
                Use as setas do teclado ou os botões da tela para mover o personagem.
            </p>

            <section className="instrucoes__grupo" aria-labelledby="instrucoes-teclado">
                <h3 id="instrucoes-teclado" className="instrucoes__subtitulo">Setas do teclado</h3>
                <ListaComandos comandos={SETAS} />
            </section>

            <section className="instrucoes__grupo" aria-labelledby="instrucoes-botoes">
                <h3 id="instrucoes-botoes" className="instrucoes__subtitulo">Botões na tela</h3>
                <p className="instrucoes__texto">
                    Os botões com setas fazem os mesmos movimentos.
                </p>
                <ListaComandos comandos={BOTOES} />
                <p className="instrucoes__texto">
                    O personagem se move enquanto você segura a seta ou o botão. Quando solta, ele para.
                </p>
            </section>

            <section
                className="instrucoes__grupo"
                aria-labelledby="instrucoes-controles"
            >
                <h3
                    id="instrucoes-controles"
                    className="instrucoes__subtitulo"
                >
                    Controles da partida
                </h3>

                <p className="instrucoes__texto">
                    Durante a partida, você também pode utilizar os seguintes controles:
                </p>

                <ListaControles />
            </section>

            <section className="instrucoes__grupo" aria-labelledby="instrucoes-limites">
                <h3 id="instrucoes-limites" className="instrucoes__subtitulo">Limites da movimentação</h3>
                <p className="instrucoes__texto">
                    O personagem não atravessa obstáculos nem ultrapassa os limites do mapa.
                </p>
            </section>

            <section className="instrucoes__grupo" aria-labelledby="instrucoes-hall">
                <h3 id="instrucoes-hall" className="instrucoes__subtitulo">Fase 5 — Hall da Fama</h3>
                <p className="instrucoes__texto">
                    Na segunda parte da Fase 5, após chegar ao Hall da Fama, vá até a máquina de registro para finalizar o jogo.
                </p>
            </section>

            <button
                type="button"
                className="botao botao--secundario instrucoes__fechar"
                onClick={() => onFechar?.()}
            >
                Fechar
            </button>
        </dialog>
    );
}

export default Instrucoes;
