
function CartaoFase({
    numero,
    imagem,
    estado,
    selecionada,
    onSelecionar,
}) {
    const bloqueada = estado === 'bloqueada';

    const descricaoEstado = {
        concluida: 'concluída',
        disponivel: 'disponível',
        bloqueada: 'bloqueada',
    }[estado];

    return (
        <button
            type="button"
            className={`mapa-fase ${
                selecionada ? 'mapa-fase--destaque' : ''
            } ${
                bloqueada ? 'mapa-fase--bloqueada' : ''
            }`}
            onClick={onSelecionar}
            disabled={bloqueada}
            aria-label={`Fase ${numero}, ${descricaoEstado}`}
        >
            <div className="mapa-fase__imagem">
                <img
                    src={imagem}
                    alt={`Mapa da fase ${numero}`}
                />

                {bloqueada && (
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