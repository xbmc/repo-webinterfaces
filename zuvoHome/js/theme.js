// @ts-nocheck

class Theme {

    static get() {
        if (localStorage && localStorage.getItem("theme")) {
            return localStorage.getItem("theme");
        }
        return "page";
    }

    static set(theme) {
        localStorage.setItem("theme", theme);
    }

}