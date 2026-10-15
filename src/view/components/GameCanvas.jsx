
import { useEffect, useRef } from 'react';
import p5 from 'p5';

function GameCanvas({ reinicio }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            p.setup = () => {
                p.createCanvas(800, 500);
            };

            p.draw = () => {
                p.background(240);
            };
        };

        const instance = new p5(sketch, canvasRef.current);

        return () => {
            instance.remove();
        };
    }, [reinicio]);

    return <div className="jogo__canvas-container" ref={canvasRef} />;
}

export default GameCanvas;
