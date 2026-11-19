// @ts-nocheck

class Modal {

    constructor(options) {

        this.id = options.id;
        this.title = options.title;
        this.body = options.body;

        $("body").find(`#${this.id}`).remove();
        $('body').append(`
            <div class="modal fade" id="${this.id}" tabindex="-1" role="dialog" aria-labelledby="${this.id}" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${this.title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span class="close__text" aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ${this.body}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary close" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $(`#${this.id}`).modal('show');

        Utils.onClick(`#${this.id} .close`, (event) => {
            $(`#${this.id}`).modal('hide');
            $(`#${this.id}`).remove();
        });
    }

}