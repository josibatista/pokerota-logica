import { useEffect, useRef } from 'react';
import './ConfirmacaoExclusao.css';

function ConfirmacaoExclusao({ aberta, etapa, ocupada, mensagem, onCancelar, onAvancar, onConfirmar }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (aberta && !dialog.open) dialog.showModal();
        if (!aberta && dialog.open) dialog.close();
        return () => { if (dialog.open) dialog.close(); };
    }, [aberta]);

    return (
        <dialog
            ref={dialogRef}
            className="confirmacao-exclusao"
            aria-labelledby="exclusao-titulo"
            aria-describedby="exclusao-descricao"
            aria-busy={ocupada}
            onCancel={(event) => {
                event.preventDefault();
                if (!ocupada) onCancelar();
            }}
        >
            <h2 id="exclusao-titulo" className="confirmacao-exclusao__titulo">
                {etapa === 1 ? 'Quer apagar sua conta?' : 'Tem certeza?'}
            </h2>
            <p id="exclusao-descricao" className="confirmacao-exclusao__descricao">
                {etapa === 1
                    ? 'Você deseja apagar sua conta do PokéRota? Se foi um engano, escolha Cancelar.'
                    : 'Sua conta do PokéRota será apagada. Depois, não poderá recuperar seu progresso nos mapas.'}
            </p>
            <p className="confirmacao-exclusao__etapa">Confirmação {etapa} de 2</p>
            <p className="confirmacao-exclusao__mensagem" role="status" aria-live="polite">{mensagem}</p>
            <div className="acoes confirmacao-exclusao__acoes">
                <button type="button" className="botao botao--secundario confirmacao-exclusao__botao" onClick={onCancelar} disabled={ocupada} autoFocus>
                    Cancelar
                </button>
                <button
                    type="button"
                    className="botao botao--destrutivo confirmacao-exclusao__botao"
                    onClick={etapa === 1 ? onAvancar : onConfirmar}
                    disabled={ocupada}
                >
                    {ocupada ? 'Apagando…' : etapa === 1 ? 'Continuar' : 'Sim, apagar minha conta'}
                </button>
            </div>
        </dialog>
    );
}

export default ConfirmacaoExclusao;
