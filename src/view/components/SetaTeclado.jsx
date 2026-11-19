const TRACOS = {
    cima: ['M12 19V5', 'M8 9l4-4 4 4'],
    baixo: ['M12 5v14', 'M8 15l4 4 4-4'],
    esquerda: ['M19 12H5', 'M9 8l-4 4 4 4'],
    direita: ['M5 12h14', 'M15 8l4 4-4 4'],
};

function SetaTeclado({ direcao, className = 'icone-controle' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            focusable="false"
        >
            <path
                d={TRACOS[direcao].join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default SetaTeclado;
