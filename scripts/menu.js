'use strict'

// @ts-check

// 設定置き場
/** @type { number } メニュー表示するまでの待ち時間 */
const waitOpenMenuTime = 450

/**
 * @param {Event} event
 */
const menuStart = (event) => {
    event.preventDefault()
    let timerId = -1
    timerId = setTimeout(() => {
        document.body.style.backgroundColor = 'green'
    }, waitOpenMenuTime)
    /**
     * @param {Event} event
     */
    const menuStop = (event) => {
        event.preventDefault()
        if (timerId !== -1) {
            clearTimeout(timerId)
        }
        document.body.style.backgroundColor = ''
        document.removeEventListener('touchend', menuStop)
        document.removeEventListener('touchcancel', menuStop)
    }
    document.addEventListener('touchend', menuStop, { passive: false })
    document.addEventListener('touchcancel', menuStop, { passive: false })
}

const setup = () => {
    document.addEventListener('touchstart', menuStart, { passive: false })
}

window.addEventListener('DOMContentLoaded', setup)
