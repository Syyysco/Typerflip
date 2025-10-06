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

import * as esbuild from 'esbuild';
import { config } from './js/build/config.js';
import { createTree } from './js/build/utils.js';
import { processAssets } from './js/build/assets.js';
import { processCSSFiles, processFontAwesome } from './js/build/css.js';
import { processHTML } from './js/build/html.js';
import { startServer } from './js/build/server.js';
import { cColors, cIcons, consoleLog } from './js/build/utils.js';

async function build() {
  consoleLog(null, `${cColors.cyan}●${cColors.reset} Building...`);

  try {
    createTree();

    consoleLog('process', 'Processing CSS...');
    await processCSSFiles();
    processFontAwesome('node_modules/@fortawesome/fontawesome-free');
    
    consoleLog('process', 'Processing JavaScript...');
    await esbuild.build({
      entryPoints: ['js/app.js'],
      bundle: true,
      minify: config.minify.js,
      outfile: 'dist/js/bundle.js',
      sourcemap: true
    });

    await processAssets();

    consoleLog('process', 'Processing HTML...');
    processHTML();

    consoleLog('success', 'Done');

    startServer();

  } catch (error) {
    consoleLog('error', 'Error on build:');
    consoleLog(null, `${cColors.magenta}${cIcons.ltTreeItem}${cColors.reset} ${error}`);
    process.exit(1);
  }
}

build();