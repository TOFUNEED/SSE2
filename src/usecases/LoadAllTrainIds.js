import * as mutations from '../state/mutations.js';

export class LoadAllTrainIds {
    /**
     * @param {object} dependencies
     * @param {import('../infrastructure/services/FirebaseRepository.js').FirebaseRepository} dependencies.repository
     * @param {import('../state/AppState.js').AppState} dependencies.state
     */
    constructor({ repository, state }) {
        this.repository = repository;
        this.appState = state;
    }

    /**
     * ユースケースを実行する
     */
    async execute() {
        try {
            const trainIds = await this.repository.fetchAllTrainIds();
            mutations.setAllTrainIds(this.appState, trainIds);
        } catch (error) {
            console.error('Failed to load all train IDs:', error);
            // エラーが発生した場合、空のリストを設定してUIの崩れを防ぐ
            mutations.setAllTrainIds(this.appState, []);
            throw new Error('Failed to execute LoadAllTrainIds use case.');
        }
    }
}