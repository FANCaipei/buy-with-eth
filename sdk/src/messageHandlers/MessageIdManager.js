class MessageIdManager {
    static _id = 0;
    static get id() {
        this._id += 1;
        return this._id;
    }
}

export default MessageIdManager;
