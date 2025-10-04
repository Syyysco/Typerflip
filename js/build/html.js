import { readFileSync, writeFileSync } from 'fs';

export function processHTML() {
    const html = readFileSync('index.html', 'utf8');
    const modifiedHtml = html
        .replace('/assets/fonts/FontAwesome7.0.0/css/all.min.css', '/css/fontawesome.min.css')
        .replace('/css/main.css', '/css/styles.min.css')
        .replace('/js/app.js', '/js/bundle.js');
    writeFileSync('dist/index.html', modifiedHtml);
}