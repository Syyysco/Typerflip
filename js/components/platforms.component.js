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
 * Platforms class responsible for initializing and managing general behavior related to
 *
 * @class PlatformsComponent
 * @typedef {PlatformsComponent}
 */
class PlatformsComponent {
    /**
     * Creates an instance of PlatformsComponent. Initializate states and elements.
     *
     * @constructor
     */
    constructor() {
        this.states = this.initializeStates(); // Inicializar estados internos
        this.elements = this.initializeElements(); // Inicializar elementos del DOM
    }

    /**
     * Initializate main UI elements and bind events
     */
    init() {
        this.generatePlatforms(); // Generar plataformas
        this.generateCompatibilityBar(); // Generar barra de compatibilidad
        const compatibility = this.calculateCompatibility();
        this.updateCompatibilityBar(compatibility);
        
        this.bindEvents(); // Enlazar eventos
    }

    
    /**
     * Initialize HTML necessary elements references
     *
     * @returns {{ platformsGrid: HTMLElement; postsTabBtn: HTMLElement; bioTabBtn: HTMLElement; textOutput: HTMLElement; }} 
     */
    initializeElements() {
        return {
            platformsGrid: document.getElementById('platformsGrid'),
            postsTabBtn: document.getElementById('postsTab'),
            bioTabBtn: document.getElementById('bioTab'),
            textOutput: document.getElementById('output')
        }
    }

    
    /**
     * Initialize necessary states
     *
     * @returns {{ currentTab: string; }} 
     */
    initializeStates() {
        return {
            currentTab: 'posts',
            //compatibility: { posts: 100, bio: 100, general: 100 } // Se implementará más adelante para optimizar editor.component
        };
    }

    /**
     * Inicializate UI elements
     */
    generatePlatforms() {
        const charCount = this.elements.textOutput.textContent.length;
        
        this.elements.platformsGrid.innerHTML = '';            
    
        Object.entries(APP_CONFIG.PLATFORMS).forEach(([key, platform]) => {
            const limit = platform.limits[this.states.currentTab];
            const percentage = (charCount / limit) * 100;
    
            let status = 'success';
            if (percentage >= APP_CONFIG.COMPATIBILITY.LIMITS.DISABLED) status = 'disabled';
            else if (percentage > APP_CONFIG.COMPATIBILITY.LIMITS.DANGER) status = 'danger';
            else if (percentage > APP_CONFIG.COMPATIBILITY.LIMITS.WARNING) status = 'warning';
    
            const platformItem = document.createElement('div');
            platformItem.className = `platform-item ${charCount > limit ? 'disabled' : ''}`;
            platformItem.setAttribute('data-platform', key); // IMPORTANTE para updatePlatforms
            platformItem.innerHTML = `
                <div class="platform-icon" style="background: ${platform.color}">
                    <i class="fa-brands fa-${platform.icon}"></i>
                </div>
                <div class="platform-info">
                    <div class="platform-name unselectable-item">${platform.name}</div>
                    <div class="platform-limit unselectable-item">${limit} caracteres</div>
                </div>
                <div class="platform-status ${status}"></div>
            `;
    
            this.elements.platformsGrid.appendChild(platformItem);
        });
    }
    
    /**
     * Refresh platforms states on sidebar on input events or another event
     */
    updatePlatforms() {
        const charCount = this.elements.textOutput.textContent.length;
    
        let allExist = true;
    
        Object.entries(APP_CONFIG.PLATFORMS).forEach(([key, platform]) => {
            const limit = platform.limits[this.states.currentTab];
            const percentage = (charCount / limit) * 100;
    
            let status = 'success';
            if (percentage >= APP_CONFIG.COMPATIBILITY.LIMITS.DISABLED) status = 'disabled';
            else if (percentage > APP_CONFIG.COMPATIBILITY.LIMITS.DANGER) status = 'danger';
            else if (percentage > APP_CONFIG.COMPATIBILITY.LIMITS.WARNING) status = 'warning';
    
            const existing = this.elements.platformsGrid.querySelector(`.platform-item[data-platform="${key}"]`);
    
            if (existing) {
                // Actualizar clase de límite
                existing.classList.toggle('disabled', charCount > limit);
    
                // Actualizar nombre y límite por si cambió el modo (posts/bio)
                existing.querySelector('.platform-limit').textContent = `${limit} caracteres`;
    
                // Actualizar estado de color
                const statusDiv = existing.querySelector('.platform-status');
                statusDiv.className = `platform-status ${status}`;
    
            } else {
                allExist = false;
            }
        });
    
        // Si falta algún elemento, regenerar toda la lista
        if (!allExist) {
            generatePlatforms();
        }
    }

