import { AbstractComponent } from '../AbstractComponent.js';
import { $ } from '../../../infrastructure/DOM.js';
import { sectionTemplates } from '../../../config/trainData.js';

export class SectionTemplate extends AbstractComponent {
    constructor(eventBus, appState) {
        super(eventBus, appState);
        this.container = $('#section-template-container');
        this.initialize();
    }

    shouldUpdate(changedKeys) {
        // currentTrain が変更されたとき（新しい列車が読み込まれたとき）に再描画
        return changedKeys.includes('currentTrain');
    }

    render(state) {
        const { currentTrain } = state;
        const direction = currentTrain ? currentTrain.direction : null;
        
        // 方面が不明な場合は何も描画しない
        if (!direction) {
            this.container.innerHTML = '';
            return;
        }

        const templates = sectionTemplates[direction];
        const options = templates.map((template, index) =>
            `<option value="${index}">${template.label}</option>`
        ).join('');
        
        const html = `
            <div class="template-selector">
                <label for="section-template-select">運転区間テンプレート:</label>
                <select id="section-template-select">
                    <option value="">よく使う区間を選択...</option>
                    ${options}
                </select>
            </div>
        `;
        this.container.innerHTML = html;
    }

    bindEvents() {
        this.container.addEventListener('change', (event) => {
            if (event.target.id === 'section-template-select' && event.target.value !== '') {
                const state = this.appState.getState();
                const direction = state.currentTrain ? state.currentTrain.direction : null;
                const templateIndex = parseInt(event.target.value, 10);
                
                if (direction && !isNaN(templateIndex)) {
                    const selectedTemplate = sectionTemplates[direction][templateIndex];
                    if (selectedTemplate) {
                        this.eventBus.publish('ui:section-template-applied', {
                            originId: selectedTemplate.o,
                            destinationId: selectedTemplate.d
                        });
                    }
                }
                // 選択後はプルダウンをリセット
                event.target.value = '';
            }
        });
    }
}