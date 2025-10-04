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
 * Debounce utility for optimization.
 * 
 * @export
 * @param {void} func - function to execute
 * @param {number} [wait=APP_CONFIG.PERFORMANCE.DEBOUNCE_DELAY] - time to execute
 * @returns {(...args: {}) => void} - execution
 */
export function debounce(func, wait = APP_CONFIG.PERFORMANCE.DEBOUNCE_DELAY) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format elapsed time to return human readable string (1 min, 2 days ...)
 *
 * @export
 * @param {number} timestamp - raw timestamp
 * @returns {string} - formated timestamt
 */
export function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(parseInt(timestamp));
    const diffMs = now - past;

    if (diffMs < 0) return 'ahora';

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    // Priorizar la unidad más significativa y agregar una secundaria si es relevante
    if (years > 0) {
        return `${years} año${years > 1 ? 's' : ''}`;
    }

    if (days > 0) {
        return `${days} día${days > 1 ? 's' : ''}`;
    }

    if (hours > 0) {
        return `${hours} hora${hours > 1 ? 's' : ''}`;
    }

    if (minutes > 0) {
        return `${minutes} min`;
    }

    return `${seconds} seg`;
}

/**
 * Get reading time based on a text lenght
 *
 * @export
 * @param {string} text 
 * @returns {string} - Reading time (example: 20 min)
 */
export function getReadingTime(text) {
    const wordsPerMinute = APP_CONFIG.EDITOR.READING_SPEED;
    const words = text.trim().split(/\s+/).length;
    const totalMinutes = words / wordsPerMinute;
    
    // Calcular minutos y segundos
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    
    // Si es menos de 1 minuto, mostrar solo segundos
    if (minutes < 1) {
        return `${Math.max(0, seconds)}s`; // Mínimo 1 segundo
    }
    
    // Si es 60 minutos o más, mostrar solo minutos (sin segundos)
    if (minutes >= 60) {
        return `${minutes}m`;
    }
    
    // Entre 1 y 59 minutos
    if (seconds > 0) {
        return `${minutes}m ${seconds}s`;
    }
    
    return `${minutes}m`;
}


/**
 * Set body overflowY (enabled or disabled)
 *
 * @export
 * @param {boolean} enabled - New state
 */
export function setBodyScroll(enabled) {
    document.body.classList.toggle('menu-open', !enabled);
}