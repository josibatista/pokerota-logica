
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
                        <div
                            className="selecao-personagem__cartao"
                            key={personagem.id}
                        >
                            <div className="selecao-personagem__imagem">
                                <img
                                    src={personagem.imagem}
                                    alt={personagem.nome}
                                />
                            </div>

                            <span className="selecao-personagem__nome">
                                {personagem.nome}
                            </span>
                        </div>
                    ))}
                </div>

                <button type="button" className="selecao-personagem__confirmar" disabled>
                    Selecionar
                </button>
            </section>
        </main>
    );
}

export default SelecaoPersonagem;