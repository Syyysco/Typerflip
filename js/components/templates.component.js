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
import { postsTemplates, bioTemplates } from "../data/templates.data.js";
import { formatText } from "../utils/formatter.utils.js";
import { formatTimeAgo, setBodyScroll } from "../utils/common.utils.js";


/**
 * Templates manager class responsible for initializing and managing general behavior related to
 *
 * @class TemplatesComponent
 * @typedef {TemplatesComponent}
 */
class TemplatesComponent {
    
    /**
     * Creates an instance of TemplatesComponent. Initialize elements and states
     *
     * @constructor
     */
    constructor() {
        this.states = this.initializeStates(); // Estados
        this.elements = this.initializeElements(); // Elementos
    }

    
    /**
     * Inicialize component intern states
     *
     * @returns {{ currentTemplatesTab: string; prevTemplatesTab: string; }} 
     */
    initializeStates() {
        return {
            currentTemplatesTab: 'posts',
            prevTemplatesTab: 'posts'
        };
    }

    
    /**
     * Initialize references to DOM elements
     *
     * @returns {{ overlay: HTMLElement; menu: HTMLElement; templatesContainer: HTMLElement; saveTemplateMainBtn: HTMLElement; }} 
     */
    initializeElements() {
        return {
            overlay: null,
            menu: null,
            templatesContainer: null,
            saveTemplateMainBtn: document.getElementById('saveTemplateBtn')
        }
    }

    /**
     * Create DOM elements and bind events
     */
    init() {
        this.createTemplatesMenu();
        this.bindEvents();
    }

