import { Time } from '../domain/models/Time.js';

export class AutoFillTimes {
    /**
     * @param {object} dependencies
     * @param {object} dependencies.config - アプリケーションの設定オブジェクト
     */
    constructor({ config }) {
        this.standardIntervals = config.standardIntervals;
    }

    /**
     * @param {object} params
     * @param {object[]} params.stops - 現在の停車駅情報の配列
     * @param {'up' | 'down'} params.direction - 列車の方面
     * @param {number} params.dwellTime - 停車時間（分）
     * @returns {object[]} 更新された停車駅情報の配列
     */
    execute({ stops, direction, dwellTime = 1 }) {
        const intervals = this.standardIntervals[direction];
        if (!intervals) {
            throw new Error(`Invalid direction provided: ${direction}`);
        }

        const startIndex = stops.findIndex(stop => stop.isStopped && stop.departureTime instanceof Time);
        if (startIndex === -1) {
            throw new Error('Calculation requires at least one starting departure time.');
        }

        let currentTime = stops[startIndex].departureTime;
        let previousStationId = stops[startIndex].stationId;
        const updatedStops = JSON.parse(JSON.stringify(stops)); // 結果を格納する新しい配列

        for (let i = startIndex + 1; i < stops.length; i++) {
            const currentStop = updatedStops[i];
            
            // 走行時間を累積計算
            let totalTravelTime = 0;
            let pathFound = false;
            for (let j = updatedStops.findIndex(s => s.stationId === previousStationId); j < i; j++) {
                if(updatedStops[j].isStopped) {
                    const fromStationId = updatedStops[j].stationId;
                    const travelTime = intervals[fromStationId];
                    if (travelTime === undefined) {
                        console.warn(`Interval data not found for station: ${fromStationId}`);
                        totalTravelTime = 0; // 不明な区間があれば計算を中断
                        break;
                    }
                    totalTravelTime += travelTime;
                    pathFound = true;
                }
            }
            if(!pathFound) continue;

            if (totalTravelTime > 0) {
                const arrivalTime = currentTime.addMinutes(totalTravelTime);
                currentStop.arrivalTime = arrivalTime;

                const isLastStop = !updatedStops.slice(i + 1).some(s => s.isStopped);
                if (!isLastStop) {
                    currentStop.departureTime = arrivalTime.addMinutes(dwellTime);
                }
            }

            if(currentStop.isStopped) {
                currentTime = currentStop.departureTime || currentStop.arrivalTime;
                previousStationId = currentStop.stationId;
            }
        }

        // Timeオブジェクトに再変換
        return updatedStops.map(stop => ({
            ...stop,
            arrivalTime: stop.arrivalTime ? new Time(stop.arrivalTime.toString()) : null,
            departureTime: stop.departureTime ? new Time(stop.departureTime.toString()) : null,
        }));
    }
}