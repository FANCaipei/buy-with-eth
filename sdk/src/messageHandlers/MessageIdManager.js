const MessageIdManager = {
    _id: 0,
    get id() {
        this._id += 1;
        return this._id;
    },
};

export default MessageIdManager;
