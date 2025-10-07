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

import notificationService from "../services/notification.service.js";
import storageService from "../services/storage.service.js";
import { envData } from "../store/env.store.js";

/**
 * Adjust the height of `.output-section`
 *
 * @export
 * @param {number} [param0={}] 
 * @param {number} [param0.textInputHeight=null] - height for sync before transitions
 * @param {number} [param0.marginTopContainer=null] - margin for sync matching keyboard visibility
 */
export function adjustOutputHeight({textInputHeight = null, marginTopContainer = null} = {}) {
    if (envData.inputInResize) return; // Evitar llamadas concurrentes

    envData.inputInResize = true;

    const recalculateOutputHeight = (textInputHeight = null, marginTopContainer = null) => {
        const OUTPUT_MIN_HEIGHT = 300;

        if (window.innerHeight < 420) {
            return 300;
        }
        else if (window.innerWidth > 1024) { // Ajustar altura del output según sidebar => REF: 000o1
            const platformsPanel = document.querySelector('.platforms-panel');
            const analysisPanel = document.querySelector('.analysis-panel');

            const sidebarHeight = platformsPanel.offsetHeight + analysisPanel.offsetHeight;
            const height = `${sidebarHeight}px`
            return height;
        } else {
            const inputSection = document.querySelector('.input-section');
            const container = document.querySelector('.container');

            const inputSectionStyles = window.getComputedStyle(inputSection);
            const containerStyles = window.getComputedStyle(container);

            const Vars = {
                SPACER: parseInt(inputSectionStyles.paddingTop), // Pequeño offset fuera de cálculo
                ISECTION_height: inputSection.offsetHeight,
                ISECTION_padding: parseInt(inputSectionStyles.paddingTop) + parseInt(inputSectionStyles.paddingBottom),
                CONTAINER_marginTop: marginTopContainer !== null ? marginTopContainer : parseInt(containerStyles.marginTop),
                CONTAINER_paddingTop: parseInt(containerStyles.paddingTop)
            }

            const marginOffset = Vars.CONTAINER_marginTop + Vars.CONTAINER_paddingTop; // + Vars.SPACER
            const minHeight = OUTPUT_MIN_HEIGHT + Vars.ISECTION_height + marginOffset;
            const viewportHeight = window.visualViewport.height;
            const canPlace = viewportHeight >= minHeight;
            
            // Si se llamó desde un cambio de altura accionado por el usuario, textInputHeight tendrá valor. REF: 000io3
            // Esto se hace para sincronizar las animaciónes y además, por que al animar el cambio de tamaño en `#textInput`, la altura de este elemento no sería lógico calcularla mientras esta cambia al mismo tiempo
            // y daría valores distintos en cada frame.
            const height = textInputHeight
                ? `${viewportHeight - textInputHeight - document.querySelector('.input-actions').getBoundingClientRect().height - Vars.ISECTION_padding - marginOffset - Vars.SPACER}px`
                : canPlace
                    ? `${viewportHeight - Vars.ISECTION_height - marginOffset - (Vars.ISECTION_padding / 2)}px`
                    : `${OUTPUT_MIN_HEIGHT}px`;
            
            return height;
        }
    }

    const height = recalculateOutputHeight(textInputHeight, marginTopContainer);
    const outputSection = document.querySelector('.output-section');

    outputSection.style.height = height;
    outputSection.style.maxHeight = height;

    setTimeout(() => {envData.inputInResize = false;}, 350); // Evitar llamadas concurrentes (timeout acorde a la duración de las animaciones CSS + 50ms de margen)
}

/**
 * Auxiliary function to prevent actions over the empty output
 * @export
 */
export function outputIsEmpty() {
    const output = document.querySelector('.formatted-output');
    const input = document.getElementById('textInput');
    if (!output || !input || output.classList.contains('with-placeholder') || !input.value.trim()) {
        return true;
    }

    return false;
}

/**
 * Copy to clipboard the `.formatted-output` text
 *
 * @export
 * @async
 */
