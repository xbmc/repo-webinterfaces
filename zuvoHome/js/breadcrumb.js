// @ts-nocheck

class Breadcrumb {

    constructor() {
        if ($('#application').find('#breadcrumbMenu').length === 0) {
            $('#application').prepend(`<div id="breadcrumbMenu"></div>`);
        }
    }

    name() {
        return 'breadcrumbLevel';
    }

    addItem(title, itemNum, pageNumToShow) {
        const item = `
            <a id="${this.name()}${itemNum}" href="#">
                <i class="breadcrumbIcon fa-solid fa-angles-right"></i>
                <span>${title}</span>
            </a>
        `;
        $('#breadcrumbMenu').append(item);

        Utils.onClick(`#${this.name()}${itemNum}`, (event) => {
            const $page = $(`.page${pageNumToShow}`);
            $page.show();
            $page.prevAll().hide();
            $page.nextAll('div').remove();
            $(event.currentTarget).nextAll().remove();
            $(event.currentTarget).remove();
        });
    }

}