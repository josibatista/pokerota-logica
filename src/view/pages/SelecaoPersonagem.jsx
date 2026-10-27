import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const [personagemSelecionado, setPersonagemSelecionado] = useState(null);

    const location = useLocation();
    const navegar = useNavigate();

    const fase = location.state?.fase;

    function confirmarPersonagem() {
        if (!personagemSelecionado || !fase) return;

        navegar('/jogo', {
            state: {
                fase,
                personagemId: personagemSelecionado,
            },
        });
    }

    return (
        <main className="selecao-personagem">
            <section
                className="selecao-personagem__janela"
                aria-labelledby="titulo-personagens"
            >
                <h1 id="titulo-personagens">
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
                            selecionado={personagemSelecionado === personagem.id}
                            onSelecionar={setPersonagemSelecionado}
                        />
                    ))}
                </div>

                <button type="button" className="selecao-personagem__confirmar" disabled={!personagemSelecionado || !fase}  onClick={confirmarPersonagem}>
                    Selecionar
                </button>
            </section>
        </main>
    );
}

export default SelecaoPersonagem;