import './estrutura.css';

function Painel({ children, className = '' }) {
    const classes = ['painel', className].filter(Boolean).join(' ');

    return <section className={classes}>{children}</section>;
}

export default Painel;
