// Execute com o servidor em modo test na porta 5174. Saída padrão ignorada pelo Git.
import { chromium } from 'playwright';
import fs from 'node:fs';
const out = process.argv[2] || 'test-results/capturas-estilos';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
    executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
});
const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
    colorScheme: 'light',
});
page.on('requestfailed', (r) =>
    fs.appendFileSync(
        out + '/rede.log',
        r.url() + ' ' + r.failure()?.errorText + '\n',
    ),
);
page.on('pageerror', (e) =>
    fs.appendFileSync(out + '/erros.log', e.message + '\n'),
);
await page.route('**/src/services/progressoService*', (route) =>
    route.fulfill({
        contentType: 'application/javascript',
        body: `export async function carregarProgresso(){return {ultimoNivelConcluido:0}};export async function salvarProgresso(v){return {ultimoNivelConcluido:v}};export async function excluirProgresso(){}`,
    }),
);
const metrics = {};
async function shot(name) {
    await page.evaluate(async () => {
        await document.fonts.ready;
        const bg = getComputedStyle(
            document.querySelector('.estrutura'),
        ).backgroundImage;
        const match = bg.match(/url\("?([^")]+)"?\)/);
        if (match) {
            const img = new Image();
            img.src = match[1];
            await img.decode().catch(() => {});
        }
    });
    await page.screenshot({ path: out + '/' + name + '.png', fullPage: true, animations: 'disabled' });
    metrics[name] = await page.evaluate(() => ({
        viewport: [innerWidth, innerHeight],
        overflow: document.documentElement.scrollWidth > innerWidth,
        elements: [
            ...document.querySelectorAll(
                '.painel,.home__botao,.mapa-fase,.selecao-personagem__cartao,canvas,.botoes-direcionais,.finalizacao-fase__botao',
            ),
        ].map((e) => ({
            classe: e.className,
            width: e.getBoundingClientRect().width,
            height: e.getBoundingClientRect().height,
            x: e.getBoundingClientRect().x,
            y: e.getBoundingClientRect().y,
            color: getComputedStyle(e).color,
            background: getComputedStyle(e).backgroundColor,
        })),
    }));
}
async function views(name) {
    for (const [device, width, height] of [
        ['desktop', 1366, 900],
        ['tablet', 768, 1024],
        ['mobile', 390, 844],
        ['baixo', 844, 390],
    ]) {
        await page.setViewportSize({ width, height });
        for (const theme of ['Claro', 'Escuro']) {
            await page.locator('.estrutura').evaluate((e, t) => {
                e.classList.remove('temaClaro', 'temaEscuro');
                e.classList.add('tema' + t);
            }, theme);
            await shot(name + '-' + device + '-' + theme);
        }
    }
    await page.setViewportSize({ width: 1366, height: 900 });
}

for (const tela of [
    'home',
    'niveis',
    'personagens',
    'jogo',
    'conta',
    'final',
]) {
    await page.goto(
        (process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5174') +
            '/tests/fixtures/estilos.html?tela=' +
            tela,
    );
    await page.locator('.estrutura').waitFor();
    if (tela === 'niveis')
        await page
            .getByRole('button', { name: 'Fase 1, disponível', exact: true })
            .waitFor();
    if (tela === 'jogo') await page.locator('canvas').waitFor();
    await views(tela);
    if (tela === 'personagens') {
        await page.getByRole('button', { name: 'Eevee', exact: true }).click();
        await shot('personagem-selecionado');
    }
    if (tela === 'conta') {
        await page
            .getByRole('button', { name: 'Apagar minha conta', exact: true })
            .click();
        await views('exclusao');
    }
}
for (const fase of [2, 3, 4, 5]) {
    await page.goto(
        (process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5174') +
            '/tests/fixtures/estilos.html?tela=jogo&fase=' +
            fase,
    );
    await page.locator('canvas').waitFor();
    await shot('mapa-' + fase);
}
fs.writeFileSync(out + '/medidas.json', JSON.stringify(metrics, null, 2));
await browser.close();
