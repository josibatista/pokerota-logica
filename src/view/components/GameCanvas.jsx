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

//relaciona cada identificador de mapa ao arquivo de imagem correspondente.
const mapas = {
    nivel1: mapaNivel1,
    nivel2: mapaNivel2,
    nivel3: mapaNivel3,
    nivel4: mapaNivel4,
    nivel5: mapaNivel5,
    hallDaFama: mapaHallDaFama,
};

function GameCanvas({ fase, onConcluir }) {
    const canvasRef = useRef(null);
    const [reinicio, setReinicio] = useState(0);

    useEffect(() => {
        const configuracao = configuracoesMapas[fase];

        //interrompe a inicialização caso a fase não tenha configuração
        if (!configuracao) {
            console.error(`Configuração não encontrada para a fase ${fase}.`);
            return;
        }

        const sketch = (p) => {
            //define as dimensões da área de jogo e as características do personagem
            const larguraCanvas = 800;
            const alturaCanvas = 500;
            const escalaMapa = configuracao.escala;
            const tamanhoPersonagem = 32;
            const velocidade = 3;

            //inicializa a posição do personagem conforme a fase selecionada
            let personagemX = configuracao.personagemInicial.x;
            let personagemY = configuracao.personagemInicial.y;

            //armazena as imagens carregadas e o estado de carregmento
            let mapa = null;
            let pikachu = null;
            let pokeparada = null;
            let erroImagens = false;

            //controla o encerramento da fase e a exibição de mensagem final
            let mapaFinal = false;
            let mensagemVitoria = false;
            let transicaoEmAndamento = false;

            //controla o deslocamento da câmera e o alinhamento de mapas menores
            let cameraX = 0;
            let cameraY = 0;
            let deslocamentoX = 0;
            let deslocamentoY = 0;

            //impede que a mesma fase seja concluída mais de uma vez
            let faseConcluida = false;

            //carrega as imagens necessárias para iniciar a fase
            async function carregarImagens() {
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

                    //a Poképarada só precisa ser carregada nas fases que a possuem
                    if (configuracao.pokeparada) {
                        pokeparada = await p.loadImage(pokeparadaImagem);
                    }
                } catch (erro) {
                    console.error('Erro ao carregar imagens:', erro);
                    erroImagens = true;
                }
            }

            //atualiza a posição do personagem conforme as setas pressionadas
            function moverPersonagem() {
                //impede a movimentação após a vitória ou durante a troca de mapa.
                if (mapaFinal || transicaoEmAndamento || faseConcluida) return;

                //atualiza as coordenadas de acordo com as setas pressionadas.
                if (p.keyIsDown(p.LEFT_ARROW)) personagemX -= velocidade;
                if (p.keyIsDown(p.RIGHT_ARROW)) personagemX += velocidade;
                if (p.keyIsDown(p.UP_ARROW)) personagemY -= velocidade;
                if (p.keyIsDown(p.DOWN_ARROW)) personagemY += velocidade;
            }

            //impede que o personagem ultrpasse os limites do mapa
            function limitarPosicaoPersonagem(larguraMapa, alturaMapa) {
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
            }

            //mantém a câmera acompanhando o personagem dentro dos limites
            function atualizarCamera(larguraMapa, alturaMapa) {
                //mantém a câmera centralizada no personagem, respeitando os limites
                cameraX = p.constrain(
                    personagemX - larguraCanvas / 2,
                    0,
                    Math.max(0, larguraMapa - larguraCanvas)
                );

                cameraY = p.constrain(
                    personagemY - alturaCanvas / 2,
                    0,
                    Math.max(0, alturaMapa - alturaCanvas)
                );

                //centraliza mapas menores que o canvas
                deslocamentoX = Math.max(
                    0,
                    (larguraCanvas - larguraMapa) / 2
                );

                deslocamentoY = Math.max(
                    0,
                    (alturaCanvas - alturaMapa) / 2
                );
            }

            //desenha o mapa considerando a câmera e o tamanho definido para a fase
            function desenharMapa(larguraMapa, alturaMapa) {
                p.image(
                    mapa,
                    deslocamentoX - cameraX,
                    deslocamentoY - cameraY,
                    larguraMapa,
                    alturaMapa
                );
            }

            //desenha a Poképarada na posição configurada para a fase
            function desenharPokeparada() {
                //não desenha o objeto quando ele não existe ou a fase terminou
                if (!pokeparada || mapaFinal) return;

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

            //desenha o personagem considerando a posição e o deslocamento da câmera
            function desenharPersonagem() {
                p.image(
                    pikachu,
                    personagemX -
                        cameraX +
                        deslocamentoX -
                        tamanhoPersonagem / 2,
                    personagemY -
                        cameraY +
                        deslocamentoY -
                        tamanhoPersonagem / 2,
                    tamanhoPersonagem,
                    tamanhoPersonagem
                );
            }

            //verifica se o personagem alcançou a porta da fase 5
            function verificarTransicao() {
                if (
                    fase !== 5 ||
                    mapaFinal ||
                    transicaoEmAndamento ||
                    Math.abs(personagemX - configuracao.porta.x) >= 20 ||
                    Math.abs(personagemY - configuracao.porta.y) >= 20
                ) {
                    return;
                }

                transicaoEmAndamento = true;

                const proximoMapa = configuracao.hallDaFama;
                const arquivoHall = mapas[proximoMapa.mapa];

                //verifica se a imagem do próximo mapa está disponível
                if (!arquivoHall) {
                    console.error('Imagem do Hall da Fama não encontrada.');
                    transicaoEmAndamento = false;
                    return;
                }

                //carrega o Hall da Fama e atualiza o estado do jogo após o carregamento
                p.loadImage(
                    arquivoHall,
                    (imagemCarregada) => {
                        mapa = imagemCarregada;

                        personagemX = proximoMapa.personagemInicial.x;
                        personagemY = proximoMapa.personagemInicial.y;

                        mapaFinal = true;
                        mensagemVitoria = true;
                        transicaoEmAndamento = false;

                        //reinicia a câmera para o novo mapa
                        cameraX = 0;
                        cameraY = 0;

                        //conclui a fase 5 ao chegar ao Hall da Fama
                        if (!faseConcluida) {
                            faseConcluida = true;
                            onConcluir?.(fase);
                        }
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

            //exibe as coordenadas do personagem ou a mensagem de vitória
            function desenharInformacoes() {
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
            }

            //exibe mensagens enquanto as imagens são carregadas ou em caso de erro
            function desenharEstadoCarregamento() {
                p.fill(255);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(16);

                if (erroImagens) {
                    p.text(
                        'Não foi possível carregar as imagens.',
                        larguraCanvas / 2,
                        alturaCanvas / 2
                    );
                } else {
                    p.text(
                        'Carregando mapa...',
                        larguraCanvas / 2,
                        alturaCanvas / 2
                    );
                }
            }

            //conclui a fase quando o personagem se aproxima da Poképarada
            function verificarPokeparada() {
                if (
                    faseConcluida ||
                    fase === 5 ||
                    !configuracao.pokeparada
                ) {
                    return;
                }

                const distanciaX = personagemX - configuracao.pokeparada.x;
                const distanciaY = personagemY - configuracao.pokeparada.y;

                //considera a fase concluída quando o personagem chega perto do objeto
                if (
                    Math.abs(distanciaX) < 40 &&
                    Math.abs(distanciaY) < 40
                ) {
                    faseConcluida = true;
                    onConcluir?.(fase);
                }
            }

            //inicializa o canvas e carrega os recursos necessários para a fase
            p.setup = () => {
                p.createCanvas(larguraCanvas, alturaCanvas);
                carregarImagens();
            };

            //executa a atualização e a renderização do jogo a cada quadro
            p.draw = () => {
                p.background(0);

                //aguarda o carregamento das imagens antes de desenhar o jogo
                if (erroImagens || !mapa || !pikachu) {
                    desenharEstadoCarregamento();
                    return;
                }

                //verifica a transição antes de atualizar o movimento do personagem
                verificarTransicao();
                moverPersonagem();

                //recalcula as dimensões porque o mapa pode mudar após a transição
                const larguraMapa = mapa.width * escalaMapa;
                const alturaMapa = mapa.height * escalaMapa;

                limitarPosicaoPersonagem(larguraMapa, alturaMapa);

                //verifica se o personagem chegou à Poképarada
                verificarPokeparada();

                atualizarCamera(larguraMapa, alturaMapa);

                //desenha os elementos na ordem necessária para manter o personagem visível
                desenharMapa(larguraMapa, alturaMapa);
                desenharPokeparada();
                desenharPersonagem();
                desenharInformacoes();
            };
        };

        //cria a instância do p5.js e remove-a ao trocar de fase ou reiniciar.
        const instance = new p5(sketch, canvasRef.current);

        return () => instance.remove();
    }, [reinicio, fase, onConcluir]);

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