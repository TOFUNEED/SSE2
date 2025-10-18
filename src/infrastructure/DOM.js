/**
 * CSSセレクタに一致する最初の要素を返す (querySelectorのエイリアス)
 * @param {string} selector - CSSセレクタ
 * @param {Element | Document} [parent=document] - 検索の起点となる要素
 * @returns {Element | null}
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * CSSセレクタに一致する全ての要素をNodeListとして返す (querySelectorAllのエイリアス)
 * @param {string} selector - CSSセレクタ
 * @param {Element | Document} [parent=document] - 検索の起点となる要素
 * @returns {NodeListOf<Element>}
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * 新しいHTML要素を作成する
 * @param {string} tagName - 作成する要素のタグ名 (例: 'div')
 * @param {object} [options] - オプション
 * @param {string} [options.className] - 追加するクラス名 (スペース区切り)
 * @param {string} [options.textContent] - 要素のテキストコンテンツ
 * @param {object} [options.attributes] - 設定する属性 (例: { 'data-id': '123' })
 * @returns {HTMLElement}
 */
export function create(tagName, options = {}) {
    const element = document.createElement(tagName);
    if (options.className) {
        element.className = options.className;
    }
    if (options.textContent) {
        element.textContent = options.textContent;
    }
    if (options.attributes) {
        for (const [key, value] of Object.entries(options.attributes)) {
            element.setAttribute(key, value);
        }
    }
    return element;
}

/**
 * イベントのデリゲーションを設定する
 * @param {Element} parent - イベントリスナーを設定する親要素
 * @param {string} eventName - イベント名 (例: 'click')
 * @param {string} selector - イベントを発火させたい子要素のCSSセレクタ
 * @param {Function} handler - イベントハンドラ
 */
export function delegate(parent, eventName, selector, handler) {
    parent.addEventListener(eventName, event => {
        if (event.target.closest(selector)) {
            handler(event, event.target.closest(selector));
        }
    });
}