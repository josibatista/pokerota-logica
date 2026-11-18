import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Cabecalho from './Cabecalho';
import Logo from './Logo';
import Painel from './Painel';
import Instrucoes from '../Instrucoes';
import { obterFaseDaRota } from '../../faseDaRota';
import { useEscalaTelaCheia } from './escalaTelaCheia';
import './estrutura.css';

// A aparência do menu é definida aqui; as ações de conta vêm da integração.
const telas = {
    '/': { configuracoes: true },
    '/niveis': { saudacao: true, sair: true, instrucoes: true, configuracoes: true },
    '/personagem': { voltar: '/niveis', instrucoes: true, configuracoes: true },
    '/jogo': { movimento: true, instrucoes: true, configuracoes: true },
    '/configuracoes': { retornar: true, titulo: 'Configurações' },
};

function Estrutura({
    children,
    tema = 'claro',
    usuario = null,
    onEncerrarSessao,
    onInstructions,
    controlesMovimento = null,
}) {
    const [saindo, setSaindo] = useState(false);
    const [erroSaida, setErroSaida] = useState('');
    const [instrucoesAbertas, setInstrucoesAbertas] = useState(false);
    const estruturaRef = useRef(null);
    const conteudoRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const caminho = location.pathname.replace(/\/+$/, '') || '/';
    const tela = telas[caminho] || {};
    const visitante = location.state?.visitante === true;
    const temaClasse = tema === 'escuro' ? 'temaEscuro' : 'temaClaro';
    const nome = usuario?.nome?.trim();
    const faseCarregada = caminho === '/jogo' ? obterFaseDaRota(location) : null;
    const saudacao = tela.titulo || (tela.saudacao
        ? (nome ? `Olá, ${nome}!` : 'Olá!')
        : (faseCarregada ? `Fase ${faseCarregada}` : undefined));
    const origem = location.state?.origem;
    const retornoConfiguracoes = typeof origem === 'string' && origem.startsWith('/')
        && origem !== '/configuracoes' ? origem : '/';

    useEscalaTelaCheia(estruturaRef, conteudoRef);

    useEffect(() => {
        setInstrucoesAbertas(false);
    }, [caminho]);

    function abrirInstrucoes() {
        setInstrucoesAbertas(true);
        if (typeof onInstructions === 'function') onInstructions();
    }

    function voltar() {
        if (tela.retornar) {
            navigate(retornoConfiguracoes);
        } else if (caminho === '/jogo') {
            navigate(visitante ? '/' : '/niveis');
        } else if (tela.movimento) {
            navigate(usuario ? '/niveis' : '/');
        } else {
            navigate(tela.voltar || '/');
        }
    }

    async function sair() {
        if (saindo || typeof onEncerrarSessao !== 'function') return;

        setErroSaida('');
        setSaindo(true);

        try {
            await onEncerrarSessao();
            navigate('/', { replace: true });
        } catch {
            setErroSaida('Não conseguimos sair da sua conta. Tente novamente.');
        } finally {
            setSaindo(false);
        }
    }

    return (
        <div className={`estrutura ${temaClasse}`} ref={estruturaRef}>
            <div className="estruturaConteudo" ref={conteudoRef}>
                {!tela.movimento && <Logo tamanho="pequeno" />}

                <Painel>
                    <Cabecalho
                        showBack={Boolean(tela.voltar || tela.retornar || tela.movimento)}
                        showLogout={Boolean(tela.sair)}
                        showInstructions={Boolean(tela.instrucoes)}
                        showSettings={Boolean(tela.configuracoes)}
                        saudacao={saudacao}
                        onBack={voltar}
                        onLogout={usuario && !saindo && typeof onEncerrarSessao === 'function' ? sair : undefined}
                        onInstructions={tela.instrucoes ? abrirInstrucoes : undefined}
                        onSettings={() => navigate('/configuracoes', { state: { origem: caminho } })}
                    />

                    <div className="painelConteudo"> 
                        {erroSaida && <p role="alert">{erroSaida}</p>}
                        {children}
                    </div>
                </Painel>

                {tela.movimento && controlesMovimento && (
                    <div className="estruturaControles" aria-label="Controles de movimento">
                        {controlesMovimento}
                    </div>
                )}
            </div>
            <Instrucoes
                aberta={instrucoesAbertas}
                onFechar={() => setInstrucoesAbertas(false)}
            />
        </div>
    );
}

export default Estrutura;