    /**
     * Create templates menu and styles
     */
    createTemplatesMenu() {
        this.elements.overlay = document.createElement('div');
        this.elements.overlay.id = 'templatesOverlay';

        this.elements.menu = document.createElement('div');
        this.elements.menu.id = 'templatesMenu';
        this.elements.menu.setAttribute('role', 'region');
        this.elements.menu.setAttribute('aria-labelledby', `templatesMenuTitle`);

        // Header del modal
        const header = document.createElement('div');
        header.className = 'templates-menu-header';

        const title = document.createElement('h3');
        title.id = 'templatesMenuTitle';
        title.textContent = 'Plantillas';
        title.className = 'templates-header-title unselectable-item one-line-element';

        const subtitle = document.createElement('p');
        subtitle.textContent = 'Haz clic en una plantilla para ver su contenido';
        subtitle.className = 'templates-header-subtitle unselectable-item one-line-element';

        const tabBtnContainer = document.createElement('div');
        tabBtnContainer.className = 'templates-tabs';

        const postsTabBtn = document.createElement('button');
        postsTabBtn.className = 'tab-btn active';
        postsTabBtn.id = 'templatesPostsTabBtn';
        postsTabBtn.textContent = 'Posts';
        postsTabBtn.setAttribute('role', 'button');
        postsTabBtn.setAttribute('aria-label', `Cambiar a la pestaña de plantillas de posts`);
        postsTabBtn.setAttribute('aria-pressed', 'false');

        const bioTabBtn = document.createElement('button');
        bioTabBtn.className = 'tab-btn';
        bioTabBtn.id = 'templatesBioTabBtn';
        bioTabBtn.textContent = 'Biografías';
        bioTabBtn.setAttribute('role', 'button');
        bioTabBtn.setAttribute('aria-label', `Cambiar a la pestaña de plantillas de biografías`);
        bioTabBtn.setAttribute('aria-pressed', 'false');

        tabBtnContainer.appendChild(postsTabBtn);
        tabBtnContainer.appendChild(bioTabBtn);

        postsTabBtn.onclick = () => this.switchTemplatesTab('posts');
        bioTabBtn.onclick = () => this.switchTemplatesTab('bio');

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        closeBtn.setAttribute('role', 'button');
        closeBtn.setAttribute('aria-label', `Cerrar menú de plantillas`);
        closeBtn.setAttribute('aria-pressed', 'false');
        closeBtn.onclick = () => this.closeTemplates();

        const addNewBtn = document.createElement('button');
        addNewBtn.id = 'newTemplateBtn';
        addNewBtn.innerHTML = '<i class="fa-solid fa-plus"></i>Nueva';
        addNewBtn.setAttribute('role', 'button');
        addNewBtn.setAttribute('aria-label', `Crear nueva plantilla`);
        addNewBtn.setAttribute('aria-pressed', 'false');
        addNewBtn.onclick = () => this.toggleEditMode({ from: 'templates' });

        header.appendChild(title);
        header.appendChild(subtitle);
        header.appendChild(tabBtnContainer);
        header.appendChild(addNewBtn);
        header.appendChild(closeBtn);

        // Contenedor de plantillas con scroll
        this.elements.templatesContainer = document.createElement('div');
        this.elements.templatesContainer.className = 'templates-container-div';

        const templatesPostsContainer = document.createElement('div');
        templatesPostsContainer.id = 'postsTabTemplates';
        templatesPostsContainer.className = 'template-tab-container active';

        const templatesBioContainer = document.createElement('div');
        templatesBioContainer.id = 'bioTabTemplates';
        templatesBioContainer.className = 'template-tab-container';

        const templatesEditContainer = document.createElement('div');
        templatesEditContainer.id = 'editTemplateTab';
        templatesEditContainer.className = 'hidden';
        templatesEditContainer.innerHTML = `
            <div class="edit-template-wrapper">
                <div class="edit-template-content">                    
                    <div class="edit-template-form-group">
                        <label for="editTemplateName" class="edit-template-input-info">Nombre:</label>
                        <input type="text" id="editTemplateName" class="edit-template-form-input" placeholder="Ej: Mi plantilla personal" 
                            value="" maxlength="50">
                    </div>
                    
                    <div class="edit-template-form-group">
                        <label for="editTemplateDescription" class="edit-template-input-info">Descripción:</label>
                        <input type="text" id="editTemplateDescription" class="edit-template-form-input" 
                            placeholder="Describe la utilidad u objetivo" 
                            value="" maxlength="100">
                    </div>
                    
                    <div class="edit-template-form-group">
                        <div class="textarea-wrapper">
                            <label for="editTemplateContent" class="edit-template-input-info">Contenido:</label>
                            <textarea id="editTemplateContent" class="edit-template-form-input edit-template-content-textarea scroll-item" 
                                    placeholder="Contenido bruto de la plantilla..."></textarea>
                        </div>
                    </div>

                    <div class="edit-template-modifdate hidden">
                        <span id="editTemplateModifDateIcon"><i class="fa-regular fa-clock"></i></span>
                        <span id="editTemplateModifDateValue" class="one-line-element"></span>
                    </div>
                </div>
            </div>

            <div class="edit-template-actions">
                <button
                    class="cancel-btn generic-btn"
                    id="editTemplateCancelBtn"
                    role="button"
                    aria-label="Cerrar edición de plantilla"
                    aria-pressed="false"
                >Cancelar</button>
                <button
                    class="save-btn generic-btn"
                    id="editTemplateSaveBtn"
                    role="button"
                    aria-label="Guardar plantilla"
                    aria-pressed="false"
                ></button>
            </div>
        `;

        const customTemplates = storageService.getCustomTemplates();
        const sources = [
            {
                templates: {...customTemplates.posts, ...postsTemplates},
                tabContainer: templatesPostsContainer,
                type: 'posts'
            },
            {
                templates: {...customTemplates.bio, ...bioTemplates},
                tabContainer: templatesBioContainer,
                type: 'bio'
            }
        ];

        for (const { templates, tabContainer, type } of sources) {
            // Separar plantillas personalizadas y por defecto
            const customEntries = Object.entries(templates).filter(([key, template]) => template.isCustom);
            const defaultEntries = Object.entries(templates).filter(([key, template]) => !template.isCustom);

            // Añadir primero las plantillas personalizadas
            customEntries.forEach(([key, template]) => {
                this.createTemplateCard({
                    key: key,
                    template: template,
                    container: tabContainer,
                    type: type,
                    isCustom: true,
                    autoMode: true
                });
            });

            // Añadir separador si hay plantillas personalizadas
            if (customEntries.length > 0 && defaultEntries.length > 0) {
                const separator = document.createElement('div');
                separator.className = 'templates-separator';
                separator.innerHTML = '<span>Plantillas predeterminadas</span>';
                tabContainer.appendChild(separator);
            }
            
            // Añadir plantillas por defecto
            defaultEntries.forEach(([key, template]) => {
                this.createTemplateCard({
                    key: key,
                    template: template,
                    container: tabContainer,
                    type: type,
                    isCustom: false,
                    autoMode: true
                });
            });
        };

        // Estilos para el estado activo
        const style = document.createElement('style');
        style.textContent += `
            & #templatesOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                &.active {
                    opacity: 1 !important;
                    visibility: visible !important;
                }
            }

            #templatesMenu {
                position: fixed;
                bottom: 0;
                left: 50%;
                transform: translate(-50%, 100%);
                background: linear-gradient(45deg, #000000 85%, #1d0d12 100%);;
                backdrop-filter: var(--blur);
                border: 1px solid var(--glass-border);
                border-radius: 24px 24px 0 0;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                max-width: 700px;
                width: 90vw;
                min-height: 400px;
                height: calc(80vh - 25px);
                opacity: 0;
                visibility: hidden;
                transition: transform .3s cubic-bezier(0.4, 0, 0.2, 1), opacity .5s ease;
                overflow: hidden;
                &.active,
                &.active ~ div {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: translate(-50%, 0) !important;
                }
                &:not(.active) * {
                    pointer-events: none; /* También evita clicks */
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                /* Scrollbar personalizada para el contenedor de plantillas */
                & div::-webkit-scrollbar { 
                    width: 21px; /* 7px scrollbar + 7px border a cada lado */
                }
                & div::-webkit-scrollbar-thumb {
                    background: var(--scrollbar-color);
                    border-radius: 10px;
                    border: 7px solid transparent;
                    background-clip: content-box;
                    min-height: 25px;
                }
                & div::-webkit-scrollbar-thumb:hover {
                    background: var(--scrollbar-color-hover);
                    border-radius: 10px;
                    border: 7px solid transparent;
                    background-clip: content-box;
                    min-height: 25px;
                }
                & div::-webkit-scrollbar-track {
                    background: var(--scrollbar-track-color);
                    border-radius: 10px;
                    border: 7px solid transparent;
                    background-clip: content-box;
                }

                & .templates-menu-header {
                    padding: 25px 30px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.01);
                    
                    z-index: 10;

                    & .templates-header-title {
                        color: rgba(255, 255, 255, 0.9);
                        margin: 0;
                        font-size: 1.4rem;
                        font-weight: 700;
                        text-align: center;
                    }

                    & .templates-header-subtitle  {
                        color: rgba(255, 255, 255, 0.6);
                        margin: 8px 0 0;
                        font-size: 0.9rem;
                        text-align: center;
                    }
                    
                    & #newTemplateBtn,
                    & .close-btn {
                        display: flex;
                        position: absolute;
                        border: none;
                        border-radius: 8px;
                        padding: 10px;
                        cursor: pointer;
                        transition: all 0.2s ease, transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        align-items: center;
                        justify-content: center;
                        font-size: 0.8rem;
                    }

                    & #newTemplateBtn {
                        top: 20px;
                        left: 20px;
                        color: #2D3748;
                        background: rgba(255, 255, 255, 0.03);
                        &:hover {
                            background: rgba(255, 255, 255, 0.05);
                        }
                        &.hidden {
                            opacity: 0;
                            transform: scale(0.7);
                            pointer-events: none;
                        }
                        & i { margin-right: 5px; }
                    }

                    & .close-btn {
                        top: 20px;
                        right: 20px;
                        background: rgba(0, 0, 0, 0.3);
                        &:hover {
                            background: rgba(0, 0, 0, 0.65);
                        }
                        & i { color: #923e45; }
                    }
                }

                & .templates-tabs {
                    display: flex;
                    margin-top: 20px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 12px;
                    padding: 4px;
                }

                & .templates-container-div {
                    padding: 20px 1px 0px 20px;
                    hieght: 100%;
                    display: flex;
                    flex-direction: row;
                    z-index: 9;
                    transition: opacity .2s;
                    
                    &.editMode {
                        overflow: hidden;

                        & .template-tab-container {
                            opacity: 0 !important;
                            pointer-events: none;
                        }
                        & #editTemplateTab {
                            transform: translateY(0);
                            pointer-events: initial;
                            opacity: 1;
                            
                            & .edit-template-actions {
                                transform: translate(0, -15%);
                            }
                        }
                    }

                    & #editTemplateTab {
                        position: absolute;
                        top: 163px; /* Tamaño del header */
                        left: 0;
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: calc(100% - 163px);
                        opacity: 0;
                        z-index: 2;
                        pointer-events: none;
                        transform: translateY(100%);
                        transition: transform .3s ease, opacity .15s;

                        & .edit-template-wrapper {
                            flex: 1;
                            overflow-y: auto;
                            margin-bottom: 25px;
                            scrollbar-gutter: stable;

                            & .edit-template-content {
                                padding: 20px 1px 20px 20px;

                                & .edit-template-form-group {
                                    margin-bottom: 20px;
                                    &:last-child {
                                        margin-bottom: 40px;
                                    }
                                    
                                    & .edit-template-input-info {
                                        display: block;
                                        margin-bottom: 8px;
                                        font-weight: 500;
                                        color: var(--text-primary);
                                        font-size: 0.7rem;
                                        opacity: 0.8;
                                    }
                                    
                                    & .edit-template-form-input {
                                        width: 100%;
                                        padding: 12px;
                                        color: var(--text-quaternary);
                                        border-radius: 8px;
                                        font-size: 0.95rem;
                                        transition: color .3s ease, background .3s ease, border .3s ease;
                                        border: none;
                                        outline: none;
                                        background: var(--glass-bg);
                                        box-sizing: border-box;
                                        &:focus {
                                            background: var(--glass-border);
                                            color: var(--text-terciary);
                                        }
                                        &.empty-input-error {
                                            background: rgba(255, 200, 205, 0.065) !important;
                                        }
                                    }                                
                                    
                                    & .edit-template-content-textarea {
                                        min-height: 120px;
                                        max-height: 300px;
                                        resize: vertical;
                                        line-height: 1.5;
                                    }
                                }

                                & .edit-template-modifdate {
                                    display: flex;
                                    width: 80%;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 8px;
                                    margin: 20px auto;
                                    color: var(--text-quaternary);
                                    opacity: 0.25;
                                    font-size: 0.7rem;
                                    &.hidden {
                                        display: none;
                                    }
                                    
                                    & i {
                                        color: var(--text-terciary);
                                        font-size: 0.65rem;
                                    }
                                    
                                    & span {
                                        color: var(--text-quaternary);
                                        font-size: inherit;
                                    }

                                    & #editTemplateModifDateIcon {
                                        flex-shrink: 0;
                                    }
                                    & #editTemplateModifDateValue {
                                        flex-shrink: 1;
                                        word-wrap: break-word;
                                        justify-content: center;
                                    }
                                }
                            }
                        }


                        & .edit-template-actions {
                            position: fixed;
                            left: 0;
                            bottom: -5px;
                            display: flex;
                            width: 100%;
                            gap: 12px;
                            transform: translate(0, calc(100% + 10px));
                            justify-content: right;
                            border-top: 1px solid var(--glass-border);
                            background: rgba(0, 0, 0, 0.3);
                            backdrop-filter: var(--blur);
                            padding: 10px 20px 10px 20px;
                            z-index: 11;
                            transition:
                                transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                                bottom .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

                            & .cancel-btn {
                                padding: 8px 12px;
                                font-weight: 500;
                                font-size: 0.8rem;
                                background: transparent;
                                &:hover {
                                    color: white;
                                    filter: brightness(1.2);
                                }
                            }                            
                            
                            & .save-btn {
                                padding: 8px 16px;
                                font-weight: 600;
                                font-size: 0.9rem;
                                background: linear-gradient(135deg, #614888 0%, #8b2d3d 100%);
                                color: var(--text-terciary);
                                box-shadow: 0 0 0 rgba(0, 0, 0, 0);
                                &:hover {
                                    
                                    box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
                                }
                            }                            
                        }
                    }

                    & #postsTabTemplates,
                    & #bioTabTemplates {
                        z-index: 1;
                    }

                    & #postsTabTemplates:not(.active) { transform: translateX(-100%) scaleX(0); }
                    & #bioTabTemplates:not(.active) { transform: translateX(100%) scaleX(0); }
                    & .template-tab-container {
                        padding-bottom: 0;
                        display: grid;
                        opacity: 0;
                        width: 0;
                        height: 0;
                        max-height: calc(80vh - 210px);
                        padding-bottom: 20px;
                        margin-bottom: 20px;
                        overflow-y: auto;
                        overflow-x: hidden;
                        scrollbar-gutter: stable;
                        transition: all .3s ease, opacity .5s ease;
                        &.active {
                            height: 100%;
                            width: 100%;
                            transform: translateX(0) scaleX(1);
                            opacity: 1;
                            padding-bottom: 10px;
                        }

                        & .templates-separator {
                            margin: 0 0 16px 10px;
                            color: #2D3748;
                            transition: all .3s;
                            &.removed {
                                max-height: 0;
                                margin-bottom: 0;
                                transform: scaleY(0) translateY(-100%);
                            }
                        }

                        & .template-card {
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 16px;
                            padding: 20px;
                            margin-bottom: 16px;
                            cursor: pointer;
                            position: relative;
                            overflow: hidden;
                            transition: all .3s;
                            &.removed {
                                max-height: 0;
                                margin-bottom: 0;
                                padding: 0;
                            }
                            &:last-child {
                                margin-bottom: 0;
                            }
                            &:hover {
                                transform: translateY(-2px);
                                background: rgba(255, 255, 255, 0.07);
                                & .card-expand-btn {
                                    opacity: 1 !important;
                                    scale: 1 !important;
                                }
                            }
                            &.expanded:hover {
                                transform: translateY(0);
                            }
                            &.expanded {
                                & .card-expand-btn {
                                    opacity: 1 !important;
                                    scale: 1 !important;
                                    transform: rotate(180deg) !important;
                                }
                                & .template-preview-line {
                                    opacity: 0;
                                    max-height: 0;
                                }
                                & .template-full-content {
                                    max-height: 400px;
                                    opacity: 1;
                                    margin-top: 15px;
                                }
                            }
                            
                            & .template-header {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                margin-bottom: 12px;
            
                                & .template-info {
                                    flex: 1;
                                    color: var(--text-quaternary);
                
                                    & .template-title,
                                    & .template-description {
                                        color: inherit;
                                        word-break: break-all;
                                    }
                                    & .template-title {
                                        font-weight: 700;
                                        max-width: 70%;
                                        margin-bottom: 6px;
                                        font-size: 1.1rem;
                                    }
                                    & .template-description {
                                        font-size: 0.9rem;
                                        max-width: 80%;
                                        opacity: 0.8;
                                        line-height: 1.4;
                                    }
                                }

                                & .card-sup-btn {
                                    background: transparent;
                                    border: none;
                                    font-size: 1.2rem;
                                    color: var(--text-quaternary);
                                }
            
                                & .card-expand-btn {
                                    pointer-events: none;
                                    flex-shrink: 0;
                                    margin-left: 15px;
                                    opacity: 0;
                                    scale: 0;
                                    transform: rotate(0);
                                    transition:
                                        opacity .3s,
                                        scale .3s,
                                        transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                                }
                            }
            
                            & .template-preview-line {
                                max-width: 85%;
                                font-size: 0.8rem;
                                color: var(--text-quaternary);
                                opacity: 0.5;
                                max-height: 21px;
                                overflow: hidden;
                                white-space: nowrap;
                                word-break: break-all;
                                transition: all 0.3s ease;
                            }
            
                            & .template-full-content {
                                max-height: 0;
                                overflow: hidden;
                                transition: all .4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                                opacity: 0;
                                margin-top: 0;
                                
                                & .template-content-display {
                                    background: rgba(0, 0, 0, 0.2);
                                    padding: 15px;
                                    border-radius: 12px;
                                    font-size: 0.9rem;
                                    line-height: 1.5;
                                    white-space: pre-wrap;
                                    color: var(--text-quaternary);
                                    margin-bottom: 15px;
                                    max-height: 300px;
                                    overflow-y: auto;
                                    cursor: text;
                                    transition: opacity .3s ease, transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                                }
            
                                & .template-action-buttons {
                                    display: flex;
                                    gap: 12px;
                                    justify-content: flex-end;
                                    flex-wrap: wrap;
            
                                    & .card-btn {
                                        transform: translateX(0);
                                        background: var(--glass-bg);
                                        border: 1px solid transparent;
                                        color: var(--text-terciary);
                                        padding: 8px 12px;
                                        border-radius: 8px;
                                        font-size: 0.8rem;
                                        font-weight: 500;
                                        cursor: pointer;
                                        transition: all 0.2s ease;
                    
                                        &:hover {
                                            transform: translateX(-5px);
                                            background: var(--glass-border);
                                        }
                                    }

                                    & .card-trash-btn {
                                        background-color: transparent;
                                        font-size: 0.9rem;
                                        & i {
                                            transition: all .3s ease;
                                        }
                                        &:hover {
                                            background-color: transparent;
                                            color: #ce3758af;
                                            transform: translate(0, 0);

                                            & i {
                                                transform: scale(1.2);
                                            }
                                        }
                                    }
                    
                                    & .card-use-btn {
                                        background: linear-gradient(135deg, #614888 0%, #8b2d3d 100%);
                                        color: var(--text-terciary);
                                        border: none;
                                        padding: 10px 16px;
                                        border-radius: 8px;
                                        font-size: 0.9rem;
                                        font-weight: 600;
                                        cursor: pointer;
                                        transition: all 0.2s ease;
                                        transform: translateX(0);
                                        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
                    
                                        &:hover {
                                            transform: translateX(-5px);
                                            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
                                        }
                                    }
                                }
                            }
                        }   
                    }
                }
            }
        `;

        this.elements.templatesContainer.appendChild(templatesPostsContainer);
        this.elements.templatesContainer.appendChild(templatesBioContainer);
        this.elements.templatesContainer.appendChild(templatesEditContainer);
        this.elements.menu.appendChild(header);
        this.elements.menu.appendChild(this.elements.templatesContainer);
        this.elements.overlay.appendChild(this.elements.menu);

        const editTemplateInputs = templatesEditContainer.querySelectorAll('.edit-template-form-input');
        editTemplateInputs.forEach((input, index) => {
            if (input.tagName === 'INPUT') {
                input.addEventListener('keydown', (e) => {
                    if (e.key === "Enter" && input.value.trim() !== '') {
                        e.preventDefault();
                        const next = editTemplateInputs[index + 1];
                        if (next) {
                            next.focus();
                        }
                    }
                });
            }
        });

        // Cerrar al hacer clic en overlay
        this.elements.overlay.addEventListener('click', (e) => {
            if (e.target === this.elements.overlay) {
                this.closeTemplates();
            }
        });

        document.head.appendChild(style);
        document.body.appendChild(this.elements.overlay);
        
        document.getElementById('editTemplateCancelBtn').onclick = () => this.toggleEditMode({from: 'cancelBtn'});
    }

