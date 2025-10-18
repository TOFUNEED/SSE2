import { Time } from '../../../src/domain/models/Time.js';

describe('domain/models/Time.js', () => {

    describe('コンストラクタとバリデーション', () => {
        it('有効な "HH:MM" 形式の文字列でインスタンスを生成できる', () => {
            const time = new Time("09:30");
            expect(time).toBeInstanceOf(Time);
        });

        it('不正な形式の文字列（例: "25:00"）でインスタンス化しようとするとエラーをスローする', () => {
            expect(() => new Time("25:00")).toThrow(Error);
        });

        it('不正な形式の文字列（例: "09:60"）でインスタンス化しようとするとエラーをスローする', () => {
            expect(() => new Time("09:60")).toThrow(Error);
        });

        it('不正な形式の文字列（例: "9:30"）でインスタンス化しようとするとエラーをスローする', () => {
            expect(() => new Time("9:30")).toThrow(Error);
        });

        it('nullまたはundefinedでインスタンス化しようとするとエラーをスローする', () => {
            expect(() => new Time(null)).toThrow(Error);
            expect(() => new Time(undefined)).toThrow(Error);
        });
    });

    describe('toString() メソッド', () => {
        it('インスタンス化した際の "HH:MM" 文字列を返す', () => {
            const timeStr = "18:05";
            const time = new Time(timeStr);
            expect(time.toString()).toBe(timeStr);
        });
    });

    describe('getTotalMinutes() メソッド', () => {
        it('00:00からの総分数を正しく返す', () => {
            const time = new Time("01:30");
            expect(time.getTotalMinutes()).toBe(90);
        });

        it('00:00 は 0 分を返す', () => {
            const time = new Time("00:00");
            expect(time.getTotalMinutes()).toBe(0);
        });

        it('23:59 は 1439 分を返す', () => {
            const time = new Time("23:59");
            expect(time.getTotalMinutes()).toBe(1439);
        });
    });

    describe('addMinutes() メソッド', () => {
        it('指定された分数を加算し、新しいTimeインスタンスを返す', () => {
            const initialTime = new Time("10:10");
            const newTime = initialTime.addMinutes(25);
            expect(newTime.toString()).toBe("10:35");
            expect(newTime).toBeInstanceOf(Time);
        });

        it('分を加算した結果、時が繰り上がる場合も正しく計算する', () => {
            const time = new Time("08:50");
            const newTime = time.addMinutes(20);
            expect(newTime.toString()).toBe("09:10");
        });

        it('24時を超える場合は、00時からにラップアラウンドする', () => {
            const time = new Time("23:45");
            const newTime = time.addMinutes(30);
            expect(newTime.toString()).toBe("00:15");
        });

        it('元のインスタンスは変更されない（不変性）', () => {
            const initialTime = new Time("12:00");
            initialTime.addMinutes(15);
            expect(initialTime.toString()).toBe("12:00");
        });
    });

    describe('static fromTotalMinutes() ファクトリメソッド', () => {
        it('総分数からTimeインスタンスを正しく生成する', () => {
            const time = Time.fromTotalMinutes(550); // 9 * 60 + 10
            expect(time.toString()).toBe("09:10");
        });

        it('0分は "00:00" を生成する', () => {
            const time = Time.fromTotalMinutes(0);
            expect(time.toString()).toBe("00:00");
        });

        it('24時間以上の分数は、24時間で割った余りで計算される', () => {
            const time = Time.fromTotalMinutes(1500); // 1500 % 1440 = 60
            expect(time.toString()).toBe("01:00");
        });
    });
});