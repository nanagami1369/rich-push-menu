'use strict'

import { getStartAndEndPositionToDegree, TouchPosition } from './util.js'

// @ts-check

// 設定置き場
/** @type { number } メニュー表示するまでの待ち時間 */
const waitOpenMenuTime = 450
/** @type { number } タッチ位置を取得する間隔 */
const touchPoolingIntervalTime = 50

/** メニュのHTMLが書かれている要素 */
const PUSH_MENU_AREA = document.getElementById('push-menu-area')

/**
 * メニューを開く
 * @param {number} top
 * @param {number} left
 */
const menuOpen = (top, left) => {
    PUSH_MENU_AREA.style.top = top + 'px'
    PUSH_MENU_AREA.style.left = left + 'px'

    PUSH_MENU_AREA.classList.add('push-menu__open')
}

/**
 * メニューを閉じる
 */
const menuClose = () => {
    PUSH_MENU_AREA.classList.remove('push-menu__open')
}

/**
 * @param {TouchEvent} event
 */
const menuStart = (event) => {
    event.preventDefault()
    let touchMovePoolingId = -1
    const touchPosition = new TouchPosition(event)
    let timerId = setTimeout(() => {
        menuOpen(event.touches[0].clientY, event.touches[0].clientX)
        const startX = event.touches[0].clientX
        const startY = event.touches[0].clientY

        const menuSwipe = () => {
            const endX = touchPosition.getClientX()
            const endY = touchPosition.getClientY()
            // 始点と終点の座標からスワイプされた角度を求める
            const degree = getStartAndEndPositionToDegree(startX, startY, endX, endY)

            //角度の情報から、どのメニュが選択されたか判定する

            // 前回の選択情報を解除
            /** @type {HTMLCollectionOf<HTMLElement>}  */
            const menus = document.getElementsByClassName('push-menu')
            for (let index = 0; index < menus.length; index++) {
                const menu = menus[index]
                menu.classList.remove('push-menu__hover')
            }
            // 指があまり動いてない場合は選択しない
            if (Math.abs(startX - endX) < 40 && Math.abs(startY - endY) < 40) {
                return
            }
            if (30 < degree && degree <= 90) {
                document.getElementById('push-menu-2').classList.add('push-menu__hover')
            } else if (90 < degree && degree <= 180) {
                document.getElementById('push-menu-4').classList.add('push-menu__hover')
            } else if (180 < degree && degree <= 270) {
                document.getElementById('push-menu-3').classList.add('push-menu__hover')
            } else if (270 < degree && degree <= 330) {
                document.getElementById('push-menu-1').classList.add('push-menu__hover')
            } else {
                // 330 < degree <= 30
                document.getElementById('push-menu-5').classList.add('push-menu__hover')
            }
        }
        touchMovePoolingId = setInterval(menuSwipe, touchPoolingIntervalTime)
    }, waitOpenMenuTime)

    /**
     * @param {Event} event
     */
    const menuStop = (event) => {
        event.preventDefault()

        clearTimeout(timerId)
        clearTimeout(touchMovePoolingId)
        touchPosition.Dispose()
        menuClose()
        /** @type {HTMLElement} */
        const selectMenu = document.querySelector('.push-menu__hover')
        if (selectMenu != null) {
            selectMenu.classList.remove('push-menu__hover')
            location.href = selectMenu.dataset.href
        }
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
