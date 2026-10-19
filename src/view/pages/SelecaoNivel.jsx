import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelecaoNivel.css';
import CartaoFase from '../components/CartaoFase';
import { carregarProgresso } from '../../controller/progressoController';
import Progresso from '../../model/progresso.js';

import mapa1 from '../assets/mapas/nivel1.png';
import mapa2 from '../assets/mapas/nivel2.png';
import mapa3 from '../assets/mapas/nivel3.png';
import mapa4 from '../assets/mapas/nivel4.png';
import mapa5 from '../assets/mapas/nivel5-parte1.png';

//associa cada número da fase à imagem utilizada no cartão de seleção
const mapas = [
    { numero: 1, imagem: mapa1 },
    { numero: 2, imagem: mapa2 },
    { numero: 3, imagem: mapa3 },
    { numero: 4, imagem: mapa4 },
    { numero: 5, imagem: mapa5 },
];

function SelecaoNivel() {
    //controla a fase selecionada, os dados de progresso e os estados da tela
    const [faseSelecionada, setFaseSelecionada] = useState(1);
    const [progresso, setProgresso] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const navegar = useNavigate();

    useEffect(() => {
        //evita atualizar o estado, caso o componente seja desmontado durante a consulta
        let ativo = true;

        //busca o progresso do jogador e prepara os dados para exibição
        async function buscarProgresso() {
            const resultado = await carregarProgresso();

            if (!ativo) {
                return;
            }

            //exibe a mensagem retornada pelo controlador se a consulta falhar
            if (!resultado.sucesso) {
                setErro(resultado.mensagem);
                setCarregando(false);
                return;
            }

            //converte os dados recebidos em uma instância do modelo Progresso
            setProgresso(
                new Progresso(resultado.progresso)
            );
            setErro('');
            setCarregando(false);
        }

        buscarProgresso();

        //marca o componente como inatvo ao sair da tela
        return () => {
            ativo = false;
        };
    }, []);

    //seleciona uma fase ou inicia o jogo caso ela já esteja selecionada
    function selecionarFase(numero) {
        const estado = progresso.obterEstadoFase(numero);

        //impede a seleção de fases que não foram desbloqueadas
        if (estado === 'bloqueada') {
            return;
        }

        //um segundo clique na fase selecionada abre o jogo nessa fase
        if (faseSelecionada === numero) {
            navegar('/jogo', {
                state: { fase: numero },
            });
            return;
        }

        //primeiro clique atualiza a fase destacada na tela
        setFaseSelecionada(numero);
    }

    //apresenta ume stado de carregamento enquanto o progresso  consultado
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

    //apresenta o erro e permite recarregar a página para tentar novamente
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

    //combina os dados de cada map com o estado correspondente no progresso
    const fases = mapas.map((mapa) => ({
        ...mapa,
        estado: progresso.obterEstadoFase(mapa.numero),
    }));

    return (
        <main className="selecao-nivel">
            <section
                className="selecao-nivel__janela"
                aria-label="Seleção de fases"
            >
                <p>
                    Fases concluídas: {progresso.ultimoNivelConcluido} de 5
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