class TargetManager {
    static targetOrigin: string = "";
    static getCurrentTargetOrigin(): string {
        if (this.targetOrigin) {
            return this.targetOrigin;
        } else {
            let fromOrigin = new URLSearchParams(window.location.search).get("from");
            if (!fromOrigin) {
                this.targetOrigin = "";
            } else {
                fromOrigin = decodeURIComponent(fromOrigin);
                this.targetOrigin = fromOrigin;
            }
            return this.targetOrigin;
        }
    }
}

export default TargetManager;
