import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import p5 from 'p5';
import configuracoesMapas from '../../model/configuracoesMapas';
import pikachuImagem from '../assets/personagens/pikachu.png';
import pokeparadaImagem from '../assets/objetos/pokeparada.png';
import mapaNivel1 from '../assets/mapas/nivel1.png';
import mapaNivel2 from '../assets/mapas/nivel2.png';
import mapaNivel3 from '../assets/mapas/nivel3.png';
import mapaNivel4 from '../assets/mapas/nivel4.png';
import mapaNivel5 from '../assets/mapas/nivel5-parte1.png';
import mapaHallDaFama from '../assets/mapas/nivel5-parte2.png';

const mapas = {
    nivel1: mapaNivel1,
    nivel2: mapaNivel2,
    nivel3: mapaNivel3,
    nivel4: mapaNivel4,
    nivel5: mapaNivel5,
    hallDaFama: mapaHallDaFama,
};

function GameCanvas({ fase }) {
    const canvasRef = useRef(null);
    const [reinicio, setReinicio] = useState(0);

    useEffect(() => {
        const configuracao = configuracoesMapas[fase];

        if (!configuracao) {
            console.error(`Configuração não encontrada para a fase ${fase}.`);
            return;
        }

        const sketch = (p) => {
            const larguraCanvas = 800;
            const alturaCanvas = 500;

            const escalaMapa = configuracao.escala;
            const tamanhoPersonagem = 32;
            const velocidade = 3;

            let personagemX = configuracao.personagemInicial.x;
            let personagemY = configuracao.personagemInicial.y;

            let mapa = null;
            let pikachu = null;
            let pokeparada = null;
            let erroImagens = false;

            let mapaFinal = false;
            let mensagemVitoria = false;

            let cameraX = 0;
            let cameraY = 0;
            let deslocamentoX = 0;
            let deslocamentoY = 0;

            let transicaoEmAndamento = false;

            p.setup = async () => {
                p.createCanvas(larguraCanvas, alturaCanvas);

                try {
                    const arquivoMapa = mapas[configuracao.mapa];

                    if (!arquivoMapa) {
                        throw new Error(
                            `Imagem não encontrada para o mapa: ${configuracao.mapa}`
                        );
                    }

                    [mapa, pikachu] = await Promise.all([
                        p.loadImage(arquivoMapa),
                        p.loadImage(pikachuImagem),
                    ]);

                    if (configuracao.pokeparada) {
                        pokeparada = await p.loadImage(pokeparadaImagem);
                    }
                } catch (erro) {
                    console.error('Erro ao carregar imagens:', erro);
                    erroImagens = true;
                }
            };

            p.draw = () => {
                p.background(0);

                if (erroImagens) {
                    p.fill(255);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(
                        'Não foi possível carregar as imagens.',
                        larguraCanvas / 2,
                        alturaCanvas / 2
                    );
                    return;
                }

                if (!mapa || !pikachu) {
                    p.fill(255);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(
                        'Carregando mapa...',
                        larguraCanvas / 2,
                        alturaCanvas / 2
                    );
                    return;
                }

                // Verifica se o personagem chegou à porta da fase 5.
                if (
                    fase === 5 &&
                    !mapaFinal &&
                    !transicaoEmAndamento &&
                    Math.abs(personagemX - configuracao.porta.x) < 20 &&
                    Math.abs(personagemY - configuracao.porta.y) < 20
                ) {
                    transicaoEmAndamento = true;

                    const proximoMapa = configuracao.hallDaFama;
                    const arquivoHall = mapas[proximoMapa.mapa];

                    if (!arquivoHall) {
                        console.error('Imagem do Hall da Fama não encontrada.');
                        transicaoEmAndamento = false;
                    } else {
                        p.loadImage(
                            arquivoHall,
                            (imagemCarregada) => {
                                mapa = imagemCarregada;

                                personagemX =
                                    proximoMapa.personagemInicial.x;
                                personagemY =
                                    proximoMapa.personagemInicial.y;

                                mapaFinal = true;
                                mensagemVitoria = true;
                                transicaoEmAndamento = false;

                                cameraX = 0;
                                cameraY = 0;
                            },
                            (erro) => {
                                console.error(
                                    'Erro ao carregar o Hall da Fama:',
                                    erro
                                );
                                transicaoEmAndamento = false;
                            }
                        );
                    }
                }

                // Enquanto o Hall não for carregado, mantém o movimento.
                if (!mapaFinal && !transicaoEmAndamento) {
                    if (p.keyIsDown(p.LEFT_ARROW)) personagemX -= velocidade;
                    if (p.keyIsDown(p.RIGHT_ARROW)) personagemX += velocidade;
                    if (p.keyIsDown(p.UP_ARROW)) personagemY -= velocidade;
                    if (p.keyIsDown(p.DOWN_ARROW)) personagemY += velocidade;
                }

                // Recalcula as dimensões do mapa atual, inclusive após a transição.
                const larguraMapa = mapa.width * escalaMapa;
                const alturaMapa = mapa.height * escalaMapa;

                personagemX = p.constrain(
                    personagemX,
                    tamanhoPersonagem / 2,
                    larguraMapa - tamanhoPersonagem / 2
                );

                personagemY = p.constrain(
                    personagemY,
                    tamanhoPersonagem / 2,
                    alturaMapa - tamanhoPersonagem / 2
                );

                cameraX = Math.max(0, (larguraMapa - larguraCanvas) / 2);
                cameraY = Math.max(0, (alturaMapa - alturaCanvas) / 2);

                deslocamentoX = Math.max(0, (larguraCanvas - larguraMapa) / 2);
                deslocamentoY = Math.max(0, (alturaCanvas - alturaMapa) / 2);

                p.image(
                    mapa,
                    deslocamentoX - cameraX,
                    deslocamentoY - cameraY,
                    larguraMapa,
                    alturaMapa
                );

                // A Poképarada só é desenhada quando existe no mapa atual.
                if (pokeparada && !mapaFinal) {
                    const tamanhoPokeparada = 128;

                    p.image(
                        pokeparada,
                        configuracao.pokeparada.x -
                            cameraX -
                            tamanhoPokeparada / 2,
                        configuracao.pokeparada.y -
                            cameraY -
                            tamanhoPokeparada / 2,
                        tamanhoPokeparada,
                        tamanhoPokeparada
                    );
                }

                p.image(
                    pikachu,
                    personagemX - cameraX + deslocamentoX - tamanhoPersonagem / 2,
                    personagemY - cameraY + deslocamentoY - tamanhoPersonagem / 2,
                    tamanhoPersonagem,
                    tamanhoPersonagem
                );

                p.fill(255);
                p.noStroke();
                p.textSize(14);
                p.textAlign(p.LEFT, p.TOP);

                if (mensagemVitoria) {
                    p.textAlign(p.CENTER, p.TOP);
                    p.textSize(22);
                    p.text(
                        'Parabéns! Você chegou ao Hall da Fama!',
                        larguraCanvas / 2,
                        20
                    );
                } else {
                    p.text(
                        `X: ${Math.round(personagemX)} | Y: ${Math.round(personagemY)}`,
                        10,
                        10
                    );
                }
            };
        };

        const instance = new p5(sketch, canvasRef.current);

        return () => instance.remove();
    }, [reinicio, fase]);

    return (
        <div className="jogo__canvas-container">
            <div className="jogo__canvas-area" ref={canvasRef} />

            <button
                type="button"
                className="jogo__reiniciar"
                onClick={() => setReinicio((valor) => valor + 1)}
                aria-label="Reiniciar fase"
                title="Reiniciar fase"
            >
                <RotateCcw size={24} strokeWidth={3} />
            </button>
        </div>
    );
}

export default GameCanvas;