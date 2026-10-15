import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Cabecalho from './Cabecalho';
import Logo from './Logo';
import Painel from './Painel';
import './estrutura.css';

// A aparência do menu é definida aqui; as ações de conta vêm da integração.
const telas = {
    '/': { configuracoes: true },
    '/niveis': { saudacao: true, sair: true, instrucoes: true, configuracoes: true },
    '/personagem': { voltar: '/niveis', instrucoes: true, configuracoes: true },
    '/jogo': { movimento: true, instrucoes: true, configuracoes: true },
    '/configuracoes': { retornar: true },
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
    const location = useLocation();
    const navigate = useNavigate();
    const caminho = location.pathname.replace(/\/+$/, '') || '/';
    const tela = telas[caminho] || {};
    const temaClasse = tema === 'escuro' ? 'temaEscuro' : 'temaClaro';
    const nome = usuario?.nome?.trim();
    const saudacao = tela.saudacao ? (nome ? `Olá, ${nome}!` : 'Olá!') : undefined;
    const origem = location.state?.origem;
    const retornoConfiguracoes = typeof origem === 'string' && origem.startsWith('/')
        && origem !== '/configuracoes' ? origem : '/';

    function voltar() {
        if (tela.retornar) {
            navigate(retornoConfiguracoes);
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
        <div className={`estrutura ${temaClasse}`}>
            <div className="estruturaConteudo">
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
                        onInstructions={onInstructions}
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
        </div>
    );
}

export default Estrutura;
