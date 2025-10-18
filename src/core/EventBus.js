export class EventBus {
    constructor() {
        this.listeners = {};
    }

    /**
     * イベントを購読（リッスン）する
     * @param {string} eventName - イベント名
     * @param {Function} callback - イベント発火時に実行されるコールバック関数
     * @returns {Function} - 購読を解除するための関数
     */
    subscribe(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);

        // 購読解除用の関数を返す
        return () => {
            this.listeners[eventName] = this.listeners[eventName].filter(
                listener => listener !== callback
            );
        };
    }

    /**
     * イベントを発行（公開）する
     * @param {string} eventName - イベント名
     * @param {*} data - コールバック関数に渡すデータ
     */
    publish(eventName, data) {
        if (!this.listeners[eventName]) {
            return;
        }
        this.listeners[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${eventName}:`, error);
            }
        });
    }
}