class TargetManager {
    static targetOrigin: string | null;
    static getCurrentTargetOrigin(): string | null {
        if (this.targetOrigin) {
            return this.targetOrigin;
        } else {
            let fromOrigin = new URLSearchParams(window.location.search).get("from");
            if (!fromOrigin) {
                this.targetOrigin = null;
            } else {
                fromOrigin = decodeURIComponent(fromOrigin);
                this.targetOrigin = fromOrigin;
            }
            return this.targetOrigin;
        }
    }
}

export default TargetManager;
