import express from 'express';
import open from 'open';
import { config } from './config.js';
import { verifyBuild } from './verifyBuild.js';
import { cColors, cIcons, consoleLog } from './utils.js';

export function startServer() {
    if (!config.server.enabled) {
        consoleLog('error', `Server disabled in settings => ${cColors.magenta}config/build.config.json${cColors.reset}`);
        return;
    }

    if (!verifyBuild()) {
        consoleLog('error', 'Incomplete or outdated build');
        consoleLog(null, `${cColors.magenta}${cIcons.ltTreeItem}${cColors.reset} First run "npm run build"`);
        process.exit(1);
    }

    const app = express();

    // Middleware para verificar archivos críticos
    app.use((req, res, next) => {
        if (!verifyBuild()) {
            res.status(500).send('Error: Incomplete or outdated build');
            return;
        }
        next();
    });

    app.use(express.static('dist'));

    const port = config.server.port || 8080;


    const server = app.listen(port, async () => {
        consoleLog(null, `\n${cColors.blue}◉${cColors.reset} Server running at ${cColors.blue}http://localhost:${port}${cColors.reset}`);
        if (config.autoOpenBrowser) {
            try {
                // Dar tiempo al servidor para inicializarse completamente
                await new Promise(resolve => setTimeout(resolve, 1000));

                await open(`http://localhost:${port}`, {
                    wait: false,
                    url: true
                });
            } catch (error) {
                consoleLog('warning', 'The browser could not be opened automatically');
                consoleLog(null, `${cColors.yellow}${cIcons.ltTreeItem}${cColors.reset} Open manually: http://localhost:${port} (CTRL + CLICK on the link)`);
            }
            
        }
    });

    // Manejar cierre limpio
    process.on('SIGINT', () => {
        server.close(() => {
            consoleLog('info', 'Server stopped successfully');
            process.exit(0);
        });
    });
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