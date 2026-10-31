import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

// Métrica textual, não um diagnóstico automático de regras removíveis.
// Repetições = soma de (ocorrências - 1) de cada par propriedade/valor.
function medir(arquivos) {
    const ocorrencias = new Map();
    let linhas = 0;
    let declaracoes = 0;
    for (const texto of arquivos) {
        linhas += texto.trimEnd().split('\n').length;
        for (const match of texto.matchAll(/([\w-]+)\s*:\s*([^;{}]+);/g)) {
            const chave = `${match[1]}:${match[2]}`;
            ocorrencias.set(chave, (ocorrencias.get(chave) || 0) + 1);
            declaracoes++;
        }
    }
    return {
        arquivos: arquivos.length,
        linhas,
        declaracoes,
        repeticoes_exatas: [...ocorrencias.values()].reduce((soma, n) => soma + n - 1, 0),
    };
}

const base = process.argv[2] || 'main';
const nomesAnteriores = execFileSync('git', ['ls-tree', '-r', '--name-only', base, 'src'], { encoding: 'utf8' })
    .trim().split('\n').filter(nome => nome.endsWith('.css'));
const antes = nomesAnteriores.map(nome => execFileSync('git', ['show', `${base}:${nome}`], { encoding: 'utf8' }));
const atuais = readdirSync('src', { recursive: true })
    .filter(nome => nome.endsWith('.css'))
    .map(nome => readFileSync(path.join('src', nome), 'utf8'));
console.log(JSON.stringify({ base, antes: medir(antes), depois: medir(atuais) }, null, 2));
