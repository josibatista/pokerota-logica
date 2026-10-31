import pikachuFinal from '../assets/pikachuFinal.png';
import './FinalizacaoFase.css';

const ESTRELAS = [
    { classe: 'finalizacao-fase__estrela--1' },
    { classe: 'finalizacao-fase__estrela--2' },
    { classe: 'finalizacao-fase__estrela--3' },
    { classe: 'finalizacao-fase__estrela--4' },
    { classe: 'finalizacao-fase__estrela--5' },
    { classe: 'finalizacao-fase__estrela--6' },
];

function Estrela({ classe }) {
    return (
        <svg
            className={`finalizacao-fase__estrela ${classe}`}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                fill="var(--pokerotaAmarelo)"
                d="M12 1.8 14.7 9h7.5l-6.1 4.4 2.3 7.2L12 16.2 5.6 20.6 7.9 13.4 1.8 9h7.5z"
            />
        </svg>
    );
}

function RetratoPersonagem({ personagemSelecionado }) {
    return (
        <div className="finalizacao-fase__cena">
            {ESTRELAS.map((estrela) => (
                <Estrela key={estrela.classe} classe={estrela.classe} />
            ))}
            <img
                className="finalizacao-fase__personagem"
                src={pikachuFinal}
                alt={personagemSelecionado || 'Pikachu'}
            />
        </div>
    );
}

function FinalizacaoFase({
    fase,
    personagemSelecionado,
    visitante,
    mostrarProxima,
    proximaDisponivel,
    onVoltar,
    onProxima,
    onVoltarLogin,
}) {
    return (
        <section className="finalizacao-fase" aria-label="Fase concluída">
            <p className="finalizacao-fase__mensagem">
                Parabéns, você concluiu a fase {fase}!
            </p>
            <RetratoPersonagem personagemSelecionado={personagemSelecionado} />
            <div className="acoes finalizacao-fase__acoes">
                {visitante ? (
                    <button
                        type="button"
                        className="botao botao--painel finalizacao-fase__botao"
                        onClick={onVoltarLogin}
                    >
                        Voltar ao login
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="botao botao--painel finalizacao-fase__botao"
                            onClick={onVoltar}
                        >
                            Voltar aos mapas
                        </button>
                        {mostrarProxima && (
                            <button
                                type="button"
                                className="botao botao--painel finalizacao-fase__botao"
                                disabled={!proximaDisponivel}
                                onClick={onProxima}
                            >
                                Próxima fase
                            </button>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default FinalizacaoFase;
