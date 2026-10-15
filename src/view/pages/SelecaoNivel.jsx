
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelecaoNivel.css';
import CartaoFase from '../components/CartaoFase';
import { carregarProgresso } from '../../controller/progressoController';

import mapa1 from '../assets/mapas/nivel1-mini.png';
import mapa2 from '../assets/mapas/nivel2-mini.png';
import mapa3 from '../assets/mapas/nivel3-mini.png';
import mapa4 from '../assets/mapas/nivel4-mini.png';
import mapa5 from '../assets/mapas/nivel5-mini.png';

const mapas = [
    { numero: 1, imagem: mapa1 },
    { numero: 2, imagem: mapa2 },
    { numero: 3, imagem: mapa3 },
    { numero: 4, imagem: mapa4 },
    { numero: 5, imagem: mapa5 },
];

function obterEstadoFase(numero, ultimoNivelConcluido) {
    if (numero <= ultimoNivelConcluido) {
        return 'concluida';
    }

    if (numero === ultimoNivelConcluido + 1) {
        return 'disponivel';
    }

    return 'bloqueada';
}

function SelecaoNivel() {
    const [faseSelecionada, setFaseSelecionada] = useState(1);
    const [ultimoNivelConcluido, setUltimoNivelConcluido] =
        useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const navegar = useNavigate();

    useEffect(() => {
        let ativo = true;

        async function buscarProgresso() {
            const resultado = await carregarProgresso();

            if (!ativo) {
                return;
            }

            if (!resultado.sucesso) {
                setErro(resultado.mensagem);
                setCarregando(false);
                return;
            }

            setUltimoNivelConcluido(
                resultado.progresso.ultimoNivelConcluido
            );
            setErro('');
            setCarregando(false);
        }

        buscarProgresso();

        return () => {
            ativo = false;
        };
    }, []);

    function selecionarFase(numero) {
        const estado = obterEstadoFase(
            numero,
            ultimoNivelConcluido
        );

        if (estado === 'bloqueada') {
            return;
        }

        setFaseSelecionada(numero);

        navegar('/jogo', {
            state: { fase: numero },
        });
    }

    if (carregando) {
        return (
            <main className="selecao-nivel">
                <section
                    className="selecao-nivel__janela"
                    aria-label="Seleção de fases"
                >
                    <p>Carregando progresso...</p>
                </section>
            </main>
        );
    }

    if (erro) {
        return (
            <main className="selecao-nivel">
                <section
                    className="selecao-nivel__janela"
                    aria-label="Seleção de fases"
                >
                    <p role="alert">{erro}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                    >
                        Tentar novamente
                    </button>
                </section>
            </main>
        );
    }

    const fases = mapas.map((mapa) => ({
        ...mapa,
        estado: obterEstadoFase(
            mapa.numero,
            ultimoNivelConcluido
        ),
    }));

    return (
        <main className="selecao-nivel">
            <section
                className="selecao-nivel__janela"
                aria-label="Seleção de fases"
            >
                <p>
                    Fases concluídas: {ultimoNivelConcluido} de 5
                </p>

                <div className="selecao-nivel__mapas">
                    {fases.map((fase) => (
                        <CartaoFase
                            key={fase.numero}
                            numero={fase.numero}
                            imagem={fase.imagem}
                            estado={fase.estado}
                            selecionada={
                                faseSelecionada === fase.numero
                            }
                            onSelecionar={() =>
                                selecionarFase(fase.numero)
                            }
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default SelecaoNivel;