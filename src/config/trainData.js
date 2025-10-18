/**
 * 駅間の標準所要時間（分）
 */
export const standardIntervals = {
    down: {
        'karuizawa': 4, 'naka-karuizawa': 3, 'shinano-oiwake': 4, 'miyota': 4, 'hirahara': 4,
        'komoro': 3, 'shigeno': 3, 'tanaka': 3, 'ohya': 4, 'ueda': 3, 'nishi-ueda': 3,
        'sakaki-techno': 3, 'sakaki': 4, 'togura': 3, 'chikuma': 3, 'yashiro': 2, 'yashiro-koukou-mae': 4,
        'shinonoi': 3, 'imai': 3, 'kawanakajima': 3, 'amori': 3, 'nagano': 3, 'kita-nagano': 3, 
        'sansai': 4, 'toyono': 6, 'mure': 5, 'furuma': 4, 'kurohime': 6
    },
    up: {
        'myoko-kogen': 6, 'kurohime': 4, 'furuma': 5, 'mure': 6, 'toyono': 4, 'sansai': 3, 
        'kita-nagano': 3, 'nagano': 3, 'amori': 3, 'kawanakajima': 3, 'imai': 3, 'shinonoi': 4, 
        'yashiro-koukou-mae': 2, 'yashiro': 3, 'chikuma': 3, 'togura': 4, 'sakaki': 3,
        'sakaki-techno': 3, 'nishi-ueda': 3, 'ueda': 4, 'ohya': 3, 'tanaka': 3, 'shigeno': 3,
        'komoro': 4, 'hirahara': 4, 'miyota': 4, 'shinano-oiwake': 3, 'naka-karuizawa': 4
    }
};

/**
 * 列車種別の選択肢リスト
 */
export const trainTypes = [
    "普通",
    "快速",
    "特別快速",
    "しなのサンライズ",
    "しなのサンセット",
    "軽井沢リゾート",
    "ろくもん"
];

/**
 * 運転日情報の選択肢
 */
export const operationDays = {
    everyday: "全日",
    weekday: "平日",
    holiday: "休日"
};

/**
 * 運転区間テンプレートの定義
 */
export const sectionTemplates = {
    down: [
        { label: "軽井沢 → 小諸", o: 'karuizawa', d: 'komoro' },
        { label: "軽井沢 → 上田", o: 'karuizawa', d: 'ueda' },
        { label: "軽井沢 → 長野", o: 'karuizawa', d: 'nagano' },
        { label: "小諸 → 長野", o: 'komoro', d: 'nagano' },
        { label: "上田 → 長野", o: 'ueda', d: 'nagano' },
        { label: "戸倉 → 長野", o: 'togura', d: 'nagano' },
        { label: "長野 → 豊野 (しなの鉄道)", o: 'nagano', d: 'toyono' },
        { label: "長野 → 妙高高原", o: 'nagano', d: 'myoko-kogen' },
    ],
    up: [
        { label: "妙高高原 → 長野", o: 'myoko-kogen', d: 'nagano' },
        { label: "豊野 → 長野 (しなの鉄道)", o: 'toyono', d: 'nagano' },
        { label: "長野 → 戸倉", o: 'nagano', d: 'togura' },
        { label: "長野 → 上田", o: 'nagano', d: 'ueda' },
        { label: "長野 → 小諸", o: 'nagano', d: 'komoro' },
        { label: "戸倉 → 小諸", o: 'togura', d: 'komoro' },
        { label: "戸倉 → 軽井沢", o: 'togura', d: 'karuizawa' },
        { label: "小諸 → 軽井沢", o: 'komoro', d: 'karuizawa' },
    ]
};

/**
 * 終着駅での接続種別
 */
export const connectionTypes = {
    end: "終着",
    transfer: "乗換",
    direct: "直通",
    switch: "切替"
};