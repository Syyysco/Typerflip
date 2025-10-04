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

import { APP_CONFIG } from "../config/constants.js";

/**
 * System to handle debug events
 *
 * @class DebugSystem
 * @typedef {DebugSystem}
 */
class DebugSystem {
    
    /**
     * Creates an instance of DebugSystem.
     *
     * @constructor
     */
    constructor() {
        this.config = {
            enabled: APP_CONFIG.DEBUG.ENABLED,
            showTimestamp: APP_CONFIG.DEBUG.SHOW_TIMESTAMP,
            logToConsole: APP_CONFIG.DEBUG.LOG_TO_CONSOLE,
            showStackTrace: APP_CONFIG.DEBUG.SHOW_STACK_TRACE
        };
        
        this.logCount = 0;
        this.sessionId = this.generateSessionId();
    }

    
    /**
     * Generate session ID
     *
     * @returns {string} 
     */
    generateSessionId() {
        return Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    
    /**
     * Returns a configuration type-based
     *
     * @param {string} type - Console mode [error, warning ..]
     * @returns {object} - Config for a determinated type
     */
    getTypeConfig(type) {
        const configs = {
            error: {
                emoji: '🔴',
                color: '#ff4444',
                bgColor: '#2d1b1b',
                consoleMethod: 'error',
                label: 'ERROR'
            },
            warning: {
                emoji: '🟡',
                color: '#ffaa00',
                bgColor: '#2d2516',
                consoleMethod: 'warn',
                label: 'WARNING'
            },
            info: {
                emoji: '🔵',
                color: '#4488ff',
                bgColor: '#1b1f2d',
                consoleMethod: 'info',
                label: 'INFO'
            },
            success: {
                emoji: '🟢',
                color: '#44ff44',
                bgColor: '#1b2d1b',
                consoleMethod: 'log',
                label: 'SUCCESS'
            },
            debug: {
                emoji: '⚪',
                color: '#888888',
                bgColor: '#1f1f1f',
                consoleMethod: 'log',
                label: 'DEBUG'
            },
            trace: {
                emoji: '🟣',
                color: '#aa44ff',
                bgColor: '#231b2d',
                consoleMethod: 'log',
                label: 'TRACE'
            }
        };
        
        return configs[type.toLowerCase()] || configs.debug;
    }

    /**
     * Format current timestamp
     * 
     * @returns {string} - Log date
     */
    formatTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString() + '.' + now.getMilliseconds().toString().padStart(3, '0');
    }

    
    /**
     * Main log handler
     *
     * @param {string} type - Debug level
     * @param {string} ref - Reference
     * @param {string} message - Plain message
     * @param {...{}} additionalData - HTMLElement, Object, String, Bool ...
     */
    log(type, ref, message, ...additionalData) {
        if (!this.config.enabled) return;
        
        this.logCount++;
        const typeConfig = this.getTypeConfig(type);
        const timestamp = this.config.showTimestamp ? this.formatTimestamp() : null;
        const logId = `LOG-${this.logCount.toString().padStart(4, '0')}`;
        
        if (this.config.logToConsole) {
            this.logToConsole(typeConfig, ref, message, timestamp, logId, additionalData);
        }
    }

    
    /**
     * Log to console
     *
     * @param {*} typeConfig - Debug level
     * @param {*} ref - Reference
     * @param {*} message - Plain message
     * @param {*} timestamp - Date
     * @param {*} logId - Log ID
     * @param {*} additionalData - HTMLElement, Object, String, Bool ...
     */
    logToConsole(typeConfig, ref, message, timestamp, logId, additionalData) {
        const groupTitle = `${typeConfig.emoji} ${typeConfig.label} [${ref}] ${logId}`;
        
        console.group(groupTitle);
        
        if (timestamp) {
            console.log(`%c⏱ Timestamp: ${timestamp}`, 'color: #666; font-style: italic;');
        }
        
        console.log(`%c🖊 Reference: ${ref}`, 'color: #888; font-weight: bold;');
        console.log(`%cⓘ Message: ${message}`, `color: ${typeConfig.color}; font-weight: bold;`);
        
        if (additionalData.length > 0) {
            console.log(`%c🗒 Additional Data:`, 'color: #888;');
            additionalData.forEach((data, index) => {
                console.log(`   [${index}]:`, data);
            });
        }
        
        if (this.config.showStackTrace) {
            console.trace('Stack Trace');
        }
        
        console.groupEnd();
    }

    // Fast methods
    error(ref, message, ...data) {
        this.log('error', ref, message, ...data);
    }

    warning(ref, message, ...data) {
        this.log('warning', ref, message, ...data);
    }

    info(ref, message, ...data) {
        this.log('info', ref, message, ...data);
    }

    success(ref, message, ...data) {
        this.log('success', ref, message, ...data);
    }

    debug(ref, message, ...data) {
        this.log('debug', ref, message, ...data);
    }

    trace(ref, message, ...data) {
        this.log('trace', ref, message, ...data);
    }

    // Utils
    enable() {
        this.config.enabled = true;
    }

    disable() {
        this.config.enabled = false;
    }

    clear() {
        if (this.config.logToConsole) {
            console.clear();
        }

        this.logCount = 0;
    }

    getStats() {
        return {
            sessionId: this.sessionId,
            totalLogs: this.logCount,
            enabled: this.config.enabled,
            timestamp: new Date().toISOString()
        };
    }
}

// Crear instancia global
const debugSystem = new DebugSystem();


/**
 * Main funtion to debug
 *
 * @param {*} type - Debug level
 * @param {*} ref - Reference
 * @param {*} message - Plain message 
 * @param {...{}} data - HTMLElement, Object, String, Bool ...
 */
function debug(type, ref, message, ...data) {
    debugSystem.log(type, ref, message, ...data);
}

/*
// Usando la función global
debug('error', '001ac5', 'Database connection failed', { host: 'localhost', port: 5432 });
debug('warning', '002bd7', 'API rate limit approaching', { current: 95, limit: 100 });
debug('info', '003ce9', 'User authentication successful', { userId: 12345 });
debug('success', '004df1', 'File upload completed', { filename: 'document.pdf', size: '2.3MB' });

// Usando métodos específicos
debugSystem.error('005ef3', 'Validation failed for user input', { field: 'email', value: 'invalid-email' });
debugSystem.warning('006fg5', 'Memory usage high', { usage: '85%', threshold: '80%' });
debugSystem.info('007gh7', 'Cache refreshed successfully');
debugSystem.success('008hi9', 'Backup completed');

// Utilidades
console.log('Debug Stats:', debugSystem.getStats());
debugSystem.clear(); // Limpiar logs
debugSystem.disable(); // Desactivar debug
*/

export { DebugSystem, debugSystem, debug };