import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Navigate, useNavigate } from 'react-router-dom';
import pikachu from '../assets/pikachu.png';
import './Home.css';

function Home({ usuario = null, carregandoSessao = false, onEntrarComGoogle }) {
    const navigate = useNavigate();
    const [entrando, setEntrando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const acessoDisponivel = typeof onEntrarComGoogle === 'function';
    const ocupado = carregandoSessao || entrando;

    async function entrar() {
        if (ocupado || !acessoDisponivel) return;
        setMensagem('');
        setEntrando(true);

        try {
            await onEntrarComGoogle();
            navigate('/niveis', { replace: true });
        } catch (erro) {
            const codigo = erro?.code;
            if (codigo === 'auth/popup-closed-by-user' || codigo === 'auth/cancelled-popup-request') {
                setMensagem('Você cancelou a entrada. Pode tentar de novo quando quiser.');
            } else if (codigo === 'auth/popup-blocked') {
                setMensagem('A janela do Google foi bloqueada. Peça ajuda a um adulto para abrir.');
            } else {
                setMensagem('Não conseguimos entrar agora. Espere um pouco e tente de novo.');
            }
        } finally {
            setEntrando(false);
        }
    }

    if (usuario && !carregandoSessao) {
        return <Navigate to="/niveis" replace />;
    }

    return (
        <main className="home">
            <section className="home__janela" aria-label="Boas-vindas ao PokéRota Lógica">
                <div className="home__apresentacao">
                    <div className="home__conteudo">
                        <p className="home__descricao">
                            <b>PokéRota Lógica</b> é um jogo inspirado no universo Pokémon, aqui você pode 
                            andar por mapas guiando seu personagem até o destino e
                            descobrir novas fases usando a lógica de movimentação!
                        </p>
                    </div>
                    <button
                        type="button"
                        className="botao botao--primario home__botao"
                        disabled={ocupado}
                        onClick={() => navigate('/jogo', { state: { visitante: true } })}
                    >
                        Experimente
                    </button>
                    <p className="home__observacao">Experimente o jogo sem entrar em uma conta.</p>
                </div>

                <div className="home__acesso" aria-busy={ocupado}>
                    <div className="home__conteudo">
                        <img className="home__pikachu" src={pikachu} alt="Pikachu" height="100" />
                        <h2 className="home__titulo">Entre para começar sua aventura!</h2>
                    </div>
                    <button
                        type="button"
                        className="botao botao--google home__botao"
                        onClick={entrar}
                        disabled={ocupado || !acessoDisponivel}
                        aria-describedby="home-status"
                    >
                        <FcGoogle className="home__icone-google" aria-hidden="true" />
                        <span>
                            {carregandoSessao ? 'Só um momento…' : entrando ? 'Entrando…' : 'Entrar com Google'}
                        </span>
                    </button>
                    <p id="home-status" className="home__mensagem" role="status" aria-live="polite">
                        {mensagem || (!acessoDisponivel ? 'Ainda não é possível entrar com o Google.' : '')}
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Home;
