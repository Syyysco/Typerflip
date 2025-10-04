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

import { envData} from "../store/env.store.js";
import { adjustOutputHeight } from "../utils/dom.utils.js";


/**
 * General keyboard handler, to manage changes on visualViewport
 *
 * @class KeyboardHandler
 * @typedef {KeyboardHandler}
 */
class KeyboardHandler {
    /**
     * Creates an instance of KeyboardHandler. Initialize elements and states
     *
     * @constructor
     */
    constructor() {
        this.elements = this.initializeElements();
        this.state = this.initializeStates();
        
        // Configuración
        this.config = {
            keyboardDetectionDelay: 500, // Necesario para manejar la salida del teclado
            scrollBehavior: 'auto' // 'smooth' puede causar conflictos
        };
    }

    
    /**
     * Inicialize component intern states
     *
     * @returns {{ initialViewportHeight: number; isKeyboardVisible: boolean; savedScrollPosition: number; focusTimeout: number; isProcessingKeyboard: boolean; }} 
     */
    initializeStates() {
        return {
            initialViewportHeight: null,
            isKeyboardVisible: false,
            savedScrollPosition: null,
            focusTimeout: null,
            isProcessingKeyboard: null
        };
    }
    
    /**
     * Initialize references to DOM elements
     *
     * @returns {{ textInput: HTMLElement; containerSelector: HTMLElement; }} 
     */
    initializeElements() {
        return {
            textInput: document.getElementById('textInput'),
            containerSelector: document.querySelector('.container')
        };
    }
    
    /**
     * Initialize module
     */
    init() {
        this.saveInitialViewportHeight();
        this.bindEvents();
    }
    
    /**
     * Save viewport height if exists, else save `window.innerHeight`
     */
    saveInitialViewportHeight() {
        if (window.visualViewport) {
            this.state.initialViewportHeight = window.visualViewport.height;
        } else {
            this.state.initialViewportHeight = window.innerHeight;
        }
    }

    /**
     * Handles only the first touch event to be compatible with the touchend event
     */
    handleInputTouch() {
        // Guardar posición de scroll actual
        this.state.savedScrollPosition = window.scrollY;
    }
    
    /**
     * Handles the appearance of the keyboard when the input is focused
     * @param {Event} e - Focus event
     */
    handleInputFocus(e) {
        if (!envData.appInitialized) return;
        
        // Prevenir scroll automático del navegador
        this.preventBrowserAutoScroll(e.target);
        
        // Limpiar timeout anterior si existe
        if (this.state.focusTimeout) {
            clearTimeout(this.state.focusTimeout);
        }
        
        // Detectar teclado con delay optimizado
        this.state.focusTimeout = setTimeout(() => {
            this.detectAndHandleKeyboard();
        }, this.config.keyboardDetectionDelay);
    }
    
    /**
     * Prevent the automatic browser scroll
     * @param {HTMLElement} target - Event target element
     */
    preventBrowserAutoScroll(target) {
        // Configurar propiedades para prevenir scroll automático
        const scrollProps = ['scrollMarginTop', 'scrollMarginBottom', 'scrollPadding'];
        scrollProps.forEach(prop => {
            target.style[prop] = '0px';
        });
    }
    
    /**
     * Detects if the keyboard is visible and applies compensation
     */
    detectAndHandleKeyboard() {
        if (this.state.isProcessingKeyboard) return; // REF: 000ot1
        
        this.state.isProcessingKeyboard = true;
        
        const currentViewportHeight = this.getCurrentViewportHeight();
        const keyboardHeight = this.calculateKeyboardHeight(currentViewportHeight);
        
        if (keyboardHeight > 0) {
            this.showKeyboardCompensation(keyboardHeight);
        } else {
            this.hideKeyboardCompensation();
        }
        
        this.state.isProcessingKeyboard = false;
    }
    
    /**
     * Calculates the virtual keyboard height
     * @param {number} currentHeight - Current viewport height
     * @returns {number} Estimated keyboard height
     */
    calculateKeyboardHeight(currentHeight) {
        if (this.state.initialViewportHeight === null) {
            return 0;
        }
        return Math.max(0, this.state.initialViewportHeight - currentHeight);
    }
    
    /**
     * Get the current viewport height
     * @returns {number} Viewport height
     */
    getCurrentViewportHeight() {
        return window.visualViewport ? window.visualViewport.height : window.innerHeight;
    }

