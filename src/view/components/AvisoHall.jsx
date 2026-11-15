import { useEffect, useRef } from 'react';
import './AvisoHall.css';

export const ID_AVISO_HALL = 'aviso-hall';

function AvisoHall({ aberto = false, onFechar }) {
    const dialogRef = useRef(null);
    const botaoRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;

        if (aberto && !dialog.open) {
            try {
                dialog.showModal();
                botaoRef.current?.focus();
            } catch {
                // Outro diálogo modal pode impedir a abertura; o jogo continua.
            }
        }
        if (!aberto && dialog.open) dialog.close();

        return () => {
            if (dialog.open) dialog.close();
        };
    }, [aberto]);

    return (
        <dialog
            id={ID_AVISO_HALL}
            ref={dialogRef}
            className="aviso-hall"
            aria-labelledby="aviso-hall-titulo"
            aria-describedby="aviso-hall-texto"
            onCancel={(evento) => {
                evento.preventDefault();
                onFechar?.();
            }}
        >
            <svg
                className="aviso-hall__estrela"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    fill="#ffcb05"
                    stroke="#c99a00"
                    strokeWidth="0.8"
                    d="M12 1.8 14.7 9h7.5l-6.1 4.4 2.3 7.2L12 16.2 5.6 20.6 7.9 13.4 1.8 9h7.5z"
                />
            </svg>
            <h2 id="aviso-hall-titulo" className="aviso-hall__titulo">
                Parabéns! Você chegou ao Hall da Fama!
            </h2>
            <p id="aviso-hall-texto" className="aviso-hall__texto">
                <svg
                    className="aviso-hall__seta"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                </svg>
                Vá até a máquina de registro para finalizar.
            </p>
            <button
                ref={botaoRef}
                type="button"
                className="botao botao--secundario aviso-hall__botao"
                onClick={() => onFechar?.()}
            >
                Entendi!
            </button>
        </dialog>
    );
}

export default AvisoHall;
