import { useState } from 'react';
import './SelecaoNivel.css';

function SelecaoNivel() {
    const [faseSelecionada, setFaseSelecionada] = useState(1);

    const fases = [1, 2, 3, 4, 5];

    return (
        <main className="selecao-nivel">
            <section className="selecao-nivel__janela">
                <div className="selecao-nivel__mapas">
                    {fases.map((fase) => (
                        <button
                            key={fase}
                            type="button"
                            className={`mapa-fase ${
                                faseSelecionada === fase
                                    ? 'mapa-fase--destaque'
                                    : ''
                            }`}
                            onClick={() => setFaseSelecionada(fase)}
                        >
                            <div className="mapa-fase__imagem">
                                Mapa {fase}
                            </div>

                            <span>Fase {fase}</span>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default SelecaoNivel;