import { AbstractComponent } from './AbstractComponent.js';
import { $, delegate } from '../../infrastructure/DOM.js';

export class SearchBox extends AbstractComponent {
    constructor(eventBus) {
        // このコンポーネントは状態を購読する必要がないため、appStateは不要
        super(eventBus); 
        this.container = $('#search-box-container');
        this.initialize();
    }

    render() {
        const html = `
            <div class="search-area">
                <input type="text" id="search-trainId" placeholder="列車番号で検索・新規作成">
                <button id="search-btn">検索 / 新規作成</button>
            </div>
        `;
        this.container.innerHTML = html;
        this.inputElement = $('#search-trainId', this.container);
        
        // train:select イベントを購読して、入力欄に値を反映する
        this.eventBus.subscribe('train:select', (trainId) => {
            if (this.inputElement) {
                this.inputElement.value = trainId;
            }
        });
    }

    bindEvents() {
        const searchHandler = () => {
            const trainId = this.inputElement.value.trim().toUpperCase();
            if (trainId) {
                this.eventBus.publish('search:request', trainId);
            }
        };

        delegate(this.container, 'click', '#search-btn', searchHandler);

        this.container.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.target.matches('#search-trainId')) {
                event.preventDefault();
                searchHandler();
            }
        });
    }
}