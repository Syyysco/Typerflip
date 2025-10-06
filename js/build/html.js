import { readFileSync, writeFileSync } from 'fs';

export function processHTML() {
    const html = readFileSync('index.html', 'utf8');
    const modifiedHtml = html
        .replace('/assets/fonts/FontAwesome7.0.0/css/all.min.css', '/css/fontawesome.min.css')
        .replace('/css/main.css', '/css/styles.min.css')
        .replace('/js/app.js', '/js/bundle.js');
    writeFileSync('dist/index.html', modifiedHtml);
}

/**
 * © 2025 Typerflip. All rights reserved.
 * 
 * This software is provided under a proprietary license.
 * You may use this software for personal and educational purposes only.
 * Commercial use, modification, and redistribution are strictly prohibited
 * without explicit written permission.
 * 
 * For licensing inquiries: syscodev@proton.me
 * License violations will be prosecuted to the full extent of the law.
 * 
 * AUTHOR: Jose Fco. López (aka Sysco)
 *      Github:     [ https://github.com/Syyysco ] @Syyysco
 *      Portfolio:  [ https://syyysco.github.io ]
 * 
 * APP: Typerflip - Social editor:
 *      Repo:       [ https://github.com/Syyysco/Typerflip ]
 *      Web:        [ https://Syyysco.github.io/Typerflip ]
 * 
 */