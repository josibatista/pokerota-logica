import './estrutura.css';

function Layout({ children, cabecalho = null, rodape = null, tema = 'claro', className = '' }) {
    const temaClasse = tema === 'escuro' ? 'temaEscuro' : 'temaClaro';
    const classes = ['layout', temaClasse, className].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            {cabecalho}
            <div className="layoutConteudo">{children}</div>
            {rodape ? <footer className="layoutRodape">{rodape}</footer> : null}
        </div>
    );
}

export default Layout;
