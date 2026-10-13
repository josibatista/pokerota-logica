import './estrutura.css';

function Icone({ children }) {
    return (
        <svg viewBox="0 0 24 24" className="cabecalhoIcone" aria-hidden="true" focusable="false">
            {children}
        </svg>
    );
}

function BotaoCabecalho({ rotulo, onClick, children }) {
    return (
        <button type="button" className="cabecalhoBotao" aria-label={rotulo} onClick={onClick}>
            {children}
        </button>
    );
}

function Cabecalho({
    showBack = false,
    showLogout = false,
    showInstructions = false,
    showSettings = false,
    saudacao,
    onBack,
    onLogout,
    onInstructions,
    onSettings,
    className = '',
}) {
    const temConteudo = showBack || showLogout || showInstructions || showSettings || saudacao;

    if (!temConteudo) {
        return null;
    }

    const classes = ['cabecalho', className].filter(Boolean).join(' ');

    return (
        <header className={classes}>
            <div className="cabecalhoLado">
                {showBack ? (
                    <BotaoCabecalho rotulo="Voltar" onClick={onBack}>
                        <Icone>
                            <path
                                d="M15 5 8 12l7 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Icone>
                    </BotaoCabecalho>
                ) : null}
                {saudacao ? <p className="cabecalhoSaudacao">{saudacao}</p> : null}
            </div>
            <div className="cabecalhoLado">
                {showLogout ? (
                    <BotaoCabecalho rotulo="Sair" onClick={onLogout}>
                        <Icone>
                            <path
                                fill="currentColor"
                                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                            />
                        </Icone>
                    </BotaoCabecalho>
                ) : null}
                {showInstructions ? (
                    <BotaoCabecalho rotulo="Instruções" onClick={onInstructions}>
                        <Icone>
                            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M9.6 9.2a2.4 2.4 0 1 1 3.1 2.3c-.8.3-1.3.9-1.3 1.7V14.4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle cx="11.4" cy="17.2" r="1.1" fill="currentColor" />
                        </Icone>
                    </BotaoCabecalho>
                ) : null}
                {showSettings ? (
                    <BotaoCabecalho rotulo="Configurações" onClick={onSettings}>
                        <Icone>
                            <path
                                fill="currentColor"
                                d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.22-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.5.4 1.05.72 1.63.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.58-.22 1.12-.54 1.63-.94l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
                            />
                        </Icone>
                    </BotaoCabecalho>
                ) : null}
            </div>
        </header>
    );
}

export default Cabecalho;
