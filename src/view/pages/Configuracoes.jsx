import { useEffect, useState } from 'react';
import GerenciamentoConta from '../components/conta/GerenciamentoConta';
import CartaoTreinador from '../components/Cartao';
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

function IconeTema() {
    return (
        <svg viewBox="0 0 24 24" className="icone-controle" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
        </svg>
    );
}

function IconeSol() {
    return (
        <svg viewBox="0 0 24 24" className="configuracoes__icone-opcao" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
                d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconeLua() {
    return (
        <svg viewBox="0 0 24 24" className="configuracoes__icone-opcao" aria-hidden="true" focusable="false">
            <path
                d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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

    // Ligado/desligado é anunciado pelo próprio interruptor; o texto mostra só restrições e falhas.
    const avisoTelaCheia = avisoFalha
        || (carregandoSessao
            ? 'Só um momento…'
            : !usuario
                ? 'Entre na sua conta para usar a tela cheia.'
                : !suportada
                    ? 'Este navegador não oferece a tela cheia.'
                    : '');

    return (
        <main className="configuracoes">
            <h1 className="visualmente-oculto">Configurações</h1>

            <CartaoTreinador usuario={usuario} carregandoSessao={carregandoSessao} />

            <section className="configuracoes__secao" aria-labelledby="titulo-acessibilidade">
                <h2 id="titulo-acessibilidade" className="configuracoes__titulo">Aparência e acessibilidade</h2>

                <div className="configuracoes__lista">
                    <div className="configuracoes__linha">
                        <span className="configuracoes__icone"><IconeTema /></span>
                        <div className="configuracoes__texto">
                            <span id="tema-titulo" className="configuracoes__rotulo">Tema</span>
                            <span id="tema-descricao" className="configuracoes__descricao">
                                Escolha as cores que ficam melhores para seus olhos.
                            </span>
                        </div>
                        <div
                            className="configuracoes__segmentos"
                            role="radiogroup"
                            aria-labelledby="tema-titulo"
                            aria-describedby="tema-descricao"
                        >
                            <label className="configuracoes__segmento">
                                <input
                                    type="radio"
                                    name="tema"
                                    value="claro"
                                    checked={temaAtivo === 'claro'}
                                    onChange={() => escolherTema('claro')}
                                />
                                <IconeSol />
                                Claro
                            </label>
                            <label className="configuracoes__segmento">
                                <input
                                    type="radio"
                                    name="tema"
                                    value="escuro"
                                    checked={temaAtivo === 'escuro'}
                                    onChange={() => escolherTema('escuro')}
                                />
                                <IconeLua />
                                Escuro
                            </label>
                        </div>
                    </div>

                    <div className="configuracoes__linha">
                        <span className="configuracoes__icone"><IconeTelaCheia ativa={telaCheia} /></span>
                        <div className="configuracoes__texto">
                            <span id="tela-cheia-titulo" className="configuracoes__rotulo">Tela cheia</span>
                            <span id="tela-cheia-descricao" className="configuracoes__descricao">
                                Esconde as barras do navegador para o mapa ficar maior.
                            </span>
                            <span
                                id="tela-cheia-aviso"
                                className="configuracoes__aviso"
                                role="status"
                                aria-live="polite"
                            >
                                {avisoTelaCheia}
                            </span>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            className="configuracoes__interruptor"
                            onClick={alternarTelaCheia}
                            disabled={!podeUsarTelaCheia}
                            aria-checked={telaCheia}
                            aria-labelledby="tela-cheia-titulo"
                            aria-describedby="tela-cheia-descricao tela-cheia-aviso"
                        >
                            <span className="configuracoes__interruptor-botao" aria-hidden="true" />
                        </button>
                    </div>
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
