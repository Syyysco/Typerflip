/**
 * Application settings
 */
export const APP_CONFIG = {
    DEBUG: {
        ENABLED: false,
        SHOW_TIMESTAMP: true,
        LOG_TO_CONSOLE: true,
        SHOW_STACK_TRACE: false
    },
    PERFORMANCE: {
        DEBOUNCE_DELAY: 100
    },
    STORAGE: {
        CUSTOM_TEMPLATES_KEY: 'userCustomTemplates',
        CONTENT_KEY: 'editorContent',
        LAST_SAVE_TIMESTAMP_KEY: 'lastSaveTimestamp',
        SCROLL_PAGE_KEY: 'pageScroll'
    },
    EDITOR: {
        READING_SPEED: 180, // palabras por minuto ((3 palabras por segundo * 60 segundos))
        SAVE_INDICATOR_DURATION: 2000 // Tiempo que tardará el indicador en desaparecer
    },
    NOTIFICATIONS: {
        DEFAULT_DURATION: 3000,
        QUICK_DURATION: 1500,
        PERSISTENT_DURATION: 10000,
        ICONS: {
            SUCCESS: 'fa-circle-check',
            ERROR: 'fa-circle-xmark',
            WARNING: 'fa-circle-exclamation',
            INFO: 'fa-circle-info'
        },
        ICON_COLORS: {
            SUCCESS: '#10b981',
            ERROR: '#ef4444',
            WARNING: '#f59e0b',
            INFO: '#3b82f6'
        },
        BG: {
            SUCCESS: 'rgba(5, 59, 41, 0.2)',
            ERROR: 'rgba(71, 20, 20, 0.2)',
            WARNING: 'rgba(65, 42, 3, 0.2)',
            INFO: 'rgba(13, 28, 53, 0.2)'
        },
        PROGESS_COLOR: {
            SUCCESS: 'rgba(16, 185, 129, 1)',
            ERROR: 'rgba(239, 68, 68, 1)',
            WARNING: 'rgba(245, 158, 11, 1)',
            INFO: 'rgba(59, 130, 246, 1)'
        }
    },
    PLATFORMS: {
        twitter: {
            name: 'X/Twitter',
            icon: 'x-twitter',
            color: '#000000',
            limits: { posts: 280, bio: 160 }
        },
        linkedin: {
            name: 'LinkedIn',
            icon: 'linkedin-in',
            color: '#0077B5',
            limits: { posts: 3000, bio: 220 }
        },
        instagram: {
            name: 'Instagram',
            icon: 'instagram',
            color: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            limits: { posts: 2160, bio: 150 }
        },
        facebook: {
            name: 'Facebook',
            icon: 'facebook-f',
            color: '#1877F2',
            limits: { posts: 63206, bio: 101 }
        },
        threads: {
            name: 'Threads',
            icon: 'threads',
            color: '#000',
            limits: { posts: 500, bio: 150 }
        },
        discord: {
            name: 'Discord',
            icon: 'discord',
            color: '#5865F2',
            limits: { posts: 2000, bio: 190 }
        },
        reddit: {
            name: 'Reddit',
            icon: 'reddit-alien',
            color: '#FF4500',
            limits: { posts: 40000, bio: 200 }
        },
        tiktok: {
            name: 'TikTok',
            icon: 'tiktok',
            color: '#000',
            limits: { posts: 2200, bio: 80 }
        },
        youtube: {
            name: 'YouTube',
            icon: 'youtube',
            color: '#FF0000',
            limits: { posts: 5000, bio: 1000 }
        },
        mastodon: {
            name: 'Mastodon',
            icon: 'mastodon',
            color: '#6364FF',
            limits: { posts: 500, bio: 500 }
        }
    },
    COMPATIBILITY: {
        COLORS: {
            LESS_THAN_30: {
                text: '#fcc6c6',
                primary: '#f56565',
                secondary: '#fc8181',
                gradient: 'linear-gradient(135deg, #f56565 0%, #fc8181 100%)'
            },
            LESS_THAN_50: {
                text: '#fae8c6',
                primary: '#ed8936',
                secondary: '#f6ad55',
                gradient: 'linear-gradient(135deg, #ed8936 0%, #f6ad55 100%)'
            },
            LESS_THAN_80: {
                text: '#d0fde3',
                primary: '#45a06b',
                secondary: '#68d391',
                gradient: 'linear-gradient(135deg, #45a06b 0%, #68d391 100%)'
            },
            LESS_THAN_100: {
                text: '#c3e2fa',
                primary: '#5390c2',
                secondary: '#63b3ed',
                gradient: 'linear-gradient(135deg, #5390c2 0%, #63b3ed 100%)'
            },
            100: {
                text: '#e6ebffff',
                primary: '#48dbfb',
                secondary: '#e079ff',
                gradient: 'linear-gradient(135deg, #48dbfb 0%, #e079ff 100%)'
            }
        },
        LIMITS: {
            DISABLED: 100,
            DANGER: 90,
            WARNING: 70
        }
    }
};

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