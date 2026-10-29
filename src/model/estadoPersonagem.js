const DIRECOES = ['cima', 'baixo', 'esquerda', 'direita'];
const DIRECAO_INICIAL = 'baixo';

// Mesma velocidade do canvas: 2 px por atualização, com a diagonal normalizada.
const VELOCIDADE = 2;
const FATOR_DIAGONAL = 0.7071;

function erroMovimentacao(mensagem, codigo) {
    const erro = new Error(mensagem);
    erro.code = codigo;
    return erro;
}

function calcularDeslocamento(comandos) {
    let dx = 0;
    let dy = 0;

    if (comandos.esquerda) dx -= 1;
    if (comandos.direita) dx += 1;
    if (comandos.cima) dy -= 1;
    if (comandos.baixo) dy += 1;

    if (dx === 0 && dy === 0) {
        return {
            x: 0,
            y: 0,
            direcao: null,
            emMovimento: false,
        };
    }

    let direcao = DIRECAO_INICIAL;

    if (dy > 0) direcao = 'baixo';
    else if (dy < 0) direcao = 'cima';
    else if (dx < 0) direcao = 'esquerda';
    else if (dx > 0) direcao = 'direita';

    let velocidadeX = dx * VELOCIDADE;
    let velocidadeY = dy * VELOCIDADE;

    if (dx !== 0 && dy !== 0) {
        velocidadeX *= FATOR_DIAGONAL;
        velocidadeY *= FATOR_DIAGONAL;
    }

    return {
        x: velocidadeX,
        y: velocidadeY,
        direcao,
        emMovimento: true,
    };
}

class EstadoPersonagem {
    #comandos;

    constructor({
        jogadorId,
        personagemSelecionado,
        personagens,
        x,
        y,
        direcao = DIRECAO_INICIAL,
    }) {
        EstadoPersonagem.validarJogador(jogadorId);
        EstadoPersonagem.validarPersonagem(personagemSelecionado, personagens);
        EstadoPersonagem.validarPosicao(x, y);
        EstadoPersonagem.validarDirecao(direcao);

        this.jogadorId = jogadorId;
        this.personagemSelecionado = personagemSelecionado;
        this.x = x;
        this.y = y;
        this.direcao = direcao;
        this.#comandos = {
            cima: new Set(),
            baixo: new Set(),
            esquerda: new Set(),
            direita: new Set(),
        };
    }

    static validarJogador(jogadorId) {
        if (typeof jogadorId !== 'string' || jogadorId.trim() === '') {
            throw erroMovimentacao(
                'Informe o identificador do jogador.',
                'movimentacao/dados-invalidos'
            );
        }
    }

    static validarPersonagem(personagemSelecionado, personagens) {
        if (!personagens || typeof personagens !== 'object') {
            throw erroMovimentacao(
                'As configurações de personagens não foram informadas.',
                'movimentacao/dados-invalidos'
            );
        }

        if (
            typeof personagemSelecionado !== 'string' ||
            !Object.hasOwn(personagens, personagemSelecionado)
        ) {
            throw erroMovimentacao(
                'O personagem informado não está disponível.',
                'movimentacao/dados-invalidos'
            );
        }
    }

    static validarPosicao(x, y) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            throw erroMovimentacao(
                'A posição do personagem é inválida.',
                'movimentacao/dados-invalidos'
            );
        }
    }

    static validarDirecao(direcao) {
        if (!DIRECOES.includes(direcao)) {
            throw erroMovimentacao(
                'A direção do personagem é inválida.',
                'movimentacao/dados-invalidos'
            );
        }
    }

    consultarPersonagem() {
        return this.personagemSelecionado;
    }

    definirComando(direcao, ativo, origem = 'comando') {
        EstadoPersonagem.validarDirecao(direcao);

        if (typeof origem !== 'string' || origem.trim() === '') {
            throw erroMovimentacao(
                'A origem do comando é inválida.',
                'movimentacao/comando-invalido'
            );
        }

        if (ativo) {
            this.#comandos[direcao].add(origem);
            return;
        }

        this.#comandos[direcao].delete(origem);
    }

    limparComandos() {
        DIRECOES.forEach((direcao) => {
            this.#comandos[direcao].clear();
        });
    }

    definirPosicao(x, y) {
        EstadoPersonagem.validarPosicao(x, y);
        this.x = x;
        this.y = y;
    }

    reiniciar({ x, y, direcao = DIRECAO_INICIAL }) {
        this.definirPosicao(x, y);
        EstadoPersonagem.validarDirecao(direcao);
        this.direcao = direcao;
        this.limparComandos();
    }

    comandosAtivos() {
        return {
            cima: this.#comandos.cima.size > 0,
            baixo: this.#comandos.baixo.size > 0,
            esquerda: this.#comandos.esquerda.size > 0,
            direita: this.#comandos.direita.size > 0,
        };
    }

    atualizar() {
        const deslocamento = calcularDeslocamento(this.comandosAtivos());

        if (!deslocamento.emMovimento) {
            return this;
        }

        this.direcao = deslocamento.direcao;
        this.x += deslocamento.x;
        this.y += deslocamento.y;
        return this;
    }

    estaEmMovimento() {
        return calcularDeslocamento(this.comandosAtivos()).emMovimento;
    }

    obterEstado() {
        return {
            jogadorId: this.jogadorId,
            personagemSelecionado: this.personagemSelecionado,
            x: this.x,
            y: this.y,
            direcao: this.direcao,
            emMovimento: this.estaEmMovimento(),
        };
    }
}

export default EstadoPersonagem;
