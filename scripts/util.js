/**
 * 始点と終点の座標から角度を取得する
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 * @returns {number}
 */
export function getStartAndEndPositionToDegree(startX, startY, endX, endY) {
    let sin = endY - startY
    let cos = endX - startX
    // 270° + θ
    cos *= -1
    let tmp
    tmp = sin
    sin = cos
    cos = tmp
    // ラジアンを求める
    const radian = Math.atan2(sin, cos)
    // ラジアンから角度に変換
    let degree = (radian * 180) / Math.PI + 180
    return degree
}

/**
 * タッチされた座標とそこに存在するElementを保持するクラス
 * 訳があってtouchmoveを直接使えない時に使う
 * touchstartで呼び出し
 * touchend or chancelで停止する
 * Dispose()を呼び出すと処理を停止し、最新の値を取得できなくする
 */
export class TouchPosition {
    /**
     * ビューポートにおけるX座標
     * @type {number}
     */
    #clientX
    /**
     * ビューポートにおけるy座標
     * @type {number}
     */
    #clientY
    /**
     * 座標上に存在するElement
     * @type {EventTarget|null}
     */
    #target

    /**
     * @param {TouchEvent} event
     */
    constructor(event) {
        const touch = event.touches[0]
        this.#clientX = touch.clientX
        this.#clientY = touch.clientY
        this.#target = touch.target
        document.addEventListener('touchmove', this.eventHandler.touchMove, { passive: false })
    }

    /**
     * ビューポートにおけるX座標
     * @returns {number}
     */
    getClientX() {
        return this.#clientX
    }
    /**
     * ビューポートにおけるY座標
     * @returns {number}
     */
    getClientY() {
        return this.#clientY
    }

    /**
     * 座標上に存在するElement
     * @returns {EventTarget|null}
     */
    getTarget() {
        return this.#target
    }

    /**
     * 処理を停止して最新の値を取得できなくする
     */
    Dispose() {
        document.removeEventListener('touchmove', this.eventHandler.touchMove)
    }

    // eventHandler

    eventHandler = {
        /**
         * タッチの移動中に反応する
         * @param {TouchEvent} event
         */
        touchMove: (event) => {
            event.preventDefault()
            const touch = event.touches[0]
            this.#clientX = touch.clientX
            this.#clientY = touch.clientY
            this.#target = touch.target
        },
    }
}
