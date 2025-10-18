import { AbstractComponent } from '../AbstractComponent.js';
import { $ } from '../../../infrastructure/DOM.js';

export class ActionBar extends AbstractComponent {
    constructor(eventBus, appState) {
        super(eventBus, appState);
        this.container = $('#action-bar-container');
        this.initialize();
    }

    shouldUpdate(changedKeys) {
        // isLoadingまたはisDirtyが変更されたときにボタンの状態を更新
        return changedKeys.includes('isLoading') || changedKeys.includes('isDirty');
    }

    render(state) {
        const { isLoading, isDirty } = state;

        this.container.innerHTML = `
            <div class="action-bar">
                <button type="button" class="delete-btn">削除</button>
                <button type="submit" class="save-btn">保存</button>
            </div>
        `;

        const saveBtn = $('.save-btn', this.container);
        const deleteBtn = $('.delete-btn', this.container);

        if (isLoading) {
            saveBtn.disabled = true;
            deleteBtn.disabled = true;
            saveBtn.textContent = '処理中...';
        } else {
            saveBtn.disabled = !isDirty; // isDirtyがfalseなら保存ボタンを無効化
            deleteBtn.disabled = false;
            saveBtn.textContent = '保存';
        }
    }

    bindEvents() {
        const form = $('#train-form');
        
        // フォームのsubmitイベント（保存ボタンクリック）
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.eventBus.publish('train:save');
        });

        // 削除ボタンのクリック
        this.container.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const trainNumber = this.appState.getState().currentTrain?.trainNumber;
                if (trainNumber && confirm(`本当に列車番号「${trainNumber}」を削除しますか？`)) {
                    this.eventBus.publish('train:delete');
                }
            }
        });
    }
}