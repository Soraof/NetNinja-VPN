// src/assets.js

// Анимации
export const animations = {
    loading: new URL('./assets/animations/loading_ninja_smoke.gif', import.meta.url).href,
    normal: new URL('./assets/animations/ninja_normal.gif', import.meta.url).href,
    active: new URL('./assets/animations/ninja_active.gif', import.meta.url).href,
    protect: new URL('./assets/animations/ninja_protect.gif', import.meta.url).href,
    sleep: new URL('./assets/animations/ninja_sleep.gif', import.meta.url).href,
    celebrate: new URL('./assets/animations/ninja_celebrate.gif', import.meta.url).href,
    stealth: new URL('./assets/animations/ninja_stealth.gif', import.meta.url).href,
    error: new URL('./assets/animations/ninja_error.gif', import.meta.url).href,
};

// Аватары
export const avatars = {
    rookie: new URL('./assets/avatars/avatar_rookie.png', import.meta.url).href,
    warrior: new URL('./assets/avatars/avatar_warrior.png', import.meta.url).href,
    shadow: new URL('./assets/avatars/avatar_shadow.png', import.meta.url).href,
    demon: new URL('./assets/avatars/avatar_demon.png', import.meta.url).href,
    legend: new URL('./assets/avatars/avatar_legend.png', import.meta.url).href,
};

// Иконки
export const icons = {
    interface: {
        mission: new URL('./assets/icons/interface/icon_mission.png', import.meta.url).href,
        clan: new URL('./assets/icons/interface/icon_clan.png', import.meta.url).href,
        shop: new URL('./assets/icons/interface/icon_shop.png', import.meta.url).href,
        profile: new URL('./assets/icons/interface/icon_profile.png', import.meta.url).href,
        settings: new URL('./assets/icons/interface/icon_settings.png', import.meta.url).href,
        help: new URL('./assets/icons/interface/icon_help.png', import.meta.url).href,
    },
    functions: {
        vpn: new URL('./assets/icons/functions/icon_vpn.png', import.meta.url).href,
        server: new URL('./assets/icons/functions/icon_server.png', import.meta.url).href,
        speed: new URL('./assets/icons/functions/icon_speed.png', import.meta.url).href,
        shield: new URL('./assets/icons/functions/icon_shield.png', import.meta.url).href,
        stealth: new URL('./assets/icons/functions/icon_stealth.png', import.meta.url).href,
    },
    rewards: {
        ryo: new URL('./assets/icons/interface/icon_ryo.png', import.meta.url).href,
        stars: new URL('./assets/icons/interface/icon_stars.png', import.meta.url).href,
        shuriken: new URL('./assets/icons/interface/icon_shuriken.png', import.meta.url).href,
        medal: new URL('./assets/icons/interface/icon_medal.png', import.meta.url).href,
    },
};

// Логотипы
export const logo = {
    full: new URL('./assets/logo/logo_full.png', import.meta.url).href,
    icon: new URL('./assets/logo/logo_icon.png', import.meta.url).href,
    favicon: new URL('./assets/logo/favicon.ico', import.meta.url).href,
};

// Фон
export const bgDark = new URL('./assets/bg_dark.png', import.meta.url).href;