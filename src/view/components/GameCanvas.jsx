
import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import p5 from 'p5';

function GameCanvas() {
    const canvasRef = useRef(null);
    const [reinicio, setReinicio] = useState(0);

    useEffect(() => {
        const sketch = (p) => {
            const tamanhoPersonagem = 30;
            const velocidade = 3;

            let personagemX = 50;
            let personagemY = 50;

            p.setup = () => {
                p.createCanvas(800, 500);
            };

            p.draw = () => {
                p.background(0);

                //teste de reinício de fase com personagem
                /*
                if (p.keyIsDown(p.LEFT_ARROW)) personagemX -= velocidade;
                if (p.keyIsDown(p.RIGHT_ARROW)) personagemX += velocidade;
                if (p.keyIsDown(p.UP_ARROW)) personagemY -= velocidade;
                if (p.keyIsDown(p.DOWN_ARROW)) personagemY += velocidade;

                personagemX = p.constrain(
                    personagemX,
                    tamanhoPersonagem / 2,
                    p.width - tamanhoPersonagem / 2
                );
                personagemY = p.constrain(
                    personagemY,
                    tamanhoPersonagem / 2,
                    p.height - tamanhoPersonagem / 2
                );

                p.fill(70, 130, 220);
                p.stroke(255);
                p.strokeWeight(2);
                p.circle(personagemX, personagemY, tamanhoPersonagem);

                p.fill(255);
                p.noStroke();
                p.circle(personagemX - 5, personagemY - 3, 6);
                p.circle(personagemX + 5, personagemY - 3, 6);

                */
            };
        };

        const instance = new p5(sketch, canvasRef.current);

        return () => instance.remove();
    }, [reinicio]);

    return (
        <div className="jogo__canvas-container">
            <div className="jogo__canvas-area" ref={canvasRef} />

            <button
                type="button"
                className="jogo__reiniciar"
                onClick={() => setReinicio((valor) => valor + 1)}
                aria-label="Reiniciar fase"
                title="Reiniciar fase"
            >
                <RotateCcw size={24} strokeWidth={3} />
            </button>
        </div>
    );
}

export default GameCanvas;
