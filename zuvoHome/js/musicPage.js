// @ts-nocheck

class MusicPage {

    constructor(options) {
        this.breadcrumb = options.breadcrumb;
        $('#gui').find(`.page2`).remove();
        $('#gui').find('.page').append(`
            <div class="page2">
                <h2>${Translation.get('gui.music.title', 'Music')}</h2>
                <div class="content"></div>
            </div>
        `);

        this.loadLink('artistsLink', Translation.get('gui.music.artists.title', 'Artists'));
        this.loadLink('albumsLink', Translation.get('gui.music.albums.title', 'Albums'));
        this.loadLink('songsLink', Translation.get('gui.music.songs.title', 'Songs'));
        this.loadLink('filesLink', Translation.get('gui.music.files', 'Files'));
        this.loadLink('libraryLink', Translation.get('gui.music.library', 'Library'));
    }

    loadLink(id, title) {
        const link = `
            <a id="${id}" class="cardItem" href="#">
                <i class="${this.loadIconBySection(id)} cardItem__icon"></i>
                <span class="cardItem__span">${title}</span>
            </a>
        `;

        $('.page2 .content').append(link);

        Utils.onClick(`#${id}`, (event) => {
            this.load(id, title);
        });
    }

    loadIconBySection(id) {
        switch (id) {
            case 'artistsLink':
                return 'fa-solid fa-paintbrush';
            case 'albumsLink':
                return 'fa-solid fa-file-audio';
            case 'songsLink':
                return 'fa-brands fa-spotify';
            case 'filesLink':
                return 'fa-solid fa-file';
            case 'libraryLink':
                return 'fa-solid fa-folder-open';
            default:
                return 'fa-solid fa-music';
        }
    }

    load(id, title) {
        $('#gui').find(`.page2`).hide();
        $('#gui').find('.page').append(`
            <div class="page3">
                <h2>${title}</h2>
                <div class="content"></div>
            </div>
        `);

        this.breadcrumb.addItem(Translation.get('gui.music.title', 'Music'), 2, 2);

        switch (id) {
            case 'artistsLink':
                this.loadArtistsPage();
                break;
            case 'albumsLink':
                this.loadAlbumsPage();
                break;
            case 'songsLink':
                this.loadSongsPage();
                break;
            case 'filesLink':
                this.loadFilesPage();
                break;
            case 'libraryLink':
                this.loadLibraryPage();
                break;
        }
    }

