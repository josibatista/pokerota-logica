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
            setErroExclusao(erro?.code === 'auth/requires-recent-login'
                ? 'Para apagar sua conta, você precisa entrar de novo com o Google.'
                : 'Não conseguimos apagar sua conta. Tente de novo.');
        } finally {
            setAcao(null);
        }
    }

    return (
        <section className="gerenciamento-conta" aria-label="Gerenciamento da conta" aria-busy={ocupado}>
            <div className="gerenciamento-conta__acoes">
                <button type="button" className="gerenciamento-conta__botao gerenciamento-conta__botao--excluir" disabled={ocupado || !podeExcluir} onClick={abrirConfirmacao}>
                    Apagar minha conta
                </button>
                <button type="button" className="gerenciamento-conta__botao" disabled={ocupado || !podeSair} onClick={encerrarSessao}>
                    {acao === 'sair' ? 'Saindo…' : 'Sair da minha conta'}
                </button>
            </div>
            <p className="gerenciamento-conta__mensagem" role="status" aria-live="polite">
                {mensagem || (
                    carregandoSessao
                        ? 'Só um momento…'
                        : !usuario
                            ? 'Entre na sua conta para usar estes botões.'
                            : !podeSair || !podeExcluir
                                ? 'Alguns botões ainda não podem ser usados.'
                                : ''
                )}
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
