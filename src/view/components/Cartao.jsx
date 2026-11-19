import { useEffect, useState } from 'react';
import { usePersonagem } from '../context/PersonagemContext';
import { carregarProgresso } from '../../controller/progressoController';
import Progresso from '../../model/progresso.js';
import './Cartao.css';

import bulbasaur from '../assets/personagens/bulbasaur.png';
import charmander from '../assets/personagens/charmander.png';
import squirtle from '../assets/personagens/squirtle.png';
import pikachu from '../assets/personagens/pikachu.png';
import eevee from '../assets/personagens/eevee.png';

// Os mesmos retratos usados na seleção de personagem.
const retratos = {
    bulbasaur: { nome: 'Bulbasaur', imagem: bulbasaur },
    charmander: { nome: 'Charmander', imagem: charmander },
    squirtle: { nome: 'Squirtle', imagem: squirtle },
    pikachu: { nome: 'Pikachu', imagem: pikachu },
    eevee: { nome: 'Eevee', imagem: eevee },
};

const FASES = [1, 2, 3, 4, 5];

function IconePokebola() {
    return (
        <svg viewBox="0 0 24 24" className="cartao-treinador__pokebola" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M2 12h7M15 12h7" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

function CartaoTreinador({ usuario = null, carregandoSessao = false }) {
    const { personagemSelecionado } = usePersonagem();
    const [progresso, setProgresso] = useState({ estado: 'carregando', concluidas: 0 });
    const uid = usuario?.uid ?? null;

    useEffect(() => {
        if (!uid) return undefined;

        // Evita atualizar o estado se a tela for fechada durante a consulta.
        let ativo = true;

        carregarProgresso().then((resultado) => {
            if (!ativo) return;

            if (!resultado.sucesso) {
                setProgresso({ estado: 'erro', concluidas: 0 });
                return;
            }

            const modelo = new Progresso(resultado.progresso);
            setProgresso({ estado: 'pronto', concluidas: modelo.ultimoNivelConcluido });
        });

        return () => {
            ativo = false;
        };
    }, [uid]);

    const retrato = retratos[personagemSelecionado] || null;
    const visitante = !carregandoSessao && !usuario;
    const nome = usuario?.nome?.trim() || usuario?.email || 'Jogador';

    let rotulo = 'Jogador';
    let titulo = nome;
    let detalhe = retrato ? `Parceiro: ${retrato.nome}` : 'Personagem não escolhido';

    if (carregandoSessao) {
        rotulo = 'Jogador';
        titulo = 'Carregando…';
        detalhe = '';
    } else if (visitante) {
        rotulo = 'Visitante';
        titulo = 'Você está sem conta';
        detalhe = 'Entre com o Google para salvar seu progresso.';
    }

    return (
        <section className="cartao-treinador" aria-label="Cartão do jogador">
            <div className="cartao-treinador__retrato">
                {retrato ? (
                    <img src={retrato.imagem} alt="" className="cartao-treinador__imagem" />
                ) : (
                    <IconePokebola />
                )}
            </div>

            <div className="cartao-treinador__identidade">
                <span className="cartao-treinador__rotulo">{rotulo}</span>
                <span className="cartao-treinador__nome">{titulo}</span>
                {detalhe ? <span className="cartao-treinador__detalhe">{detalhe}</span> : null}
            </div>

            {usuario ? (
                <div className="cartao-treinador__progresso">
                    <span className="cartao-treinador__progresso-titulo" aria-hidden="true">
                        Fases concluídas
                    </span>
                    {progresso.estado === 'erro' ? (
                        <span className="cartao-treinador__progresso-aviso" role="status">
                            Não foi possível carregar o progresso.
                        </span>
                    ) : (
                        <div
                            className="cartao-treinador__fases"
                            role="img"
                            aria-label={progresso.estado === 'pronto'
                                ? `${progresso.concluidas} de 5 fases concluídas`
                                : 'Carregando o progresso'}
                        >
                            {FASES.map((fase) => (
                                <span
                                    key={fase}
                                    className={`cartao-treinador__fase${
                                        progresso.estado === 'pronto' && fase <= progresso.concluidas
                                            ? ' cartao-treinador__fase--concluida'
                                            : ''
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </section>
    );
}

export default CartaoTreinador;
