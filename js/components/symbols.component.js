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

import { SYMBOLS } from "../data/symbols.data.js";


/**
 * Symbol handler class responsible for initializing and managing general behavior related to
 *
 * @class SymbolsComponent
 * @typedef {SymbolsComponent}
 */
class SymbolsComponent {
    
    /**
     * Creates an instance of SymbolsComponent. Initialize elements and states.
     *
     * @constructor
     */
    constructor() {
        this.states = this.initializeStates(); // Inicializar estados internos
        this.elements = this.initializeElements(); // Inicializar elementos del DOM
    }
    
    /**
     * Initialize UI elements and styles
     */
    init() {
        const symbolContainer = document.createElement('div');
        symbolContainer.id = 'symbolContainer';
    
        // Crear contenedor de pestañas
        const tabBtnContainer = document.createElement('div');
        tabBtnContainer.className = 'symbol-tabs';
    
        // Añadir scroll horizontal por defecto
        tabBtnContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            tabBtnContainer.scrollTo({
                left: tabBtnContainer.scrollLeft + e.deltaY,
                behavior: 'smooth'
            }) 
        }, { passive: false });
    
        symbolContainer.appendChild(tabBtnContainer);
    
        let count = 0;
        Object.values(SYMBOLS).forEach(category => {
            // Crear boton de pestaña
            const symbolTabBtn = document.createElement('button');
            symbolTabBtn.className = `tab-btn symbol-tab-btn tabunselectable-item${count === 0 ? ' active' : ''}`;
            symbolTabBtn.title = category.title;
            symbolTabBtn.setAttribute('role', 'button');
            symbolTabBtn.setAttribute('aria-label', `Pesataña de símbolos ${category.title}`);
            symbolTabBtn.setAttribute('aria-pressed', 'false');
            symbolTabBtn.innerHTML = category.icon;
            symbolTabBtn.id = `${category.id}SymbolTabBtn`;
            
            if (count === 0) this.elements.symbolTabActive.button = symbolTabBtn; 
            symbolTabBtn.onclick = () => this.switchSymbolsTab(category.id);
    
            tabBtnContainer.appendChild(symbolTabBtn);
    
            // Crear grid y elementos
            const symbolGrid = document.createElement('div');
            symbolGrid.id = `${category.id}SymbolTabGrid`;
            symbolGrid.className = `symbol-grid${count === 0 ? ' active' : ''} scroll-item`;
    
            if (count === 0) this.elements.symbolTabActive.grid = symbolGrid;
    
            category.symbols.forEach(symbol => {
                const symbolItem = document.createElement('div');
                symbolItem.className = `symbol-item unselectable-item`;
                symbolItem.textContent = symbol;
                symbolItem.onclick = () => this.insertSymbol(symbol);
                symbolGrid.appendChild(symbolItem);
            });
    
            symbolContainer.appendChild(symbolGrid);
            count += 1;
        });

        this.elements.symbolPicker.appendChild(symbolContainer);
    
        const style = document.createElement('style');
        style.textContent = `
            /* Symbol picker placeholder */
            .symbol-picker {
                position: absolute;
                bottom: 0;
                left: 0;
                max-width: 394px;
                min-width: 187px !important;
                background: var(--glass-bg);
                backdrop-filter: var(--blur);
                box-shadow: var(--shadow-lg);
                border: 4px solid transparent;
                border-radius: 16px 16px 0 0;
                padding: 6px 5px 6px 5px;
                z-index: 1001;
                max-height: 0;
                overflow-y: hidden;
                pointer-events: none;
                opacity: 0;
                transition: max-height .3s, height .3s, opacity .2s;
            }
    
            .symbol-picker.active {
                pointer-events: auto;
                max-height: 200px;
                height: 200px;
                opacity: 1;
            }
    
            .symbol-tabs {
                display: flex;
                position: sticky;
                top: 0;
                left: 0;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                overflow-x: auto;
                border: 4px solid transparent;
                border-bottom: 0px;
                box-shadow: var(--shadow-sm);
                z-index: 999;
                
                &::-webkit-scrollbar { 
                    height: 8px; /* 3px scrollbar + 3px border-top + 2px border-bottom */
                }
    
                &::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.4);
                    border-top: 3px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 2px solid transparent;
                    border-left: 10px solid transparent;
                    background-clip: content-box;
                    min-width: 25px;
                }
                &::-webkit-scrollbar-thumb:hover {
                    background: var(--scrollbar-color-hover);
                    border-top: 3px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 2px solid transparent;
                    border-left: 10px solid transparent;
                    background-clip: content-box;
                    min-width: 25px;
                }
                &::-webkit-scrollbar-track {
                    background: var(--scrollbar-track-color);
                    border: 1px solid transparent;
                    background-clip: content-box;
                }
            }
    
            .symbol-tab-btn{
                padding: 6px;
                width: 29px;
                height: 29px;
                &:hover {
                    background-color: var(--glass-border);
                }
                &.active {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        
            .symbol-grid {
                display: grid;
                grid-template-columns: repeat(9, 1fr);
                gap: 8px;
                padding-top: 5px;
                margin-top: 3px;
                max-height: calc(200px - 70px);
                margin-bottom: 20px;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
                z-index: 1000;
                transition: all 0.3s ease;

                &:not(.active) {
                    max-height: 0;
                    opacity: 0;
                    pointer-events: none;
                    margin: 0;
                    padding: 0;
                }
            }
    
            .symbol-item {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                cursor: pointer;
                font-size: 17px;
                color: var(--text-terciary);
                transition: all 0.3s ease;
                &:active {
                    transform: scale(1) !important;
                }
                &:hover {
                    background: var(--glass-border);
                    transform: scale(1.2);
                }
            }
        `;
    
        document.head.appendChild(style);
    
    }

    
    /**
     * Inicialize component intern states
     *
     * @returns {{ textareaWithSymbolPicker: HTMLElement; symbolButtonDisabled: HTMLElement; }} 
     */
    initializeStates() {
        return {
            textareaWithSymbolPicker: null,
            symbolButtonDisabled: null,
            pickerOnProcess: false
        };
    }

    /**
     * Initialize references to DOM elements
     *
     * @returns {{ symbolPicker: HTMLElement; textInput: HTMLElement; symbolTabActive: { button: HTMLElement; grid: HTMLElement; }; }} 
     */
    initializeElements() {
        return {
            symbolPicker: document.getElementById('editorSymbolPicker'),
            textInput: document.getElementById('textInput'),
            symbolTabActive: {
                button: null,
                grid: null
            }
        };
    }
        
    /**
     * Switch tab of symbol picker
     *
     * @param {string} id - Name of tab (bio or posts)
     */
    switchSymbolsTab(id) {
        this.elements.symbolTabActive.button.classList.remove('active');
        this.elements.symbolTabActive.grid.classList.remove('active');
    
        const tabBtn = document.getElementById(`${id}SymbolTabBtn`);
        const tabGrid = document.getElementById(`${id}SymbolTabGrid`);
    
        tabBtn.classList.add('active');
        tabGrid.classList.add('active');
    
        this.elements.symbolTabActive.button = tabBtn;
        this.elements.symbolTabActive.grid = tabGrid;
    }
        
    /**
     * Show symbol picker on determinated place
     *
     * @param {string} place - Site from where the symbol picker was called. At the momment ['main']
     */
    showSymbolPicker(place) {
        this.states.pickerOnProcess = true;
        // Se implementó el sistema de lugares para facilitar futuras expansiones
        // Actualmente solo existe "main" (el único lugar donde está el botón)
        let PLACES = null;
    
        const updatePlaces = () => {
            PLACES = {
                main: {
                    left: Math.max(14.5, ((window.innerWidth - this.elements.textInput.offsetWidth) / 2) - 8), // En tamaños minimos solo ajustrar al padding
                    bottom: document.querySelector('.input-section').offsetHeight - 20,
                    textareaContainer: document.querySelector('.editor-textarea-container'),
                    textarea: document.querySelector('.editor-textarea-container textarea'),
                    button: document.getElementById('inputSymbolBtn')
                },
            }
        };
    
        const placeSymbolPicker = () => {
            this.elements.symbolPicker.style.left = `${PLACES[place].left}px`;
            this.elements.symbolPicker.style.bottom = `${PLACES[place].bottom}px`;
        };
        
        updatePlaces();
    
        if (PLACES[place].textareaContainer) {
            this.states.textareaWithSymbolPicker = PLACES[place].textareaContainer;
            PLACES[place].textareaContainer.classList.add('with-symbol-picker');
        }
    
        
        placeSymbolPicker();
        this.elements.symbolPicker.classList.add('active');
        //PLACES[place].textarea.focus();
        PLACES[place].button.disabled = true;
        this.states.symbolButtonDisabled = PLACES[place].button;
    
        const onResize = () => {
            updatePlaces();
            placeSymbolPicker();
        }
    
        window.removeEventListener('resize', onResize);
        window.addEventListener('resize', onResize);

        setTimeout(() => {
            this.states.pickerOnProcess = false;
        }, 300); // Duración de la transición CSS
    }
        
    /**
     * Insert symbol on main textArea (`#textInput`). More places will be added soon to complement the `showSymbolPicker()` function.
     *
     * @param {string} symbol 
     */
    insertSymbol(symbol) {
        const start = this.elements.textInput.selectionStart;
        const end = this.elements.textInput.selectionEnd;
        const text = this.elements.textInput.value;
    
        // Insertar el símbolo en la posición del cursor
        this.elements.textInput.value = text.substring(0, start) + symbol + text.substring(end);
    
        // Mantener el cursor después del símbolo insertado
        this.elements.textInput.selectionStart = this.elements.textInput.selectionEnd = start + symbol.length;
        this.elements.textInput.focus();
    
        window.updateOutput();
    }
    
    /**
     * Close symbol picker, restore textarea styles and enable symbol button
     */
    closeSymbolPicker() {
        if (this.states.pickerOnProcess) return; // Evitar cierres múltiples rápidos
        
        this.states.pickerOnProcess = true;

        this.elements.symbolPicker.classList.remove('active');
    
        if (this.states.textareaWithSymbolPicker !== null)
            this.states.textareaWithSymbolPicker.classList.remove('with-symbol-picker');
    
        if (this.states.symbolButtonDisabled !== null)
            this.states.symbolButtonDisabled.disabled = false;

        setTimeout(() => {
            this.states.pickerOnProcess = false;
        }, 300); // Duración de la transición CSS
    }
}

export default SymbolsComponent;