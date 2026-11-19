// @ts-nocheck

class Utils {

    static onClick(selector, callback) {
        $(document)
            .off('click', selector)
            .on("click", selector, (e) => {
                e.preventDefault();
                callback(e);
            });
    }

    static onShowTab(selector, callback) {
        $(document).on('shown.bs.tab', (event) => {
            event.preventDefault();
            callback(event);
        });
    }

    static onMouseDownTouchStart(selector, callback) {
        $(selector).on('mousedown touchstart', (e) => {
            e.preventDefault();
            callback(e);
        });
    }

    static onMouseUpOnTouchCancel(selector, callback) {
        $(selector).on('mouseup touchend touchcancel', (e) => {
            e.preventDefault();
            callback(e);
        });
    }

    static kodiImageToUrl(url) {
        return '/image/' + encodeURI(url);
    }

    static getNotifications(text) {
        $.toast({
            text: text,
            showHideTransition: 'slide',
            bgColor: '#1d3047',
            textColor: '#eee',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            textAlign: 'left',
            position: 'top-right'
        });
    }

    static formatTime(seconds) {
        var hh = Math.floor(seconds / 3600);
        var mm = Math.floor((seconds - hh * 3600) / 60);
        var ss = seconds - hh * 3600 - mm * 60;
        var result = '';
        if (hh > 0)
            result = (hh < 10 ? '0' : '') + hh + ':';
        return result + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
    }

}