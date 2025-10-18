import { $ } from '../../infrastructure/DOM.js';

export class TemplateApplicator {
    /**
     * @param {import('../../core/EventBus.js').EventBus} eventBus
     * @param {import('../../state/AppState.js').AppState} appState
     */
    constructor(eventBus, appState) {
        this.eventBus = eventBus;
        this.appState = appState;

        // テンプレート適用イベントを購読
        this.eventBus.subscribe('ui:section-template-applied', 
            (payload) => this.applyTemplate(payload)
        );
    }

    /**
     * 区間テンプレートをフォームに適用する
     * @param {{originId: string, destinationId: string}} payload
     */
    applyTemplate({ originId, destinationId }) {
        const state = this.appState.getState();
        const { allStations } = state;

        const originStation = allStations.find(s => s.id === originId);
        const destStation = allStations.find(s => s.id === destinationId);
        if (!originStation || !destStation) return;
        
        // 1. 出発駅と到着駅のプルダウンを更新
        $('#train-origin').value = originId;
        $('#train-destination').value = destinationId;
        
        const startOrder = Math.min(originStation.order, destStation.order);
        const endOrder = Math.max(originStation.order, destStation.order);

        // 2. 停車駅テーブルのチェックボックスを更新
        const stationRows = document.querySelectorAll('#station-editor-tbody tr');
        stationRows.forEach(row => {
            const stationId = row.dataset.stationId;
            const station = allStations.find(s => s.id === stationId);
            const checkbox = row.querySelector('.stop-check');

            if (station && checkbox) {
                const shouldBeChecked = station.order >= startOrder && station.order <= endOrder;
                checkbox.checked = shouldBeChecked;
            }
        });
        
        // 3. フォームが変更されたことを通知
        this.eventBus.publish('ui:form-input');
        
        // 4. (重要) UIの状態と内部的なモデルの状態が乖離するため、
        //    UIからのデータでモデルを更新するようイベントを発行
        this.eventBus.publish('ui:form-field-changed', {
            field: 'originStationId',
            value: originId
        });
        this.eventBus.publish('ui:form-field-changed', {
            field: 'destinationStationId',
            value: destinationId
        });
    }
}