import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { config } from './config.js';
import { cColors, cIcons, consoleLog } from './utils.js';

export function verifyBuild() {
  try {
    const requiredFiles = config.files.requiredFiles || [];
    if (requiredFiles.length === 0) {
      consoleLog('warning', `There are no configured files to check in ${cColors.red}config/build.config.json${cColors.reset}`);
      return true; // No hay archivos que verificar
    };

    // Verificar existencia y validez de archivos
    for (const file of requiredFiles) {
      const path = join(process.cwd(), file);
      
      if (!existsSync(path)) {
        consoleLog('error', `Error: "${file}" does not exist`);
        return false;
      }

      // Verificar que los archivos no estén vacíos
      const stats = statSync(path);
      if (!stats.isDirectory() && stats.size === 0) {
        consoleLog('error', `Error: "${file}" is empty`);
        return false;
      }
    }

    // Verificar última modificación
    const buildTime = statSync('dist').mtime;
    const sourceTime = Math.max(
      ...['css', 'js', 'assets'].map(dir => 
        statSync(dir).mtime.getTime()
      )
    );

    if (buildTime.getTime() < sourceTime) {
      consoleLog('warning', 'The build might be outdated. Please run "npm run build" again.');
      return false;
    }

    return true;
  } catch (error) {
    consoleLog('error', 'Error verifying build:');
    consoleLog(`null, ${cColors.magenta}${cIcons.ltTreeItem}${cColors.reset} ${error}`);
    return false;
  }
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