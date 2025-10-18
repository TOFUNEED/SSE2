import { Stop } from './Stop.js';

export class Train {
    /**
     * @param {object} params
     * @param {string} params.trainNumber
     * @param {string} params.trainType
     * @param {string | null} params.trainName
     * @param {string} params.operationInfo
     * @param {Stop[]} params.stops
     * @param {object | null} params.directInfo
     * @param {object | null} params.transferInfo
     * @param {object | null} params.switchInfo
     */
    constructor({
        trainNumber,
        trainType,
        trainName = null,
        operationInfo,
        stops = [],
        directInfo = null,
        transferInfo = null,
        switchInfo = null,
    }) {
        if (!trainNumber) {
            throw new Error('Train number is required.');
        }

        this.trainNumber = trainNumber;
        this.trainType = trainType;
        this.trainName = trainName;
        this.operationInfo = operationInfo;
        this.stops = stops;
        this.directInfo = directInfo;
        this.transferInfo = transferInfo;
        this.switchInfo = switchInfo;

        const { direction, company } = Train.analyzeTrainId(this.trainNumber);
        this.direction = direction;
        this.company = company;
    }

    get id() {
        return this.trainNumber;
    }

    get originStationId() {
        return this.stops.length > 0 ? this.stops[0].stationId : null;
    }

    get destinationStationId() {
        return this.stops.length > 0 ? this.stops[this.stops.length - 1].stationId : null;
    }

    /**
     * 指定された駅IDの停車駅情報を返す
     * @param {string} stationId
     * @returns {Stop | undefined}
     */
    getStopByStationId(stationId) {
        return this.stops.find(stop => stop.stationId === stationId);
    }

    /**
     * 列車番号を解析し、方面や会社を返す静的メソッド
     * @param {string} trainId - 解析する列車番号 (例: '1611M')
     * @returns {{direction: 'up' | 'down' | null, company: string | null, number: number | null}}
     */
    static analyzeTrainId(trainId) {
        const match = trainId.match(/^(\d+)([A-Z])$/);
        if (!match) {
            return { direction: null, company: null, number: null };
        }

        const number = parseInt(match[1], 10);
        const suffix = match[2];
        const direction = (number % 2 === 0) ? 'up' : 'down';

        let company = '不明';
        if (suffix === 'M') {
            company = 'しなの鉄道';
        } else if (suffix === 'D') {
            company = 'JR飯山線';
        }

        return { direction, company, number };
    }
    
    /**
     * Firestoreに保存するためのプレーンオブジェクトに変換する
     * @returns {object}
     */
    toPlainObject() {
        return {
            train_number: this.trainNumber,
            train_type: this.trainType,
            train_name: this.trainName,
            operation_info: this.operationInfo,
            direction: this.direction,
            stops: this.stops.map(stop => stop.toPlainObject()),
            direct_info: this.directInfo,
            transfer_info: this.transferInfo,
            switch_info: this.switchInfo,
            // 飯山線方面などの追加情報があればここに追加
            iiyama_destination: null, 
        };
    }
}