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

import { APP_CONFIG } from '../config/constants.js';
import { debounce } from '../utils/common.utils.js';
import { debug } from '../lib/debugSystem.js';
import notificationService from './notification.service.js';


/**
 * Storage service hanlder, manage all storage flow
 *
 * @class StorageService
 * @typedef {StorageService}
 */
class StorageService {
    /**
     * Creates an instance of StorageService and initialize references to DOM elements.
     *
     * @constructor
     */
    constructor() {
        this.elements = this.initializeElements();
    }

    
    /**
     * Initialize references to DOM elements
     *
     * @returns {{ textInput: HTMLElement; }} 
     */
    initializeElements() {
        return {
            textInput: document.getElementById('textInput')
        };
    }

    
    /**
     * Gets the `#textInput` saved content on localStorage
     *
     * @returns {string} 
     */
    getContent() {
        return localStorage.getItem(APP_CONFIG.STORAGE.CONTENT_KEY) || '';
    }

    
    /**
     * Gets the date of last save
     *
     * @returns {string} 
     */
    getLastSaveTimestamp() {
        return localStorage.getItem(APP_CONFIG.STORAGE.LAST_SAVE_TIMESTAMP_KEY) || null;
    }

    
    /**
     * Save `#textInput` content on localStorage
     *
     * @type {void} - **debounced**
     */
    saveContent = debounce(() => {
        const content = this.elements.textInput.value;
        try {
            localStorage.setItem(APP_CONFIG.STORAGE.CONTENT_KEY, content);
            localStorage.setItem(APP_CONFIG.STORAGE.LAST_SAVE_TIMESTAMP_KEY, Date.now().toString());
            if (content.length > 10) {
                window.showSaveIndicator();
            }
        } catch (error) {
            notificationService.showError('Error al guardar el contenido');
            debug('error', '000c1', 'Error al guardar el contenido', error);
        }
    });

    
    /**
     * Gets the saved custom templates on localStorage
     *
     * @returns {object} saved templates
     */
    getCustomTemplates() {
        const templates = localStorage.getItem(APP_CONFIG.STORAGE.CUSTOM_TEMPLATES_KEY);
        return templates ? JSON.parse(templates) : {posts: {}, bio: {}};
    }

    
    /**
     * Save custom templates updated on localStorage
     *
     * @param {object} templates 
     */
    saveCustomTemplates(templates) {
        localStorage.setItem(APP_CONFIG.STORAGE.CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    }

    
    /**
     * Save the scroll position on the page
     *
     * @param {number} scrollTop 
     */
    saveScrollPosition(scrollTop) {
        localStorage.setItem(APP_CONFIG.STORAGE.SCROLL_PAGE_KEY, scrollTop);
    }

    
    /**
     * Get the saved scroll position
     *
     * @returns {number} scrollTop
     */
    getScrollPosition() {
        return localStorage.getItem(APP_CONFIG.STORAGE.SCROLL_PAGE_KEY) || 0;
    }
}

export default new StorageService();