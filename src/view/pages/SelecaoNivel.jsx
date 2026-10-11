
import { useState } from 'react';
import './SelecaoNivel.css';
import CartaoFase from '../components/CartaoFase';

import mapa1 from '../assets/mapas/nivel1-mini.png';
import mapa2 from '../assets/mapas/nivel2-mini.png';
import mapa3 from '../assets/mapas/nivel3-mini.png';
import mapa4 from '../assets/mapas/nivel4-mini.png';
import mapa5 from '../assets/mapas/nivel5-mini.png';

function SelecaoNivel() {
    const [faseSelecionada, setFaseSelecionada] = useState(1);

    // Desbloqueio temporário para testar a tela.
    const fases = [
        { numero: 1, imagem: mapa1, desbloqueada: true },
        { numero: 2, imagem: mapa2, desbloqueada: false },
        { numero: 3, imagem: mapa3, desbloqueada: false },
        { numero: 4, imagem: mapa4, desbloqueada: false },
        { numero: 5, imagem: mapa5, desbloqueada: false },
    ];

    return (
        <main className="selecao-nivel">
            <section
                className="selecao-nivel__janela"
                aria-label="Seleção de fases"
            >
                <div className="selecao-nivel__mapas">
                    {fases.map((fase) => (
                        <CartaoFase
                            key={fase.numero}
                            numero={fase.numero}
                            imagem={fase.imagem}
                            desbloqueada={fase.desbloqueada}
                            selecionada={
                                faseSelecionada === fase.numero
                            }
                            onSelecionar={() =>
                                setFaseSelecionada(fase.numero)
                            }
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default SelecaoNivel;