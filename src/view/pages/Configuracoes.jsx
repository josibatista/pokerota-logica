import GerenciamentoConta from '../components/conta/GerenciamentoConta';

function Configuracoes({
    usuario,
    carregandoSessao,
    onEncerrarSessao,
    onExcluirConta,
}) {
    return (
        <main>
            <h1 className="titulo-pagina">Configurações</h1>

            <GerenciamentoConta
                usuario={usuario}
                carregandoSessao={carregandoSessao}
                onEncerrarSessao={onEncerrarSessao}
                onExcluirConta={onExcluirConta}
            />
        </main>
    );
}

export default Configuracoes;