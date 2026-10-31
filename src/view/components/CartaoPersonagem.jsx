
function CartaoPersonagem({ personagem, selecionado, onSelecionar }) {
    return (
        <button
            type="button"
            className={`cartao-selecao selecao-personagem__cartao ${
                selecionado ? 'selecao-personagem__cartao--selecionado' : ''
            }`}
            onClick={() => onSelecionar(personagem.id)}
            aria-pressed={selecionado}
        >
            <div className="cartao-selecao__imagem selecao-personagem__imagem">
                <img
                    src={personagem.imagem}
                    alt=""
                />
            </div>

            <span className="selecao-personagem__nome">
                {personagem.nome}
            </span>
        </button>
    );
}

export default CartaoPersonagem;
