import logo from '../assets/logo.png';
import './estrutura.css';

const tamanhos = {
    pequeno: 'logoJogoPequeno',
    medio: 'logoJogoMedio',
    grande: 'logoJogoGrande',
};

function Logo({ tamanho = 'medio', className = '' }) {
    const classeTamanho = tamanhos[tamanho] || tamanhos.medio;
    const classes = ['logoJogo', classeTamanho, className].filter(Boolean).join(' ');

    return <img className={classes} src={logo} alt="PokéRota Lógica" />;
}

export default Logo;
