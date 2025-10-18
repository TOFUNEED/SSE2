export class AppState {
    /**
     * @param {import('../core/EventBus.js').EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.state = {
            // データキャッシュ
            allStations: [],      // Stationモデルの配列
            allTrainIds: [],      // {id, direction} のオブジェクトの配列

            // 現在の編集状態
            currentTrain: null,   // 現在編集中のTrainモデル, もしくは新規作成中のデータ
            isDirty: false,       // 未保存の変更があるか
            isLoading: false,     // データロード中などのローディング状態
            
            // UIの状態
            listFilterText: '',   // 列車一覧の絞り込みテキスト
        };
    }

    /**
     * 状態を取得する
     * @returns {object} 現在の状態オブジェクト
     */
    getState() {
        return this.state;
    }

    /**
     * 状態を更新し、変更イベントを発行する
     * @param {object} newState - 更新する新しい状態の一部
     */
    setState(newState) {
        // 現在の状態と新しい状態をマージ
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };

        // 変更があったキーを特定
        const changedKeys = Object.keys(newState).filter(key => {
            return oldState[key] !== this.state[key];
        });

        // 状態が実際に変更された場合のみイベントを発行
        if (changedKeys.length > 0) {
            this.eventBus.publish('state:changed', {
                newState: this.state,
                changedKeys: changedKeys
            });
        }
    }
}