import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import { copyFileSync, mkdirSync } from 'fs';
import { glob } from 'glob';
import { dirname, join } from 'path';
import { config } from './config.js';
import { consoleLog } from './utils.js';

export async function processAssets() {
  try {
    // Verificar todos los archivos en assets
    const allFiles = glob.sync('assets/**/*.*');

    // Filtrar archivos ignorados
    const filteredFiles = allFiles.filter(file => {
      return !config.files.ignoreAssetsPaths.some(ignorePath => 
        file.startsWith(ignorePath)
      );
    });

    const imageFiles = filteredFiles.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const otherFiles = filteredFiles.filter(file => !/\.(jpg|jpeg|png|gif)$/i.test(file));
    
    if (filteredFiles.length === 0) {
      consoleLog('warning', 'Aassets not found or all files are ignored.');
      return;
    }

    // Procesar imágenes optimizables
    if (imageFiles.length > 0 && config.minify.images) {
      consoleLog('process', 'Processing images...');
      const files = await imagemin(imageFiles, {
        destination: 'dist/assets',
        plugins: [
          imageminMozjpeg({ quality: 75 }),
          imageminPngquant({ 
            quality: [0.6, 0.8],
            strip: true
          })
        ]
      });
      //console.log(`✓ Se optimizaron ${files.length} imágenes`);
    }

    // Copiar archivos no optimizables y/o imágenes si minify.images = false
    const filesToCopy = config.minify.images ? otherFiles : filteredFiles;
    
    if (filesToCopy.length > 0) {
      consoleLog('process', 'Copying additional files...');
      filesToCopy.forEach(file => {
        // Mantener estructura de directorios
        const relativePath = file.replace('assets/', '');
        const destPath = join('dist/assets', relativePath);
        
        // Crear subdirectorios
        mkdirSync(dirname(destPath), { recursive: true });
        
        // Copiar archivo
        copyFileSync(file, destPath);
      });
      
      //console.log(`✓ Se copiaron ${filesToCopy.length} archivos adicionales`);
    }

  } catch (error) {
    consoleLog('error', 'Error processing files:');
    consoleLog(null, `${cColors.magenta}${cIcons.ltTreeItem}${cColors.reset} ${error}`);
    throw error;
  }
}