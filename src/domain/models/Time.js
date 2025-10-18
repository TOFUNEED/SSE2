const MINUTES_IN_DAY = 24 * 60;

export class Time {
    #totalMinutes;

    /**
     * @param {string} timeString - "HH:MM" 形式の時刻文字列
     */
    constructor(timeString) {
        if (!Time.isValidString(timeString)) {
            throw new Error(`Invalid time string format: "${timeString}". Must be "HH:MM".`);
        }
        
        const [hours, minutes] = timeString.split(':').map(Number);
        this.#totalMinutes = hours * 60 + minutes;
    }

    /**
     * 総分数からTimeインスタンスを生成する静的ファクトリメソッド
     * @param {number} totalMinutes
     * @returns {Time}
     */
    static fromTotalMinutes(totalMinutes) {
        const minutes = totalMinutes % MINUTES_IN_DAY;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        return new Time(timeString);
    }

    /**
     * "HH:MM" 形式の文字列が妥当かどうかを判定する静的メソッド
     * @param {string} timeString
     * @returns {boolean}
     */
    static isValidString(timeString) {
        if (!timeString || typeof timeString !== 'string') {
            return false;
        }
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(timeString);
    }

    /**
     * 00:00からの総分数を返す
     * @returns {number}
     */
    getTotalMinutes() {
        return this.#totalMinutes;
    }

    /**
     * 指定された分数を加算した新しいTimeインスタンスを返す（不変性）
     * @param {number} minutesToAdd
     * @returns {Time}
     */
    addMinutes(minutesToAdd) {
        const newTotalMinutes = this.#totalMinutes + minutesToAdd;
        return Time.fromTotalMinutes(newTotalMinutes);
    }
    
    /**
     * "HH:MM" 形式の文字列に変換する
     * @returns {string}
     */
    toString() {
        const hours = Math.floor(this.#totalMinutes / 60);
        const minutes = this.#totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
}