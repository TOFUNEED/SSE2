import { AbstractComponent } from './AbstractComponent.js';
import { $, create, delegate } from '../../infrastructure/DOM.js';
import * as mutations from '../../state/mutations.js';

export class TrainList extends AbstractComponent {
    constructor(eventBus, appState) {
        super(eventBus, appState);
        this.container = $('#train-list-container');
        this.initialize();
    }

    shouldUpdate(changedKeys) {
        return changedKeys.includes('allTrainIds') || changedKeys.includes('listFilterText');
    }

    render(state) {
        const { allTrainIds, listFilterText } = state;
        const filterText = listFilterText.toUpperCase();

        const filteredTrains = allTrainIds.filter(t => t.id.toUpperCase().includes(filterText));
        const upTrains = filteredTrains.filter(t => t.direction === 'up');
        const downTrains = filteredTrains.filter(t => t.direction === 'down');

        let html = `
            <div class="train-list-wrapper">
                <div class="list-filter">
                    <input type="text" id="list-filter-input" placeholder="一覧を絞り込み..." value="${listFilterText}">
                </div>
        `;

        if (downTrains.length > 0) {
            html += this.createCategoryHtml('下り (長野・妙高高原方面)', downTrains);
        }
        if (upTrains.length > 0) {
            html += this.createCategoryHtml('上り (軽井沢方面)', upTrains);
        }

        html += '</div>';
        this.container.innerHTML = html;
    }

    createCategoryHtml(title, trains) {
        let listHtml = trains.map(train => 
            `<li><a href="#" data-train-id="${train.id}">${train.id}</a></li>`
        ).join('');

        return `
            <div class="train-list-category">
                <h3>${title}</h3>
                <ul class="train-list">${listHtml}</ul>
            </div>
        `;
    }

    bindEvents() {
        // 絞り込み入力
        delegate(this.container, 'input', '#list-filter-input', (event) => {
            mutations.setListFilterText(this.appState, event.target.value);
        });

        // 列車リンクのクリック
        delegate(this.container, 'click', '.train-list a', (event, target) => {
            event.preventDefault();
            const trainId = target.dataset.trainId;
            if (trainId) {
                this.eventBus.publish('train:select', trainId);
            }
        });
    }
}