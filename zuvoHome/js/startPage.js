// @ts-nocheck

class StartPage {

    constructor() {
        const startPage = StartPage.get();
        if (startPage !== "startPage") {
            const ids = startPage.split('|');
            ids.forEach(id => {
                $(`#${id}`).trigger("click");
            });
        }
    }

    static get() {
        if (localStorage && localStorage.getItem("startPage")) {
            return localStorage.getItem("startPage");
        }
        return "startPage";
    }

    static set(value) {
        localStorage.setItem("startPage", value);
    }

}