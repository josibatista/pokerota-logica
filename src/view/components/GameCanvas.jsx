import { useEffect, useRef } from 'react';
import p5 from 'p5';

function GameCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            p.setup = () => {
                p.createCanvas(800, 500);
                p.background(240);
            };
        };

        const instance = new p5(sketch, canvasRef.current);

        return () => {
            instance.remove();
        };
    }, []);

    return <div ref={canvasRef}></div>;
}

export default GameCanvas;