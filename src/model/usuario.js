class Usuario {
    constructor({ uid, nome = null, email = null, provedor = null }) {
        this.uid = uid;
        this.nome = nome;
        this.email = email;
        this.provedor = provedor;
    }

    static converterUsuario(usuarioFirebase) {
        if (!usuarioFirebase) {
            return null;
        }

        const provedores = Array.isArray(usuarioFirebase.providerData)
            ? usuarioFirebase.providerData
            : [];

        const dadosGoogle = provedores.find(
            (item) => item.providerId === 'google.com'
        );

        return new Usuario({
            uid: usuarioFirebase.uid,
            nome: usuarioFirebase.displayName || null,
            email: usuarioFirebase.email || null,
            provedor:
                dadosGoogle?.providerId ||
                provedores[0]?.providerId ||
                null,
        });
    }
}

export default Usuario;