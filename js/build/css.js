import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import cssnano from 'cssnano';
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { glob } from 'glob';
import { config } from './config.js';
import { consoleLog } from './utils.js';

export async function processCSSFiles() {
  try {
    // 1. Procesar archivos en orden específico
    const cssOrder = [
      // Base styles primero
      'css/base/*.css',
      // Componentes
      'css/components/*.css',
      // Layout
      'css/layout/*.css',
      // Utils
      'css/utils/*.css',
      // Responsive último
      'css/responsive/*.css'
    ];

    let concatenatedCSS = '';
    
    // Concatenar archivos en el orden definido
    for (const pattern of cssOrder) {
      const files = glob.sync(pattern);
      concatenatedCSS += files.map(file => {
        //console.log(`\t · Processing: ${file}`);
        return readFileSync(file, 'utf8');
      }).join('\n');
    }

    // Procesar con PostCSS
    const plugins = [autoprefixer];
    
    if (config.minify.css) {
      plugins.push(cssnano({
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true
        }]
      }));
    }

    const result = await postcss(plugins)
      .process(concatenatedCSS, { from: undefined });

    // Guardar resultado
    writeFileSync('dist/css/styles.min.css', result.css);
    //console.log('✅ CSS procesado y guardado en dist/css/styles.min.css');

  } catch (error) {
    consoleLog('error', 'Error processing CSS:');
    consoleLog(null, `${cColors.magenta}${cIcons.ltTreeItem}${cColors.reset} ${error}`);
    throw error;
  }
}

export function processFontAwesome() {
    // Copiar FontAwesome CSS y fuentes
    const fontAwesomePath = 'node_modules/@fortawesome/fontawesome-free';
    copyFileSync(
      `${fontAwesomePath}/css/all.min.css`, 
      'dist/css/fontawesome.min.css'
    );
    
    // Copiar fuentes FontAwesome
    ['fa-brands-400.woff2', 'fa-regular-400.woff2', 'fa-solid-900.woff2']
      .forEach(font => {
        copyFileSync(
          `${fontAwesomePath}/webfonts/${font}`,
          `dist/fonts/${font}`
        );
      });

    // Modificar las rutas en el CSS de FontAwesome
    const faCSS = readFileSync('dist/css/fontawesome.min.css', 'utf8');
    writeFileSync(
      'dist/css/fontawesome.min.css', 
      faCSS.replace(/\.\.\/webfonts\//g, '../fonts/')
    );
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