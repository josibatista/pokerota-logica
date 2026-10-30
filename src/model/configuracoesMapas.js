
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
        }
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
        }
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
        }
    },

    5: {
        mapa: 'nivel5',
        escala: 2.1,
        personagemInicial: {
            x: 385,
            y: 405,
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
        },
    },
};

export default configuracoesMapas;
