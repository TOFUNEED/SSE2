import { Train } from '../models/Train.js';
import { Stop } from '../models/Stop.js';
import { Time } from '../models/Time.js';
import { Station } from '../models/Station.js';

export class TrainFactory {
    /**
     * FirestoreのドキュメントデータからTrainインスタンスを生成する
     * @param {object} docData - Firestoreから取得したプレーンオブジェクト
     * @returns {Train}
     */
    static createFromFirestore(docData) {
        if (!docData || !docData.train_number) {
            throw new Error('Invalid train data provided to factory.');
        }

        const stops = (docData.stops || []).map(stopData => {
            try {
                return new Stop({
                    stationId: stopData.station_id,
                    stationNameJp: stopData.station_name_jp,
                    arrivalTime: stopData.arrival ? new Time(stopData.arrival) : null,
                    departureTime: stopData.departure ? new Time(stopData.departure) : null,
                    track: stopData.track || { arrival: null, departure: null },
                    isStopped: true,
                });
            } catch (error) {
                console.warn(`Skipping invalid stop data for station ${stopData.station_id}:`, error.message);
                return null;
            }
        }).filter(Boolean); // nullになった要素を除外

        return new Train({
            trainNumber: docData.train_number,
            trainType: docData.train_type || '普通',
            trainName: docData.train_name || null,
            operationInfo: docData.operation_info || 'everyday',
            stops: stops,
            directInfo: docData.direct_info || null,
            transferInfo: docData.transfer_info || null,
            switchInfo: docData.switch_info || null,
        });
    }

    /**
     * UIフォームのデータから新しいTrainインスタンスを生成する
     * @param {object} formData - UIから取得したフォームデータ
     * @param {Station[]} allStations - 全駅のStationモデルの配列
     * @returns {Train}
     */
    static createFromFormData(formData, allStations) {
        const stops = formData.stops.map(stopData => {
            const station = allStations.find(s => s.id === stopData.stationId);
            return new Stop({
                stationId: stopData.stationId,
                stationNameJp: station ? station.name_jp : '不明',
                arrivalTime: stopData.arrivalTime ? new Time(stopData.arrivalTime) : null,
                departureTime: stopData.departureTime ? new Time(stopData.departureTime) : null,
                track: stopData.track,
                isStopped: stopData.isStopped,
            });
        });

        return new Train({
            trainNumber: formData.trainNumber,
            trainType: formData.trainType,
            trainName: formData.trainName,
            operationInfo: formData.operationInfo,
            stops: stops.filter(stop => stop.isStopped), // 停車する駅のみをstopsに含める
            directInfo: formData.directInfo,
            transferInfo: formData.transferInfo,
            switchInfo: formData.switchInfo,
        });
    }

    /**
     * 駅データのプレーンオブジェクトからStationインスタンスの配列を生成する
     * @param {object[]} stationDocs - Firestoreから取得した駅データの配列
     * @returns {Station[]}
     */
    static createStations(stationDocs) {
        return stationDocs.map(doc => new Station({
            id: doc.id,
            name_jp: doc.name_jp,
            order: doc.order
        }));
    }
}