    loadArtistsPage() {
        $(`.page3 .content`).append(`
            <a href="#" id="artistTitles" class="cardItem">
                <i class="fa-solid fa-music cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.artists.titles', 'Titles')}
                </span>
            </a>
            <a href="#" id="artistGenre" class="cardItem">
                <i class="fa-solid fa-guitar cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.artists.genres', 'Genres')}
                </span>
            </a>
        `);

        Utils.onClick('#artistTitles', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.artists.titles', 'Titles')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.artists.title', 'Artists'), 3, 3);
            this.loadArtistsByTitle();
        });

        Utils.onClick('#artistGenre', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            const title = Translation.get('gui.music.artists.genres', 'Genres');
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${title}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.artists.title', 'Artists'), 3, 3);
            this.loadArtistsByGenre();
        });
    }

    loadArtistsByTitle() {
        Loader.loader();
        Api.getArtists().then((result) => {
            Loader.remove();
            if (result.result && result.result.artists.length) {
                const artists = result.result.artists;
                artists.forEach((artist) => {
                    const element = `
                        <div class="artist rowItem">
                            <a href="#" class="rowItem__link" data-id="${artist.artistid}">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${artist.artist}
                                <span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn artist__info" title="${Translation.get('tooltip.info', 'Info')}" data-id="${artist.artistid}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn artist__enqueue" title="${Translation.get('tooltip.enqueue', 'Enqueue')}" data-id="${artist.artistid}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="rowItem__btn-group__btn3 rowItem__btn-group__btn artist__play" title="${Translation.get('tooltip.play', 'Play')}" data-id="${artist.artistid}">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.artist a', (event) => {
                        $('#gui').find('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.music.artists.titles', 'Titles'), 4, 4);
                        this.loadArtistsByTitlePage($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.artist__info', (event) => {
                        this.loadArtistInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.artist__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByArtistId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.artist__play', event => {
                        Loader.loader();
                        Api.playByArtistId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadArtistsByTitlePage(id) {
        Loader.loader();
        Api.getAlbumsByArtistId(id).then(result => {
            Loader.remove();
            if (result.result && result.result.albums) {
                const albums = result.result.albums;
                albums.forEach(album => {
                    const element = `
                        <div class="artistByTitlePage rowItem">
                            <img src="${album.thumbnail ? Utils.kodiImageToUrl(album.thumbnail) : 'assets/images/empty_cover_music.png'}" class="rowItem__img">
                            <a href="#" class="rowItem__link" data-id="${album.albumid}">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${album.artist.join(', ')} ${album.label}
                                <span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn artistByTitlePage__info" data-id="${album.albumid}" title="${Translation.get('gui.tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn artistByTitlePage__enqueue" data-id="${album.albumid}" title="${Translation.get('gui.tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;

                    $('.page5 .content').append(element);

                    Utils.onClick('.artistByTitlePage a', (event) => {
                        Loader.loader();
                        Api.playByAlbumId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.artistByTitlePage__info', (event) => {
                        this.loadAlbumInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.artistByTitlePage__enqueue', (event) => {
                        Loader.loader();
                        Api.addPlaylistByAlbumId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadAlbumInformation(id) {
        Loader.loader();
        Api.getAlbumDetailsByAlbumId(id).then(result => {
            Loader.remove();
            const album = result.result.albumdetails;

            let body = `
                <div class="thumb">
                    <img src="${album.thumbnail ? Utils.kodiImageToUrl(album.thumbnail) : 'assets/images/empty_cover_music.png'}" class="thumb__img">
                </div>
                <div class="textinfo">
                    <h1 class="underline">${album.title}</h1>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.artists', 'Artists')}:</span>
                        <span class="labelinfo">${album.artist.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.genre', 'Genres')}:</span>
                        <span class="labelinfo">${album.genre.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.albumlabel', 'Album')}:</span>
                        <span class="labelinfo">${album.albumlabel}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.year', 'Years')}:</span>
                        <span class="labelinfo">${album.year}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.played', 'Played')}:</span>
                        <span class="labelinfo">${album.playcount}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.description', 'Description')}:</span>
                        <p class="artistdesc">${album.description}</p>
                    </div>
                </div>
            `;

            new Modal({
                id: 'modalAlbumInformation',
                title: Translation.get('gui.info.title', 'Informations'),
                body
            })
        });
    }

    loadArtistInformation(id) {
        Loader.loader();
        Api.getArtistDetailsByArtistId(id).then(result => {
            Loader.remove();
            const artist = result.result.artistdetails;

            let body = `
                <h1 class="underline">${artist.artist}</h1>
                <div class="textinfo">
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.genre', 'Genres')}</span>
                        <span class="labelinfo">${artist.genre.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.yearactive', 'Active years')}:</span>
                        <span class="labelinfo">${artist.yearsactive.join(', ')}</span>
                    </div>
                    <div class="movieInfo">
                        <span class="label">${Translation.get('gui.info.description', 'Description')}:</span>
                        <p class="artistdesc">${artist.description}</p>
                    </div>
                </div>
            `;
            new Modal({
                id: 'modalArtistInformation',
                title: artist.label,
                body
            })
        });
    }

    loadArtistsByGenre() {
        Loader.loader();
        Api.getGenresAudio().then((result) => {
            Loader.remove();
            if (result.result && result.result.genres.length) {
                const genres = result.result.genres;
                genres.forEach((genre) => {
                    const element = `
                        <div class="artistByGenre rowItem">
                            <a href="#" class="rowItem__link" data-id="${genre.genreid}">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${genre.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn artistsByGenre__enqueue" data-id="${genre.genreid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn artistsByGenre__play" data-id="${genre.genreid}" title="${Translation.get('tooltip.play', 'Play')}">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.artistByGenre a', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$element.find('span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.music.artists.genres', 'Genres'), 4, 4);
                        this.loadGenresPage($element.data('id'), $element.find('span').text());
                    });

                    Utils.onClick('.artistsByGenre__play', event => {
                        Loader.loader();
                        Api.playByGenreId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.artistsByGenre__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistMusicByGenreId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        })
    }

    loadGenresPage(id, title) {
        Loader.loader();
        Api.getArtistsByGenreId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.artists.length) {
                const artists = result.result.artists;
                artists.forEach((artist) => {
                    const element = `
                        <div class="artistByGenrePage rowItem">
                            <a href="#" class="rowItem__link" data-id="${artist.artistid}">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${artist.artist}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn artistByGenrePage__info" data-id="${artist.artistid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn artistByGenrePage__enqueue" data-id="${artist.artistid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="rowItem__btn-group__btn3 rowItem__btn-group__btn artistByGenrePage__play" data-id="${artist.artistid}" title="${Translation.get('tooltip.play', 'Play')}">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page5 .content`).append(element);

                    Utils.onClick('.artistByGenrePage a', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page5').hide();
                        $('#gui').find('.page6').remove();
                        $('#gui').find('.page').append(`
                            <div class="page6">
                                <h2>${$element.find('span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(title, 5, 5);
                        this.loadSongsByGenrePage($element.data('id'), $element.find('span').text());
                    });

                    Utils.onClick('.artistByGenrePage__info', event => {
                        this.loadArtistInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.artistByGenrePage__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByArtistId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.artistByGenrePage__play', event => {
                        Loader.loader();
                        Api.playByArtistId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadSongsByGenrePage(id, title) {
        Loader.loader();
        Api.getAlbumsByArtistId(id).then(result => {
            Loader.remove();
            if (result.result && result.result.albums.length) {
                const albums = result.result.albums;
                albums.forEach(album => {
                    const element = `
                        <div class="songsByGenrePage rowItem">
                            <a href="#" class="rowItem__link" data-id="${album.albumid}">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${album.artist.join(', ')} ${album.label}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn songsByGenrePage__info" data-id="${album.albumid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn songsByGenrePage__enqueue" data-id="${album.albumid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn songsByGenrePage__play" data-id="${album.albumid}" title="${Translation.get('tooltip.play', 'Play')}">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page6 .content').append(element);

                    Utils.onClick('.songsByGenrePage a', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page6').hide();
                        $('#gui').find('.page7').remove();
                        $('#gui').find('.page').append(`
                            <div class="page7">
                                <h2>${$element.find('span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(title, 6, 6);
                        this.loadSongsByAlbumId($element.data('id'));
                    });

                    Utils.onClick('.songsByGenrePage__info', event => {
                        this.loadAlbumInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.songsByGenrePage__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByAlbumId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.songsByGenrePage__play', event => {
                        Loader.loader();
                        Api.playByAlbumId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadSongsByAlbumId(id) {
        Loader.loader();
        Api.getSongsByAlbumId(id).then(result => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach(song => {
                    const element = `
                        <div class="songsByAlbumId rowItem">
                            <a href="#" class="rowItem__link" data-id="${song.songid}">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${song.artist.join(', ')} ${song.label}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn songsByAlbumId__info" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn songsByAlbumId__enqueue" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page7 .content').append(element);

                    Utils.onClick('.songsByAlbumId a', event => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.songsByAlbumId__info', event => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.songsByAlbumId__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadAlbumsPage() {
        $('.page3').find('.content').append(`
            <a href="#" id="albumTitles" class="cardItem">
                <i class="fa-solid fa-file-audio cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.albums.titles', 'Titles')}
                </span>
            </a>
            <a href="#" id="albumGenres" class="cardItem">
                <i class="fa-solid fa-guitar cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.albums.genres', 'Genres')}
                </span>
            </a>
            <a href="#" id="albumYears" class="cardItem">
                <i class="fa-solid fa-calendar-days cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.albums.years', 'Years')}
                </span>
            </a>
        `);

        Utils.onClick('#albumTitles', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.albums.titles', 'Titles')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.albums.title', 'Albums'), 3, 3);
            this.loadAlbumsByTitle();
        });

        Utils.onClick('#albumGenres', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.albums.genres', 'Genres')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.albums.title', 'Albums'), 3, 3);
            this.loadAlbumsByGenre();
        });

        Utils.onClick('#albumYears', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.albums.years', 'Years')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.albums.title', 'Albums'), 3, 3);
            this.loadAlbumsByYears();
        });
    }

    loadAlbumsByYears() {
        Loader.loader();
        Api.getAlbumsByYears().then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach((file) => {
                    const element = `
                        <div class="albumYear rowItem">
                            <a href="#" class="rowItem__link" data-file="${file.file}">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${file.label}</span>
                            </a>
                        </div>
                    `;
                    $('.page4 .content').append(element);

                    Utils.onClick('.albumYear a', (event) => {
                        $('#gui').find('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);
                        this.breadcrumb.addItem(Translation.get('gui.music.albums.years', 'Years'), 4, 4);
                        this.loadAlbumsYearsPage($(event.currentTarget).find('.rowItem__span').text());
                    });
                });
            }
        });
    }

    loadAlbumsYearsPage(text) {
        Loader.loader();
        Api.getAlbumsByYearValue(text).then((result) => {
            Loader.remove();
            if (result.result && result.result.albums.length) {
                const albums = result.result.albums;
                albums.forEach(album => {
                    const element = `
                        <div class="albumYearPage rowItem">
                            <a href="#" class="rowItem__link" data-id="${album.albumid}">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${album.artist.join(' ')} - ${album.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="buttonAlbumYearPageSongs rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.songs', 'Songs')}">
                                    <i class="fa-solid fa-music"></i>
                                </button>
                                <button class="buttonAlbumYearPageEnqueue rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="buttonAlbumYearPageInformation rowItem__btn-group__btn3 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.albumYearPage a', (event) => {
                        Loader.loader();
                        Api.playByAlbumId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.buttonAlbumYearPageSongs', (event) => {
                        $('#gui').find('.page5').hide();
                        $('#gui').find('.page6').remove();
                        $('#gui').find('.page').append(`
                            <div class="page6">
                                <h2>${Translation.get('gui.music.albums.songs', 'Songs')}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(text, 5, 5);
                        this.loadAlbumsYearsPageSongs($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.page5 .buttonAlbumYearPageInformation', (event) => {
                        this.loadModalInformationAlbumTitle($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.page5 .buttonAlbumYearPageEnqueue', (event) => {
                        Loader.loader();
                        Api.addPlaylistByAlbumId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadAlbumYearInformation(id) {
        Loader.loader();
        Api.getAlbumDetailsByAlbumId(id).then((result) => {
            Loader.remove();
            const info = result.result.albumdetails;
            const body = `
                <div class="textinfo">
                    <h1 class="underline">
                        ${info.title}
                    </h1>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.artists', "Artists")}:
                        </span>
                        <span class="labelinfo">${info.artist.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.genre', "Genre")}:
                        </span>
                        <span class="labelinfo">${info.genre.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.year', "Year")}:
                        </span>
                        <span class="labelinfo">${info.year}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.played', "Played")}:</span>
                        <span class="labelinfo">${info.playcount}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.recordLabel', "Record Label")}:</span>
                        <span class="labelinfo">${info.albumlabel}</span>
                    </div>
                    <p class="artistdesc">${info.musicbrainzalbumartistid.join(' ')}</p>
                </div>
            `;

            new Modal({
                id: 'modalAlbumTitleInformation',
                title: Translation.get('information', 'Informations'),
                body
            });
        });
    }

    loadAlbumsYearsPageSongs(id) {
        Loader.loader();
        Api.getSongsByAlbumId(id).then(result => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach(song => {
                    const element = `
                        <div class="albumYearPageSong rowItem">
                            <a href="#" class="rowItem__link" data-id="${song.songid}">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${song.artist.join(' ')} ${song.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnAddPlaylistYearPageSong rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnAddPlaylistYearPageSongInfo rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page6 .content').append(element);

                    Utils.onClick('.albumYearPageSong a', (event) => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.page6 .btnAddPlaylistYearPageSong', (event) => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnAddPlaylistYearPageSongInfo', event => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadAlbumsByGenre() {
        Loader.loader();
        Api.getGenresAudio().then((result) => {
            Loader.remove();
            if (result.result && result.result.genres.length) {
                const genres = result.result.genres;
                genres.forEach((genre) => {
                    const element = `
                        <div class="albumByGenre rowItem">
                            <a href="#" class="rowItem__link" data-id="${genre.genreid}">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${genre.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="albumGenre__enqueue rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${genre.genreid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="albumGenre__play rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${genre.genreid}" title="${Translation.get('tooltip.play', 'Play')}">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.albumByGenre a', (event) => {
                        const $element = $(event.currentTarget);
                        $('#gui').find('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$element.text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.music.albums.genres', 'Genres'), 4, 4);
                        this.loadAlbumsByGenrePage($element.data('id'), $element.text());
                    });

                    Utils.onClick('.albumGenre__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistMusicByGenreId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.albumGenre__play', (event) => {
                        Loader.loader();
                        Api.playByGenreId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadAlbumsByGenrePage(id, title) {
        Loader.loader();
        Api.getAlbumsByGenreId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.albums.length) {
                const albums = result.result.albums;
                albums.forEach(album => {
                    const element = `
                        <div class="albumGenrePage rowItem">
                            <a href="#" class="rowItem__link" data-id="${album.albumid}">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${album.artist.join(' ')} ${album.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="albumGenrePage__enqueue rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="albumGenrePage__play rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.play', 'Play')}">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                                <button class="albumGenrePage__info rowItem__btn-group__btn3 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.albumGenrePage a', (event) => {
                        const $element = $(event.currentTarget);
                        $('#gui').find('.page5').hide();
                        $('#gui').find('.page6').remove();
                        $('#gui').find('.page').append(`
                            <div class="page6">
                                <h2>${$element.find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(title, 5, 5);
                        this.loadAlbumsGenreSongsPage($element.data('id'));
                    });

                    Utils.onClick('.albumGenrePage__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByAlbumId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.albumGenrePage__play', event => {
                        Loader.loader();
                        Api.playByAlbumId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.albumGenrePage__info', event => {
                        this.loadAlbumInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadAlbumsGenreSongsPage(id) {
        Loader.loader();
        Api.getSongsByAlbumId(id).then(result => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach(song => {
                    const element = `
                        <div class="albumGenreSongsPage rowItem">
                            <a href="#" class="rowItem__link" data-id="${song.songid}">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${song.artist.join(' ')} ${song.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnAlbumGenreSongsPageEnqueue rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnAlbumGenreSongsPageInfo rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;

                    $('.page6 .content').append(element);

                    Utils.onClick('.albumGenreSongsPage a', (event) => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.page6 .btnAlbumGenreSongsPageEnqueue', (event) => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnAlbumGenreSongsPageInfo', event => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadAlbumsBySongs(id) {
        Loader.loader();
        Api.getSongsByAlbumId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach((song) => {
                    const element = `
                        <div class="albumBySong">
                            <a href="#" data-id="${song.songid}">
                                ${song.artist.join(' ')} - ${song.label}
                            </a>
                            <button class="btnEnqueueAlbumSong" data-id="${song.songid}">
                                <i class="fa-solid fa-copy"></i>
                            </button>
                        </div>
                    `;
                    $(`.page5 .content`).append(element);

                    Utils.onClick('.albumBySong a', (event) => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnEnqueueAlbumSong', (event) => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadSongsByArtist() {
        Loader.loader();
        Api.getArtists().then(result => {
            Loader.remove();
            if (result.result && result.result.artists.length) {
                const artists = result.result.artists;
                artists.forEach(artist => {
                    const element = `
                        <div class="songByArtist rowItem">
                            <a href="#" data-id="${artist.artistid}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${artist.artist}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnEnqueueSongByArtist rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${artist.artistid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnInfoSongByArtist rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${artist.artistid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page4 .content').append(element);

                    Utils.onClick('.songByArtist a', (event) => {
                        const $element = $(event.currentTarget);
                        $('#gui').find('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$element.text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.music.songs.artists', 'Artists'), 4, 4);
                        this.loadSongsByArtistItems($element.data('id'));
                    });

                    Utils.onClick('.btnEnqueueSongByArtist', (event) => {
                        Loader.loader();
                        Api.addPlaylistByArtistId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnInfoSongByArtist', event => {
                        this.loadArtistInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadSongsByArtistItems(id) {
        Loader.loader();
        Api.getSongsByArtistId(id).then(result => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach(song => {
                    const element = `
                        <div class="songByArtistItem rowItem">
                            <a href="#" data-id="${song.songid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${song.artist.join(' ')} ${song.label}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn songByArtistItem__enqueue" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn songByArtistItem__info" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.songByArtistItem a', (event) => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.songByArtistItem__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.songByArtistItem__info', event => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadSongsByTitle() {
        Loader.loader();
        Api.getSongs().then(result => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach((song) => {
                    const element = `
                        <div class="songByTitle rowItem">
                            <a href="#" data-id="${song.songid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${song.artist.join(' ')} ${song.label}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnEnqueueSongByTitle rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnInfoSongByTitle rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page4 .content').append(element);

                    Utils.onClick('.page4 .btnEnqueueSongByTitle', (event) => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.songByTitle a', (event) => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnInfoSongByTitle', event => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadAlbumsByTitle() {
        Loader.loader();
        Api.getAlbums().then((result) => {
            Loader.remove();
            if (result.result && result.result.albums.length) {
                const albums = result.result.albums;
                albums.forEach((album) => {
                    const element = `
                        <div class="albumByTitle rowItem">
                            <a href="#" data-id="${album.albumid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${album.artist.join(' ')} - ${album.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnSongsAlbumTitle rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.songs', 'Songs')}">
                                    <i class="fa-solid fa-music"></i>
                                </button>
                                <button class="btnEnqueueAlbumTitle rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnInformationAlbumTitle rowItem__btn-group__btn3 rowItem__btn-group__btn" data-id="${album.albumid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.albumByTitle a', (event) => {
                        Loader.loader();
                        Api.playByAlbumId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnSongsAlbumTitle', (event) => {
                        $('#gui').find('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${Translation.get('gui.music.albums.songs', 'Songs')}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.music.albums.titles', 'Titles'), 4, 4);
                        this.loadSongsAlbumTitle($(event.currentTarget).data('id'));
                    });
                });

                Utils.onClick('.btnEnqueueAlbumTitle', (event) => {
                    Loader.loader();
                    Api.addPlaylistByAlbumId($(event.currentTarget).data('id')).then(result => {
                        Loader.remove();
                    });
                });

                Utils.onClick('.btnInformationAlbumTitle', (event) => {
                    this.loadModalInformationAlbumTitle($(event.currentTarget).data('id'));
                });
            }
        });
    }

    loadModalInformationAlbumTitle(id) {
        Loader.loader();
        Api.getAlbumDetailsByAlbumId(id).then((result) => {
            Loader.remove();
            const info = result.result.albumdetails;
            const body = `
                <div class="textinfo">
                    <h1 class="underline">
                        ${info.title}
                    </h1>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.artists', "Artists")}:
                        </span>
                        <span class="labelinfo">${info.artist.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.genre', "Genre")}:
                        </span>
                        <span class="labelinfo">${info.genre.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.year', "Year")}:
                        </span>
                        <span class="labelinfo">${info.year}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.played', "Played")}:</span>
                        <span class="labelinfo">${info.playcount}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.recordLabel', "Record Label")}:</span>
                        <span class="labelinfo">${info.albumlabel}</span>
                    </div>
                    <p class="artistdesc">${info.musicbrainzalbumartistid.join(' ')}</p>
                </div>
            `;

            new Modal({
                id: 'modalAlbumTitleInformation',
                title: Translation.get('information', 'Informations'),
                body
            });
        });
    }

    loadSongsAlbumTitle(id) {
        Loader.loader();
        Api.getSongsByAlbumId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach(song => {
                    const element = `
                        <div class="albumTitleSongsPage rowItem">
                            <a href="#" data-id="${song.songid}" class="rowItem__link">
                                <span class="rowItem__span">${song.artist.join(' ')} ${song.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnAlbumGenreSongsPageEnqueue rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnAlbumGenreSongsPageInfo rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;

                    $('.page5 .content').append(element);

                    Utils.onClick('.page5 .albumTitleSongsPage a', (event) => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.page5 .btnAlbumGenreSongsPageEnqueue', (event) => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnAlbumGenreSongsPageInfo', event => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadSongsPage() {
        $('.page3').find('.content').append(`
            <a href="#" id="songTitles" class="cardItem">
                <i class="fa-solid fa-file-audio cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.songs.titles', 'Titles')}
                </span>
            </a>
            <a href="#" id="songArtists" class="cardItem">
                <i class="fa-solid fa-user cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.songs.artists', 'Artists')}
                </span>
            </a>
            <a href="#" id="songGenres" class="cardItem">
                <i class="fa-solid fa-guitar cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.songs.genres', 'Genres')}
                </span>
            </a>
            <a href="#" id="songYears" class="cardItem">
                <i class="fa-solid fa-calendar-days cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.music.songs.years', 'Years')}
                </span>
            </a>
        `);

        Utils.onClick('#songTitles', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.songs.titles', 'Titles')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.songs.title', 'Songs'), 3, 3);
            this.loadSongsByTitle();
        });

        Utils.onClick('#songArtists', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.songs.artists', 'Artists')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.songs.title', 'Songs'), 3, 3);
            this.loadSongsByArtist();
        });

        Utils.onClick('#songGenres', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.songs.genres', 'Genres')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.songs.title', 'Songs'), 3, 3);
            this.loadSongsByGenre();
        });

        Utils.onClick('#songYears', (event) => {
            $('#gui').find('.page3').hide();
            $('#gui').find('.page4').remove();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${Translation.get('gui.music.songs.years', 'Years')}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.music.songs.title', 'Songs'), 3, 3);
            this.loadSongsByYears();
        });
    }

    loadSongsByYears() {
        Loader.loader();
        Api.getSongsByYears().then(result => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach(file => {
                    const element = `
                        <div class="songByYear rowItem">
                            <a href="#" data-file="${file.file}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${file.label}</span>
                            </a>
                        </div>
                    `;
                    $('.page4 .content').append(element);

                    Utils.onClick('.songByYear a', (event) => {
                        $('#gui').find('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.music.songs.years', 'Years'), 4, 4);
                        this.loadSongsByYearsItems($(event.currentTarget).find('.rowItem__span').text());
                    });
                });
            }
        });
    }

    loadSongsByYearsItems(year) {
        Loader.loader();
        Api.getSongsByYearValue(year).then(result => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach(song => {
                    const element = `
                        <div class="songByYearItem rowItem">
                            <a href="#" data-id="${song.songid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${song.artist.join(' ')} ${song.label}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnEnqueueSongByYearItem rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnInfoSongByYearItem rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.songByYearItem a', event => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnEnqueueSongByYearItem', (event) => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnInfoSongByYearItem', event => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadSongsByGenre() {
        Loader.loader();
        Api.getGenres().then(result => {
            Loader.remove();
            if (result.result && result.result.genres.length) {
                const genres = result.result.genres;
                genres.forEach(genre => {
                    const element = `
                        <div class="songByGenre rowItem">
                            <a href="#" data-id="${genre.genreid}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${genre.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnEnqueueSongByGenre rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${genre.genreid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnPlaySongByGenre rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${genre.genreid}" title="${Translation.get('tooltip.play', 'Play')}">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page4 .content').append(element);

                    Utils.onClick('.songByGenre a', (event) => {
                        $('#gui').find('.page4').hide();
                        $('#gui').find('.page5').remove();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.music.songs.genres', 'Genres'), 4, 4);
                        this.loadSongsByGenreItems($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.btnEnqueueSongByGenre', event => {
                        Loader.loader();
                        Api.addPlaylistMusicByGenreId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnPlaySongByGenre', event => {
                        Loader.loader();
                        Api.playByGenreId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadSongsByGenreItems(id) {
        Loader.loader();
        Api.getSongsByGenreId(id).then(result => {
            Loader.remove();
            if (result.result && result.result.songs.length) {
                const songs = result.result.songs;
                songs.forEach(song => {
                    const element = `
                        <div class="songByGenreItem rowItem">
                            <a href="#" data-id="${song.songid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${song.artist.join(' ')} ${song.label}
                                </span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnEnqueueSongByGenreItem rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnInfoSongByGenreItem rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${song.songid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.songByGenreItem a', (event) => {
                        Loader.loader();
                        Api.playBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnInfoSongByGenreItem', (event) => {
                        this.loadSongGenreInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.btnEnqueueSongByGenreItem', event => {
                        Loader.loader();
                        Api.addPlaylistBySongId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadSongGenreInformation(id) {
        Loader.loader();
        Api.getSongDetailsBySongId(id).then(result => {
            Loader.remove();
            const info = result.result.songdetails;
            const body = `
                <div class="textinfo">
                    <h1 class="underline">
                        ${info.title}
                    </h1>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.artists', "Artists")}:
                        </span>
                        <span class="labelinfo">${info.artist.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.genre', "Genre")}:
                        </span>
                        <span class="labelinfo">${info.genre.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.year', "Year")}:
                        </span>
                        <span class="labelinfo">${info.year}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.played', "Played")}:</span>
                        <span class="labelinfo">${info.playcount}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.lastPlayed', "Last PLayed")}:</span>
                        <span class="labelinfo">${info.lastplayed}</span>
                    </div>
                </div>
            `;

            new Modal({
                id: 'modalSongGenreInformation',
                title: Translation.get('information', 'Informations'),
                body
            });
        });
    }

    loadFilesPage() {
        Loader.loader();
        Api.getFilesByMedia("music").then((result) => {
            Loader.remove();
            if (result.result && result.result.sources.length) {
                const files = result.result.sources;
                files.forEach((file) => {
                    const element = `
                        <div class="file rowItem">
                            <a href="#" data-link="${file.file}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${file.label}</span>
                            </a>
                        </div>
                    `;
                    $(`.page3 .content`).append(element);

                    Utils.onClick('.file a', (event) => {
                        const $element = $(event.currentTarget);
                        this.loadFilesDirectory($element.data('link'), $element.find('span').text(), 3);
                    });
                });
            }
        });
    }

    loadFilesDirectory(path, title, numPageActive) {

        $('#gui').find(`.page${numPageActive}`).hide();
        $('#gui').find('.page').append(`
            <div class="page${numPageActive + 1}">
                <h2>${title}</h2>
                <div class="content"></div>
            </div>
        `);

        this.breadcrumb.addItem($(`.page${numPageActive}`).find('h2').text(), numPageActive, numPageActive);

        Loader.loader();
        Api.getDirectoryByDirectoryAndMedia(path, "music").then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach((file) => {
                    const element = `
                        <div class="fileDirectory rowItem">
                            <a href="#" data-file="${file.file}" data-type="${file.filetype}" class="rowItem__link">
                                <i class="fa-solid ${file.filetype === 'directory' ? 'fa-folder-open' : 'fa-file'} rowItem__icon"></i>
                                <span class="rowItem__span">
                                    ${file.label}
                                </span>
                            </a>
                        </div>
                    `;
                    $(`.page${numPageActive + 1} .content`).append(element);

                    Utils.onClick(`.page${numPageActive + 1} .fileDirectory a`, (event) => {
                        const $element = $(event.currentTarget);
                        const filetype = $element.data('type');
                        const file = $element.data('file');
                        if (filetype === "directory") {
                            this.loadFilesDirectory(file, $element.find('.rowItem__span').text(), numPageActive + 1);
                        } else {
                            Loader.loader();
                            Api.playByFile(file).then((result) => {
                                Loader.remove();
                            });
                        }
                    });
                });
            }
        });
    }

    loadLibraryPage() {
        $('.page3').find('.content').append(`
            <a href="#" id="scan" class="cardItem">
                <i class="fa-solid fa-folder-plus cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.library.scan', 'Scan Library')}
                </span>
            </a>
            <a href="#" id="clean" class="cardItem">
                <i class="fa-solid fa-broom cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.library.clean', 'Clean Library')}
                </span>
            </a>
            <a href="#" id="export" class="cardItem">
                <i class="fa-solid fa-file-arrow-down cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.library.export', 'Export Library')}
                </span>
            </a>
        `);

        Utils.onClick('#scan', (event) => {
            Loader.loader();
            Api.scanLibraryAudio().then((result) => {
                Loader.remove();
            });
        });

        Utils.onClick('#clean', (event) => {
            Loader.loader();
            Api.cleanLibraryAudio().then((result) => {
                Loader.remove();
            });
        });

        Utils.onClick('#export', (event) => {
            Loader.loader();
            Api.exportLibraryAudio().then((result) => {
                Loader.remove();
            });
        });
    }
}