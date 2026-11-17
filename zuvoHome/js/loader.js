// @ts-nocheck

class Loader {

    static loader() {
        $("body").append(Loader.show(Translation.get('loading.loading', 'Loading Application...')));
    }

    static show(text = 'Loading...') {
        return `<div id="loadingApplication" class="loadingApplication">
                    <div class="loadingApplication__content">
                        <div class="loadingApplication__content__logo">
                            <!--img src="assets/images/loading.gif" alt="Logo" /-->
                        </div>
                        <div class="loadingApplication__content__text">
                            <p>${text}</p>
                        </div>
                    </div>
                </div>`;
    }

    static remove() {
        $("#loadingApplication").remove();
    }
}