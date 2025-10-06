import { mkdirSync } from 'fs';

export function createTree() {
  const dirs = [ 'dist/css', 'dist/js', 'dist/fonts', 'dist/assets' ];
  dirs.forEach(dir => {
    mkdirSync(dir, { recursive: true});
  })
}

export const cColors = {
  reset: "\x1b[0m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m"
}

export const cIcons = {
  info: `${cColors.cyan}i${cColors.reset}`,
  process: `${cColors.cyan}▢${cColors.reset}`,
  success: `${cColors.green}✓${cColors.reset}`,
  error: `${cColors.magenta}✕${cColors.reset}`,
  warning: `${cColors.yellow}!!${cColors.reset}`,
  ltTreeItem: `└──`,
  mdTreeIemp: `├──`
}


/**
 * Log message to console with color and icon based on type
 *
 * @export
 * @param {string} type - type of log: 'info', 'success', 'error', 'warning'
 * @param {string} message - text to log
 */
export function consoleLog(type, message) {
  const consoleCalls = {
    info: () => console.info(`${cIcons.info} ${message}`),
    process: () => console.info(`${cIcons.process} ${message}`),
    success: () => console.log(`${cIcons.success} ${message}`),
    error: () => console.error(`\n${cIcons.error} ${message}`),
    warning: () => console.warn(`${cIcons.warning} ${message}`)
  };

  if (consoleCalls[type]) {
    consoleCalls[type]();
  } else {
    console.log(message);
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