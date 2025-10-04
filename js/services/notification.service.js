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
import { NotificationSystem } from "../lib/NotificationSystem.js";


/**
 * Service handler for NotificationSystem
 *
 * @class NotificationService
 * @typedef {NotificationService}
 */
class NotificationService {
    constructor() {
        this.system = new NotificationSystem();
    }

    clearAll() {
        this.system.clearAll();
    }

    // Función general para mostrar notificaciones
    show(message, type = 'info', duration = APP_CONFIG.NOTIFICATIONS.DEFAULT_DURATION) {
        return this.system.show(message, type, duration);
    }

    // Más métodos específicos
    showSuccess(message) {
        return this.system.show(message, 'success');
    }

    showError(message) {
        return this.system.show(message, 'error');
    }

    showPersistentNotification(message, type = 'info') {
        return this.system.show(message, type, APP_CONFIG.NOTIFICATIONS.PERSISTENT_DURATION);
    }

    showQuickNotification(message, type = 'info') {
        return this.system.show(message, type, APP_CONFIG.NOTIFICATIONS.QUICK_DURATION);
    }
}

export default new NotificationService();