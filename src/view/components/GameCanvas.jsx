import { useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import p5 from 'p5';
import { atualizarMovimentacao, definirPosicao } from '../../controller/movimentacaoController';
import configuracoesPersonagens from '../../model/configuracoesPersonagens';
import configuracoesMapas from '../../model/configuracoesMapas';
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

function GameCanvas({
    fase,
    onConcluir,
    personagemSelecionado = 'pikachu',
    estado = null,
    reinicio = 0,
    onReiniciarEstado,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!estado) {
            return undefined;
        }

        const configuracao = configuracoesMapas[fase];

        //interrompe a inicialização caso a fase não tenha configuração
        if (!configuracao) {
            console.error(`Configuração não encontrada para a fase ${fase}.`);
            return;
        }

        const configuracaoPersonagem = configuracoesPersonagens[personagemSelecionado];

        if (!configuracaoPersonagem) {
            console.error(`Personagem não encontrado ${personagemSelecionado}.`);
            return;
        }

        const sketch = (p) => {
            //define as dimensões da área de jogo e as características do personagem
            const larguraCanvas = 800;
            const alturaCanvas = 500;
            const escalaMapa = configuracao.escala;
            const tamanhoPersonagem = 64;

            //controla o quadro atual da animação; a direção vem do estado lógico
            let indiceQuadro = 0;
            let ultimoQuadroAnimacao = 0;

            //controla a velocidade da animação
            const intervaloAnimacao = 150;

            //armazena as imagens carregadas e o estado de carregmento
            let mapa = null;
            let personagem = null;
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

                    [mapa, personagem] = await Promise.all([
                        p.loadImage(arquivoMapa),
                        p.loadImage(configuracaoPersonagem.imagem),
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

            //avança um quadro da posição lógica e a animação correspondente
            function aplicarMovimento() {
                if (mapaFinal || transicaoEmAndamento || faseConcluida) {
                    return;
                }

                const resultado = atualizarMovimentacao(estado);

                if (!resultado.sucesso || !estado.estaEmMovimento()) {
                    indiceQuadro = 0;
                    return;
                }

                //controla o tempo da animação dos quadros do sprite
                const tempoAtual = p.millis();
                if (tempoAtual - ultimoQuadroAnimacao >= intervaloAnimacao) {
                    indiceQuadro = (indiceQuadro + 1) % configuracaoPersonagem.quadrosPorDirecao;
                    ultimoQuadroAnimacao = tempoAtual;
                }
            }

            //impede que o personagem ultrapasse os limites do mapa e devolve essa posição ao estado
            function limitarPosicaoPersonagem(larguraMapa, alturaMapa) {
                const x = p.constrain(
                    estado.x,
                    tamanhoPersonagem / 2,
                    larguraMapa - tamanhoPersonagem / 2
                );

                const y = p.constrain(
                    estado.y,
                    tamanhoPersonagem / 2,
                    alturaMapa - tamanhoPersonagem / 2
                );

                if (x !== estado.x || y !== estado.y) {
                    definirPosicao(estado, x, y);
                }
            }

            //mantém a câmera acompanhando o personagem dentro dos limites
            function atualizarCamera(larguraMapa, alturaMapa) {
                //mantém a câmera centralizada no personagem, respeitando os limites
                cameraX = p.constrain(
                    estado.x - larguraCanvas / 2,
                    0,
                    Math.max(0, larguraMapa - larguraCanvas)
                );

                cameraY = p.constrain(
                    estado.y - alturaCanvas / 2,
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
                const {
                    larguraSprite,
                    alturaSprite,
                    direcoes,
                } = configuracaoPersonagem;

                const destinoX =
                    estado.x - cameraX + deslocamentoX - tamanhoPersonagem / 2;

                const destinoY =
                    estado.y - cameraY + deslocamentoY - tamanhoPersonagem / 2;

                const linha = direcoes[estado.direcao];
                //alterna entre 0 e 1 (passo esquerdo/direito)
                const coluna = indiceQuadro; 

                const origemX = coluna * larguraSprite;
                const origemY = linha * alturaSprite;

                p.push(); //salva os estilos/transformações do canvas

                if (estado.direcao === 'direita') {
                    //espelha horizontalmente para criar a direção Direita a partir da Esquerda
                    p.translate(destinoX + tamanhoPersonagem, destinoY);
                    p.scale(-1, 1);

                    p.image(
                        personagem,
                        0,
                        0,
                        tamanhoPersonagem,
                        tamanhoPersonagem,
                        origemX,
                        origemY,
                        larguraSprite,
                        alturaSprite
                    );
                } else {
                    //desenho normal para Cima, Baixo e Esquerda
                    p.image(
                        personagem,
                        destinoX,
                        destinoY,
                        tamanhoPersonagem,
                        tamanhoPersonagem,
                        origemX,
                        origemY,
                        larguraSprite,
                        alturaSprite
                    );
                }

                //restaura as transformações para não afetar os outros desenhos
                p.pop(); 
            }

            //verifica se o personagem alcançou a porta da fase 5
            function verificarTransicao() {
                if (
                    fase !== 5 ||
                    mapaFinal ||
                    transicaoEmAndamento ||
                    Math.abs(estado.x - configuracao.porta.x) >= 20 ||
                    Math.abs(estado.y - configuracao.porta.y) >= 20
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

                        definirPosicao(
                            estado,
                            proximoMapa.personagemInicial.x,
                            proximoMapa.personagemInicial.y
                        );

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
                        `X: ${Math.round(estado.x)} | Y: ${Math.round(estado.y)}`,
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

                const distanciaX = estado.x - configuracao.pokeparada.x;
                const distanciaY = estado.y - configuracao.pokeparada.y;

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
                if (erroImagens || !mapa || !personagem) {
                    desenharEstadoCarregamento();
                    return;
                }

                //verifica a transição antes de atualizar o movimento do personagem
                verificarTransicao();
                aplicarMovimento();

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
    }, [reinicio, fase, onConcluir, personagemSelecionado, estado]);

    return (
        <div className="jogo__canvas-container">
            <div className="jogo__canvas-area" ref={canvasRef} />

            <button
                type="button"
                className="jogo__reiniciar"
                onClick={() => onReiniciarEstado?.()}
                aria-label="Reiniciar fase"
                title="Reiniciar fase"
            >
                <RotateCcw size={24} strokeWidth={3} />
            </button>
        </div>
    );
}

export default GameCanvas;