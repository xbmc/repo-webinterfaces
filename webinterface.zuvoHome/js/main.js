// @ts-nocheck

class Application {

    constructor() {
        const translation = new Translation();
        translation.setLanguage(translation.getLanguage("lang", "it"));
        $('head #themeCss').attr("href", `css/${Theme.get()}.css`);
        this.init();
    }

    init() {
        $("body").append(`<div id="application"></div>`);
        const gui = new GUI();
        new StartPage();
    }
}