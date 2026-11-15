import { useEffect, useState } from 'react';
import GerenciamentoConta from '../components/conta/GerenciamentoConta';
import './Configuracoes.css';

function telaCheiaSuportada() {
    return document.fullscreenEnabled === true
        && typeof document.documentElement.requestFullscreen === 'function'
        && typeof document.exitFullscreen === 'function';
}

function IconeTelaCheia({ ativa }) {
    return (
        <svg viewBox="0 0 24 24" className="icone-controle" aria-hidden="true" focusable="false">
            <path
                d={ativa
                    ? 'M9 4H4v5M15 4h5v5M4 15v5h5M20 15v5h-5'
                    : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Configuracoes({
    usuario,
    carregandoSessao,
    onEncerrarSessao,
    onExcluirConta,
    tema = 'claro',
    onAlterarTema,
    telaCheia = false,
}) {
    const temaAtivo = tema === 'escuro' ? 'escuro' : 'claro';
    const [avisoFalha, setAvisoFalha] = useState('');
    const suportada = telaCheiaSuportada();
    const podeUsarTelaCheia = Boolean(usuario) && suportada && !carregandoSessao;

    useEffect(() => {
        setAvisoFalha('');
    }, [telaCheia]);

    function escolherTema(proximo) {
        if (typeof onAlterarTema === 'function') {
            onAlterarTema(proximo);
        }
    }

    function alternarTelaCheia() {
        if (!podeUsarTelaCheia) return;

        setAvisoFalha('');
        const documentoInteiro = document.fullscreenElement === document.documentElement;
        const pedido = documentoInteiro
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen();

        pedido.catch(() => {
            setAvisoFalha('Não foi possível mudar a tela cheia. Tente de novo.');
        });
    }

    const avisoTelaCheia = avisoFalha
        || (carregandoSessao
            ? 'Só um momento…'
            : !usuario
                ? 'Entre na sua conta para usar a tela cheia.'
                : !suportada
                    ? 'Este navegador não oferece a tela cheia.'
                    : telaCheia
                        ? 'Tela cheia ativada.'
                        : 'Tela cheia desativada.');

    return (
        <main className="configuracoes">
            <h1 className="titulo-pagina">Configurações</h1>

            <section className="configuracoes__aparencia" aria-labelledby="titulo-acessibilidade">
                <h2 id="titulo-acessibilidade" className="configuracoes__titulo">Aparência e acessibilidade</h2>
                <fieldset className="configuracoes__temas">
                    <legend className="configuracoes__legenda">Tema da interface</legend>
                    <div className="acoes configuracoes__opcoes">
                        <label className="botao botao--secundario configuracoes__opcao">
                            <input
                                type="radio"
                                name="tema"
                                value="claro"
                                checked={temaAtivo === 'claro'}
                                onChange={() => escolherTema('claro')}
                            />
                            Tema claro
                        </label>
                        <label className="botao botao--secundario configuracoes__opcao">
                            <input
                                type="radio"
                                name="tema"
                                value="escuro"
                                checked={temaAtivo === 'escuro'}
                                onChange={() => escolherTema('escuro')}
                            />
                            Tema escuro
                        </label>
                    </div>
                </fieldset>
                <p className="configuracoes__tema-atual" role="status" aria-live="polite">
                    {temaAtivo === 'escuro' ? 'Tema escuro selecionado.' : 'Tema claro selecionado.'}
                </p>

                <div className="configuracoes__tela-cheia">
                    <h3 className="configuracoes__legenda">Tela cheia</h3>
                    <button
                        type="button"
                        className="botao botao--secundario configuracoes__tela-cheia-botao"
                        onClick={alternarTelaCheia}
                        disabled={!podeUsarTelaCheia}
                        aria-pressed={telaCheia}
                        aria-describedby="tela-cheia-aviso"
                    >
                        <IconeTelaCheia ativa={telaCheia} />
                        {telaCheia ? 'Desativar tela cheia' : 'Ativar tela cheia'}
                    </button>
                    <p id="tela-cheia-aviso" className="configuracoes__tema-atual" role="status" aria-live="polite">
                        {avisoTelaCheia}
                    </p>
                </div>
            </section>

            <GerenciamentoConta
                usuario={usuario}
                carregandoSessao={carregandoSessao}
                onEncerrarSessao={onEncerrarSessao}
                onExcluirConta={onExcluirConta}
            />
        </main>
    );
}

export default Configuracoes;
