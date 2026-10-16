const NIVEL_INICIAL = 0;
const NIVEL_MAXIMO = 5;

class Progresso {
    constructor({
        ultimoNivelConcluido = NIVEL_INICIAL
    } = {}) {
        Progresso.validarNivel(ultimoNivelConcluido);

        this.ultimoNivelConcluido = ultimoNivelConcluido;
    }

    static validarNivel(numero) {
        if (
            !Number.isInteger(numero) ||
            numero < NIVEL_INICIAL ||
            numero > NIVEL_MAXIMO
        ) {
            const erro = new Error(
                'O progresso deve ser um número inteiro entre 0 e 5.'
            );

            erro.code = 'progresso/dados-invalidos';
            throw erro;
        }
    }

    obterEstadoFase(numero) {
        Progresso.validarNivel(numero);

        if (numero <= this.ultimoNivelConcluido) {
            return 'concluida';
        }

        if (numero === this.ultimoNivelConcluido + 1) {
            return 'disponivel';
        }

        return 'bloqueada';
    }

    static criarInicial() {
        return new Progresso();
    }

    static converterDados(dados) {
        if (!dados || !Number.isInteger(dados.ultimoNivelConcluido)) {
            const erro = new Error(
                'O progresso armazenado está em um formato inválido.'
            );

            erro.code = 'progresso/dados-armazenados-invalidos';
            throw erro;
        }

        try {
            return new Progresso({
                ultimoNivelConcluido: dados.ultimoNivelConcluido
            });
        } catch {
            const erro = new Error(
                'O progresso armazenado está em um formato inválido.'
            );

            erro.code = 'progresso/dados-armazenados-invalidos';
            throw erro;
        }
    }
}

export default Progresso;
