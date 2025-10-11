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

import { debug } from '../lib/debugSystem.js';
import { debounce, getReadingTime, formatTimeAgo } from '../utils/common.utils.js';
import { formatText } from '../utils/formatter.utils.js';
import { adjustOutputHeight, setupMargins } from '../utils/dom.utils.js';
import storageService from '../services/storage.service.js';
import notificationService from '../services/notification.service.js';
import keyboardHandler from '../lib/keyboardHandler.js';
import { APP_CONFIG } from '../config/constants.js';


/**
 * Text editor class responsible for initializing and managing general behavior related to
 * 
 * @class EditorComponent
 * @typedef {EditorComponent}
 */
class EditorComponent {
    
    /**
     * Creates an instance of EditorComponent. Initialize elements and states.
     *
     * @constructor
     * @param {{ components: Object; callbacks: Object; }} param0 - {components, callbacks}
     * @param {*} param0.components - Necessary classes
     * @param {*} param0.callbacks - Necessary functions
     */
    constructor({ components, callbacks }) {
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        
        this.platforms = components.platformsComponent;
        this.showSymbolPicker = callbacks.showSymbolPicker;
        this.closeSymbolPicker = callbacks.closeSymbolPicker;
        this.toggleTemplates = callbacks.toggleTemplates;
    }

    
    /**
     * Initialize references to DOM elements
     *
     * @returns {{ textInput: HTMLElement; output: HTMLElement; symbolBtn: HTMLElement; templatesBtn: HTMLElement; charCounter: HTMLElement; saveIndicator: HTMLElement; expandBtn: HTMLElement; }} 
     */
    initializeElements() {
        return {
            inputSection: document.querySelector('.input-section'),
            textInput: document.getElementById('textInput'),
            output: document.getElementById('output'),
            symbolBtn: document.getElementById('inputSymbolBtn'),
            templatesBtn: document.getElementById('inputTemplatesBtn'),
            charCounter: document.getElementById('editorCharCounter'),
            saveIndicator: document.getElementById('saveIndicator'),
            expandBtn: document.getElementById('editorExpandBtn'),
        };
    }
    
    /**
     * Inicialize component intern states
     *
     * @returns {{ isExpanded: boolean; saveIndicatorTimeout: Number; }} 
     */
    initializeState() {
        return {
            isExpanded: false,
            saveIndicatorTimeout: null,
            selectionStart: 0,
            selectionEnd: 0

        };
    }

    /**
     * Main function to intialize and configure this module
     */
    init() {
        this.loadContent();         // Cargar contenido guardado
        this.handleTextareaInput(); // Actualizar salida y análisis
        keyboardHandler.init();     // Inicializar manejador de teclado
        
        // Exponer para uso externo
        window.updateOutput = this.updateOutput.bind(this);           
        window.showSaveIndicator = this.showSaveIndicator.bind(this);
        window.updateCharCounter = this.updateCharCounter.bind(this);
        window.closeSymbolPicker = this.closeSymbolPicker.bind(this);
        
        this.bindEvents();          // Enlazar eventos
    }
    
    /**
     * Load saved content if exists and insert on text input
     */
    loadContent() {       
        try {
            const savedContent = storageService.getContent();
            const savedTimestamp = storageService.getLastSaveTimestamp();

            if (savedContent && savedContent.trim()) {
                this.elements.textInput.value = savedContent;

                if (savedTimestamp) {
                    const timeAgo = formatTimeAgo(savedTimestamp);
                    setTimeout(() => {
                        notificationService.show(`Contenido restaurado (guardado hace ${timeAgo})`, 'info');
                    }, 1000);
                }
            }
        } catch (error) {
            notificationService.showError('Ocurrió un error al cargar contenido guardado');
            debug('error', '000b1', 'Error al cargar contenido guardado', error);
        }

        // Initial focus with delay on the main input
        setTimeout(() => {
            if (this.elements.textInput && typeof this.elements.textInput.focus === 'function') {
                this.elements.textInput.focus();
                // Position cursor at end if there is content
                if (this.elements.textInput.value) {
                    this.elements.textInput.setSelectionRange(this.elements.textInput.value.length, this.elements.textInput.value.length);
                }
            }
        }, 800);
    }
    
