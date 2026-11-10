
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePersonagem } from '../context/PersonagemContext';
import CartaoPersonagem from '../components/CartaoPersonagem';
import './SelecaoPersonagem.css';

import bulbasaur from '../assets/personagens/bulbasaur.png';
import charmander from '../assets/personagens/charmander.png';
import squirtle from '../assets/personagens/squirtle.png';
import pikachu from '../assets/personagens/pikachu.png';
import eevee from '../assets/personagens/eevee.png';

const personagens = [
    { id: 'bulbasaur', nome: 'Bulbasaur', imagem: bulbasaur },
    { id: 'charmander', nome: 'Charmander', imagem: charmander },
    { id: 'squirtle', nome: 'Squirtle', imagem: squirtle },
    { id: 'pikachu', nome: 'Pikachu', imagem: pikachu },
    { id: 'eevee', nome: 'Eevee', imagem: eevee },
];

function SelecaoPersonagem() {
    const { personagemSelecionado, setPersonagemSelecionado } = usePersonagem();
    const [escolha, setEscolha] = useState(personagemSelecionado);

    const location = useLocation();
    const navegar = useNavigate();
    const fase = location.state?.fase;

    function confirmarPersonagem() {
        if (!escolha || !fase) return;

        setPersonagemSelecionado(escolha);

        navegar('/jogo', {
            state: { fase },
        });
    }

    return (
        <main className="selecao selecao-personagem">
            <section
                className="selecao__janela selecao-personagem__janela"
                aria-labelledby="titulo-personagens"
            >
                <h1 className="titulo-pagina" id="titulo-personagens">
                    Seleção de personagem
                </h1>

                <p className="selecao-personagem__descricao">
                    Escolha quem vai acompanhar você durante o percurso!
                </p>

                <div className="selecao-personagem__lista">
                    {personagens.map((personagem) => (
                        <CartaoPersonagem
                            key={personagem.id}
                            personagem={personagem}
                            selecionado={escolha === personagem.id}
                            onSelecionar={setEscolha}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="botao botao--confirmar selecao-personagem__confirmar"
                    disabled={!escolha || !fase}
                    onClick={confirmarPersonagem}
                >
                    Selecionar
                </button>
            </section>
        </main>
    );
}

export default SelecaoPersonagem;
