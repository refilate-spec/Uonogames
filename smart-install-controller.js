document.addEventListener('DOMContentLoaded', () => {
    const config = window.SmartInstallConfig;
    if (!config) return;

    let deferredPrompt = null;
    const modal = document.getElementById('smartInstallModal');
    const modalCard = document.getElementById('smartInstallCard');
    const btnInstall = document.getElementById('btnInstallApp');
    const btnChrome = document.getElementById('btnOpenChrome');
    const btnContinue = document.getElementById('btnContinueBrowser');
    const btnClose = document.getElementById('smartInstallClose');
    const instructionsBox = document.getElementById('deviceInstructions');
    const appIconImg = document.getElementById('modalAppIcon');
    const appNameSpan = document.getElementById('modalAppNameSpan');

    if (appIconImg) appIconImg.src = config.appIcon;
    if (appNameSpan) appNameSpan.textContent = config.appName;

    if (config.isStandalone() || !config.isSecure()) return;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
        localStorage.setItem(config.storageKeyInstalled, 'true');
        hideModal();
        deferredPrompt = null;
    });

    if (config.enableAutoPopup && !config.isDismissed() && localStorage.getItem(config.storageKeyInstalled) !== 'true') {
        setTimeout(() => {
            if (modal && document.visibilityState === 'visible') showModal();
        }, config.popupDelayMs);
    }

    function showModal() {
        if (!modal) return;
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modalCard.classList.remove('translate-y-4');
        document.body.style.overflow = 'hidden';
        evaluateDeviceUI();
        if (btnClose) btnClose.focus();
    }

    function hideModal() {
        if (!modal) return;
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalCard.classList.add('translate-y-4');
        document.body.style.overflow = '';
        config.setDismissed();
    }

    function evaluateDeviceUI() {
        const device = config.getDeviceType();
        if (deferredPrompt) {
            btnInstall.style.display = 'flex';
            if (instructionsBox) instructionsBox.classList.add('hidden');
        } else {
            if (device === 'ios') {
                btnInstall.style.display = 'none';
                if (instructionsBox) {
                    instructionsBox.classList.remove('hidden');
                    instructionsBox.innerHTML = `<strong>iOS Instructions:</strong> Tap the <strong>Share</strong> button in Safari and select <strong>"Add to Home Screen"</strong>.`;
                }
            } else if (device === 'android' && config.enableChromeButton && btnChrome) {
                btnChrome.style.display = 'flex';
            }
        }
        if (device === 'desktop' && config.enableChromeButton && btnChrome) {
            btnChrome.style.display = 'flex';
        }
    }

    if (btnClose) btnClose.addEventListener('click', hideModal);
    if (btnContinue) btnContinue.addEventListener('click', hideModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('pointer-events-none')) hideModal();
    });

    if (btnInstall) {
        btnInstall.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                deferredPrompt = null;
                hideModal();
            } else {
                alert("Please use your browser menu to add this app to your device.");
            }
        });
    }

    if (btnChrome) {
        btnChrome.addEventListener('click', () => {
            const device = config.getDeviceType();
            if (device === 'android') {
                window.location.href = config.getAndroidChromeIntentUrl();
            } else if (device === 'desktop') {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert("Link copied! Open Google Chrome and paste the URL.");
                });
            }
        });
    }

    window.TriggerSmartInstallModal = showModal;
});
