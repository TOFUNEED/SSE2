import { Time } from './Time.js';

export class Stop {
    /**
     * @param {object} params
     * @param {string} params.stationId
     * @param {string} params.stationNameJp
     * @param {Time | null} params.arrivalTime
     * @param {Time | null} params.departureTime
     * @param {{ arrival: number | null, departure: number | null }} params.track
     * @param {boolean} params.isStopped - この駅に停車するかどうかのフラグ
     */
    constructor({
        stationId,
        stationNameJp,
        arrivalTime = null,
        departureTime = null,
        track = { arrival: null, departure: null },
        isStopped = true,
    }) {
        if (!stationId || !stationNameJp) {
            throw new Error('Stop requires stationId and stationNameJp.');
        }

        this.stationId = stationId;
        this.stationNameJp = stationNameJp;
        
        // Timeオブジェクトまたはnullであることを保証
        this.arrivalTime = arrivalTime instanceof Time ? arrivalTime : null;
        this.departureTime = departureTime instanceof Time ? departureTime : null;

        this.track = track;
        this.isStopped = isStopped;
    }

    /**
     * Firestoreに保存するためのプレーンオブジェクトに変換する
     * @returns {object}
     */
    toPlainObject() {
        return {
            station_id: this.stationId,
            station_name_jp: this.stationNameJp,
            arrival: this.arrivalTime ? this.arrivalTime.toString() : null,
            departure: this.departureTime ? this.departureTime.toString() : null,
            track: this.track,
        };
    }
}