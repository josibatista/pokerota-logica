
function CartaoFase({
    numero,
    imagem,
    desbloqueada,
    selecionada,
    onSelecionar,
}) {
    return (
        <button
            type="button"
            className={`mapa-fase ${
                selecionada ? 'mapa-fase--destaque' : ''
            } ${
                !desbloqueada ? 'mapa-fase--bloqueada' : ''
            }`}
            onClick={onSelecionar}
            disabled={!desbloqueada}
            aria-label={`Fase ${numero}${
                desbloqueada ? '' : ', bloqueada'
            }`}
        >
            
        <div className="mapa-fase__imagem">
            <img
                src={imagem}
                alt={`Mapa da fase ${numero}`}
            />

            {!desbloqueada && (
                <div
                    className="mapa-fase__filtro"
                    aria-hidden="true"
                />
            )}
        </div>

        <span className="mapa-fase__nome">
                Fase {numero}
            </span>
        </button>
    );
}

export default CartaoFase;