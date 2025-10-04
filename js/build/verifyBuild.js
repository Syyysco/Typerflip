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