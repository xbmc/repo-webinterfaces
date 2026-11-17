// @ts-nocheck

class SettingsPage {

    sliders = [];

    constructor(options) {
        this.breadcrumb = options.breadcrumb;

        $('#gui').find(`.page2`).remove();
        $('#gui').find('.page').append(`
            <div class="page2">
                <h2>${Translation.get('gui.settings.title', 'Settings')}</h2>
                <div class="content-settings"></div>
            </div>
        `);

        this.load().then(() => {
            this.loadSettings();
        });
    }

    getCookieDocumentLanguage() {
        let lang = 'it';
        if (document.cookie) {
            let array = document.cookie.split(';');
            array.forEach(item => {
                let element = item.split('=');
                if (element[0] === 'lang') {
                    lang = element[1];
                }
            });
        }
        return lang;
    }

    addCookie(setting, value) {
        var d = new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 365);
        document.cookie = setting + '=' + value + '; expires=' + d.toGMTString() + ';';
    }

    load() {
        return new Promise((resolve, reject) => {
            $.getJSON(`lang/manifest.json`, (data) => {
                let optionsLang = '';
                data.lang.forEach(element => {
                    optionsLang += `<option value="${element}" ${this.getCookieDocumentLanguage() === element ? "selected" : ""}>${element}</option>`;
                });
                let optionsTheme = '';
                data.themes.forEach(option => {
                    optionsTheme += `<option value="${option.value}"${Theme.get() === option.value ? " selected" : ""}>${option.label}</option>`;
                });
                let optionsPages = '';
                data.pages.forEach(page => {
                    optionsPages += `<option value="${page.value}"${StartPage.get() === page.value ? " selected" : ""}>${page.label}</option>`;
                });
                let language = `
                    <div class="settings">
                        <div class="settingItem">
                            <label>${Translation.get('gui.settings.lang', 'Language')}</label>
                            <div class="settingItem__group">
                                <select name="lang">
                                    ${optionsLang}
                                </select>
                            </div>
                        </div>
                        <div class="settingItem">
                            <label>${Translation.get('gui.settings.theme', 'Theme')}</label>
                            <div class="settingItem__group">
                                <select name="theme">
                                    ${optionsTheme}
                                </select>
                            </div>
                        </div>
                        <div class="settingItem">
                            <label>${Translation.get('gui.settings.startPage', 'Initial page')}</label>
                            <div class="settingItem__group">
                                <select name="startPage">
                                    ${optionsPages}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="settings__btn-group">
                        <button class="saveBtn">
                            <i class="fa-solid fa-floppy-disk"></i>
                            <span>${Translation.get('save', "Save")}</span>
                        </button>
                    </div>
                    <div class="settings__section"></div>
                `;
                $('.page2 .content-settings').append(language);

                Utils.onClick('.saveBtn', (event) => {
                    // Gestione della lingua
                    let value = $('select[name="lang"]').val();
                    this.addCookie("lang", value);
                    let translation = new Translation();
                    translation.setLanguage(translation.getLanguage("lang", value));

                    // Gestione del tema
                    let theme = $('select[name="theme"]').val();
                    Theme.set(theme);
                    $("head #themeCss").attr("href", `css/${theme}.css`);

                    // Gestione pagina iniziale
                    let startPage = $('select[name="startPage"]').val();
                    StartPage.set(startPage);

                    Utils.getNotifications(Translation.get('alert.saved', "Saved Successfully"));
                });
                resolve();
            });
        });
    }

    loadSettings() {
        Loader.loader();
        Api.getSectionsByExpert().then(sections => {
            const sectionId = sections.result.sections[0].id;
            Api.getCategoriesBySection(sectionId).then(categories => {
                const categoryId = categories.result.categories[0].id;
                Api.getSettingsBySectionAndCategory(sectionId, categoryId).then(settings => {
                    Loader.remove();
                    this.loadSettingsPage(sections, categories, settings);
                });
            });
        });
    }

    loadSettingsPage(sections, categories, settings) {
        let body = `
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        `;
        sections.result.sections.forEach((section, index) => {
            body += `
                <li class="nav-item" role="presentation">
                    <button class="nav-link${index === 0 ? ' active' : ''}" id="${section.id}-tab" data-bs-toggle="pill" data-bs-target="#${section.id}" type="button" role="tab" aria-controls="${section.id}" aria-selected="true" data-type="section">
                        ${section.label}
                    </button>
                </li>
            `;
        });

        body += `
            </ul>
        `;

        const sectionId = sections.result.sections[0].id;

        body += `
            <div class="tab-content" id="tabSectionContent">
                <div class="tab-pane fade show active" id="${sectionId}" role="tabpanel" aria-labelledby="${sectionId}-tab">
                    <ul class="nav nav-pills mb-3" id="${sectionId}-tab" role="tablist">
        `;

        categories.result.categories.forEach((category, index) => {
            body += `
                        <li class="nav-item" role="presentation">
                            <button class="nav-link${index === 0 ? ' active' : ''}" id="${category.id}-tab" data-bs-toggle="pill" data-bs-target="#${category.id}" type="button" role="tab" aria-controls="${category.id}" aria-selected="true" data-type="category">
                                ${category.label}
                            </button>
                        </li>
            `;
        });
        body += `
                    </ul>
        `;

        const categoryId = categories.result.categories[0].id;

        body += `
                    <div class="tab-content" id="tabCategoryContent">
                        <div class="tab-pane fade show active" id="${categoryId}" role="tabpanel" aria-labelledby="${categoryId}-tab">
                            <table class="table">
                                <thead>
                                    <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                            <tbody>
        `;

        settings.result.settings.forEach(setting => {
            body += this.loadSetting(setting);
        });

        body += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        $('.settings__section').append(body);

        Utils.onShowTab('button[data-bs-toggle="pill"]', (event) => {
            const id = $(event.target).attr('aria-controls');
            const type = $(event.target).data('type');
            if (type === "category") {
                this.loadCategory(id);
            } else if (type === "section") {
                this.loadSection(id);
            }
        });

        this.loadButtonSave();

        this.loadSlider();
        this.slider = [];
    }

    loadSection(sectionId) {
        Loader.loader();
        Api.getCategoriesBySection(sectionId).then(categories => {
            const categoryId = categories.result.categories[0].id;
            Api.getSettingsBySectionAndCategory(sectionId, categoryId).then(settings => {
                Loader.remove();
                this.loadSectionPage(sectionId, categories, settings);
            });
        });
    }

    loadSectionPage(sectionId, categories, settings) {

        let body = `
            <div class="tab-pane fade show active" id="${sectionId}" role="tabpanel" aria-labelledby="${sectionId}-tab">
                <ul class="nav nav-pills mb-3" id="${sectionId}-tab" role="tablist">
        `;

        categories.result.categories.forEach((category, index) => {
            body += `
                    <li class="nav-item" role="presentation">
                        <button class="nav-link${index === 0 ? ' active' : ''}" id="${category.id}-tab" data-bs-toggle="pill" data-bs-target="#${category.id}" type="button" role="tab" aria-controls="${category.id}" aria-selected="true" data-type="category">
                            ${category.label}
                        </button>
                    </li>
            `;
        });
        body += `
                </ul>
        `;

        const categoryId = categories.result.categories[0].id;

        body += `
                <div class="tab-content" id="tabCategoryContent">
                    <div class="tab-pane fade show active" id="${categoryId}" role="tabpanel" aria-labelledby="${categoryId}-tab">
                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col"></th>
                                <th scope="col">Actions</th>
                                </tr>
                            </thead>
                        <tbody>
        `;

        let settingsItems = settings.result.settings.filter(i => i.type !== 'action' && i.control.format !== 'action');

        settingsItems.forEach(setting => {
            body += this.loadSetting(setting);
        });

        body += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        $('#tabSectionContent').empty();
        $('#tabSectionContent').append(body);

        this.loadButtonSave();

        this.loadSlider();
        this.sliders = [];
    }

    loadSlider() {
        this.sliders.forEach(slider => {
            $(`#${this.getId(slider.id)}`).slider({
                range: 'min',
                min: slider.minimum,
                max: (slider.maximum === 0 ? 100 : slider.maximum),
                value: slider.value
            });
        });
    }

    loadCategory(categoryId) {
        Loader.loader();
        const sectionId = $('#pills-tab').find('.nav-link.active').attr('aria-controls');
        Api.getSettingsBySectionAndCategory(sectionId, categoryId).then(settings => {
            Loader.remove();
            this.loadCategoryPage(categoryId, settings);
        });
    }

    loadCategoryPage(categoryId, settings) {

        let body = `
            <div class="tab-pane fade show active" id="${categoryId}" role="tabpanel" aria-labelledby="${categoryId}-tab">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let settingsItems = settings.result.settings.filter(i => i.type !== 'action' && i.control.format !== 'action');

        settingsItems.forEach(setting => {
            body += this.loadSetting(setting);
        });

        body += `
                    </tbody>
                </table>
            </div>
        `;

        $(`#${categoryId}`).remove();
        $('#tabCategoryContent').append(body);

        this.loadButtonSave();

        this.loadSlider();
        this.sliders = [];
    }

    getId(id) {
        return id.replaceAll('.', '-');
    }

    getIdReverse(id) {
        return id.replaceAll('-', '.');
    }

    loadButtonSave() {

        Utils.onClick('.formItem__btn', (event) => {
            this.$btn = $(event.currentTarget);
            const type = this.$btn.data('addontype');
            Loader.loader();
            Api.getAddonsByType(type).then(result => {
                Loader.remove();
                if (result.result && result.result.addons && result.result.addons.length) {
                    let body = `
                        <div>
                            <div>Available Addons</div>
                            <div class="addonsList">
                    `;

                    result.result.addons.forEach(addon => {
                        body += `
                                <div class="addonsList__content">
                                    <div class="switchTo">
                                        <a href="#" id="${this.getId(addon.addonid)}" data-value="${addon.addonid}" class="switchTo__btn ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false">
                                            <span class="ui-button-text">Select</span>
                                        </a>
                                    </div>
                                    <img src="${Utils.kodiImageToUrl(addon.thumbnail)}">
                                    <div class="movieinfo">
                                        <span class="label">Name:</span>
                                        <span class="value">${addon.name}</span>
                                    </div>
                                    <div class="movieinfo">
                                        <span class="label">Author:</span>
                                        <span class="value">${addon.author}</span>
                                    </div>
                                    <div class="movieinfo">
                                        <span class="label">Version:</span>
                                        <span class="value">${addon.version}</span>
                                    </div>
                                </div>
                        `;
                    });

                    body += `
                            </div>
                        </div>
                    `;

                    new Modal({
                        id: 'modalAddonItem',
                        title: 'Addons',
                        body,
                    });

                    Utils.onClick('.switchTo__btn', (event) => {
                        const value = $(event.currentTarget).data('value');
                        this.$btn.val(value);
                        this.$btn = undefined;
                        $('#modalAddonItem').modal("hide");
                        $('#modalAddonItem').remove();
                    });
                } else {
                    let body = `${Translation.get('gui.settings.error')}`;
                    new Modal({
                        id: 'modalAddonItem',
                        title: 'Addons',
                        body,
                    });
                }
            });
        });

        Utils.onClick('.saveBtnSettings', (event) => {
            let $element = $(event.currentTarget);
            let $tr = $element.closest('tr');
            let $formItemElement = $tr.find('input, select');
            let $slider = $tr.find('.formItem__slider');

            if ($slider.length) {
                const value = $slider.slider("value");
                const id = this.getIdReverse($slider.attr('id'));
                Api.setSettingValueBySettingAndValue(id, value);
            } else {
                let value = '';
                const id = this.getIdReverse($formItemElement.attr('id'));
                if ($formItemElement.hasClass('formItem__checkbox')) {
                    value = $formItemElement.is(':checked');
                } else if ($formItemElement.hasClass('formItem__input')) {
                    value = $formItemElement.val();
                } else if ($formItemElement.hasClass('formItem__multiselect')) {
                    value = $formItemElement.val();
                } else if ($formItemElement.hasClass('formItem__select')) {
                    value = $formItemElement.val();
                } else if ($formItemElement.hasClass('formItem__number')) {
                    value = $formItemElement.val();
                } else if ($formItemElement.hasClass('formItem__btn')) {
                    value = $formItemElement.val();
                }
                Api.setSettingValueBySettingAndValue(id, value);
            }
        });

        Utils.onClick('.defaultBtnSettings', (event) => {
            const $button = $(event.currentTarget);
            const value = $button.data('default');
            const $tr = $button.closest('tr');
            const $formItemElement = $tr.find('select, input');
            let $slider = $tr.find('.formItem__slider');
            let id = '';
            if ($slider.length) {
                id = $slider.attr('id');
            } else if ($formItemElement.length) {
                id = $formItemElement.attr('id');
            }
            Api.setSettingValueBySettingAndValue(this.getIdReverse(id), value);
        });
    }

    loadSetting(setting) {
        return `
            <tr>
                <td>
                    ${this.loadFormItem(setting)}
                </td>
                <td>
                    <button type="button" class="saveBtnSettings">Save</button>
                    <button type="button" class="defaultBtnSettings" data-default="${setting.default}">Default</button>
                </td>
            </tr>
        `;
    }

    loadFormItem(setting) {
        switch (setting.control.type) {
            case 'toggle':
                return `
                    <div class="form-check form-switch formItem">
                        <label class="form-check-label" for="${this.getId(setting.id)}">${setting.label}</label>
                        <input class="form-check-input formItem__checkbox" type="checkbox" role="switch" id="${this.getId(setting.id)}"${setting.value ? "checked" : ""}>
                    </div>
                `;
            case 'slider':
                this.sliders.push(setting);
                return `
                    <div class="formItem">
                        <label for="${this.getId(setting.id)}">${setting.label}</label>
                        <div class="formItem__slider" id="${this.getId(setting.id)}"></div>
                    </div>
                `;
            case 'edit':
                return `
                    <div class="formItem">
                        <label for="${this.getId(setting.id)}">${setting.label}</label>
                        <input class="formItem__input" type="text" name="${this.getId(setting.id)}" id="${this.getId(setting.id)}" value="${setting.value}" />
                    </div>
                `;
            case 'button':
                if (setting.type === 'path') {
                    return `
                        <div class="formItem">
                            <label for="${this.getId(setting.id)}">${setting.label}</label>
                            <input class="formItem__input" id="${this.getId(setting.id)}" name="${this.getId(setting.id)}" type="text" value="${setting.value}">
                        </div>
                    `;
                }
                return `
                    <div class="formItem">
                        <label for="${this.getId(setting.id)}">${setting.label}</label>
                        <input class="formItem__btn" id="${this.getId(setting.id)}" name="${this.getId(setting.id)}" type="button" value="${setting.value}" data-addontype="${setting.addontype}">
                    </div>
                `;
            case 'list':
                let options = '';
                if (setting.control.multiselect) {
                    setting.definition.options.forEach(option => {
                        options += `<option value="${option.value}"${setting.value.includes(option.value) ? ' selected' : ''}>${option.label}</option>`
                    });
                } else {
                    if (setting.options) {
                        setting.options.forEach(option => {
                            options += `<option value="${option.value}"${option.value === setting.value ? ' selected' : ''}>${option.label}</option>`
                        });
                    } else {
                        if (setting.type === 'integer') {
                            this.sliders.push(setting);
                            return `
                                <div class="formItem">
                                    <label for="${this.getId(setting.id)}">${setting.label}</label>
                                    <div class="formItem__slider" id="${this.getId(setting.id)}"></div>
                                </div>
                            `;
                        }
                    }
                }
                return `
                    <div class="formItem">
                        <label for="${this.getId(setting.id)}">${setting.label}</label>
                        <select class="${setting.control.multiselect ? 'formItem__multiselect ' : ''}formItem__select" name="${this.getId(setting.id)}" id="${this.getId(setting.id)}"${setting.control.multiselect ? ' multiple="multiple"' : ''}>
                            ${options}
                        </select>
                    </div>
                `;
            case 'spinner':
                if (setting.options) {
                    let options = '';
                    setting.options.forEach(option => {
                        options += `<option value="${option.value}"${option.value === setting.value ? ' selected' : ''}>${option.label}</option>`
                    });
                    return `
                        <div class="formItem">
                            <label for="${this.getId(setting.id)}">${setting.label}</label>
                            <select class="formItem__select" name="${this.getId(setting.id)}" id="${this.getId(setting.id)}">
                                ${options}
                            </select>
                        </div>
                    `;
                }
                return `
                    <div class="formItem">
                        <label for="${this.getId(setting.id)}">${setting.label}</label>
                        <input class="formItem__number" type="number" name="${this.getId(setting.id)}" id="${this.getId(setting.id)}" value="${setting.value}" />
                    </div>
                `;
        }
    }
}