import { AutoFillTimes } from '../../../src/usecases/AutoFillTimes.js';
import { Time } from '../../../src/domain/models/Time.js';

describe('usecases/AutoFillTimes.js', () => {

    // テストで使用するダミーデータ
    const dummyIntervals = {
        down: {
            'station-A': 5,  // A -> B: 5分
            'station-B': 10, // B -> C: 10分
            'station-C': 7,  // C -> D: 7分
        }
    };

    const dummyStops = [
        { stationId: 'station-A', isStopped: true, departureTime: new Time("09:00"), arrivalTime: null },
        { stationId: 'station-B', isStopped: true, departureTime: null, arrivalTime: null },
        { stationId: 'station-C', isStopped: false, departureTime: null, arrivalTime: null }, // 途中通過
        { stationId: 'station-D', isStopped: true, departureTime: null, arrivalTime: null },
    ];

    it('始発駅の時刻を基に、各停車駅の到着・出発時刻を正しく計算できる', () => {
        const useCase = new AutoFillTimes({ standardIntervals: dummyIntervals });
        
        const params = {
            stops: JSON.parse(JSON.stringify(dummyStops)), // 元データを壊さないようにディープコピー
            direction: 'down',
            dwellTime: 1, // 停車時間1分
        };

        const result = useCase.execute(params);
        
        // 始発駅 (変更なし)
        expect(result[0].departureTime.toString()).toBe("09:00");

        // 2番目の駅 (station-B)
        // 到着: 09:00 + 走行5分 = 09:05
        // 出発: 09:05 + 停車1分 = 09:06
        expect(result[1].arrivalTime.toString()).toBe("09:05");
        expect(result[1].departureTime.toString()).toBe("09:06");
        
        // 3番目の駅 (station-C) は isStopped: false なので変更されない
        expect(result[2].arrivalTime).toBe(null);
        expect(result[2].departureTime).toBe(null);
        
        // 4番目の駅 (station-D)
        // 走行時間は station-B から計算されるべき (station-Cを飛ばすため)
        // 到着: 09:06 (B発) + 走行10分(B->C) + 走行7分(C->D) = 09:23
        expect(result[3].arrivalTime.toString()).toBe("09:23");
        // 終着駅と仮定し、出発時刻はnullのまま
        expect(result[3].departureTime).toBe(null);
    });

    it('始発駅の時刻が入力されていない場合、エラーをスローする', () => {
        const useCase = new AutoFillTimes({ standardIntervals: dummyIntervals });
        const invalidStops = [
            { stationId: 'station-A', isStopped: true, departureTime: null, arrivalTime: null },
            { stationId: 'station-B', isStopped: true, departureTime: null, arrivalTime: null },
        ];
        const params = { stops: invalidStops, direction: 'down', dwellTime: 1 };

        expect(() => useCase.execute(params)).toThrow(Error);
    });

    it('走行時間データが存在しない区間がある場合、計算をスキップして警告を出す', () => {
        // station-B -> C のデータがない intervals
        const incompleteIntervals = { down: { 'station-A': 5 } };
        const useCase = new AutoFillTimes({ standardIntervals: incompleteIntervals });
        
        // console.warnをスパイして、呼び出されたかチェックする
        const consoleWarnSpy = {
            warned: false,
            warn: function() { this.warned = true; }
        };
        const originalConsoleWarn = console.warn;
        console.warn = consoleWarnSpy.warn.bind(consoleWarnSpy);

        const params = {
            stops: JSON.parse(JSON.stringify(dummyStops)),
            direction: 'down',
            dwellTime: 1,
        };

        const result = useCase.execute(params);

        // A->B は計算される
        expect(result[1].departureTime.toString()).toBe("09:06");
        // B->C のデータがないため、Dの時刻は計算されない
        expect(result[3].arrivalTime).toBe(null);
        // warnが呼び出されたことを確認
        expect(consoleWarnSpy.warned).toEqual(true);

        // console.warnを元に戻す
        console.warn = originalConsoleWarn;
    });

});