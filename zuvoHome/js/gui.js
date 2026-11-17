// @ts-nocheck

class GUI {
    constructor() {
        $('#application').append(`
            <div id="gui">
                <h1>${Translation.get('gui.title', 'GUI')}</h1>
                <div class="page">
                    <div class="page1">
                        <div class="content">
                            <a href="#" id="musicMenuItem" class="cardItem">
                                <i class="fa-solid fa-music cardItem__icon"></i>
                                <span class="cardItem__span">
                                    ${Translation.get('gui.music.title', 'Music')}
                                </span>
                            </a>
                            <a href="#" id="videoMenuItem" class="cardItem">
                                <i class="fa-solid fa-video cardItem__icon"></i>
                                <span class="cardItem__span">
                                    ${Translation.get('gui.video.title', 'Video')}
                                </span>
                            </a>
                            <a href="#" id="settingsMenuItem" class="cardItem">
                                <i class="fa-solid fa-gears cardItem__icon"></i>
                                <span class="cardItem__span">
                                    ${Translation.get('gui.settings.title', 'Settings')}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.loadFooter();
        this.init();
    }

    loadFooter() {
        $('body').append(`
            <div id="footer">
                <div id="simple_controls">
                    <a class="button prev" href="#">
                        <i class="fa-solid fa-backward-fast"></i>
                    </a>
                    <a class="button rewind" href="#">
                        <i class="fa-solid fa-backward"></i>
                    </a>
                    <a class="button pause" href="#">
                        <i class="fa-solid fa-pause"></i>
                    </a>
                    <a class="button play" href="#">
                        <i class="fa-solid fa-play"></i>
                    </a>
                    <a class="button stop" href="#">
                        <i class="fa-solid fa-stop"></i>
                    </a>
                    <a class="button fastforward" href="#">
                        <i class="fa-solid fa-forward"></i>
                    </a>
                    <a class="button next" href="#">
                        <i class="fa-solid fa-forward-fast"></i>
                    </a>
                </div>
                <div class="volume">
                    <button class="volume-text">
                        <i class="volume-icon fa-solid"></i>
                    </button>
                    <div id="volume-controls"></div>
                </div>
                <div id="infoContainer">
                    <div id="now_next">
                        <div id="now">
                            ${Translation.get('footer.now', "Now")}: <span class="label"></span>
                        </div>
                        <div id="next">
                            ${Translation.get('footer.next', "Next")}: <span class="nextTitle"></span>
                        </div>
                    </div>
                </div>
                <div class="sliderPlayed"></div>
                <div id="remainPlayer">
                    <div id="remaining">
                        ${Translation.get('footer.remaining', "Remaining")}: <span class="timeRemain">00:00</span>
                    </div>
                    <div id="plTotal">
                        ${Translation.get('footer.total', "Total")}: <span class="timeTotal">00:00</span>
                    </div>
                </div>
            </div>
        `);
        new Footer();
        this.breadcrumb = new Breadcrumb();
    }

    init() {

        Utils.onClick('.page1 #musicMenuItem', (event) => {
            $('.page1').hide();
            const breadcrumbBody = `
                <i class="fa-solid fa-house"></i>
                ${Translation.get('gui.initialPage', 'Initial page')}
            `;
            this.breadcrumb.addItem(breadcrumbBody, 1, 1);
            this.loadMusicPage();
        });

        Utils.onClick('.page1 #videoMenuItem', (event) => {
            $('.page1').hide();
            const breadcrumbBody = `
                <i class="fa-solid fa-house"></i>
                ${Translation.get('gui.initialPage', 'Initial page')}
            `;
            this.breadcrumb.addItem(breadcrumbBody, 1, 1);
            this.loadVideoPage();
        });

        Utils.onClick('.page1 #settingsMenuItem', (event) => {
            $('.page1').hide();
            const breadcrumbBody = `
                <i class="fa-solid fa-house"></i>
                ${Translation.get('gui.initialPage', 'Initial page')}
            `;
            this.breadcrumb.addItem(breadcrumbBody, 1, 1);
            this.loadSettingsPageItems();
        });
    }

    loadMusicPage() {
        new MusicPage({ breadcrumb: this.breadcrumb });
    }

    loadVideoPage() {
        new VideoPage({ breadcrumb: this.breadcrumb });
    }

    loadSettingsPageItems() {
        new SettingsPage({ breadcrumb: this.breadcrumb });
    }
}