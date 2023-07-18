const Utils = {
    getCurrentIcon: () => {
        const iconLinkEle = document.querySelector(`link[rel*="icon"][href]`);
        let iconUrl = iconLinkEle?.getAttribute("href")?.trim();

        if (!iconUrl || !iconUrl?.length) {
            return null;
        } else {
            if (iconUrl.startsWith("http://") || iconUrl.startsWith("https://")) {
                return iconUrl;
            } else {
                return `${window.location.origin}${iconUrl}`;
            }
        }
    },
};

export default Utils;
