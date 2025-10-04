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

import EditorComponent from "./components/editor.component.js";
import TemplatesComponent from "./components/templates.component.js";
import SymbolsComponent from "./components/symbols.component.js";
import PlatformsComponent from "./components/platforms.component.js";
import notificationService from "./services/notification.service.js";
import { initializeDOMUI, exportText, copyToClipboard, toggleFastGuide } from "./utils/dom.utils.js";
import storageService from "./services/storage.service.js";
import { debug } from "./lib/debugSystem.js";
import { envData } from "./store/env.store.js";

/**
 * Main application class responsible for initializing and orchestrating all components
 * @class App
 */
class App {
    /**
     * Creates an instance of App and initializes all required components
     * @constructor
     */
    constructor() {
        this._initializeComponents();
        //this._setupComponentsDependencies();
    }

    /**
     * Initializes all application components with their required dependencies
     * @private
     */
    _initializeComponents() {
        this.platforms = new PlatformsComponent();
        this.templates = new TemplatesComponent();
        this.symbols = new SymbolsComponent();
        
        // El editor requiere otros componentes para la integración
        this.editor = new EditorComponent({
            components: {
                platformsComponent: this.platforms                
            },
            callbacks: {
                toggleTemplates: this.templates.toggleTemplates.bind(this.templates),
                showSymbolPicker: this.symbols.showSymbolPicker.bind(this.symbols),
                closeSymbolPicker: this.symbols.closeSymbolPicker.bind(this.symbols)
            }
        });
    }

    /**
     * Sets up inter-component dependencies and bindings
     * @private
     */
    /*_setupComponentDependencies() {
        // Las dependencias de los componentes se establecen mediante los parámetros del constructor.
        // Aquí se puede configurar la comunicación entre componentes si es necesario.
    }*/

    /**
     * Main initialization method that sets up the complete application
     * @async
     * @throws {Error} When initialization fails
     */
    async initialize() {
        try {
            await this._initializeUI();
            this._bindGlobalEvents();
            this._markAppAsReady();

        } catch (error) {
            debug('error', '000a3', 'Fallo al inicializar la aplicación', error);
            throw new Error('Inicialización de aplicación fallido');
        }
    }

    /**
     * Binds global event listeners for application-wide functionality
     * @private
     */
    async _bindGlobalEvents() {
        this._setupErrorHandling();
        this._setupScrollHandling();
        this._setupClickOutsideHandling();
        this._setupKeyboardShortcuts();
        this._bindUIElements()

        // Event delegation (en lugar de funciones globales) : próximamente
        //document.addEventListener('click', this.handleGlobalClick.bind(this));
        //window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Sets up global error handling to catch unhandled exceptions
     * @private
     */
    _setupErrorHandling() {
        window.addEventListener('error', (event) => {
            notificationService.showError('Ocurrió un error inesperado. Recarga la página si persiste.');
            debug('error', '000a1', 'Error global capturado', event.error);
        });
    }

    /**
     * Handles scroll position persistence to prevent layout issues
     * @private
     */
    _setupScrollHandling() {
        // Evita problemas de desplazamiento acumulativos al conservar la posición de desplazamiento => REF: 000s1
        window.addEventListener('scroll', () => {
            storageService.saveScrollPosition(window.scrollY);
        });
    }

    /**
     * Manages click-outside behavior for modal components
     * @private
     */
    _setupClickOutsideHandling() {
        document.addEventListener('click', (event) => {
            const isSymbolPickerClick = event.target.closest('.symbol-picker') || 
                                       event.target.closest('.symbol-btn') || 
                                       event.target.closest('#textInput');
            
            if (!isSymbolPickerClick) {
                this.symbols.closeSymbolPicker();
            }
        });
    }

    /**
     * Registers global keyboard shortcuts for enhanced user experience
     * @private
     */
    _setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            this._handleKeyboardShortcuts(event);
        });
    }

    /**
     * Processes keyboard shortcut events
     * @private
     * @param {KeyboardEvent} event - The keyboard event to process
     */
    _handleKeyboardShortcuts(event) {
        const { key, ctrlKey, metaKey } = event;
        
        // atajo Guardar/Exportar (Ctrl/Cmd + S)
        if ((ctrlKey || metaKey) && key === 's') {
            event.preventDefault();
            exportText('plain');
            return;
        }

        // Cerrar modales con la tecla `ESC`
        if (key === 'Escape') {
            this.symbols.closeSymbolPicker();
            this.templates.closeTemplates();
        }
    }

    /**
     * Binds UI elements to their corresponding event handlers
     * @private
     */
    _bindUIElements() {
        const elements = this._getUIElements();
        
        if (elements.exportTemplateBtn) {
            elements.exportTemplateBtn.onclick = () => exportText('plain');
        }
        
        if (elements.mainCopyBtn) {
            elements.mainCopyBtn.onclick = () => copyToClipboard();
        }
        
        if (elements.showGuideBtn) {
            elements.showGuideBtn.onclick = () => toggleFastGuide();
        }
    }

    /**
     * Retrieves required UI elements from the DOM
     * @private
     * @returns {Object} Object containing UI element references
     */
    _getUIElements() {
        return {
            exportTemplateBtn: document.getElementById('exportTemplateBtn'),
            mainCopyBtn: document.getElementById('mainCopyBtn'),
            showGuideBtn: document.getElementById('showGuideBtn')
        };
    }

    /**
     * Initializes all UI components in the correct order
     * @private
     * @async
     */
    async _initializeUI() {
        // Inicializar componentes en orden de dependencia
        this.editor.init();     // Actualizar salida y análisis inicialmente && cargar contenido guardado
        this.platforms.init();  // Inicializar elementos de la interfaz
        this.symbols.init();    // Iniciar selector de símbolos
        this.templates.init();  // Iniciar menú de plantillas
        
        // Aplicar efectos visuales y mejoras DOM
        initializeDOMUI();
    }

    /**
     * Marks the application as fully initialized and ready for user interaction
     * @private
     */
    _markAppAsReady() {
        // Un ligero retraso garantiza que se complete toda la inicialización
        setTimeout(() => {
            envData.appInitialized = true;
        }, 100);
    }

    /*handleGlobalClick(event) { // próximamente
        const action = event.target.dataset.action;
        if (action && this[action]) {
            this[action](event);
        }
    }*/

    /**
     * Static factory method to create and initialize the application
     * @static
     * @async
     * @throws {Error} When application creation or initialization fails
     */
    static async init() {
        try {
            const app = new App();
            await app.initialize();
            debug('info', '000a4', 'Aplicación inicializada exitosamente');
        } catch (error) {
            notificationService.showError('Error al cargar la aplicación');
            debug('error', '000a2', 'Error al inicial la aplicación', error);
            throw error;
        }
    }
}

/**
 * Application entry point - ensures DOM is ready before initialization
 */
(function initializeApplication() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', App.init);
    } else {
        App.init();
    }
})();