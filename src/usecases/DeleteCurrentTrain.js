import * as mutations from '../state/mutations.js';

export class DeleteCurrentTrain {
    /**
     * @param {object} dependencies
     * @param {import('../infrastructure/services/FirebaseRepository.js').FirebaseRepository} dependencies.repository
     * @param {import('../state/AppState.js').AppState} dependencies.state
     * @param {import('../core/EventBus.js').EventBus} dependencies.eventBus
     */
    constructor({ repository, state, eventBus }) {
        this.repository = repository;
        this.appState = state;
        this.eventBus = eventBus;
    }

    async execute() {
        const state = this.appState.getState();
        const trainToDelete = state.currentTrain;
        
        if (!trainToDelete) {
            console.warn('No train selected for deletion.');
            return;
        }

        mutations.setLoading(this.appState, true);

        try {
            // 1. リポジトリを使って削除
            await this.repository.deleteTrain(trainToDelete.id);

            // 2. 状態を更新して編集エリアを閉じる
            mutations.clearEditor(this.appState);
            this.eventBus.publish('ui:show-notification', {
                message: `列車「${trainToDelete.id}」を削除しました。`,
                type: 'success'
            });

            // 3. 列車一覧を再読み込みするイベントを発行
            // このイベントをLoadAllTrainIdsユースケースが購読するようにApp.jsで設定する
            this.eventBus.publish('data:reload-train-list');

        } catch (error) {
            console.error('Failed to delete train:', error);
            this.eventBus.publish('ui:show-notification', {
                message: '削除に失敗しました。',
                type: 'error'
            });
        } finally {
            mutations.setLoading(this.appState, false);
        }
    }
}