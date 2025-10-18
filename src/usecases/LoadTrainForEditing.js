import * as mutations from '../state/mutations.js';
import { Train } from '../domain/models/Train.js';
import { TrainFactory } from '../domain/services/TrainFactory.js';

export class LoadTrainForEditing {
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

    /**
     * @param {string} trainId - 編集対象の列車番号
     */
    async execute(trainId) {
        const state = this.appState.getState();
        if (state.isDirty && !confirm('編集中の内容が破棄されます。よろしいですか？')) {
            return;
        }

        if (!trainId) return;

        mutations.setLoading(this.appState, true);

        try {
            let train = await this.repository.findTrainById(trainId);

            if (!train) {
                // データが存在しない場合は、新規作成モードとして空のTrainモデルを作成
                train = new Train({
                    trainNumber: trainId,
                    trainType: '普通',
                    operationInfo: 'everyday',
                    stops: [],
                });
            }
            
            mutations.setCurrentTrain(this.appState, train);
            mutations.setDirty(this.appState, false); // ロード直後は未編集状態

        } catch (error) {
            console.error(`Failed to load train data for ${trainId}:`, error);
            this.eventBus.publish('ui:show-notification', {
                message: `列車データ「${trainId}」の読み込みに失敗しました。`,
                type: 'error'
            });
        } finally {
            mutations.setLoading(this.appState, false);
        }
    }
}