    /**
     * Close and restore view of templates menu & restore body scroll
     */
    closeTemplates() {
        if (this.elements.overlay && this.elements.overlay.classList.contains('active')) {
            this.elements.overlay.classList.remove('active');
        }
        if (this.elements.menu && this.elements.menu.classList.contains('active')) {
            this.elements.menu.classList.remove('active');
        }

        if (this.elements.templatesContainer && this.elements.templatesContainer.classList.contains('editMode')) {
            this.toggleEditMode({from: 'closeTemplates'});
        }

        setBodyScroll(true);
    }
    
    /**
     * Generate uniq ID for new custom template
     *
     * @returns {string} 
     */
    generateTemplateId() {
        return 'custom_template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Create new custom template or edit one
     *
     * @param {object} customTemplates - saved templates
     * @param {string} templateType - tab location (posts or bio)
     * @param {object} templateData - template propperties at the time of clicking the save button
     * @param {object} editData  - New data for a template if is on edit mode
     * @param {boolean} isEditing - Is edit mode or not
     */
    createCustomTemplate(customTemplates, templateType, templateData, editData, isEditing) {
        let templateChanged = false; // Variable para saber si mostrar cambios visuales post-edición
        let isFirstKey = false; // Variable para controlar si se anima la edicion
        let isFirstItem = null; // Si es el primer elemento del nuevo tipo, se creará el separador en el nuevo contenedor
        let isLastItem = null; // Si era el ultimo elemento del anterior tipo, se eliminará el separador del anterior tipo (solo isEditing)
        let notificationText = ''; // Texto de la notificación (si se muestra)
    
        const templateCardId = templateData.id; // ID del objeto (y la tajeta)
    
        // Elementos
        const tabContainer = document.getElementById(templateType === 'posts' ? 'postsTabTemplates' : 'bioTabTemplates');
        let separator = null; // Se almacenará el elemento HTML del separador del contenedor actual
        let prevSeparator = null; // Se almacenará el elemento HTML del separador del contenedor que contenía la tarjeta antes de moverla
    
    
        const showVisualEffect = () => {
            let willBeNotified = false; // Validar si el cambio será notificado (si, en el caso de que se realicen cambios)
    
            const addSeparator = () => {
                separator = document.createElement('div');
                separator.className = 'templates-separator removed';
                separator.innerHTML = '<span>Plantillas predeterminadas</span>';
                tabContainer.insertBefore(separator, tabContainer.firstChild);
            };
    
            const tryNotificate = () => {
                if (willBeNotified && notificationText !== '') {
                    notificationService.showSuccess(notificationText);
                }
            };
    
            if (isEditing) {
                const templateCard = document.getElementById(templateCardId);
    
                const removeSeparator = () => {
                    const prevTabContainer = document.getElementById(editData.type === 'posts' ? 'postsTabTemplates' : 'bioTabTemplates');
                    prevSeparator = prevTabContainer.querySelector('.templates-separator');
                    prevTabContainer.removeChild(prevSeparator);
                };
    
                // Funcion para actualizar los datos que envian los botones de la tarjeta
                const updateButtonBinds = () => {
                    const templateBtnDelete = templateCard.querySelector('.card-trash-btn');
                    templateBtnDelete.onclick = (e) => {
                        e.stopPropagation();
                        this.deleteCustomTemplate(templateData.id, templateType, templateCard.id, tabContainer);
                    };
    
                    const templateBtnEdit = templateCard.querySelector('.card-edit-btn');
                    templateBtnEdit.onclick = (e) => {
                        e.stopPropagation();
                        this.toggleEditMode({
                            editData: {
                                id: templateData.id,
                                type: templateType,
                                name: templateData.name,
                                description: templateData.description,
                                content: templateData.content,
                                createdAt: templateData.createdAt,
                                updatedAt: templateData.updatedAt
                            },
                            from: 'editBtn'
                        });
                    };

                    const templateBtnUse = templateCard.querySelector('.card-use-btn');
                    templateBtnUse.onclick = (e) => {
                        e.stopPropagation();
                        textInput.value = templateData.content;
                        window.updateOutput();
                        this.closeTemplates();
                        notificationService.showSuccess(`Plantilla "${templateData.name}" aplicada`);
                        setTimeout(() => {
                            textInput.focus();
                            textInput.setSelectionRange(0, 0);
                        }, 300);
                    };

                    let isFormatted = templateCard.dataset.formatted === 'true';;
                    const templateContentText = templateCard.querySelector('.template-content-display');
                    const templateBtnFormat = templateCard.querySelector('.card-format-btn');
                    templateBtnFormat.textContent = 'Ver Raw';
                    templateBtnFormat.onclick = (e) => {
                        e.stopPropagation();
                        isFormatted = !isFormatted;
                
                        if (isFormatted) {
                            templateContentText.textContent = formatText(templateData.content);
                            templateBtnFormat.textContent = 'Ver Raw';
                        } else {
                            templateContentText.textContent = templateData.content;
                            templateBtnFormat.textContent = 'Ver Formato';
                        }

                        templateCard.dataset.formatted = isFormatted ? 'true' : 'false';
                
                        // Pequeña animación de cambio
                        templateContentText.style.opacity = '0.7';
                        templateContentText.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            templateContentText.style.opacity = '1';
                            templateContentText.style.transform = 'scale(1)';
                        }, 150);
                    };
                };
    
                if (templateChanged) {
                    const templateTitle = templateCard.querySelector('.template-title');
                    const templateDescription = templateCard.querySelector('.template-description');
                    const templateContent = templateCard.querySelector('.template-content-display');
                    const templatePreview = templateCard.querySelector('.template-preview-line');
                    
                    const typeChanged = templateData.type !== templateType;
    
                    // Inicialmente oculta
                    if (!isFirstKey) templateCard.classList.add('removed');
                    
                    // Actualizar datos
                    templateCard.dataset.formatted = 'true';
                    const content = formatText(templateData.content);
                    templateTitle.innerHTML = `<i class="fa-solid fa-cloud-arrow-down" style="color: #ce3758;"}></i> ${templateData.name}`;
                    templateTitle.title = templateData.name;
                    templateDescription.textContent = templateData.description;
                    templateDescription.title = templateData.description;
                    templatePreview.textContent = content;
                    templateContent.textContent = content;
                    
                    if (isLastItem) removeSeparator();
    
                    if (!isFirstKey) {
                        setTimeout(() => {
                            // Insertar tarjeta en el contenedor
                            if (isFirstItem) addSeparator();
                            tabContainer.insertBefore(templateCard, tabContainer.firstChild);
                            tabContainer.scrollTo({ top: 0, behavior: 'smooth' });
                        }, typeChanged ? 0 : 300);
                        
                        setTimeout(() => { // Mostrar tarjeta
                            if (separator !== null) separator.classList.remove('removed');
                            templateCard.classList.remove('removed');
                        }, typeChanged ? 0 : 350);
                    }
    
                    willBeNotified = true;
                    updateButtonBinds();
                }
    
            } else {                    
                //const templates = templateType === 'posts' ? customTemplates.posts : customTemplates.bio;
                const templateCard = this.createTemplateCard({
                    key: templateCardId,
                    template: templateData,
                    container: tabContainer,
                    type: templateType,
                    isCustom: true,
                    autoMode: false
                });
    
                templateCard.classList.add('removed');
    
                if (isFirstItem) addSeparator();
    
                tabContainer.insertBefore(templateCard, tabContainer.firstChild);
                tabContainer.scrollTo({ top: 0, behavior: 'smooth' });
    
                setTimeout(() => {
                    if (separator !== null) separator.classList.remove('removed');
                    templateCard.classList.remove('removed');
                }, 0);
    
                willBeNotified = true;
            }
    
            tryNotificate(); // Notificar si es necesario
        };
    