    /**
     * Update output text || **debounced**
     *
     * @type {void} - window.updateOutput
     */
    updateOutput = debounce(() => {
        const text = this.elements.textInput.value;
        if (!text.trim()) { // Si no hay texto, colocar el texto predeterminado
            this.elements.output.textContent = 'Escribe algo en el área de texto para ver la magia ...';
            this.elements.output.classList.add('with-placeholder');
        } else {
            const formatted = formatText(text);
            this.elements.output.textContent = formatted;
            if (this.elements.output.classList.contains('with-placeholder')) this.elements.output.classList.remove('with-placeholder');
        }       

        this.updateCharCounter(this.elements.output.textContent.length);

        // Calcular y actualizar compatibilidad
        const compatibility = this.platforms.calculateCompatibility();
        this.platforms.updateCompatibilityBar(compatibility);

        setTimeout(() => {
            this.platforms.updatePlatforms();
        }, 10);

        this.analyzeContent(text);

        // Guardar contenido en el almacenamiento local y mostrar el indicador de guardado
        storageService.saveContent();
    });

    
    /**
     * Analyce the input text and refresh the analysis panel with the data
     *
     * @param {String} text - text to analyce
     */
    analyzeContent(text) {
        const countSymbolsAndEmojis = (text) => {
            if (typeof Intl !== 'undefined' && Intl.Segmenter) {
                const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
                const segments = [...segmenter.segment(text)];
                
                return segments.filter(segment => {
                    const char = segment.segment;
                    // Comprueba si es un emoji o un símbolo usando una expresión regular
                    return /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{2000}-\u{206F}]|[\u{2070}-\u{209F}]|[\u{20A0}-\u{20CF}]|[\u{2100}-\u{214F}]|[\u{2190}-\u{21FF}]|[\u{2200}-\u{22FF}]|[\u{2300}-\u{23FF}]|[\u{2400}-\u{243F}]|[\u{2440}-\u{245F}]|[\u{2460}-\u{24FF}]|[\u{2500}-\u{257F}]/u.test(char);
                }).length;
            } else {
                // Fallback para navegadores que no soportan Intl.Segmenter
                const emojiAndSymbolRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{2000}-\u{206F}]|[\u{2070}-\u{209F}]|[\u{20A0}-\u{20CF}]|[\u{2100}-\u{214F}]|[\u{2190}-\u{21FF}]|[\u{2200}-\u{22FF}]|[\u{2300}-\u{23FF}]|[\u{2400}-\u{243F}]|[\u{2440}-\u{245F}]|[\u{2460}-\u{24FF}]|[\u{2500}-\u{257F}]/gu;
                return (text.match(emojiAndSymbolRegex) || []).length;
            }
        }

        const countSocialElements = (text) => {
            // Helper function to check if a position is inside markdown code
            const isInCodeBlock = (text, position) => {
                // Find code blocks ``` before position
                const beforeText = text.substring(0, position);
                //const afterText = text.substring(position);
                
                // Counting triple code blocks
                const tripleBackticksBefore = (beforeText.match(/```/g) || []).length;
                //const tripleBackticksAfter = (afterText.match(/```/g) || []).length;
                
                // If there is an odd number of ``` before, we are inside a block
                const inTripleBlock = tripleBackticksBefore % 2 === 1;
                
                // Find inline code ` before position (only on the same line)
                const currentLineStart = beforeText.lastIndexOf('\n') + 1;
                const currentLineEnd = text.indexOf('\n', position);
                const currentLine = text.substring(
                    currentLineStart, 
                    currentLineEnd === -1 ? text.length : currentLineEnd
                );
                
                const positionInLine = position - currentLineStart;
                const lineBeforePosition = currentLine.substring(0, positionInLine);
                const lineAfterPosition = currentLine.substring(positionInLine);
                
                const singleBackticksBefore = (lineBeforePosition.match(/`/g) || []).length;
                const singleBackticksAfter = (lineAfterPosition.match(/`/g) || []).length;
                
                // If there is an odd number of ` before the line, we are inlined.
                const inSingleBlock = singleBackticksBefore % 2 === 1;
                
                return inTripleBlock || inSingleBlock;
            }
            
            // Function to count valid hashtags
            const countHashtags = (text) => {
                const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
                let match;
                let count = 0;
                
                while ((match = hashtagRegex.exec(text)) !== null) {
                    const position = match.index;
                    const hashtagText = match[0];
                    
                    // Check if it is in a code block
                    if (isInCodeBlock(text, position)) {
                        continue;
                    }
                    
                    // Check that there is no text pasted to the left (except space or start of line)
                    if (position > 0) {
                        const charBefore = text[position - 1];
                        if (charBefore !== ' ' && charBefore !== '\n' && charBefore !== '\t') {
                            continue;
                        }
                    }
                    
                    // Verify that the text after the # is valid for the hashtag
                    const hashtagContent = hashtagText.substring(1); // Quitar el #
                    // Hashtags can contain letters, numbers, underscores, and some accents.
                    if (!/^[\w\u00C0-\u017F]+$/.test(hashtagContent)) {
                        continue;
                    }
                    
                    count++;
                }
                
                return count;
            }
            
            // Function to count valid mentions
            const countMentions = (text) => {
                const mentionRegex = /@[\w\u00C0-\u017F_]+/g;
                let match;
                let count = 0;
                
                while ((match = mentionRegex.exec(text)) !== null) {
                    const position = match.index;
                    //const mentionText = match[0];
                    
                    // Check if it is in a code block
                    if (isInCodeBlock(text, position)) {
                        continue;
                    }
                    
                    // Check that there is no text pasted to the left (except space or start of line)
                    if (position > 0) {
                        const charBefore = text[position - 1];
                        if (charBefore !== ' ' && charBefore !== '\n' && charBefore !== '\t') {
                            continue;
                        }
                    }
                    
                    count++;
                }
                
                return count;
            }
            
            return {
                hashtags: countHashtags(text),
                mentions: countMentions(text)
            };
        }

        const outputText = this.elements.output.textContent; // Usar el texto formateado para contar palabras y párrafos
        const isEmpty = !this.elements.textInput.value.trim() || this.elements.output.classList.contains('with-placeholder');
        // Calcular métricas
        const words = !isEmpty ? outputText.trim().split(/\s+/).length : 0;
        const paragraphs = !isEmpty ? outputText.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
        const { hashtags, mentions } = countSocialElements(text);
        const symbols = countSymbolsAndEmojis(text);
        const urls = (text.match(/https?:\/\/[^\s]+/g) || []).length;
        const readingTime = getReadingTime(!isEmpty ? outputText : '');

        // Calculate general compatibility
        const compatibility = this.platforms.calculateCompatibility();

        // Update elements
        const elements = [
            { id: 'wordCount', value: words },
            { id: 'paragraphCount', value: paragraphs },
            { id: 'hashtagCount', value: hashtags },
            { id: 'mentionCount', value: mentions },
            { id: 'emojiCount', value: symbols },
            { id: 'readingTime', value: readingTime }
        ];

        elements.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element && element.textContent !== value.toString()) {
                element.style.transform = 'scale(1.1)';
                element.textContent = value;
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        });

        // Add or update compatibility
        let compatibilityItem = document.getElementById('compatibilityGeneral');
        const colors = this.platforms.getCompatibilityColor(compatibility.general);

        if (!compatibilityItem) {
            compatibilityItem = document.createElement('div');
            compatibilityItem.id = 'compatibilityGeneral';
            compatibilityItem.className = 'analysis-item';
            compatibilityItem.innerHTML = `
                <span class="analysis-label">Compatibilidad</span>
                <span class="analysis-value" id="compatibilityValue">${compatibility.general}%</span>
            `;
            // Insert to analysis panel start
            const analysisContent = document.getElementById('analysisContent');
            analysisContent.insertBefore(compatibilityItem, analysisContent.firstChild);

            const compatibilityValue = document.getElementById('compatibilityValue');
            compatibilityValue.style.color = colors.text;
        } else {
            const compatibilityValue = document.getElementById('compatibilityValue');
            if (compatibilityValue.textContent !== `${compatibility.general}%`) {
                compatibilityValue.style.transform = 'scale(1.2)';
                compatibilityValue.textContent = `${compatibility.general}%`;

                // Change color according to compatibility
                compatibilityValue.style.color = colors.text;

                setTimeout(() => {
                    compatibilityValue.style.transform = 'scale(1)';
                }, 200);
            }
        }

        // Add URLs if the element does not exist
        if (urls > 0 && !document.getElementById('urlCount')) {
            const urlItem = document.createElement('div');
            urlItem.className = 'analysis-item';
            urlItem.innerHTML = `
                <span class="analysis-label">URLs</span>
                <span class="analysis-value" id="urlCount">${urls}</span>
            `;
            document.getElementById('analysisContent').appendChild(urlItem);
        } else if (document.getElementById('urlCount')) {
            const urlElement = document.getElementById('urlCount');
            if (urlElement.textContent !== urls.toString()) {
                urlElement.style.transform = 'scale(1.1)';
                urlElement.textContent = urls;
                setTimeout(() => {
                    urlElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }

    /**
     * Resizes the `#textInput` when is necessary: Expanding with button, typing ..
     * 
     * @returns if text input not exists
     */
    autoResizeTextarea() {
        if (!this.elements.textInput) return;

        // Guardar posicion del cursor
        const cursorPosition = this.elements.textInput.selectionStart;
        //const scrollTop = this.elements.textInput.scrollTop;

        // Calcular la altura requerida sin afectar el DOM
        const computedStyle = window.getComputedStyle(this.elements.textInput);
        const padding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        const lineHeight = parseFloat(computedStyle.lineHeight);

        // Crear elemento temporal para medir el contenido
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
            position: absolute;
            top: -9999px;
            left: -9999px;
            width: ${this.elements.textInput.offsetWidth}px;
            font-family: ${computedStyle.fontFamily};
            font-size: ${computedStyle.fontSize};
            line-height: ${computedStyle.lineHeight};
            padding: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            border: none;
            overflow: hidden;
        `;

        // Utilice el contenido actual o un espacio para evitar el colapso
        tempDiv.textContent = this.elements.textInput.value + ' ' || ' ';
        document.body.appendChild(tempDiv);

        // Calcular la altura necesaria
        const contentHeight = tempDiv.scrollHeight;
        document.body.removeChild(tempDiv);

        // Calcular nueva altura con límites
        const minHeight = 48; // referenced in styles
        const maxHeight = this.state.isExpanded ? 300 : 120;
        const newHeight = this.state.isExpanded
            ? maxHeight
            : Math.max(minHeight, Math.min(contentHeight + padding, maxHeight));

        // Aplicar nueva altura solo si ha cambiado significativamente
        const currentHeight = this.elements.textInput.offsetHeight;
        if (Math.abs(newHeight - currentHeight) > 2) {
            this.elements.textInput.style.height = newHeight + 'px';

            // Aplicar cambios a la salida principal REF: 000io1
            const requireOutputResize = window.innerWidth < 1024;
            const isKeyboardVisible = keyboardHandler.state.isKeyboardVisible;
            if (requireOutputResize) adjustOutputHeight({textInputHeight: newHeight, marginTopContainer: isKeyboardVisible ? 0 : null}); // (si se modifica la anchura mínima, es necesario modificarla en adjustOutputHeight())

            setTimeout(() => setupMargins(), 300); // Ajustar márgenes
        }

        // Restaurar posición del cursor
        this.elements.textInput.setSelectionRange(cursorPosition, cursorPosition);

        // Mejorar el desplazamiento automático del cursor
        requestAnimationFrame(() => {
            const cursorLine = this.elements.textInput.value.substring(0, cursorPosition).split('\n').length;
            //const totalLines = this.elements.textInput.value.split('\n').length;
            const lineScrollPosition = (cursorLine - 1) * lineHeight;

            // Desplácese solo si el cursor está fuera del área visible
            if (lineScrollPosition < this.elements.textInput.scrollTop) {
                this.elements.textInput.scrollTop = lineScrollPosition;
            } else if (lineScrollPosition + lineHeight > this.elements.textInput.scrollTop + this.elements.textInput.clientHeight) {
                this.elements.textInput.scrollTop = lineScrollPosition + lineHeight - this.elements.textInput.clientHeight;
            }
        });
    }

    /**
     * Toggle expand/collapse textarea
     */
    toggleTextareaExpand() {
        this.state.isExpanded = !this.state.isExpanded;
        this.elements.textInput.classList.toggle('expanded', this.state.isExpanded);
        this.elements.expandBtn.classList.toggle('expanded', this.state.isExpanded);

        this.autoResizeTextarea();
    }

    /**
     * Show save indicator label on `.input-section` momentarily
     */
    showSaveIndicator() {
        // Clean previus timeout
        if (this.state.saveIndicatorTimeout) {
            clearTimeout(this.state.saveIndicatorTimeout);
        }

        // Show
        const offsetRight = 10; // 20px of right margin - 10px of ::before padding
        this.elements.saveIndicator.style.right = `${offsetRight + this.elements.charCounter.offsetWidth}px`;
        this.elements.saveIndicator.classList.add('show');

        // Hide after 2 seconds of inactivity
        this.state.saveIndicatorTimeout = setTimeout(() => {
            if (this.elements.saveIndicator) {
                this.elements.saveIndicator.classList.remove('show');
            }
        }, APP_CONFIG.EDITOR.SAVE_INDICATOR_DURATION);
    }

    /**
     * Hanlde input events on `#textInput` - this function is called initally
     */
    handleTextareaInput() {
        const scrollTop = this.elements.textInput.scrollTop; // // Prevenir el scroll automático del navegador
        
        this.autoResizeTextarea();
        this.analyzeContent(this.elements.textInput.value);
        this.updateOutput();

        // Guardar el scroll actual y restaurarlo después
        requestAnimationFrame(() => {
            this.elements.textInput.scrollTop = scrollTop;
            this.fixView();
        });
    }

    /**
     * Handle textarea keydown events
     *
     * @param {Event} event - keydown event to determinate key
     */
    handleTextareaKeydown(event) {
        const scrollTop = this.elements.textInput.scrollTop; // // Prevenir el scroll automático del navegador
        // Manejar teclas de flecha para scroll suave
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
            // Guardar el scroll actual y restaurarlo después
            requestAnimationFrame(() => {
                this.elements.textInput.scrollTop = scrollTop;
                this.fixView();
            });
        }
    }

    /**
     * Try to fix view of `#textInput` on events (viewport scroll)
     */
    fixView() {
        const textarea = this.elements.textInput;
        const cursorPosition = textarea.selectionStart;
        
        // Crear un elemento temporal para medir la altura real del texto hasta el cursor
        const tempDiv = document.createElement('div');
        const computedStyle = window.getComputedStyle(textarea);
        
        // Copiar estilos relevantes del textarea
        tempDiv.style.font = computedStyle.font;
        tempDiv.style.fontSize = computedStyle.fontSize;
        tempDiv.style.fontFamily = computedStyle.fontFamily;
        tempDiv.style.lineHeight = computedStyle.lineHeight;
        tempDiv.style.letterSpacing = computedStyle.letterSpacing;
        tempDiv.style.wordSpacing = computedStyle.wordSpacing;
        tempDiv.style.whiteSpace = computedStyle.whiteSpace;
        tempDiv.style.wordWrap = computedStyle.wordWrap;
        tempDiv.style.width = textarea.clientWidth - 
            parseFloat(computedStyle.paddingLeft) - 
            parseFloat(computedStyle.paddingRight) + 'px';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.visibility = 'hidden';
        
        document.body.appendChild(tempDiv);
        
        try {
            // Obtener el texto hasta la posición del cursor
            const textBeforeCursor = textarea.value.substring(0, cursorPosition);
            tempDiv.textContent = textBeforeCursor;
            
            // Calcular la posición vertical real del cursor
            const cursorTopOffset = tempDiv.offsetHeight;
            const lineHeight = parseFloat(computedStyle.lineHeight);
            
            // Calcular área visible
            const scrollTop = textarea.scrollTop;
            const clientHeight = textarea.clientHeight;
            const visibleTop = scrollTop;
            const visibleBottom = scrollTop + clientHeight;
            
            // Margen de seguridad (una línea)
            const margin = lineHeight;
            
            // Determinar si necesitamos ajustar el scroll
            let newScrollTop = scrollTop;
            
            if (cursorTopOffset < visibleTop + margin) {
                // El cursor está muy cerca del borde superior o fuera de vista
                newScrollTop = Math.max(0, cursorTopOffset - margin);
            } else if (cursorTopOffset + lineHeight > visibleBottom - margin) {
                // El cursor está muy cerca del borde inferior o fuera de vista
                newScrollTop = cursorTopOffset + lineHeight - clientHeight + margin;
            }
            
            // Aplicar el scroll suavemente
            if (newScrollTop !== scrollTop) {
                textarea.scrollTo({
                    top: newScrollTop,
                    behavior: 'smooth'
                })
            }
            
        } finally {
            // Limpiar el elemento temporal
            document.body.removeChild(tempDiv);
        }
    }
    
    /**
     * Update the floating char-counter label on `.input-section`
     *
     * @param {Number} count - Characters on `.formatted-output`
     */
    updateCharCounter(count) {
        const isEmpty = !this.elements.textInput.value.trim() || this.elements.output.classList.contains('with-placeholder');
        this.elements.charCounter.textContent = isEmpty ? '0' : `${count}`;

        const compatibility = this.platforms.calculateCompatibility();
        const currentCompatibility = compatibility[this.platforms.states.currentTab];
        const colors = this.platforms.getCompatibilityColor(currentCompatibility);

        this.elements.charCounter.style.color = colors.text;
        this.elements.charCounter.dataset.tooltip = `${currentCompatibility}% de compatibilidad en ${this.platforms.states.currentTab === 'bio' ? 'biografías' : 'posts'}`;
    }

    /**
     * Auxiliary method. Handle selection saving on `#textInput` (for buttons that open panels)
     */
    saveSelection() {
        this.state.selectionStart = this.elements.textInput.selectionStart;
        this.state.selectionEnd = this.elements.textInput.selectionEnd;
    }

    /**
     * Auxiliary method. Handle selection restoring on `#textInput` (for buttons that open panels)
     */
    restoreSelection() {
        this.elements.textInput.setSelectionRange(this.state.selectionStart, this.state.selectionEnd);
    }

    /**
     * Intern Event Binding
     */
    bindEvents() {     
        this.elements.textInput.addEventListener('input', this.handleTextareaInput.bind(this));
        this.elements.textInput.addEventListener('keydown', this.handleTextareaKeydown.bind(this));
        this.elements.textInput.addEventListener('paste', () => setTimeout(this.handleTextareaInput.bind(this), 10));
        this.elements.templatesBtn.onclick = () => this.toggleTemplates('main');

        // Evitar que el input pierda el foco al pulsar el boton de expandir/mostrar simbolos
        const handleExpandBtnPress = (e) => { 
            e.preventDefault();
            this.saveSelection();
            this.toggleTextareaExpand();
            this.restoreSelection();

            window.closeSymbolPicker();
        };

        const handleShowSymbolBtnPRess = (e) => {
            e.preventDefault();
            this.saveSelection();
            this.showSymbolPicker('main');
            this.restoreSelection();
        }
        this.elements.symbolBtn.onmousedown = handleShowSymbolBtnPRess;
        this.elements.symbolBtn.ontouchstart = handleShowSymbolBtnPRess;
        this.elements.expandBtn.onmousedown = handleExpandBtnPress;
        this.elements.expandBtn.ontouchstart = handleExpandBtnPress;

        this.elements.inputSection.ontouchmove = (e) => {
            // Evitar que el scroll del input se propague al body (que provoca el rebote en iOS)
            e.stopPropagation();

            /*if (e.target !== this.elements.textInput) {
                e.preventDefault();
            }*/
        }

        /*window.addEventListener('resize', () => {
            adjustOutputHeight({ textInputHeight: this.elements.textInput.offsetHeight });
        });*/
    }
}

export default EditorComponent;
