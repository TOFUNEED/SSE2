import { AbstractComponent } from '../AbstractComponent.js';
import { $ } from '../../../infrastructure/DOM.js';
import { TrainInfoForm } from './TrainInfoForm.js';
import { SectionTemplate } from './SectionTemplate.js';
import { StationTable } from './StationTable.js';
import { ActionBar } from './ActionBar.js';

export class Editor extends AbstractComponent {
    constructor(eventBus, appState) {
        super(eventBus, appState);
        this.container = $('#editor-container');
        this.titleElement = $('#editor-title');
        this.formElement = $('#train-form');

        this.children = {
            trainInfoForm: new TrainInfoForm(eventBus, appState),
            sectionTemplate: new SectionTemplate(eventBus, appState),
            stationTable: new StationTable(eventBus, appState),
            actionBar: new ActionBar(eventBus, appState),
        };

        this.initialize();
    }

    shouldUpdate(changedKeys) {
        // currentTrainが変更されたときのみ、Editor全体の再描画をトリガーする
        return changedKeys.includes('currentTrain');
    }

    render(state) {
        const { currentTrain } = state;
        
        if (currentTrain) {
            this.titleElement.textContent = `列車番号: ${currentTrain.trainNumber}`;
            this.container.style.display = 'block';
        } else {
            this.container.style.display = 'none';
        }

        // 状態変更は各子コンポーネントが購読しているので、
        // ここで明示的に子コンポーネントのrenderを呼ぶ必要はない
    }

    bindEvents() {
        // フォーム内で何らかの入力があったら、isDirtyフラグを立てるイベントを発行
        this.formElement.addEventListener('input', () => {
            this.eventBus.publish('ui:form-input');
        });

        // ページを離れようとしたときの警告
        window.addEventListener('beforeunload', (e) => {
            if (this.appState.getState().isDirty) {
                e.preventDefault();
                e.returnValue = ''; // 標準の警告メッセージを表示
            }
        });
    }
}