export async function copyToClipboard() {
    if (outputIsEmpty()) {
        notificationService.show('No hay texto para copiar', 'warning');
        return;
    }
    
    const output = document.querySelector('.formatted-output');

    try {
        await navigator.clipboard.writeText(output.textContent);
    } catch (err) {
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea');
        textArea.value = output.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    notificationService.showSuccess('Texto copiado al portapapeles');
}

/**
 * Download the `.formatted-output` text on a file
 *
 * @export
 * @param {string} format 
 */
export function exportText(format) {
    if (outputIsEmpty()) {
        notificationService.show('No hay texto para exportar', 'warning');
        return;
    }

    // Se añadirán más formatos en el futuro
    const FORMATS = {
        plain: 'txt'
    };
    
    const text = output.textContent;
    const filename = `Typerflip-tpt.${FORMATS[format]}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notificationService.showSuccess('Plantilla descargada');
}

// Generar partículas de fondo

/**
 * Generate background particles
 *
 * @export
 */
export function generateParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particlesContainer.appendChild(particle);
    }
}


/**
 * Expand/collapse guide section
 *
 * @export
 */
export function toggleFastGuide() {
    const formattedOutput = document.getElementById('output');
    const showGuideBtn = document.getElementById('showGuideBtn');
    const placeholderSection = document.querySelector('.guide-section');
    
    const isHidden = placeholderSection.classList.contains('hidden');

    showGuideBtn.classList.toggle('active', isHidden);
    formattedOutput.classList.toggle('with-guide', isHidden);
    placeholderSection.classList.toggle('hidden', !isHidden);
}


/**
 * Set margins on `.main-layout` according to `.input-section` height.
 * Allowing there to always be space available for the latter in the window.
 *
 * @export
 */
export function setupMargins() {
    requestAnimationFrame(() => {
        const mainLayout = document.querySelector('.main-layout');
        const inputSection = document.querySelector('.input-section');

        if (!mainLayout || !inputSection) return;

        // Calcular la altura total de la sección de input
        const inputHeight = inputSection.offsetHeight;

        // Solo aplicar margen si es necesario
        const viewportHeight = window.innerHeight;
        const layoutHeight = mainLayout.scrollHeight;

        // Si el contenido es más alto que la ventana, aplicar margen
        if (layoutHeight + inputHeight > viewportHeight) {
            mainLayout.style.marginBottom = `${Math.max(150, inputHeight - 15)}px`; //
        } else {
            mainLayout.style.marginBottom = '150px'; // Margen por defecto
        }
    });
}

// Manejar teclado móvil (funcion en desarrollo: hay un error que hace que el tamaño de la página crezca al ocultar input-section y deslizar consecutivamente hacia abajo)
/*export function setupMobileKeyboard() {
    if ('visualViewport' in window) {
        const viewport = window.visualViewport;
        const inputSection = document.querySelector('.input-section');
        const textInput = document.getElementById('textInput');
        
        let isKeyboardVisible = false;
        let positioningActive = false;
        let rafId = null;
        let isHidden = false;
        let touchStartY = 0;
        let touchStartX = 0;

        // Función que calcula y aplica la posición correcta
        function forceCorrectPosition() {
            if (!isKeyboardVisible || !positioningActive || isHidden) return;

            // Obtener dimensiones actuales
            const viewportHeight = viewport.height;
            const viewportTop = viewport.offsetTop || 0;
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
            const inputHeight = inputSection.offsetHeight;

            // Calcular posición exacta - JUSTO encima del teclado
            const absoluteTop = currentScrollTop + viewportTop + viewportHeight - inputHeight;

            // Aplicar posición
            inputSection.style.position = 'absolute';
            inputSection.style.top = `${absoluteTop - 50}px`;
            inputSection.style.bottom = 'auto';
            inputSection.style.left = '0';
            inputSection.style.right = '0';
            inputSection.style.transform = 'translateY(0)';
            inputSection.style.opacity = '1';
            inputSection.style.zIndex = '9999';

            // Programar próxima actualización
            if (positioningActive) {
                rafId = requestAnimationFrame(forceCorrectPosition);
            }
        }

        // Ocultar input section
        function hideInputSection() {
            if (isHidden) return;
            
            isHidden = true;
            inputSection.style.transform = 'translateY(100%)';
            inputSection.style.opacity = '0';
            inputSection.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
            
            console.log('Input section oculto');
        }

        // Mostrar input section
        function showInputSection() {
            if (!isHidden) return;
            
            isHidden = false;
            inputSection.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            
            // Forzar reposicionamiento inmediato
            setTimeout(() => {
                forceCorrectPosition();
            }, 50);
            
            console.log('Input section mostrado');
        }

        // Iniciar posicionamiento continuo
        function startContinuousPositioning() {
            if (positioningActive) return;
            
            positioningActive = true;
            isKeyboardVisible = true;
            isHidden = false;
            
            // Cancelar cualquier animación anterior
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            
            // Iniciar bucle de posicionamiento
            forceCorrectPosition();
            
            console.log('Posicionamiento continuo activado');
        }

        // Detener posicionamiento continuo
        function stopContinuousPositioning() {
            positioningActive = false;
            isKeyboardVisible = false;
            isHidden = false;
            
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            
            // Volver a posición fixed normal
            inputSection.style.position = 'fixed';
            inputSection.style.bottom = '0';
            inputSection.style.top = 'auto';
            inputSection.style.transform = 'translateY(0)';
            inputSection.style.opacity = '1';
            inputSection.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            console.log('Posicionamiento continuo desactivado');
        }

        // Touch handlers
        function handleTouchStart(e) {
            if (!isKeyboardVisible) return;
            
            // Verificar si el touch es fuera del input-section
            const touch = e.touches[0];
            const rect = inputSection.getBoundingClientRect();
            
            if (touch.clientY < rect.top || 
                touch.clientY > rect.bottom || 
                touch.clientX < rect.left || 
                touch.clientX > rect.right) {
                
                touchStartY = touch.clientY;
                touchStartX = touch.clientX;
                
                console.log('Touch start fuera del input section');
            }
        }

        function handleTouchMove(e) {
            if (!isKeyboardVisible || isHidden) return;
            
            const touch = e.touches[0];
            const deltaY = Math.abs(touch.clientY - touchStartY);
            const deltaX = Math.abs(touch.clientX - touchStartX);
            
            // Si se movió aunque sea 1px, ocultar
            if ((deltaY >= 1 || deltaX >= 1) && touchStartY !== 0) {
                hideInputSection();
            }
        }

        function handleTouchEnd(e) {
            if (!isKeyboardVisible) return;
            
            // Resetear valores
            touchStartY = 0;
            touchStartX = 0;
            
            // Mostrar input section
            setTimeout(() => {
                showInputSection();
            }, 100);
            
            console.log('Touch end - mostrando input section');
        }

        function handleViewportChange() {
            const keyboardHeight = window.innerHeight - viewport.height;
            
            console.log('Viewport change:', { 
                keyboardHeight, 
                windowHeight: window.innerHeight, 
                viewportHeight: viewport.height 
            });

            if (keyboardHeight > 50) {
                // Teclado visible
                startContinuousPositioning();
            } else {
                // Teclado oculto
                stopContinuousPositioning();
            }
        }

        // Event listeners principales
        viewport.addEventListener('resize', handleViewportChange);

        textInput.addEventListener('focus', () => {
            console.log('Input focused');
            setTimeout(() => {
                handleViewportChange();
                // Forzar inicio si no se ha detectado cambio de viewport
                setTimeout(() => {
                    const keyboardHeight = window.innerHeight - viewport.height;
                    if (keyboardHeight > 50 && !positioningActive) {
                        console.log('Forzando inicio del posicionamiento');
                        startContinuousPositioning();
                    }
                }, 600);
            }, 300);
        });

        textInput.addEventListener('blur', () => {
            console.log('Input blurred');
            setTimeout(() => {
                if (!textInput.matches(':focus')) {
                    stopContinuousPositioning();
                }
            }, 200);
        });

        // Touch event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

        // Cleanup al salir de la página
        window.addEventListener('beforeunload', () => {
            stopContinuousPositioning();
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        });

        // Función de limpieza manual
        window.cleanupMobileKeyboard = () => {
            stopContinuousPositioning();
            viewport.removeEventListener('resize', handleViewportChange);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        };

        console.log('Mobile keyboard setup initialized');
    }
}*/

/**
 * DOM Event Binding
 */
function bindDOMEvents() {
    window.addEventListener('resize', () => {
        const isPossibleMobile = window.innerWidth <= 768;
        const hasKeyboardShows = envData.initialViewportHeight !== window.visualViewport.height;
        const condition = !isPossibleMobile && (!hasKeyboardShows && envData.initialViewportHeight !== null)
        if (condition) {
            adjustOutputHeight();
        }

        setTimeout(() => setupMargins(), 350);
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            adjustOutputHeight();
        }, 100); // Delay para que se complete el cambio
    });
}

/**
 * Update Environments variables
 *
 * @async
 */
async function syncEnvData() {
    envData.initialViewportHeight = window.visualViewport.height;
}

// Inicializar configuración inicial

/**
 * Initialize first UI setup
 *
 * @export
 * @async
 */
export async function initializeDOMUI() {    
    setTimeout(() => { // Ajustes de altura y márgenes
        adjustOutputHeight();
    }, 300);
    
    // Recalcular márgenes después de animaciones iniciales
    setTimeout(() => setupMargins(), 700);
    scrollTo({top: storageService.getScrollPosition(), behavior: 'smooth'});
    await syncEnvData();

    generateParticles(); // Generar particulas de fondo
    //setupMobileKeyboard(); // Configuración móvil (se reemplazo por el listener 'touchmove' en el documento y ocultamiento natural, provisionalmente REF: 000ax1)
    bindDOMEvents();

}
