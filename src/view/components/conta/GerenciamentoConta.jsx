import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmacaoExclusao from './ConfirmacaoExclusao';
import './GerenciamentoConta.css';

function GerenciamentoConta({ usuario = null, carregandoSessao = false, onEncerrarSessao, onExcluirConta }) {
    const navigate = useNavigate();
    const [acao, setAcao] = useState(null);
    const [etapa, setEtapa] = useState(1);
    const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erroExclusao, setErroExclusao] = useState('');
    const ocupado = carregandoSessao || acao !== null;
    const podeSair = Boolean(usuario) && typeof onEncerrarSessao === 'function';
    const podeExcluir = Boolean(usuario) && typeof onExcluirConta === 'function';
    const aviso = mensagem
        || (carregandoSessao
            ? 'Só um momento…'
            : !usuario
                ? 'Entre na sua conta para usar estes botões.'
                : (!podeSair || !podeExcluir)
                    ? 'Alguns botões ainda não podem ser usados.'
                    : '');

    async function encerrarSessao() {
        if (ocupado || !podeSair) return;
        setMensagem('');
        setAcao('sair');
        try {
            await onEncerrarSessao();
            navigate('/', { replace: true });
        } catch {
            setMensagem('Não conseguimos sair da sua conta. Tente de novo.');
        } finally {
            setAcao(null);
        }
    }

    function abrirConfirmacao() {
        if (ocupado || !podeExcluir) return;
        setMensagem('');
        setErroExclusao('');
        setEtapa(1);
        setConfirmacaoAberta(true);
    }

    function cancelar() {
        if (ocupado) return;
        setConfirmacaoAberta(false);
        setEtapa(1);
        setErroExclusao('');
    }

    async function excluirConta() {
        if (ocupado || !podeExcluir || !confirmacaoAberta || etapa !== 2) return;
        setErroExclusao('');
        setAcao('excluir');
        try {
            await onExcluirConta({
                primeiraConfirmacao: true,
                segundaConfirmacao: true,
            });
            setConfirmacaoAberta(false);
            navigate('/', { replace: true });
        } catch (erro) {
            const codigo = erro?.code;
            const detalheObrigatorio = codigo === 'conta/exclusao-parcial'
                || (typeof codigo === 'string' && codigo.startsWith('progresso/'));

            if (codigo === 'auth/requires-recent-login') {
                setErroExclusao('Para apagar sua conta, você precisa entrar de novo com o Google.');
            } else if (detalheObrigatorio) {
                setErroExclusao(erro.message || 'Não conseguimos apagar sua conta. Tente de novo.');
            } else {
                setErroExclusao('Não conseguimos apagar sua conta. Tente de novo.');
            }
        } finally {
            setAcao(null);
        }
    }

    return (
        <section className="gerenciamento-conta" aria-labelledby="titulo-conta" aria-busy={ocupado}>
            <h2 id="titulo-conta" className="gerenciamento-conta__titulo">Conta</h2>
            <div className="gerenciamento-conta__linha">
                <div className="gerenciamento-conta__texto">
                    <span className="gerenciamento-conta__rotulo">Sair da minha conta</span>
                    <span className="gerenciamento-conta__descricao">Seu progresso fica salvo para quando você voltar.</span>
                </div>
                <button type="button" className="botao botao--secundario gerenciamento-conta__botao" disabled={ocupado || !podeSair} aria-describedby={aviso ? 'gerenciamento-conta-aviso' : undefined} onClick={encerrarSessao}>
                    {acao === 'sair' ? 'Saindo…' : 'Sair da minha conta'}
                </button>
            </div>
            <div className="gerenciamento-conta__linha gerenciamento-conta__linha--perigo">
                <div className="gerenciamento-conta__texto">
                    <span className="gerenciamento-conta__rotulo gerenciamento-conta__rotulo--perigo">Apagar minha conta</span>
                    <span id="conta-apagar-descricao" className="gerenciamento-conta__descricao">Remove sua conta e todo o progresso. Não dá para desfazer.</span>
                </div>
                <button type="button" className="botao botao--secundario botao--perigo-contorno gerenciamento-conta__botao" disabled={ocupado || !podeExcluir} aria-describedby={aviso ? 'conta-apagar-descricao gerenciamento-conta-aviso' : 'conta-apagar-descricao'} onClick={abrirConfirmacao}>
                    Apagar minha conta
                </button>
            </div>
            <p id="gerenciamento-conta-aviso" className="gerenciamento-conta__mensagem" role="status" aria-live="polite">
                {aviso}
            </p>
            <ConfirmacaoExclusao
                aberta={confirmacaoAberta && Boolean(usuario)}
                etapa={etapa}
                ocupada={ocupado}
                mensagem={erroExclusao}
                onCancelar={cancelar}
                onAvancar={() => { if (!ocupado) setEtapa(2); }}
                onConfirmar={excluirConta}
            />
        </section>
    );
}

export default GerenciamentoConta;
