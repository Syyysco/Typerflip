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

/**
 * System to handle all events and interaction with notifications
 *
 * @export
 * @class NotificationSystem
 * @typedef {NotificationSystem}
 */
export class NotificationSystem {
    
    /**
     * Creates an instance of NotificationSystem.
     *
     * @constructor
     */
    constructor() {
        this.notifications = [];
        this.container = document.getElementById('notificationContainer');
        this.maxNotifications = this.calculateMaxNotifications();
        this.config = APP_CONFIG.NOTIFICATIONS;
        
        this.bindEvents();
    }
    
    /**
     * Generates an uniq ID for a notification
     *
     * @returns {string} Notification ID
     */
    generateNotificationId() {
        return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Calculate max notifications based on window height and notifications height
     *
     * @returns {number} - Max notifications
     */
    calculateMaxNotifications() {
        const viewportHeight = window.innerHeight;
        const notificationHeight = 135; // 1.5 altura + margin => REF: 000n1
        const topMargin = 40;

        if (window.innerWidth > 480) return Math.floor((viewportHeight - topMargin) / notificationHeight);
        return 1; // En versiones moviles solo se mostrará 1 notificación máxima (los estilos son diferentes)
    }

    
    /**
     * General function to handle the display notifications
     *
     * @param {str} message 
     * @param {string} [type='info'] 
     * @param {number} [duration=APP_CONFIG.NOTIFICATIONS.DEFAULT_DURATION] 
     * @returns {{ element: HTMLElement; progressBar: HTMLElement; type: string; timestamp: string; timer: number; progressTimer: number; isRemoving: boolean; }} 
     */
    show(message, type = 'info', duration = APP_CONFIG.NOTIFICATIONS.DEFAULT_DURATION) {
        if (window.innerWidth <= 279) return;
        
        // Prevenir que la misma notificación esté activa más de una vez al mismo tiempo
        const notificationExists = this.notifications.some(notificationObject => {
            return notificationObject.message === message &&
                notificationObject.type === type;
        })

        if (notificationExists) return;

        const notification = this.createNotification(message, type, duration);
        
        // Añadir al principio del contenedor
        notification.element.classList.add('entering'); // Crear elemento con estado colapsado
        this.container.insertBefore(notification.element, this.container.firstChild);
        this.notifications.unshift(notification);

        this.manageOverflow(); // Gestionar overflow ANTES de aplicar estilos y animaciones
        this.updateNotificationStyles(); // Aplicar opacidades graduales

        notification.element.offsetHeight; // Forzar reflow y mostrar
        // Activar transición
        requestAnimationFrame(() => {
            notification.element.classList.remove('entering');
        });
        
        // Mostrar la notificación
        requestAnimationFrame(() => {
            notification.element.classList.add('show');
        });

        // Auto-eliminación - asegurar que el timer se configura correctamente
        if (duration > 0) {
            notification.timer = setTimeout(() => {
                // Verificar que la notificación aún existe antes de eliminar
                if (this.notifications.includes(notification) && !notification.isRemoving) {
                    this.remove(notification);
                }
            }, duration);
        }

        return notification;
    }

    
    /**
     * Method to create and insert notiofication elements to DOM
     *
     * @param {str} message 
     * @param {str} type 
     * @param {number} duration 
     * @returns {{ element: HTMLElement; progressBar: HTMLElement; type: string; timestamp: string; timer: number; progressTimer: number; isRemoving: boolean; }} 
     */
    createNotification(message, type, duration) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        notificationElement.style.background = `${this.config.BG[type.toUpperCase()] || this.config.BG.INFO}`;
        notificationElement.id = this.generateNotificationId();

        const iconElement = document.createElement('i');
        iconElement.className = `fas ${this.config.ICONS[type.toUpperCase()] || this.config.ICONS.INFO} notification-icon`;
        iconElement.style.color = this.config.ICON_COLORS[type.toUpperCase()] || this.config.ICON_COLORS.INFO;

        const textElement = document.createElement('span');
        textElement.className = 'notification-text';
        textElement.textContent = message;

        const progressBar = document.createElement('div');
        progressBar.className = 'notification-progress';
        progressBar.style.background = this.config.PROGESS_COLOR[type.toUpperCase()] || this.config.PROGESS_COLOR.INFO;
        progressBar.style.width = '100%';

        notificationElement.appendChild(iconElement);
        notificationElement.appendChild(textElement);
        notificationElement.appendChild(progressBar);

        const notification = {
            message: message, // Solo necesario para evitar múltiples notificaciones idénticas
            element: notificationElement,
            progressBar: progressBar,
            type: type,
            timestamp: Date.now(),
            timer: null,
            progressTimer: null,
            isRemoving: false
        };

        // Click para eliminar - asegurar que funciona siempre
        notificationElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!notification.isRemoving) {
                this.remove(notification);
            }
        });

        // Animación de la barra de progreso - solo si hay duración
        if (duration > 0) {
            notification.progressTimer = setTimeout(() => {
                if (progressBar && !notification.isRemoving) {
                    progressBar.style.transition = `width ${duration}ms linear`;
                    progressBar.style.width = '0%';
                }
            }, 100);
        }

        return notification;
    }

    /**
     * Remove a notification from the DOM
     *
     * @param {HTMLElement} notification 
     */
    remove(notification) {
        // Prevenir remociones múltiples
        if (notification.isRemoving) {
            return;
        }

        const index = this.notifications.indexOf(notification);
        if (index === -1) return;

        // Marcar como en proceso de remoción
        notification.isRemoving = true;

        // Limpiar timers inmediatamente
        if (notification.timer) {
            clearTimeout(notification.timer);
            notification.timer = null;
        }
        
        if (notification.progressTimer) {
            clearTimeout(notification.progressTimer);
            notification.progressTimer = null;
        }

        // Parar la animación de progreso inmediatamente
        if (notification.progressBar) {
            notification.progressBar.style.transition = 'none';
            notification.progressBar.style.width = '0%';
        }

        // Animación de salida
        notification.element.classList.remove('show');
        notification.element.classList.add('hide');
        
        // Remover después de la animación
        setTimeout(() => {
            // Doble verificación antes de remover del DOM
            if (notification.element && notification.element.parentNode) {
                notification.element.remove();
            }
            
            // Remover del array - verificar que sigue existiendo
            const currentIndex = this.notifications.indexOf(notification);
            if (currentIndex !== -1) {
                this.notifications.splice(currentIndex, 1);
            }
            
            // Actualizar estilos solo de las notificaciones restantes
            this.updateNotificationStyles();
        }, 400);
    }

    /**
     * Manage overflow of notifications on window
     */
    manageOverflow() {
        // Remover las notificaciones más antiguas que excedan el límite
        while (this.notifications.length > this.maxNotifications) {
            const oldestNotification = this.notifications[this.notifications.length - 1];
            
            // Solo remover si no está ya en proceso de remoción
            if (oldestNotification && !oldestNotification.isRemoving) {
                this.remove(oldestNotification);
            } else {
                // Si la más antigua está en proceso de remoción, simplemente removerla del array
                this.notifications.pop();
            }
        }
    }

    /**
     * Refresh styles of valid notifications
     */
    updateNotificationStyles() {
        // Solo aplicar estilos a notificaciones válidas y no en proceso de remoción
        this.notifications
            .filter(notification => !notification.isRemoving && notification.element.parentNode)
            .forEach((notification, index) => {
                const opacity = Math.max(1 - (index * 0.15), 0.4);
                notification.element.style.opacity = opacity;
                notification.element.style.zIndex = 10000 - index;
            });
    }

    /**
     * Supplementary method to clear all notifications
     */
    clearAll() {
        // Crear una copia del array para evitar modificaciones durante la iteración
        const notificationsToRemove = [...this.notifications];
        
        notificationsToRemove.forEach(notification => {
            if (!notification.isRemoving) {
                this.remove(notification);
            }
        });
    }

    /**
     * Intern Event Binding
     */
    bindEvents() {
        // Recalcular cuando cambie el tamaño de ventana
        window.addEventListener('resize', () => {
            this.manageOverflow();
        });
    }
}