        const updateTemplateProps = () => {
            if (isEditing) {
                const updateItemPos = () => {
                    isFirstItem = Object.keys(customTemplates[templateType]).length === 1; // 1 por que ya se añadió
                    isLastItem = Object.keys(customTemplates[editData.type]).length === 0; // 0 por que ya se eliminó
                }
    
                // Determinar si es la primera clave, para no animar la actualización
                isFirstKey = Object.keys(customTemplates[editData.type])[0] === templateData.id && editData.type === templateType;
                
                // Verificar si el tipo cambió
                const typeChanged = editData.type !== templateType;
                
                if (typeChanged) {
                    // Eliminar del tipo anterior (si existe)
                    if (customTemplates[editData.type] && customTemplates[editData.type][editData.id]) {
                        delete customTemplates[editData.type][editData.id];
                    }
                    
                    // Asegurar que existe el objeto del nuevo tipo
                    if (!customTemplates[templateType]) {
                        customTemplates[templateType] = {};
                    }
                    
                    // Añadir al principio en el nuevo tipo (se movió, así que se recoloca)
                    customTemplates[templateType] = {
                        [editData.id]: templateData,
                        ...customTemplates[templateType]
                    };
    
                    templateChanged = true;
                    notificationText = `Plantilla "${templateData.name}" movida de ${editData.type} a ${templateType}`;
                } else {
                    // El tipo no cambió: verificar si el contenido cambió para recolocar
                    const currentTemplate = customTemplates[templateType] && customTemplates[templateType][editData.id];
                    let contentChanged = true; // Asumir que cambió por defecto
                    
                    if (currentTemplate) {
                        // Comparar si realmente cambió el contenido (opcional pero recomendado)
                        contentChanged = JSON.stringify(currentTemplate) !== JSON.stringify(templateData);
                    }
                    
                    // Asegurar que existe el objeto del tipo
                    if (!customTemplates[templateType]) {
                        customTemplates[templateType] = {};
                    }
                    
                    if (contentChanged) {
                        // Contenido cambió: recolocar al principio
                        // Crear copia sin el elemento actual
                        const otherTemplates = { ...customTemplates[templateType] };
                        delete otherTemplates[editData.id];
                        
                        // Recolocar al principio
                        customTemplates[templateType] = {
                            [editData.id]: templateData,
                            ...otherTemplates
                        };
    
                        templateChanged = true;
                        notificationText = `Plantilla "${templateData.name}" actualizada`;
                    }
                }
                
                templateData.updatedAt = templateChanged ? Date.now().toString() : templateData.updatedAt;
                updateItemPos(); // Actualizar posición y situación del elemento en los contenedores
            } else {
                const updateItemPos = () => {
                    isFirstItem = Object.keys(customTemplates[templateType]).length === 1; // 1 por que ya se añadió
                }
                
                // Asegurar que existe el objeto del tipo
                if (!customTemplates[templateType]) {
                    customTemplates[templateType] = {};
                }
                
                // Añadir al principio (elemento nuevo)
                customTemplates[templateType] = {
                    [templateCardId]: templateData,
                    ...customTemplates[templateType]
                };
                
                notificationText = `Plantilla "${templateData.name}" creada`;
                updateItemPos(); // Actualizar posición y situación del elemento en los contenedores
            }
        }
        
