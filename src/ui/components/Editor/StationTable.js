import { AbstractComponent } from '../AbstractComponent.js';
import { $, delegate } from '../../../infrastructure/DOM.js';
import { connectionTypes } from '../../../config/trainData.js';

export class StationTable extends AbstractComponent {
    constructor(eventBus, appState) {
        super(eventBus, appState);
        this.container = $('#station-table-container');
        this.initialize();
    }

    shouldUpdate(changedKeys) {
        return changedKeys.includes('currentTrain') || changedKeys.includes('allStations');
    }

    render(state) {
        const { currentTrain, allStations } = state;
        if (!currentTrain || allStations.length === 0) {
            this.container.innerHTML = '';
            return;
        }

        const sortedStations = currentTrain.direction === 'up' 
            ? [...allStations].reverse() 
            : allStations;

        const tableRowsHtml = sortedStations.map(station => 
            this.createStationRowHtml(station, currentTrain)
        ).join('');

        const html = `
            <div class="station-editor">
                <div class="station-editor-header">
                    <h3>停車駅・時刻設定</h3>
                    <div class="station-bulk-actions">
                        <input type="number" id="dwell-time" value="30" style="width: 50px;" title="標準停車時間"> 秒
                        <button type="button" id="auto-fill-times-btn" class="secondary-btn">時刻自動計算</button>
                    </div>
                </div>
                <div class="station-list-container">
                    <table class="station-table">
                        <thead>
                            <tr>
                                <th>停車</th>
                                <th>駅名</th>
                                <th>時刻・詳細</th>
                            </tr>
                        </thead>
                        <tbody id="station-editor-tbody">
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    createStationRowHtml(station, train) {
        const stopInfo = train.getStopByStationId(station.id);
        const isStopped = !!stopInfo;
        
        const isOrigin = station.id === train.originStationId;
        const isDestination = station.id === train.destinationStationId;
        let detailsHtml = '';

        if (isDestination) {
            detailsHtml = this.createDestinationDetailsHtml(station, train, stopInfo);
        } else {
            detailsHtml = this.createViaDetailsHtml(station, train, stopInfo);
        }

        return `
            <tr class="${isStopped ? 'is-stopped' : ''}" data-station-id="${station.id}">
                <td data-label="停車">
                    <input type="checkbox" class="stop-check" ${isStopped ? 'checked' : ''}>
                </td>
                <td data-label="駅名">${station.name_jp}</td>
                <td data-label="時刻・詳細">
                    <div class="time-and-details">${detailsHtml}</div>
                </td>
            </tr>
        `;
    }
    
    createViaDetailsHtml(station, train, stopInfo) {
        const departureTime = stopInfo?.departureTime?.toString() || '';
        const platform = stopInfo?.track?.departure || '';
        return `
            <input type="text" class="stop-time-departure" placeholder="HH:MM 発" value="${departureTime}">
            <input type="number" class="platform-departure" placeholder="番線" value="${platform}">
        `;
    }

    createDestinationDetailsHtml(station, train, stopInfo) {
        const arrivalTime = stopInfo?.arrivalTime?.toString() || '';
        let connectionType = 'end';
        let nextTrainNumber = '';

        if (train.transferInfo?.end_station_id === station.id) {
            connectionType = 'transfer';
            nextTrainNumber = train.transferInfo.transfer_train_number || '';
        } else if (train.directInfo?.end_station_id === station.id) {
            connectionType = 'direct';
            nextTrainNumber = train.directInfo.direct_train_number || '';
        } else if (train.switchInfo?.end_station_id === station.id) {
            connectionType = 'switch';
            nextTrainNumber = train.switchInfo.switch_train_number || '';
        }
        
        const options = Object.entries(connectionTypes).map(([key, label]) => 
            `<option value="${key}" ${key === connectionType ? 'selected' : ''}>${label}</option>`
        ).join('');

        return `
            <input type="text" class="stop-time-arrival" placeholder="HH:MM 着" value="${arrivalTime}">
            <select class="connection-type-select">${options}</select>
            <input type="text" class="next-train-input" placeholder="次の列車番号" value="${nextTrainNumber}" style="${connectionType === 'end' ? 'display: none;' : ''}">
        `;
    }

    bindEvents() {
        delegate(this.container, 'click', '#auto-fill-times-btn', () => {
            const dwellTime = parseInt($('#dwell-time', this.container).value, 10);
            this.eventBus.publish('ui:autofill-request', { dwellTime });
        });

        delegate(this.container, 'change', '.connection-type-select', (event, target) => {
            const nextTrainInput = target.closest('.time-and-details').querySelector('.next-train-input');
            if (nextTrainInput) {
                nextTrainInput.style.display = target.value === 'end' ? 'none' : 'inline-block';
            }
        });
        
        delegate(this.container, 'keydown', 'input[type="text"], input[type="number"]', (event) => {
            if (event.key !== 'Enter' || event.shiftKey) return;
            event.preventDefault();
            const inputs = Array.from($$('input[type="text"], input[type="number"]', this.container));
            const currentIndex = inputs.indexOf(event.target);
            if (currentIndex !== -1 && currentIndex + 1 < inputs.length) {
                inputs[currentIndex + 1].focus();
            }
        });
    }
}