    /**
     * Generate compatibility bar element and styles
     */
    generateCompatibilityBar() {
        let compatibilityContainer = document.getElementById('compatibilityContainer');

        if (!compatibilityContainer) {
            compatibilityContainer = document.createElement('div');
            compatibilityContainer.id = 'compatibilityContainer';
            compatibilityContainer.style.cssText = `
                margin: 20px 0;
                padding: 0;
            `;

            const compatibilityBar = document.createElement('div');
            compatibilityBar.id = 'compatibilityProgress';
            compatibilityBar.style.cssText = `
                width: 100%;
                height: 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                overflow: hidden;
                position: relative;
                border: 2px solid transparent;
                transition: border-color 0.3s ease;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            `;

            const compatibilityFill = document.createElement('div');
            compatibilityFill.id = 'compatibilityFill';
            compatibilityFill.style.cssText = `
                height: 100%;
                width: 0%;
                background: linear-gradient(135deg, #48dbfb 0%, #e079ff 100%);
                border-radius: 10px;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            `;

            // Efecto de brillo en la barra
            const shine = document.createElement('div');
            shine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: shine 2s infinite;
            `;

            const compatibilityText = document.createElement('div');
            compatibilityText.id = 'compatibilityText';
            compatibilityText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 0.75rem;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.9);
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                z-index: 2;
                transition: color 0.3s ease;
            `;
            compatibilityText.textContent = '0%';

            compatibilityFill.appendChild(shine);
            compatibilityBar.appendChild(compatibilityFill);
            compatibilityBar.appendChild(compatibilityText);
            compatibilityContainer.appendChild(compatibilityBar);

            // Insertar después de los tabs
            const platformTabs = document.querySelector('.platform-tabs');
            platformTabs.parentNode.insertBefore(compatibilityContainer, platformTabs.nextSibling);

            // Añadir estilos para la animación de brillo y pseudoelementos
            const style = document.createElement('style');
            style.textContent += `
                @keyframes shine {
                    0% { left: -100%; }
                    50% { left: 100%; }
                    100% { left: 100%; }
                }

                #compatibilityText::after {
                    content: 'compatible';
                    margin-left: 5px;
                    color: inherit;
                    font-size: inherit;
                }
            `;
            document.head.appendChild(style);
        }
    }

    
    /**
     * Calculate platforms compatibility based on `#output` length
     *
     * @returns {{ posts: Number; bio: Number; general: Number; }} 
     */
    calculateCompatibility() {
        const textLength = this.elements.textOutput.textContent.length;
        const platforms = Object.values(APP_CONFIG.PLATFORMS);

        const postsCompatibility = platforms.filter(platform =>
            textLength <= platform.limits.posts
        ).length / platforms.length * 100;

        const bioCompatibility = platforms.filter(platform =>
            textLength <= platform.limits.bio
        ).length / platforms.length * 100;

        const generalCompatibility = (postsCompatibility + bioCompatibility) / 2;

        return {
            posts: Math.round(postsCompatibility),
            bio: Math.round(bioCompatibility),
            general: Math.round(generalCompatibility)
        };
    }
    
    /**
     * Get gradient color according to compatibility
     *
     * @param {Number} percentage 
     * @returns {String} HEX color
     */
    getCompatibilityColor(percentage) {
        let color_id = null;

        if (percentage < 30) {
            color_id = 'LESS_THAN_30';
        } else if (percentage < 50) {
            color_id = 'LESS_THAN_50';
        } else if (percentage < 80) {
            color_id = 'LESS_THAN_80';
        } else if (percentage < 100) {
            color_id = 'LESS_THAN_100';
        } else {
            color_id = '100';
        }

        return APP_CONFIG.COMPATIBILITY.COLORS[color_id];
    }
    
    /**
     * Refresh compatibility progress bar
     *
     * @param {Number} compatibility 
     */
    updateCompatibilityBar(compatibility) {
        const progressBar = document.getElementById('compatibilityProgress');
        const progressFill = document.getElementById('compatibilityFill');
        const progressText = document.getElementById('compatibilityText');

        if (!progressBar) return;

        const currentCompatibility = compatibility[this.states.currentTab];
        const colors = this.getCompatibilityColor(currentCompatibility);

        // Actualizar texto
        progressText.textContent = `${currentCompatibility}%`;
        progressText.style.color = `${colors.text}`;

        // Actualizar fill con animación
        progressFill.style.background = colors.gradient;
        progressFill.style.width = `${currentCompatibility}%`;
    }
    
    /**
     * Swtich to determinated tab of platforms
     *
     * @param {String} tab 
     */
    switchTab(tab) {
        if (this.states.currentTab === tab) return;
        this.states.currentTab = tab;
    
        // Actualizar estado de pestañas
        document.getElementById('postsTab').classList.toggle('active', tab === 'posts');
        document.getElementById('bioTab').classList.toggle('active', tab === 'bio');
    
        // Animación suave para el cambio
        this.elements.platformsGrid.classList.add('changing');
        setTimeout(() => {
            this.updatePlatforms();
            this.elements.platformsGrid.classList.remove('changing');
        }, 150);
    
        // Actualizar barra de compatibilidad con la nueva pestaña
        const compatibility = this.calculateCompatibility();
        this.updateCompatibilityBar(compatibility);
        window.updateCharCounter(this.elements.textOutput.textContent.length);
    }

    /**
     * Intern Event Binding
     */
    bindEvents() {
        this.elements.postsTabBtn.onclick = () => this.switchTab('posts');
        this.elements.bioTabBtn.onclick = () => this.switchTab('bio');
    }
}

export default PlatformsComponent;