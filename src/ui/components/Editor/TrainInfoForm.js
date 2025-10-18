import { AbstractComponent } from '../AbstractComponent.js';
import { $ } from '../../../infrastructure/DOM.js';
import { trainTypes, operationDays } from '../../../config/trainData.js';
import { Train } from '../../../domain/models/Train.js';

export class TrainInfoForm extends AbstractComponent {
    constructor(eventBus, appState) {
        super(eventBus, appState);
        this.container = $('#train-info-form-container');
        this.initialize();
    }

    shouldUpdate(changedKeys) {
        return changedKeys.includes('currentTrain') || changedKeys.includes('allStations');
    }

    render(state) {
        const { currentTrain, allStations } = state;
        const train = currentTrain; // 可読性のためのエイリアス

        const stationOptions = allStations.map(station =>
            `<option value="${station.id}">${station.name_jp}</option>`
        ).join('');

        const typeOptions = trainTypes.map(type =>
            `<option value="${type}">${type}</option>`
        ).join('');

        const dayOptions = Object.entries(operationDays).map(([value, label]) =>
            `<option value="${value}">${label}</option>`
        ).join('');
        
        const directionInfo = train ? Train.analyzeTrainId(train.trainNumber) : {};
        const directionText = directionInfo.direction === 'up' ? '上り (軽井沢方面)' : '下り (長野方面)';

        this.container.innerHTML = `
            <div class="train-info-grid">
                <div class="field">
                    <label for="train-origin">出発駅</label>
                    <select id="train-origin" data-field="originStationId">${stationOptions}</select>
                </div>
                <div class="field">
                    <label for="train-destination">到着駅</label>
                    <select id="train-destination" data-field="destinationStationId">${stationOptions}</select>
                </div>
                <div class="field">
                    <label for="train-type">種別</label>
                    <select id="train-type" data-field="trainType">${typeOptions}</select>
                </div>
                <div class="field">
                    <label for="train-name">愛称名</label>
                    <input type="text" id="train-name" data-field="trainName" placeholder="例: しなのサンライズ">
                </div>
                <div class="field">
                    <label for="train-direction">方面</label>
                    <input type="text" id="train-direction" value="${train ? directionText : ''}" readonly>
                </div>
                <div class="field">
                    <label for="train-company">所属</label>
                    <input type="text" id="train-company" value="${train ? directionInfo.company : ''}" readonly>
                </div>
                <div class="field">
                    <label for="train-days">運行日</label>
                    <select id="train-days" data-field="operationInfo">${dayOptions}</select>
                </div>
            </div>
        `;
        
        // フォームに現在の列車データを反映
        if (train) {
            this.updateFormValues(train);
        }
    }

    updateFormValues(train) {
        $('#train-origin', this.container).value = train.originStationId || '';
        $('#train-destination', this.container).value = train.destinationStationId || '';
        $('#train-type', this.container).value = train.trainType || '普通';
        $('#train-name', this.container).value = train.trainName || '';
        $('#train-days', this.container).value = train.operationInfo || 'everyday';
    }

    bindEvents() {
        // 各フォーム要素の変更を検知し、イベントを発行
        this.container.addEventListener('change', (event) => {
            if (event.target.dataset.field) {
                this.eventBus.publish('ui:form-field-changed', {
                    field: event.target.dataset.field,
                    value: event.target.value
                });
            }
        });
    }
}