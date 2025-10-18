import * as mutations from '../state/mutations.js';
import { TrainFactory } from '../domain/services/TrainFactory.js';
import { Time } from '../domain/models/Time.js';

export class SaveCurrentTrain {
    constructor({ repository, state, eventBus }) {
        this.repository = repository;
        this.appState = state;
        this.eventBus = eventBus;
    }

    async execute() {
        const state = this.appState.getState();
        if (!state.currentTrain) return;

        mutations.setLoading(this.appState, true);

        try {
            // 1. UIから最新のフォームデータを取得する
            const formData = this.getFormDataFromUI(state);

            // 2. バリデーション
            const validationResult = this.validateFormData(formData);
            if (!validationResult.isValid) {
                this.eventBus.publish('ui:show-notification', { message: validationResult.message, type: 'error' });
                // TODO: UI側で該当フィールドをハイライトするイベントを発行しても良い
                return; 
            }
            
            // 3. フォームデータからTrainモデルインスタンスを生成
            const trainToSave = TrainFactory.createFromFormData(formData, state.allStations);

            // 4. リポジトリを使って保存
            await this.repository.saveTrain(trainToSave);
            
            // 5. 状態を更新
            mutations.setDirty(this.appState, false);
            this.eventBus.publish('ui:show-notification', { message: `列車「${trainToSave.id}」を保存しました。`, type: 'success' });
            
            // 6. 列車一覧を再読み込み
            this.eventBus.publish('data:reload-train-list');

        } catch (error) {
            console.error('Failed to save train:', error);
            this.eventBus.publish('ui:show-notification', { message: '保存に失敗しました。', type: 'error' });
        } finally {
            mutations.setLoading(this.appState, false);
        }
    }

    getFormDataFromUI(state) {
        const form = document.getElementById('train-form');
        const stops = [];
        const rows = form.querySelectorAll('#station-editor-tbody tr');

        rows.forEach(row => {
            const isStopped = row.querySelector('.stop-check').checked;
            stops.push({
                stationId: row.dataset.stationId,
                isStopped: isStopped,
                arrivalTime: row.querySelector('.stop-time-arrival')?.value || null,
                departureTime: row.querySelector('.stop-time-departure')?.value || null,
                track: {
                    arrival: null, // UIからの取得ロジックは簡略化
                    departure: parseInt(row.querySelector('.platform-departure')?.value, 10) || null,
                }
            });
        });
        
        return {
            trainNumber: state.currentTrain.trainNumber,
            trainType: form.querySelector('#train-type')?.value,
            trainName: form.querySelector('#train-name')?.value || null,
            operationInfo: form.querySelector('#train-days')?.value,
            stops: stops,
            // TODO: 直通・乗換情報の取得
        };
    }

    validateFormData(formData) {
        for (const stop of formData.stops) {
            if (stop.arrivalTime && !Time.isValidString(stop.arrivalTime)) {
                return { isValid: false, message: `駅ID ${stop.stationId} の到着時刻の形式が不正です。` };
            }
            if (stop.departureTime && !Time.isValidString(stop.departureTime)) {
                return { isValid: false, message: `駅ID ${stop.stationId} の出発時刻の形式が不正です。` };
            }
        }
        return { isValid: true };
    }
}