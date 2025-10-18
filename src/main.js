import { App } from './core/App.js';

/**
 * アプリケーションのエントリーポイント。
 * DOMの準備が完了した時点で、アプリケーションのメインクラスをインスタンス化して起動します。
 */
document.addEventListener('DOMContentLoaded', () => {
    // アプリケーションインスタンスを作成
    const app = new App();
    
    // アプリケーションを初期化・起動
    app.start();
});