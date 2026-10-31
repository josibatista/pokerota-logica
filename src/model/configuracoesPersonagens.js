import pikachu from '../view/assets/personagens/overworld/pikachu-spritesheet.png';
import bulbasauro from '../view/assets/personagens/overworld/bulbasauro-spritesheet.png';
import charmander from '../view/assets/personagens/overworld/charmander-spritesheet.png';
import squirtle from '../view/assets/personagens/overworld/squirtle-spritesheet.png';
import eevee from '../view/assets/personagens/overworld/eevee-spritesheet.png';

//centraliza as imagens e as dimensões dos sprites
const configuracoesPersonagens = {
    pikachu: {
        imagem: pikachu,
        larguraSprite: 32,
        alturaSprite: 32,
        direcoes: {
            cima: 0,
            baixo: 1,
            esquerda: 2,
            direita: 2,
        },
        quadrosPorDirecao: 2,
    },

    bulbasaur: {
        imagem: bulbasauro,
        larguraSprite: 32,
        alturaSprite: 32,
        direcoes: {
            cima: 0,
            baixo: 1,
            esquerda: 2,
            direita: 2,
        },
        quadrosPorDirecao: 2,
    },

    charmander: {
        imagem: charmander,
        larguraSprite: 32,
        alturaSprite: 32,
        direcoes: {
            cima: 0,
            baixo: 1,
            esquerda: 2,
            direita: 2,
        },
        quadrosPorDirecao: 2,
    },

    squirtle: {
        imagem: squirtle,
        larguraSprite: 32,
        alturaSprite: 32,
        direcoes: {
            cima: 0,
            baixo: 1,
            esquerda: 2,
            direita: 2,
        },
        quadrosPorDirecao: 2,
    },

    eevee: {
        imagem: eevee,
        larguraSprite: 32,
        alturaSprite: 32,
        direcoes: {
            cima: 0,
            baixo: 1,
            esquerda: 2,
            direita: 2,
        },
        quadrosPorDirecao: 2,
    },
};

export default configuracoesPersonagens;