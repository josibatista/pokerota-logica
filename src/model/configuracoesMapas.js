import obstaculosNivel1 from './colisoes/dados/nivel1.js';
import obstaculosNivel2 from './colisoes/dados/nivel2.js';
import obstaculosNivel3 from './colisoes/dados/nivel3.js';
import obstaculosNivel4 from './colisoes/dados/nivel4.js';
import obstaculosNivel5, { obstaculosHallDaFama } from './colisoes/dados/nivel5.js';

const configuracoesMapas = {
    1: {
        mapa: 'nivel1',
        escala: 2.1,
        personagemInicial: {
            x: 550,
            y: 485,
        },
        pokeparada: {
            x: 442,
            y: 45,
        },
        obstaculos: obstaculosNivel1,
    },

    2: {
        mapa: 'nivel2',
        escala: 2.1,    
        personagemInicial: {
            x: 435,
            y: 1110,
        },
        pokeparada: {
            x: 410,
            y: 50,
        },
        obstaculos: obstaculosNivel2,
    },

    3: {
        mapa: 'nivel3',
        escala: 2.1,    
        personagemInicial: {
            x: 990,
            y: 2073,
        },
        pokeparada: {
            x: 186,
            y: 378,
        },
        obstaculos: obstaculosNivel3,
    },

    4: {
        mapa: 'nivel4',
        escala: 2.1,    
        personagemInicial: {
            x: 400,
            y: 2560,
        },
        pokeparada: {
            x: 395,
            y: 60,
        },
        transicao: {
            origem: {
                x: 182,
                y: 963,
            },
            destino: {
                x: 620,
                y: 963,
            },
        },
        obstaculos: obstaculosNivel4,
    },

    5: {
        mapa: 'nivel5',
        escala: 2.1,
        personagemInicial: {
            x: 385,
            y: 613,
        },
        porta: {
            x: 385,
            y: 231,
        },
        hallDaFama: {
            mapa: 'hallDaFama',
            personagemInicial: {
                x: 185,
                y: 245,
            },
            // Ponto em frente à máquina de registro, já na escala 2.1 do mapa.
            // O valor pode ser calibrado pelo texto X/Y exibido no canvas.
            objetivo: {
                x: 185,
                y: 160,
            },
            obstaculos: obstaculosHallDaFama,
        },
        obstaculos: obstaculosNivel5,
    },
};

export default configuracoesMapas;