    /**
     * Restore the saved scroll position
     */
    restoreScrollPosition() {
        if (this.state.savedScrollPosition >= 0) {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: this.state.savedScrollPosition,
                    behavior: this.config.scrollBehavior
                });
            });
        }
    }
    
    /**
     * Applies offset when the keyboard is visible
     * @param {number} keyboardHeight - Keyboard height
     */
    showKeyboardCompensation(keyboardHeight) {
        if (this.state.isKeyboardVisible) return; // Ya está aplicado
        
        this.state.isKeyboardVisible = true;
        
        // Restaurar scroll antes de aplicar compensación
        this.restoreScrollPosition();


        // const containerStyles = window.getComputedStyle(this.elements.containerSelector);
        // const marginTopContainer = parseInt(containerStyles.marginTop);
        
        // Aplicar compensación
        if (this.elements.containerSelector) {
            this.elements.containerSelector.style.marginTop = `${keyboardHeight}px`;
            this.elements.containerSelector.style.transition = 'margin-top 0.2s ease';
        }

        // Ajustar altura del output considerando el margen superior del contenedor
        // adjustOutputHeight({ textInputHeight: this.elements.textInput.offsetHeight, marginTopContainer: marginTopContainer });
        adjustOutputHeight({ textInputHeight: this.elements.textInput.offsetHeight, marginTopContainer: 0 });
    }
    
    /**
     * Removes offset when keyboard is hidden
     */
    hideKeyboardCompensation() {
        if (!this.state.isKeyboardVisible) return; // Ya está quitado
        
        this.state.isKeyboardVisible = false;
        
        if (this.elements.containerSelector) {
            this.elements.containerSelector.style.marginTop = '';
            this.elements.containerSelector.style.transition = '';
        }

        setTimeout(() => {
            const containerStyles = window.getComputedStyle(this.elements.containerSelector);
            const marginTopContainer = parseInt(containerStyles.marginTop);

            adjustOutputHeight({ textInputHeight: this.elements.textInput.offsetHeight, marginTopContainer: marginTopContainer});
        }, 350);
    }
    
    /**
     * Handles the blur input events
     */
    handleInputBlur() {
        // Limpiar timeout si existe
        if (this.state.focusTimeout) {
            clearTimeout(this.state.focusTimeout);
            this.state.focusTimeout = null;
        }
        
        // Ocultar compensación después de un pequeño delay
        // para evitar parpadeos si el usuario vuelve a enfocar rápidamente
        setTimeout(() => {
            if (!this.elements.textInput.matches(':focus')) {
                this.hideKeyboardCompensation();
            }
        }, 100);
    }

    /**
     * Handle tocuhmove outside `.input-section` (provisional)
     * @param {Event} e - Event
     */
    handleClickOutside(e) {
        if (!e.target.closest('.input-section')) {
            this.elements.textInput.blur();
        }
    }
    
    /**
     * Hanlde changes on visual viewport
     */
    handleViewportResize() {
        if (!this.state.isKeyboardVisible) return;

        // El teclado se ocultó
        this.elements.textInput.blur();
        this.hideKeyboardCompensation();
    }
    
    /**
     * Intern Event Binding
     */
    bindEvents() {
        // Usar touchend y touchstart en lugar de focus para evitar que no se aplique el resize cuando el input ya tiene el foco
        this.elements.textInput.addEventListener('touchstart', (e) => { // focus no es efectivo en este caso
            this.handleInputTouch(e);
        }, { passive: true }); // Se añadió como passivo para más responsive

        this.elements.textInput.addEventListener('touchend', (e) => { // focus no es efectivo en este caso
            this.handleInputFocus(e);
        });
        
        this.elements.textInput.addEventListener('blur', () => {
            this.handleInputBlur();
        });
        
        // Visual Viewport API para detectar cambios de teclado
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                this.handleViewportResize();
            });
        } else {
            // Fallback para navegadores sin Visual Viewport API
            window.addEventListener('resize', () => {
                this.handleViewportResize();
            });
        }
        
        // Evitar deslizamiento de `.input-section` junto con el contenido
        // (provisional) REF: 000ax1
        document.addEventListener('touchmove', this.handleClickOutside.bind(this));
    }
    
    /**
     * Clean resources and event listeners
     */
    /*destroy() {
        if (this.state.focusTimeout) {
            clearTimeout(this.state.focusTimeout);
        }
        
        this.hideKeyboardCompensation();
        
        // En una implementación completa, aquí remover los event listeners
    }*/
}

export default new KeyboardHandler;