// @ts-nocheck

class Translation {

    settings = {};
    currentLanguage = "it";

    load() {
        if (document.cookie) {
            var ss = document.cookie.split(';');
            $.each(ss, (i, s) => {
                var tmp = s.split('=');
                if (tmp.length == 2) {
                    this.settings[tmp[0].trim()] = tmp[1].trim();
                }
            });
        }
    }

    getLanguage(key, defaultValue) {
        if (this.isEmpty(this.settings)) {
            this.load();
        }
        if (this.settings[key]) {
            return this.settings[key];
        }
        return defaultValue;
    }

    isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        var language = `lang/${lang}.json`;
        $.getJSON(language, function (data) {
            localStorage.setItem("translation", JSON.stringify(data));
        });
    }

    static get(key, defaultValue) {
        var translation = localStorage.getItem("translation");
        if (translation) {
            var data = JSON.parse(translation);
            var value = key.split('.').reduce((obj, prop) => obj?.[prop], data);
            if (value !== undefined) {
                return value;
            } else {
                return defaultValue;
            }
        }
        return defaultValue;
    }
}