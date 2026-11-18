import { useEffect } from 'react';

const VARIAVEL_ESCALA = '--escala-tela-cheia';

function aplicacaoEmTelaCheia() {
    return document.fullscreenElement === document.documentElement;
}

export function useEscalaTelaCheia(estruturaRef, conteudoRef) {
    useEffect(() => {
        const estrutura = estruturaRef.current;
        const conteudo = conteudoRef.current;

        if (!estrutura || !conteudo) return undefined;

        let escalaAtual = null;
        let quadro = 0;

        function remover() {
            if (escalaAtual === null) return;
            estrutura.style.removeProperty(VARIAVEL_ESCALA);
            escalaAtual = null;
        }

        function recalcular() {
            quadro = 0;

            if (!aplicacaoEmTelaCheia()) {
                remover();
                return;
            }

            const larguraNatural = conteudo.offsetWidth;
            const alturaNatural = conteudo.offsetHeight;

            if (!larguraNatural || !alturaNatural) return;

            const estilo = window.getComputedStyle(estrutura);
            const folgaHorizontal = parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight);
            const folgaVertical = parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
            const larguraTela = document.documentElement.clientWidth;
            const alturaTela = document.documentElement.clientHeight;

            const escalaCalculada = Math.min(
                larguraTela / (larguraNatural + folgaHorizontal),
                alturaTela / (alturaNatural + folgaVertical),
            );

            const escala = Math.max(1, Math.floor(escalaCalculada * 1000) / 1000);

            if (escalaAtual !== null && Math.abs(escala - escalaAtual) < 0.001) return;

            estrutura.style.setProperty(VARIAVEL_ESCALA, String(escala));
            escalaAtual = escala;
        }

        function agendar() {
            if (quadro) return;
            quadro = window.requestAnimationFrame(recalcular);
        }

        const observador = new ResizeObserver(agendar);
        observador.observe(conteudo);
        document.addEventListener('fullscreenchange', agendar);
        window.addEventListener('resize', agendar);
        agendar();

        return () => {
            observador.disconnect();
            document.removeEventListener('fullscreenchange', agendar);
            window.removeEventListener('resize', agendar);
            if (quadro) window.cancelAnimationFrame(quadro);
            remover();
        };
    }, [estruturaRef, conteudoRef]);
}
