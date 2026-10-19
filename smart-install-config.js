window.SmartInstallConfig = {
    appName: "UONO GAMES STORE",
    appShortName: "Store",
    appIcon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8-vsAyLJp6FXO6ZSL4F2-8-ZRcu0WyMmXhT3-wnzVDk2Dien6h699iNxHnzBTIDWaORfHqceMOSM2P21MowWWkLJL86LYiq50bSmlzeU8iCn2Dut8QEjmzno1LqfKNKC_0Ftc7JKgLOoTIGEEK1MRs6lszeqH5M8xvJ_Fj4PC56v782gstsIAYUpDwaEn/s1600/20260822_143214.jpg",
    popupDelayMs: 4000, 
    dismissalCooldownDays: 7, 
    enableAutoPopup: true,
    enableChromeButton: true,
    enableInstallButton: true,
    enableManualInstructions: true,
    
    storageKeyDismissed: "smart_install_dismissed_until",
    storageKeyInstalled: "smart_install_completed",

    isStandalone() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            document.referrer.includes('android-app://')
        );
    },

    isSecure() {
        return window.isSecureContext;
    },

    getDeviceType() {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(ua)) return 'android';
        if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
        return 'desktop';
    },

    isDismissed() {
        const dismissedUntil = localStorage.getItem(this.storageKeyDismissed);
        if (!dismissedUntil) return false;
        return new Date().getTime() < parseInt(dismissedUntil, 10);
    },

    setDismissed() {
        const expiryTime = new Date().getTime() + (this.dismissalCooldownDays * 24 * 60 * 60 * 1000);
        localStorage.setItem(this.storageKeyDismissed, expiryTime.toString());
    },

    getAndroidChromeIntentUrl() {
        const currentUrl = window.location.href;
        const encodedUrl = encodeURIComponent(currentUrl);
        return `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodedUrl};end;`;
    }
};
