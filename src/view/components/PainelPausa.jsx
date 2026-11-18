import {
    RotateCcw,
    DoorOpen,
    Play,
    Maximize2,
    Minimize2,
    Pause,
} from 'lucide-react';

function PainelPausa({
    onReiniciar,
    onSair,
    onContinuar,
    onAmpliar,
    podeExpandir,
    mapaCheio,
}) {
    return (
        <div className="jogo__pausa-overlay">
            <section
                className="jogo__pausa-painel"
                aria-labelledby="titulo-pausa"
                role="dialog"
                aria-modal="true"
            >
                <div className="jogo__pausa-cabecalho">
                    <div className="jogo__pausa-icone">
                        <Pause size={28} strokeWidth={2.5} />
                    </div>

                    <h2 id="titulo-pausa">Jogo pausado</h2>

                    <p>
                        Respire um pouco! Sua aventura está em pausa.
                    </p>
                </div>

                <div className="jogo__pausa-acoes">
                    <button
                        type="button"
                        className="jogo__pausa-botao jogo__pausa-botao--principal"
                        onClick={onContinuar}
                    >
                        <Play size={20} fill="currentColor" />
                        Continuar jogando
                    </button>

                    <button
                        type="button"
                        className="jogo__pausa-botao"
                        onClick={onReiniciar}
                    >
                        <RotateCcw size={20} />
                        Reiniciar fase
                    </button>

                    <button
                        type="button"
                        className="jogo__pausa-botao"
                        onClick={onAmpliar}
                        disabled={!podeExpandir}
                        aria-pressed={mapaCheio}
                    >
                        {mapaCheio
                            ? <Minimize2 size={20} />
                            : <Maximize2 size={20} />
                        }
                        {mapaCheio ? 'Reduzir mapa' : 'Ampliar mapa'}
                    </button>
                </div>

                <button
                    type="button"
                    className="jogo__pausa-sair"
                    onClick={onSair}
                >
                    <DoorOpen size={18} />
                    Sair da fase
                </button>
            </section>
        </div>
    );
}

export default PainelPausa;
