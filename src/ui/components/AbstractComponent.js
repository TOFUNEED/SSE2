export class AbstractComponent {
    /**
     * @param {import('../../core/EventBus.js').EventBus} eventBus
     * @param {import('../../state/AppState.js').AppState} [appState] - (オプション) 状態を購読する場合
     */
    constructor(eventBus, appState) {
        if (this.constructor === AbstractComponent) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.eventBus = eventBus;
        this.appState = appState;

        // appStateが渡された場合、state:changedイベントを購読し、
        // 関連する状態が変更されたら再描画する
        if (this.appState) {
            this.eventBus.subscribe('state:changed', ({ newState, changedKeys }) => {
                if (this.shouldUpdate(changedKeys)) {
                    this.render(newState);
                }
            });
        }
    }

    /**
     * このコンポーネントが状態変更に応じて更新されるべきかを判断する
     * 子クラスはこのメソッドをオーバーライドして、関心のある状態キーを指定する
     * @param {string[]} changedKeys - 変更された状態のキーの配列
     * @returns {boolean}
     */
    shouldUpdate(changedKeys) {
        // デフォルトでは何もしない (更新されない)
        return false;
    }
    
    /**
     * コンポーネントの初期化処理
     * DOMへの描画とイベントリスナーの登録を行う
     */
    initialize() {
        if (this.appState) {
            this.render(this.appState.getState());
        } else {
            this.render();
        }
        this.bindEvents();
    }

    /**
     * コンポーネントのHTMLを描画する (子クラスで実装必須)
     * @param {object} [state] - 現在のアプリケーションの状態
     */
    render(state) {
        throw new Error("Method 'render()' must be implemented.");
    }

    /**
     * DOMイベントリスナーを登録する (子クラスで実装必須)
     */
    bindEvents() {
        throw new Error("Method 'bindEvents()' must be implemented.");
    }
}