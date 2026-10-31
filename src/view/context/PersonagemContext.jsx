
import { createContext, useContext, useState } from 'react';

const PersonagemContext = createContext(null);

export function PersonagemProvider({ children }) {
    const [personagemSelecionado, setPersonagemSelecionado] = useState(null);

    return (
        <PersonagemContext.Provider
            value={{ personagemSelecionado, setPersonagemSelecionado }}
        >
            {children}
        </PersonagemContext.Provider>
    );
}

export function usePersonagem() {
    const contexto = useContext(PersonagemContext);

    if (!contexto) {
        throw new Error('usePersonagem deve ser usado dentro de PersonagemProvider');
    }

    return contexto;
}