        updateTemplateProps(); // Actualizar valores de customTemplates 
        storageService.saveCustomTemplates(customTemplates); // Guardar cambios
    
        if (isEditing && isFirstKey) { // Actualizar contenidos primero
            showVisualEffect();
            setTimeout(() => {
                this.toggleEditMode({from: 'saveBtn'});
            }, 0);
        } else { // Actualizar contenidos despues
            this.toggleEditMode({from: 'saveBtn'}); // Cerrar el modo edición antes de añadir visualmente
            setTimeout(() => { // Esperar a que se cierre el modo edición
                showVisualEffect()
            }, 300);
        }
    }
    
    
    /**
     * Delete a custom template
     *
     * @param {string} templateId - ID on custom templates (localStorage)
     * @param {string} templateType - Necessary to remove from localStorage
     * @param {string} templateCardId - ID of HTMLElement template card
     * @param {HTMLElement} templateTabContainer - Container where the template is located
     */
    deleteCustomTemplate(templateId, templateType, templateCardId, templateTabContainer) {
        const customTemplates = storageService.getCustomTemplates();
        const isLastItem = Object.keys(customTemplates[templateType]).length === 1;
        
        // Eliminar visualmente
        const separator = templateTabContainer.querySelector('.templates-separator');
        const templateCard = document.getElementById(templateCardId);
        
        templateCard.classList.add('removed');
        if (isLastItem) separator.classList.add('removed');
    
        setTimeout(() => {
            templateTabContainer.removeChild(templateCard);
            if (isLastItem) templateTabContainer.removeChild(separator);
        }, 350);
        
        // Eliminar en localStorage
        const templateName = customTemplates[templateType][templateId]?.name || 'de usuario';
        delete customTemplates[templateType][templateId];
        storageService.saveCustomTemplates(customTemplates);
        
        notificationService.showSuccess(`Plantilla "${templateName}" eliminada`);
    }
    
    /**
     * Show/hide templates menu
     */
    toggleTemplates() {
        if (this.elements.menu.classList.contains('active')) {
            this.closeTemplates(); // setBodyScroll(true); se establece dentro de closeTemplates()
        } else {
            this.elements.overlay.classList.add('active');
            this.elements.menu.classList.add('active');
            setBodyScroll(false);
        }
    }
    
    
    /**
     * Show/hide the edit mode and manage this mode interactions
     *
     * @param {{ editData?: object; from?: string; }} [param0={}] 
     * @param {*} [param0.editData=null] - If is editing a template, receive new data to refresh
     * @param {*} [param0.from=null] - Location from this function was called `['cancelBtn', 'closeTemplates', 'main', 'templates', 'editBtn']`
     */
    toggleEditMode({editData = null, from = null} = {}) {
        // Elementos
        const textInput = document.getElementById('textInput');

        // Variables de control
        const isEditing = editData !== null; // Modo: editar / crear
        const wasOpened = this.elements.templatesContainer.classList.contains('editMode'); // ¿Estaba abierto el modo edición?
        if (!wasOpened) this.states.prevTemplatesTab = this.states.currentTemplatesTab; // Guardar la pestaña donde se abrió. En caso de cancelar o hacer click fuera, se volverá a ella
        let content; // Variable de reescate de contenido
        
        // FROMS:  editBtn, saveBtn, templates, cancelBtn, main, closeTemplates
        if (from === 'cancelBtn' || from === 'closeTemplates') { // Se cerrará el menú sin guardar, volver a la pestaña original
            const tabBtnTemplatesTarget = document.getElementById(this.states.prevTemplatesTab === 'posts'
                ? 'templatesPostsTabBtn'
                : 'templatesBioTabBtn'
            );
            tabBtnTemplatesTarget.click();
            tabBtnTemplatesTarget.blur();
        }
        else if (from === 'main') content = textInput.value;
        else if (from === 'templates') content = '';
        else content = '';
    
        // Elementos del menu
        const title = document.querySelector('.templates-header-title');
        const subtitle = document.querySelector('.templates-header-subtitle');
        const addNewBtn = document.getElementById('newTemplateBtn');
        const saveBtn = document.getElementById('editTemplateSaveBtn');
        const cancelBtn = document.getElementById('editTemplateCancelBtn');
    
        // Elementos del modo edición
        const templateName = document.getElementById('editTemplateName');
        const templateDescription = document.getElementById('editTemplateDescription');
        const templateContent = document.getElementById('editTemplateContent');
        const templateDateContainer = document.querySelector('.edit-template-modifdate');
        const templateDateValue = document.getElementById('editTemplateModifDateValue');
    
        const showInputError = (emptyItem) => {
            emptyItem.classList.add('empty-input-error');
            setTimeout(() => {
                emptyItem.classList.remove('empty-input-error');
            }, 1300);
        }
        
        // Funciones básicas
        const validateData = (customTemplates, templateType, templateData) => {
            const name = templateName.value.trim();
            const description = templateDescription.value.trim();
            const content = templateContent.value.trim();
            
            if (!name) {
                notificationService.show('El nombre de la plantilla es obligatorio', 'warning');
                templateName.focus();
                showInputError(templateName);
                return false;
            }
            
            if (!description) {
                notificationService.show('La descripción de la plantilla es obligatoria', 'warning');
                templateDescription.focus();
                showInputError(templateDescription);
                return false;
            }
            
            if (!content) {
                notificationService.show('El contenido de la plantilla es obligatorio', 'warning');
                templateContent.focus();
                showInputError(templateContent);
                return false;
            }
    
            // Comprobar duplicaciones
            // El nombre está duplicado en la pestaña actual? Error, no permitido
            const hasNameAlready = Object.values(templateType === 'posts'
                ? customTemplates.posts
                : customTemplates.bio
            ).some(
                p => p.name === templateData.name 
                    && p.id !== templateData.id
            );
    
            // El contenido está duplicadoen alguna pestaña? Advertencia, permitido
            const hasContentAlready = 
                Object.values(customTemplates.posts).some(
                    p => p.content === templateData.content
                        && p.id !== templateData.id
                )
                || Object.values(customTemplates.bio).some(
                    p => p.content === templateData.content
                        && p.id !== templateData.id
                )
    
            if (hasNameAlready) {
                notificationService.show(`El nombre de la plantilla ya existe`, 'warning');
                showInputError(templateName);
                return false;
            }
            
            if (hasContentAlready) {
                notificationService.show(`Contenido duplicado: otra plantilla tiene el mismo contenido`, 'warning');
            }
            
            return true;
        };
    
        const isEditMode = !wasOpened && isEditing; // Va ser abierto el modo edición
        // Aplicaciones
        addNewBtn.classList.toggle('hidden', !wasOpened);
        this.elements.templatesContainer.classList.toggle('editMode', !wasOpened);
        
        // Cambiar título y subtítulo del menú
        title.textContent = 
            wasOpened
                ? 'Plantillas'
                : isEditMode 
                    ? 'Editar plantilla'
                    : 'Crear plantilla';
        subtitle.textContent = 
            wasOpened
                ? 'Haz click en una plantilla para ver su contenido'
                : isEditMode
                    ? 'Modifica el contenido de la plantilla actual'
                    : 'Escribe una nueva plantilla personalizada';
        
        // Establecer textos de los elementos del menú de edición
        templateName.value = isEditMode ? editData.name : '';
        templateDescription.value = isEditMode ? editData.description : '';
        templateContent.value = isEditMode ? editData.content : content;
    
        const finalDateText = isEditMode
            ? editData.updatedAt !== null
                ? `Modificada hace ${formatTimeAgo(editData.updatedAt)}`
                : `Creada hace ${formatTimeAgo(editData.createdAt)}`
            : '';
        templateDateContainer.classList.toggle('hidden', !isEditMode);
        templateDateValue.textContent = finalDateText;
        templateDateContainer.title = finalDateText;
        saveBtn.textContent = isEditMode ? 'Guardar': 'Crear';
    
        // Abrir el menu si no está abierto
        if (!this.elements.menu.classList.contains('active') && !wasOpened) {
            this.toggleTemplates();
        }
    
        if (!wasOpened) {
            // Focus inicial
            setTimeout(() => {
                templateName.focus();
            }, 100);
    
            // Listeners
            const saveListener = () => {
                const customTemplates = storageService.getCustomTemplates();
                const templateId = this.generateTemplateId(); // Solo para casos de creación.
                const templateType = this.states.currentTemplatesTab; // Utilizar la pestaña actual
                const templateData = {
                    id: isEditing ? editData.id : templateId,
                    type: templateType,
                    name: templateName.value.trim(),
                    description: templateDescription.value.trim(),
                    content: templateContent.value.trim(),
                    //icon: typeSelect.value === 'posts' ? 'fa-file-text' : 'fa-user',
                    isCustom: true,
                    createdAt: isEditing ? editData.createdAt : Date.now().toString(),
                    updatedAt: isEditing ? editData.updatedAt : null
                };
    
                if (!validateData(customTemplates, templateType, templateData)) return;
                this.createCustomTemplate(customTemplates, templateType, templateData, editData, isEditing);
            }
    
            saveBtn.onclick = () => saveListener();
    
        }
    
        // Quitar el foco en los botones
        setTimeout(() => {
            saveBtn.blur();
            cancelBtn.blur();
        }, 0);
    }
    
    /**
     * Create new template and add to the DOM or return this template
     *
     * @param {{ key: string; template: object; container: HTMLElement; type: string; isCustom: boolean; autoMode: boolean; }} param0 
     * @param {string} param0.key - ID of template
     * @param {object} param0.template - Template propperties
     * @param {HTMLElement} param0.container - Container where the template will be placed
     * @param {string} param0.type - Tab where the template will be configured (localStorage)
     * @param {boolean} param0.isCustom - If is custom or not
     * @param {boolean} param0.autoMode - Whether this function was called at application startup or by user interaction
     * @returns {HTMLElement} If is `autoMode`, the template card will be added to the container, however if `automode === false` and `isCustom === true`, the HTMLElement of the new template will be returned.
     */
    createTemplateCard({key, template, container, type, isCustom, autoMode}) {
        function expandTemplate(card) {
            card.classList.add('expanded');
        }
    
        function collapseTemplate(card) {
            card.classList.remove('expanded');
        }

        const textInput = document.getElementById('textInput'); // Input principal
        
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card';
        templateCard.dataset.formatted = 'true';
    
        const templateHeader = document.createElement('div');
        templateHeader.className = 'template-header';
    
        const templateInfo = document.createElement('div');
        templateInfo.className = 'template-info';
        const iconProps = {
            icon: isCustom ? 'fa-cloud-arrow-down' :template.icon,
            color: isCustom ? '#ce3758' : 'inherit'
        };
    
        templateInfo.innerHTML = `
            <div class="one-line-element unselectable-item template-title${isCustom ? ' notranslate' : ''}"
                title="${template.name}"${isCustom ? ' translate="no" data-translate="no"' : ''}>
                <i class="fa-solid ${iconProps.icon}" style="color: ${iconProps.color};"}></i> ${template.name}
            </div>
            <div class="one-line-element unselectable-item template-description${isCustom ? ' notranslate' : ''}"
                title="${template.description}${isCustom ? ' translate="no" data-translate="no"' : ''}">
                ${template.description}
            </div>
        `;
    
        const templateSupButtons = document.createElement('div');
        
        const expandIcon = document.createElement('button');
        expandIcon.className = 'card-expand-btn card-sup-btn icon-element';
        expandIcon.setAttribute('role', 'button');
        expandIcon.setAttribute('aria-label', `Expandir área de texto`);
        expandIcon.setAttribute('aria-pressed', 'false');
        expandIcon.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    
        templateSupButtons.appendChild(expandIcon);
        templateHeader.appendChild(templateInfo);
        templateHeader.appendChild(templateSupButtons);
    
        const templatePreview = document.createElement('div');
        templatePreview.className = `template-preview-line one-line-element unselectable-item${isCustom ? ' notranslate' : ''}`;
        templatePreview.translate = 'no';
        templatePreview.dataset.translate = 'no';
    
        // Mostrar preview formateado
        const formattedPreview = formatText(template.content);
        templatePreview.textContent = formattedPreview.substring(0, 100) + '...';
    
        const templateFullContent = document.createElement('div');
        templateFullContent.className = `template-full-content${isCustom ? ' notranslate' : ''}`;
        templateFullContent.translate = 'no';
        templateFullContent.dataset.translate = 'no';
    
        const contentText = document.createElement('div');
        contentText.className = 'template-content-display scroll-item';
    
        // Inicialmente mostrar contenido formateado
        let isFormatted = templateCard.dataset.formatted = 'true';
        contentText.textContent = formatText(template.content);
    
        const actionButtons = document.createElement('div');
        actionButtons.className = 'template-action-buttons';
    
        const toggleFormatButton = document.createElement('button');
        toggleFormatButton.className = 'card-btn card-format-btn';
        toggleFormatButton.setAttribute('role', 'button');
        toggleFormatButton.setAttribute('aria-label', `Cambiar vista del formato de texto`);
        toggleFormatButton.setAttribute('aria-pressed', 'false');
        toggleFormatButton.textContent = 'Ver Raw';
    
        toggleFormatButton.onclick = (e) => {
            e.stopPropagation();
            isFormatted = !isFormatted;
    
            if (isFormatted) {
                contentText.textContent = formatText(template.content);
                toggleFormatButton.textContent = 'Ver Raw';
            } else {
                contentText.textContent = template.content;
                toggleFormatButton.textContent = 'Ver Formato';
            }

            templateCard.dataset.formatted = isFormatted ? 'true' : 'false';
    
            // Pequeña animación de cambio
            contentText.style.opacity = '0.7';
            contentText.style.transform = 'scale(0.95)';
            setTimeout(() => {
                contentText.style.opacity = '1';
                contentText.style.transform = 'scale(1)';
            }, 150);
        };
    
        const useButton = document.createElement('button');
        useButton.setAttribute('role', 'button');
        useButton.setAttribute('aria-label', `Insertar plantilla al area de texto`);
        useButton.setAttribute('aria-pressed', 'false');
        useButton.className = 'card-use-btn icon-element';
        useButton.innerHTML = '<i class="fa-solid fa-star" style="color: #ffdb65;"></i> Usar Plantilla';
    
        useButton.onclick = (e) => {
            e.stopPropagation();
            textInput.value = template.content;
            window.updateOutput();
            this.closeTemplates();
            notificationService.showSuccess(`Plantilla "${template.name}" aplicada`);
            setTimeout(() => {
                textInput.focus();
                textInput.setSelectionRange(0, 0);
            }, 300);
        };
    
        if (isCustom) {
            // Asignar un id para poder eliminar el elemento de manera dinámica
            templateCard.id = template.id;
    
            const editBtn = document.createElement('button');
            editBtn.className = 'card-edit-btn card-btn left-divisor';
            editBtn.setAttribute('role', 'button');
            editBtn.setAttribute('aria-label', `Editar plantilla`);
            editBtn.setAttribute('aria-pressed', 'false');
            editBtn.textContent = 'Editar';
    
            editBtn.onclick = (e) => {
                e.stopPropagation();
                this.toggleEditMode({
                    editData: {
                        id: key,
                        type: type,
                        name: template.name,
                        description: template.description,
                        content: template.content,
                        createdAt: template.createdAt,
                        updatedAt: template.updatedAt
                    },
                    from: 'editBtn'
                });
            };
    
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'card-btn card-trash-btn icon-element';
            deleteBtn.setAttribute('role', 'button');
            deleteBtn.setAttribute('aria-label', `Eliminar plantilla`);
            deleteBtn.setAttribute('aria-pressed', 'false');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteCustomTemplate(key, type, templateCard.id, container);
            };
    
    
            actionButtons.appendChild(deleteBtn);
            actionButtons.appendChild(editBtn);
        }
    
        actionButtons.appendChild(toggleFormatButton);
        actionButtons.appendChild(useButton);
    
        templateFullContent.appendChild(contentText);
        templateFullContent.appendChild(actionButtons);
    
        templateCard.appendChild(templateHeader);
        templateCard.appendChild(templatePreview);
        templateCard.appendChild(templateFullContent);
    
        // Toggle expand/collapse
        templateCard.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.classList.contains('template-content-display')) return;
    
            const isExpanded = templateCard.classList.contains('expanded');
    
            if (isExpanded) {
                collapseTemplate(templateCard);
            } else {
                expandTemplate(templateCard);
            }
        });
    
        // Si son creadas automaticamente al cargar la página, simplemente añadir de manera normal
        if (autoMode) {
            container.appendChild(templateCard);
        }
        // Si se crean por el usuario manualmente añadir en la parte superior en modo oculto
        else if (!autoMode && isCustom) {
            return templateCard;
        }
    }
    
    /**
     * Switch to determinated tab
     *
     * @param {string} tab - Name of tab to switch to
     */
    switchTemplatesTab(tab) {
        if (this.states.currentTemplatesTab === tab) return;
        this.states.currentTemplatesTab = tab;
    
        // Botones
        document.getElementById('templatesPostsTabBtn').classList.toggle('active', tab === 'posts');
        document.getElementById('templatesBioTabBtn').classList.toggle('active', tab === 'bio');
        // Contenedores
        document.getElementById('postsTabTemplates').classList.toggle('active', tab === 'posts');
        document.getElementById('bioTabTemplates').classList.toggle('active', tab === 'bio');
    }

    /**
     * Intern Event Binding
     */
    bindEvents() {
        this.elements.saveTemplateMainBtn.onclick = () => this.toggleEditMode({from: 'main'});
    }
}

export default TemplatesComponent;