/**
 * 全駅リストを設定する
 * @param {import('./AppState.js').AppState} appState - AppStateのインスタンス
 * @param {import('../domain/models/Station.js').Station[]} stations - Stationモデルの配列
 */
export function setAllStations(appState, stations) {
    appState.setState({ allStations: stations });
}

/**
 * 全列車IDリストを設定する
 * @param {import('./AppState.js').AppState} appState
 * @param {{id: string, direction: string}[]} trainIds
 */
export function setAllTrainIds(appState, trainIds) {
    appState.setState({ allTrainIds: trainIds });
}

/**
 * 現在編集中の列車モデルを設定する
 * @param {import('./AppState.js').AppState} appState
 * @param {import('../domain/models/Train.js').Train | null} train
 */
export function setCurrentTrain(appState, train) {
    appState.setState({ currentTrain: train });
}

/**
 * 変更フラグ（Dirty State）を設定する
 * @param {import('./AppState.js').AppState} appState
 * @param {boolean} isDirty
 */
export function setDirty(appState, isDirty) {
    appState.setState({ isDirty: isDirty });
}

/**
 * ローディング状態を設定する
 * @param {import('./AppState.js').AppState} appState
 * @param {boolean} isLoading
 */
export function setLoading(appState, isLoading) {
    appState.setState({ isLoading: isLoading });
}

/**
 * 列車一覧のフィルターテキストを設定する
 * @param {import('./AppState.js').AppState} appState
 * @param {string} filterText
 */
export function setListFilterText(appState, filterText) {
    appState.setState({ listFilterText: filterText });
}

/**
 * 編集エリアをクリア（閉じる）する
 * @param {import('./AppState.js').AppState} appState
 */
export function clearEditor(appState) {
    appState.setState({
        currentTrain: null,
        isDirty: false
    });
}