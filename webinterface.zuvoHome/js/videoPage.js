// @ts-nocheck

class VideoPage {

    constructor(options) {

        this.breadcrumb = options.breadcrumb;

        $('#gui').find(`.page2`).remove();
        $('#gui').find('.page').append(`
            <div class="page2">
                <h2>${Translation.get('gui.video.title', 'Video')}</h2>
                <div class="content"></div>
            </div>
        `);

        this.loadLink('moviesLink', Translation.get('gui.video.movies.title', 'Movies'));
        this.loadLink('playlistsLink', Translation.get('gui.video.playlists', 'Playlists'));
        this.loadLink('tvShowsLink', Translation.get('gui.video.tvShows.title', 'TV Shows'));
        this.loadLink('musicVideoLink', Translation.get('gui.video.musicVideo.title', 'Music Video'));
        this.loadLink('filesLink', Translation.get('gui.video.files', 'Files'));
        this.loadLink('libraryLink', Translation.get('gui.video.library.title', 'Library'));
    }

    loadLink(id, title) {
        const link = `
            <a id="${id}" href="#" class="cardItem">
                <i class="${this.loadIconVideo(id)} cardItem__icon"></i>
                <span class="cardItem__span">${title}</span>
            </a>
        `;

        $('.page2 .content').append(link);

        Utils.onClick(`#${id}`, (event) => {
            this.load(id, title);
        });
    }

    loadIconVideo(id) {
        switch (id) {
            case 'moviesLink':
                return "fa-brands fa-square-letterboxd";
            case 'playlistsLink':
                return 'fa-solid fa-circle-play';
            case 'tvShowsLink':
                return 'fa-solid fa-tv';
            case 'musicVideoLink':
                return 'fa-solid fa-guitar';
            case 'filesLink':
                return 'fa-solid fa-file-audio';
            case 'libraryLink':
                return 'fa-solid fa-folder-open';
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

        this.breadcrumb.addItem(Translation.get('gui.video.title', 'Video'), 2, 2);

        switch (id) {
            case 'moviesLink':
                this.loadMoviesPage();
                break;
            case 'playlistsLink':
                this.loadPlaylistsPage();
                break;
            case 'tvShowsLink':
                this.loadTVShowsPage();
                break;
            case 'musicVideoLink':
                this.loadMusicVideoPage();
                break;
            case 'filesLink':
                this.loadFilesPage();
                break;
            case 'libraryLink':
                this.loadLibraryPage();
                break;
        }
    }

    loadMoviesPage() {
        $('.page3').find('.content').append(`
            <a href="#" id="moviesTitles" class="cardItem">
                <i class="fa-solid fa-photo-film cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.movies.titles', 'Titles')}
                </span>
            </a>
            <a href="#" id="moviesGenres" class="cardItem">
                <i class="fa-solid fa-drum-steelpan cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.movies.genres', 'Genres')}
                </span>
            </a>
            <a href="#" id="moviesYears" class="cardItem">
                <i class="fa-solid fa-calendar-days cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.movies.years', 'Years')}
                </span>
            </a>
        `);

        Utils.onClick('#moviesTitles', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.movies.title', 'Movies'), 3, 3);
            this.loadMoviesByTitle();
        });

        Utils.onClick('#moviesGenres', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.movies.title', 'Movies'), 3, 3);
            this.loadMoviesByGenre();
        });

        Utils.onClick('#moviesYears', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.movies.title', 'Movies'), 3, 3);
            this.loadMoviesByYear();
        });
    }

    loadMoviesByYear() {
        Loader.loader();
        Api.getMoviesByYear().then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach((file) => {
                    const yearElement = `
                        <div class="movieYear rowItem">
                            <a href="#" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${file.label}</span>
                            </a>
                        </div>
                    `;
                    $(`.page4 .content`).append(yearElement);
                });

                Utils.onClick('.movieYear a', (event) => {
                    $('.page4').hide();
                    $('#gui').find('.page').append(`
                        <div class="page5">
                            <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                            <div class="content"></div>
                        </div>
                    `);

                    this.breadcrumb.addItem(Translation.get('gui.video.movies.years', 'Years'), 4, 4);
                    this.loadMoviesByYearsPage($(event.currentTarget).find('.rowItem__span').text());
                });
            }
        });
    }

    loadTVShowsByYear() {
        Loader.loader();
        Api.getTvShowsByYear().then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach(item => {
                    const element = `
                        <div class="tvShowYear rowItem">
                            <a href="#" data-file="${item.file}" data-year="${item.label}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${item.label}</span>
                            </a>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);
                });

                Utils.onClick('.tvShowYear a', (event) => {
                    const $element = $(event.currentTarget);
                    $('.page4').hide();
                    $('#gui').find('.page').append(`
                        <div class="page5">
                            <h2>${$element.find('.rowItem__span').text()}</h2>
                            <div class="content"></div>
                        </div>
                    `);

                    this.breadcrumb.addItem(Translation.get('gui.video.movies.years', 'Years'), 4, 4);
                    this.loadTVShowsByYearsPage($element.data('year'));
                });
            }
        });
    }

    loadTVShowsByGenre() {
        Loader.loader();
        Api.getGenresByTvShow().then((result) => {
            Loader.remove();
            if (result.result && result.result.genres.length) {
                const genres = result.result.genres;
                genres.forEach((genre) => {
                    const genreElement = `
                        <div class="tvShowGenre rowItem">
                            <a href="#" data-id="${genre.genreid}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${genre.label}</span>
                            </a>
                        </div>
                    `;
                    $(`.page4 .content`).append(genreElement);
                });

                Utils.onClick('.tvShowGenre a', (event) => {
                    const $element = $(event.currentTarget);
                    $('.page4').hide();
                    $('#gui').find('.page').append(`
                        <div class="page5">
                            <h2>${$element.find('.rowItem__span').text()}</h2>
                            <div class="content"></div>
                        </div>
                    `);

                    this.breadcrumb.addItem(Translation.get('gui.video.movies.genres', 'Genres'), 4, 4);
                    this.loadTVShowsByGenrePage($element.data('id'), $element.find('.rowItem__span').text());
                });
            }
        });
    }

    loadMoviesByGenre() {
        Loader.loader();
        Api.getGenresVideo().then((result) => {
            Loader.remove();
            if (result.result && result.result.genres.length) {
                const genres = result.result.genres;
                genres.forEach((genre) => {
                    const element = `
                        <div class="movieGenre rowItem">
                            <a href="#" data-id="${genre.genreid}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${genre.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn movieGenre__enqueue" data-id="${genre.genreid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);
                });

                Utils.onClick('.movieGenre a', (event) => {
                    $('.page4').hide();
                    $('#gui').find('.page').append(`
                        <div class="page5">
                            <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                            <div class="content"></div>
                        </div>
                    `);

                    this.breadcrumb.addItem(Translation.get('gui.video.movies.genres', 'Genres'), 4, 4);
                    this.loadMoviesByGenrePage($(event.currentTarget).data('id'));
                });

                Utils.onClick('.movieGenre__enqueue', (event) => {
                    Loader.loader();
                    Api.addPlaylistVideoByGenreId($(event.currentTarget).data('id')).then(result => {
                        Loader.remove();
                    });
                });
            }
        });
    }

    loadTVShowsByYearsPage(value) {
        Loader.loader();
        Api.getTvShowsByYearValue(value).then((result) => {
            Loader.remove();
            if (result.result && result.result.tvshows.length) {
                const tvshows = result.result.tvshows;
                tvshows.forEach((tvshow) => {
                    const element = `
                        <div class="tvShowYearPage rowItem">
                            <a href="#" data-id="${tvshow.tvshowid}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${tvshow.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnTVShowInformation rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${tvshow.tvshowid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.tvShowYearPage a', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page5').hide();
                        $('#gui').find('.page').append(`
                            <div class="page6">
                                <h2>${$element.find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(value, 5, 5);
                        this.loadTvShowSeasonsPage($element.data('id'), $element.text());
                    });

                    Utils.onClick('.btnTVShowInformation', (event) => {
                        this.loadTVShowTitleInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadTvShowSeasonsPage(tvshowid, title) {
        Loader.loader();
        Api.getSeasonsByTvShowId(tvshowid).then((result) => {
            Loader.remove();
            if (result.result && result.result.seasons.length) {
                const seasons = result.result.seasons;
                seasons.forEach(season => {
                    const element = `
                        <div class="tvShowSeason rowItem">
                            <a href="#" data-id="${season.season}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${season.label}</span>
                            </a>
                        </div>
                    `;
                    $('.page6 .content').append(element);

                    Utils.onClick('.tvShowSeason a', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page6').hide();
                        $('#gui').find('.page').append(`
                            <div class="page7">
                                <h2>${$element.find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(title, 6, 6);
                        this.loadEpisodesTVShows($element.data('id'), tvshowid);
                    });
                });
            }
        });
    }

    loadMoviesByYearsPage(value) {
        Loader.loader();
        Api.getMoviesByYearsValue(value).then((result) => {
            Loader.remove();
            if (result.result && result.result.movies.length) {
                const movies = result.result.movies;
                movies.forEach((movie) => {
                    const movieElement = `
                        <div class="movieYearPage rowItem">
                            <a href="#" data-id="${movie.movieid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${movie.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn movieYearPage__info" data-id="${movie.movieid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn movieYearPage__enqueue" data-id="${movie.movieid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(movieElement);

                    Utils.onClick('.movieYearPage a', (event) => {
                        Loader.loader();
                        Api.playByMovieId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.movieYearPage__info', (event) => {
                        this.loadMovieInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.movieYearPage__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByMovieId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadTVShowsByGenrePage(id, title) {
        Loader.loader();
        Api.getTvShowsByGenreId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.tvshows.length) {
                const tvshows = result.result.tvshows;
                tvshows.forEach((tvshow) => {
                    const element = `
                        <div class="tvShowGenrePage rowItem">
                            <a href="#" data-id="${tvshow.tvshowid}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${tvshow.title}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn tvShowGenrePage__info" data-id="${tvshow.tvshowid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.tvShowGenrePage a', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page5').hide();
                        $('#gui').find('.page').append(`
                            <div class="page6">
                                <h2>${$element.find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(title, 5, 5);
                        this.loadSeasonsTVShowsByGenres($element.data('id'), $element.find('.rowItem__span').text());
                    });

                    Utils.onClick('.tvShowGenrePage__info', event => {
                        this.loadTVShowTitleInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadSeasonsTVShowsByGenres(id, title) {
        Loader.loader();
        Api.getSeasonsByTvShowId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.seasons.length) {
                const seasons = result.result.seasons;
                seasons.forEach((season) => {
                    const element = `
                        <div class="season rowItem">
                            <a href="#" data-id="${season.season}" data-tvshowid="${id}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${season.label}</span>
                            </a>
                        </div>
                    `;
                    $('.page6 .content').append(element);
                });

                Utils.onClick('.season a', (event) => {
                    const $element = $(event.currentTarget);
                    $('.page6').hide();
                    $('#gui').find('.page7').remove();
                    $('#gui').find('.page').append(`
                        <div class="page7">
                            <h2>${$element.find('.rowItem__span').text()}</h2>
                            <div class="content"></div>
                        </div>
                    `);

                    this.breadcrumb.addItem(title, 6, 6);
                    this.loadTVShowsEpisodesListBySeasons($element.data('id'), $element.data('tvshowid'));
                });
            }
        });
    }

    loadMoviesByGenrePage(id) {
        Loader.loader();
        Api.getMoviesByGenreId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.movies.length) {
                const movies = result.result.movies;
                movies.forEach((movie) => {
                    const element = `
                        <div class="movieGenrePage rowItem">
                            <a href="#" data-id="${movie.movieid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${movie.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn movieGenrePage__info" data-id="${movie.movieid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn movieGenrePage__enqueue" data-id="${movie.movieid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.movieGenrePage a', (event) => {
                        Loader.loader();
                        Api.playByMovieId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.movieGenrePage__info', (event) => {
                        this.loadMovieInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.movieGenrePage__enqueue', (event) => {
                        Loader.loader();
                        Api.addPlaylistByMovieId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadMoviesByTitle() {
        Loader.loader();
        Api.getMovies().then((result) => {
            Loader.remove();
            if (result.result && result.result.movies.length) {
                const movies = result.result.movies;
                movies.forEach(movie => {
                    const element = `
                        <div class="movieTitle rowItem">
                            <a href="#" data-id="${movie.movieid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${movie.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn movieTitle__info" data-id="${movie.movieid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn movieTitle__enqueue" data-id="${movie.movieid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.movieTitle a', (event) => {
                        Loader.loader();
                        Api.playByMovieId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.movieTitle__info', (event) => {
                        this.loadMovieInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.movieTitle__enqueue', (event) => {
                        Loader.loader();
                        Api.addPlaylistByMovieId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadTVShowsByTitle() {
        Loader.loader();
        Api.getTVShows().then((result) => {
            Loader.remove();
            if (result.result && result.result.tvshows.length) {
                const tvshows = result.result.tvshows;
                tvshows.forEach(tvshow => {
                    const element = `
                        <div class="tvShowTitle rowItem">
                            <img class="tvShowTitle__link__img rowItem__img" src="${Utils.kodiImageToUrl(tvshow.art.poster)}" />
                            <div class="tvShowTitle__content">
                                <a href="#" data-id="${tvshow.tvshowid}" class="tvShowTitle__link rowItem__link">
                                    <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                    <span class="rowItem__span">${tvshow.originaltitle}</span>
                                </a>
                                <span class="tvShowTitle__link__plot rowItem__plot">${tvshow.plot}</span>
                                <div class="tvShowTitle__link__rating rowItem__rating">
                                    ${this.generateStars(tvshow.rating)}
                                    <span>${tvshow.rating.toFixed(1)}</span>
                                </div>
                                <div class="rowItem__btn-group">
                                    <button class="tvShowTitle__information rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${tvshow.tvshowid}" title="${Translation.get('tooltip.info', 'Info')}">
                                        <i class="fa-solid fa-circle-info"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.tvShowTitle a.tvShowTitle__link', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page4').hide();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$element.find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.video.tvShows.titles', 'Titles'), 4, 4);
                        this.loadSeasonsTVShows($element.data('id'), $element.find('.rowItem__span').text());
                    });

                    Utils.onClick('.tvShowTitle__information', (event) => {
                        this.loadTVShowTitleInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadEpisodeInformation(id) {
        Loader.loader();
        Api.getEpisodeDetailsByEpisodeId(id).then(result => {
            Loader.remove();
            const episode = result.result.episodedetails;
            let body = `
                <div class="thumb">
                    <img src="${episode.thumbnail ? Utils.kodiImageToUrl(episode.thumbnail) : 'assets/images/emptyActor.png'}" class="thumbFanart">
                </div>
                <div class="textinfo">
                    <div class="title">
                        <h1 class="underline">${episode.title}</h1>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.episode', 'Episode')}:</span>
                        <span class="value">${episode.episode}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.season', 'Season')}:</span>
                        <span class="value">${episode.season}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.duration', 'Duration')}:</span>
                        <span class="value">${Utils.formatTime(episode.runtime)}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.rating', 'Rating')}:</span>
                        <span class="value">
                            <div class="rating">
                                ${this.generateStars(episode.rating)}
                            </div>
                        </span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.firstaired', 'First start')}:</span>
                        <span class="value">${episode.firstaired}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.lastPlayed', 'Last played')}:</span>
                        <span class="value">${episode.playcount}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.audioTrack', 'Audio track')}</span>
                        <span class="value">${this.getChannels(episode.streamdetails.audio)}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.file', 'File')}:</span>
                        <span class="value">${episode.file}</span>
                    </div>
                </div>
            `;

            new Modal({
                id: 'modalInformationEpisode',
                title: Translation.get('information', 'Informations'),
                body
            });
        });
    }

    loadMusicVideoInformation(id) {
        Loader.loader();
        Api.getMusicVideoDetailsByMusicVideoId(id).then(result => {
            Loader.remove();
            const musicvideo = result.result.musicvideodetails;

            let body = `
                <div class="thumb">
                    <img src="${musicvideo.thumbnail ? Utils.kodiImageToUrl(musicvideo.thumbnail) : 'assets/images/empty_cover_musicvideo.png'}" class="thumbFanart">
                </div>
                <div class="textinfo">
                    <h1 class="underline">${musicvideo.title}</h1>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.duration', 'Duration')}:</span>
                        <span class="value">${Utils.formatTime(musicvideo.runtime)}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.genre', 'Genres')}</span>
                        <span class="value">${musicvideo.genre.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.year', 'Year')}:</span>
                        <span class="value">${musicvideo.year}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.director', 'Director')}</span>
                        <span class="value">${musicvideo.director.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.lastPlayed', 'Last played')}:</span>
                        <span class="value">${musicvideo.lastplayed}</span>
                    </div>
                    <div class="movieinfo filelink">
                        <span class="label">${Translation.get('gui.info.file', 'File')}:</span>
                        <span class="value">${musicvideo.file}</span>
                    </div>
                </div>
            `;

            new Modal({
                id: 'modalMusicVideoInformation',
                title: Translation.get('information', 'Informations'),
                body
            });
        });
    }

    loadMovieInformation(id) {
        Loader.loader();
        Api.getMovieDetailsByMovieId(id).then(result => {
            Loader.remove();
            const movie = result.result.moviedetails;
            let body = `
                <div class="movieframe">
                    <div class="title">
                        <h1 class="underline">${movie.title}</h1>
                    </div>
                    <div class="textinfo">
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.originaltitle', 'Original title')}:</span>
                            <span class="value">${movie.originaltitle}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.runtime', 'Duration')}:</span>
                            <span class="value">${Utils.formatTime(movie.runtime)}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.genre', 'Genres')}</span>
                            <span class="value">${movie.genre.join(', ')}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.rating', 'Rating')}:</span>
                            <span class="value">
                                <div class="rating">
                                    ${this.generateStars(movie.rating)}
                                </div>
                            </span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.votes', 'Votes')}:</span>
                            <span class="value">${movie.votes}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.year', 'Year')}:</span>
                            <span class="value">${movie.year}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.director', 'Directors')}</span>
                            <span class="value">${movie.director.join(' ')}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.writer', 'Writer')}: </span>
                            <span class="value">${movie.writer.join(', ')}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.studio', 'Studios')}</span>
                            <span class="value">${movie.studio.join(', ')}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.tagline', 'Tag line')}:</span>
                            <span class="value">${movie.tagline}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.tag', 'Tags')}:</span>
                            <span class="value">${movie.tag.join(', ')}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.trailer', 'Trailer')}:</span>
                            <span class="value">
                                <a href="${movie.trailer}">Link</a>
                            </span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.set', 'Set')}:</span
                            ><span class="value">${movie.set}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.lastplayed', 'Last played')}:</span
                            ><span class="value">${movie.lastplayed}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.played', 'Played')}:</span>
                            <span class="value">${movie.playcount}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">${Translation.get('gui.movie.audio', 'Audio')}</span>
                            <span class="value">${this.getChannels(movie.streamdetails.audio)}</span>
                        </div>
                        <div class="movieinfo">
                            <span class="label">IMDB:</span>
                            <span class="value">
                                <a href="http://www.imdb.com/title/${movie.imdbnumber}">IMDB</a>
                            </span>
                        </div>
                        <div class="movieinfo filelink">
                            <span class="label">${Translation.get('gui.movie.file', 'File')}:</span>
                            <span class="value">${movie.file}</span>
                        </div>
                        <div class="movieinfo">
                            <p class="plot">
                                ${movie.plot}
                            </p>
                        </div>
                    </div>
                    <div class="movieinfo">
                        <div class="movietags">
                            <button class="infoqueue" data-id="${movie.movieid}">${Translation.get('gui.movie.enqueue', 'Enqueue')}</span>
                            <button class="infoplay" data-id="${movie.movieid}">${Translation.get('gui.movie.play', 'Play')}</button>
                        </div>
                    </div>
                    <h2>Cast</h2>
                    <div class="movieinfo">
                        <div class="cast">
            `;
            movie.cast.forEach((c, i) => {
                body += `
                            <div class="actorimg actOrder${i}">
                                <img src="${c.thumbnail ? Utils.kodiImageToUrl(c.thumbnail) : "assets/images/emptyActor.png"}" class="actor" />
                                <div class="actortext">
                                    <span class="actorname">${c.name}</span>
                                    <span class="actorrole">${c.role}</span>
                                </div>
                            </div>
                `;
            });
            body += `
                        </div>
                    </div>
                </div>
            `;
            new Modal({
                id: 'modalInformationMovie',
                title: Translation.get('information', 'Informations'),
                body
            });

            Utils.onClick('.infoqueue', (event) => {
                Loader.loader();
                Api.addPlaylistByMovieId($(event.currentTarget).data('id')).then(result => {
                    Loader.remove();
                });
            });

            Utils.onClick('.infoplay', (event) => {
                Loader.loader();
                Api.playByMovieId($(event.currentTarget).data('id')).then(result => {
                    Loader.remove();
                });
            });
        });
    }

    getChannels(audio) {
        let item = [];
        audio.forEach(a => {
            item.push(`${a.channels} - ${a.language}: ${a.codec}`);
        });
        return item.join(', ');
    }

    loadTVShowTitleInformation(id) {
        Loader.loader();
        Api.getTvShowDetailsByTvShowId(id).then(result => {
            Loader.remove();
            const info = result.result.tvshowdetails;
            let body = `
                <div class="textinfo">
                    <h1 class="underline">
                        ${info.title}
                    </h1>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.genre', "Genre")}:
                        </span>
                        <span class="labelinfo">${info.genre.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.description', "Description")}:
                        </span>
                        <span class="labelinfo">${info.plot}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">
                            ${Translation.get('gui.info.tags', "Tags")}:
                        </span>
                        <span class="labelinfo">${info.tag.join(', ')}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.played', "Played")}:</span>
                        <span class="labelinfo">${info.playcount}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.date', "Date")}:</span>
                        <span class="labelinfo">${info.premiered}</span>
                    </div>
                    <div class="movieinfo">
                        <span class="label">${Translation.get('gui.info.premiered', "Premiered")}:</span>
                        <span class="labelinfo">
                            <div class="rating">
                                ${this.generateStars(info.rating)}
                            </div>
                        </span>
                    </div>
                    <h2>Cast</h2>
            `;
            info.cast.forEach((c, i) => {
                body += `
                    <div class="actorimg actOrder${i}">
                        <img src="${c.thumbnail ? Utils.kodiImageToUrl(c.thumbnail) : 'assets/images/emptyActor.png'}" class="actor">
                        <div class="actortext">
                            <span class="actorname">${c.name}</span>
                            <span class="actorrole">${c.role}</span>
                        </div>
                    </div>
                `
            });

            body += '</div>';

            new Modal({
                id: 'modalTVShowTitleInformation',
                title: Translation.get('information', 'Informations'),
                body
            });
        });
    }

    loadSeasonsTVShows(id, title) {
        Loader.loader();
        Api.getSeasonsByTvShowId(id).then((result) => {
            Loader.remove();
            if (result.result && result.result.seasons.length) {
                const seasons = result.result.seasons;
                seasons.forEach((season) => {
                    const element = `
                        <div class="season rowItem">
                            <a href="#" data-id="${season.season}" data-tvshowid="${id}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${season.label}</span>
                            </a>
                        </div>
                    `;
                    $('.page5 .content').append(element);
                });

                Utils.onClick('.season a', (event) => {
                    const $element = $(event.currentTarget);
                    $('.page5').hide();
                    $('#gui').find('.page6').remove();
                    $('#gui').find('.page').append(`
                        <div class="page6">
                            <h2>${$element.find('.rowItem__span').text()}</h2>
                            <div class="content"></div>
                        </div>
                    `);

                    this.breadcrumb.addItem(title, 5, 5);
                    this.loadEpisodesList($element.data('id'), $element.data('tvshowid'));
                });
            }
        });
    }

    loadTVShowsEpisodesListBySeasons(id, tvshowid) {
        Loader.loader();
        Api.getEpisodesByTvShowIdAndSeason(id, tvshowid).then((result) => {
            Loader.remove();
            if (result.result && result.result.episodes.length) {
                const episodes = result.result.episodes;
                episodes.forEach((episode) => {
                    const element = `
                        <div class="episode rowItem">
                            <a href="#" data-id="${episode.episodeid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${episode.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn episode__info" data-id="${episode.episodeid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn episode__enqueue" data-id="${episode.episodeid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page7 .content').append(element);

                    Utils.onClick('.episode a', (event) => {
                        Loader.loader();
                        Api.playByEpisodeId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.episode__info', event => {
                        this.loadEpisodeInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.episode__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByEpisodeId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadEpisodesTVShows(id, tvshowid) {
        Loader.loader();
        Api.getEpisodesByTvShowIdAndSeason(id, tvshowid).then((result) => {
            Loader.remove();
            if (result.result && result.result.episodes.length) {
                const episodes = result.result.episodes;
                episodes.forEach((episode) => {
                    const element = `
                        <div class="episode rowItem">
                            <a href="#" data-id="${episode.episodeid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${episode.showtitle} - ${episode.title}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn episode__info" data-id="${episode.episodeid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn episode__enqueue" data-id="${episode.episodeid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page7 .content').append(element);

                    Utils.onClick('.episode a', (event) => {
                        Loader.loader();
                        Api.playByEpisodeId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.episode__info', event => {
                        this.loadEpisodeInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.episode__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByEpisodeId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadEpisodesList(id, tvshowid) {
        Loader.loader();
        Api.getEpisodesByTvShowIdAndSeason(id, tvshowid).then((result) => {
            Loader.remove();
            if (result.result && result.result.episodes.length) {
                const episodes = result.result.episodes;
                episodes.forEach((episode) => {
                    const element = `
                        <div class="episode rowItem">
                            <a href="#" data-id="${episode.episodeid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${episode.showtitle} - ${episode.title}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn episode__info" data-id="${episode.episodeid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn episode__enqueue" data-id="${episode.episodeid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page6 .content').append(element);

                    Utils.onClick('.episode a', (event) => {
                        Loader.loader();
                        Api.playByEpisodeId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.episode__info', event => {
                        this.loadEpisodeInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.episode__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByEpisodeId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    generateStars(rating) {
        const stars = rating / 2;
        let html = "";

        for (let i = 0; i < 5; i++) {
            const fill = Math.max(0, Math.min(1, stars - i)) * 100;

            html += `
                <span class="star">
                    ★
                    <span class="star-fill" style="width:${fill}%">★</span>
                </span>
            `;
        }

        return html;
    }

    loadPlaylistsPage() {
        Loader.loader();
        Api.getVideoPlaylists().then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach((file) => {
                    const element = `
                        <div class="playlist rowItem">
                            <a href="#" data-file="${file.file}" class="rowItem__link">
                                <i class="fa-solid fa-circle-play rowItem__icon"></i>
                                <span class="rowItem__span">${file.label}</span>
                            </a>
                        </div>
                    `;
                    $('.page3 .content').append(element);

                    Utils.onClick('.playlist a', (event) => {
                        const $element = $(event.currentTarget);
                        $('.page3').hide();
                        $('#gui').find('.page').append(`
                            <div class="page4">
                                <h2>${$element.find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.video.movies.playlists', 'Playlists'), 3, 3);
                        this.loadVideoPlaylist($element.data('file'));
                    });
                });
            }
        });
    }

    loadVideoPlaylist(file) {
        Loader.loader();
        Api.getVideoPlaylistsByDirectory(file).then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach((file) => {
                    const element = `
                        <div class="filePlaylist rowItem">
                            <a href="#" data-file="${file.file}" data-movieid="${file.id}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${file.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="btnEnqueuePlaylistVideo rowItem__btn-group__btn1 rowItem__btn-group__btn" data-id="${file.id}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                                <button class="btnInfoPlaylistVideo rowItem__btn-group__btn2 rowItem__btn-group__btn" data-id="${file.id}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page4 .content').append(element);

                    Utils.onClick('.filePlaylist a', (event) => {
                        Loader.loader();
                        Api.playByFile($(event.currentTarget).data('file')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnEnqueuePlaylistVideo', (event) => {
                        Loader.loader();
                        Api.addPlaylistByMovieId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.btnInfoPlaylistVideo', event => {
                        this.loadMovieInformation($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadTVShowsPage() {
        $('.page3').find('.content').append(`
            <a href="#" id="tvShowsTitles" class="cardItem">
                <i class="fa-solid fa-closed-captioning cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.tvShows.titles', 'Titles')}
                </span>
            </a>
            <a href="#" id="tvShowsGenres" class="cardItem">
                <i class="fa-solid fa-photo-film cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.tvShows.genres', 'Genres')}
                </span>
            </a>
            <a href="#" id="tvShowsYears" class="cardItem">
                <i class="fa-solid fa-calendar-days cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.tvShows.years', 'Years')}
                </span>
            </a>
        `);

        Utils.onClick('#tvShowsTitles', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.tvShows.title', 'TV Shows'), 3, 3);
            this.loadTVShowsByTitle();
        });

        Utils.onClick('#tvShowsGenres', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.tvShows.title', 'TV Shows'), 3, 3);
            this.loadTVShowsByGenre();
        });

        Utils.onClick('#tvShowsYears', (event) => {
            const $element = $(event.currentTarget);
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$element.text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.tvShows.title', 'Movies'), 3, 3);
            this.loadTVShowsByYear();
        });
    }

    loadMusicVideoPage() {
        $('.page3').find('.content').append(`
            <a href="#" id="videoMusicTitles" class="cardItem">
                <i class="fa-solid fa-clapperboard cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.musicVideo.titles', 'Titles')}
                </span>
            </a>
            <a href="#" id="videoMusicGenres" class="cardItem">
                <i class="fa-solid fa-photo-film cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.musicVideo.genres', 'Genres')}
                </span>
            </a>
            <a href="#" id="videoMusicYears" class="cardItem">
                <i class="fa-solid fa-calendar-days cardItem__icon"></i>
                <span class="cardItem__span">
                    ${Translation.get('gui.video.musicVideo.years', 'Years')}
                </span>
            </a>
        `);

        Utils.onClick('#videoMusicTitles', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).find('.cardItem__span').text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.musicVideo.title', 'Video Music'), 3, 3);
            this.loadVideoMusicByTitle();
        });

        Utils.onClick('#videoMusicGenres', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).find('.cardItem__span').text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.musicVideo.title', 'Video Music'), 3, 3);
            this.loadVideoMusicByGenre();
        });

        Utils.onClick('#videoMusicYears', (event) => {
            $('.page3').hide();
            $('#gui').find('.page').append(`
                <div class="page4">
                    <h2>${$(event.currentTarget).find('.cardItem__span').text()}</h2>
                    <div class="content"></div>
                </div>
            `);

            this.breadcrumb.addItem(Translation.get('gui.video.musicVideo.title', 'Video Music'), 3, 3);
            this.loadVideoMusicByYear();
        });
    }

    loadVideoMusicByYear() {
        Loader.loader();
        Api.getMusicVideoByYear().then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach(item => {
                    const element = `
                        <div class="musicVideoYear rowItem">
                            <a href="#" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${item.label}</span>
                            </a>
                        </div>
                    `;
                    $('.page4 .content').append(element);

                    Utils.onClick('.musicVideoYear a', (event) => {
                        $('.page4').hide();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.video.musicVideo.years', 'Years'), 4, 4);
                        this.loadMusicVideoByYearValue($(event.currentTarget).find('.rowItem__span').text());
                    });
                });
            }
        });
    }

    loadMusicVideoByYearValue(label) {
        Loader.loader();
        Api.getMusicVideoByYearValue(label).then((result) => {
            Loader.remove();
            if (result.result && result.result.musicvideos.length) {
                const items = result.result.musicvideos;
                items.forEach((item) => {
                    const element = `
                        <div class="musicVideoYearList rowItem">
                            <a href="#" data-id="${item.musicvideoid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${item.title}</span>
                            </a>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.musicVideoYearList a', (event) => {
                        Loader.loader();
                        Api.playByMusicVideoId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadVideoMusicByTitle() {
        Loader.loader();
        Api.getMusicVideos().then((result) => {
            Loader.remove();
            if (result.result && result.result.musicvideos.length) {
                const musicvideos = result.result.musicvideos;
                musicvideos.forEach(musicVideo => {
                    const element = `
                        <div class="musicVideoTitle rowItem">
                            <a href="#" data-id="${musicVideo.musicvideoid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${musicVideo.artist.join(' ')} - ${musicVideo.label}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn musicVideoTitle__info" data-id="${musicVideo.musicvideoid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn musicVideoTitle__enqueue" data-id="${musicVideo.musicvideoid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.musicVideoTitle a', (event) => {
                        Loader.loader();
                        Api.playByMusicVideoId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.musicVideoTitle__info', event => {
                        this.loadMusicVideoInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.musicVideoTitle__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByMusicVideoId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        });
    }

    loadVideoMusicByGenre() {
        Loader.loader();
        Api.getGenresByMusicVideo().then((result) => {
            Loader.remove();
            if (result.result && result.result.genres.length) {
                const genres = result.result.genres;
                genres.forEach(genre => {
                    const element = `
                        <div class="musicVideoGenre rowItem">
                            <a href="#" data-id="${genre.genreid}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${genre.label}</span>
                            </a>
                        </div>
                    `;
                    $(`.page4 .content`).append(element);

                    Utils.onClick('.musicVideoGenre a', (event) => {
                        $('.page4').hide();
                        $('#gui').find('.page').append(`
                            <div class="page5">
                                <h2>${$(event.currentTarget).find('.rowItem__span').text()}</h2>
                                <div class="content"></div>
                            </div>
                        `);

                        this.breadcrumb.addItem(Translation.get('gui.video.musicVideo.genres', 'Genres'), 4, 4);
                        this.loadGenreValueList($(event.currentTarget).data('id'));
                    });
                });
            }
        });
    }

    loadGenreValueList(id) {
        Loader.loader();
        Api.getMusicVideosByGenreId(id).then((result => {
            Loader.remove();
            if (result.result && result.result.musicvideos.length) {
                const musicVideos = result.result.musicvideos;
                musicVideos.forEach((item) => {
                    const element = `
                        <div class="musicVideoValue rowItem">
                            <a href="#" data-id="${item.musicvideoid}" class="rowItem__link">
                                <i class="fa-solid fa-file rowItem__icon"></i>
                                <span class="rowItem__span">${item.artist.join(', ')} ${item.title}</span>
                            </a>
                            <div class="rowItem__btn-group">
                                <button class="rowItem__btn-group__btn1 rowItem__btn-group__btn musicVideoValue__info" data-id="${item.musicvideoid}" title="${Translation.get('tooltip.info', 'Info')}">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                                <button class="rowItem__btn-group__btn2 rowItem__btn-group__btn musicVideoValue__enqueue" data-id="${item.musicvideoid}" title="${Translation.get('tooltip.enqueue', 'Enqueue')}">
                                    <i class="fa-solid fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $('.page5 .content').append(element);

                    Utils.onClick('.musicVideoValue a', (event) => {
                        Loader.loader();
                        Api.playByMusicVideoId($(event.currentTarget).data('id')).then((result) => {
                            Loader.remove();
                        });
                    });

                    Utils.onClick('.musicVideoValue__info', event => {
                        this.loadMusicVideoInformation($(event.currentTarget).data('id'));
                    });

                    Utils.onClick('.musicVideoValue__enqueue', event => {
                        Loader.loader();
                        Api.addPlaylistByMusicVideoId($(event.currentTarget).data('id')).then(result => {
                            Loader.remove();
                        });
                    });
                });
            }
        }))
    }

    loadFilesPage() {
        Loader.loader();
        Api.getSourcesVideo().then((result) => {
            Loader.remove();
            if (result.result && result.result.sources.length) {
                const sources = result.result.sources;
                sources.forEach(item => {
                    const element = `
                        <li class="fileElement rowItem">
                            <a href="#" data-file="${item.file}" class="rowItem__link">
                                <i class="fa-solid fa-folder-open rowItem__icon"></i>
                                <span class="rowItem__span">${item.label}</span>
                            </a>
                        </li>
                    `;
                    $('.page3 .content').append(element);

                    Utils.onClick('.fileElement a', (event) => {
                        const $element = $(event.currentTarget);
                        this.loadFilesVideo($element.data('file'), $element.find('.rowItem__span').text(), 3);
                    });
                });
            }
        });
    }

    loadFilesVideo(file, title, numPageActive) {

        $(`.page${numPageActive}`).hide();
        $('#gui').find('.page').append(`
            <div class="page${numPageActive + 1}">
                <h2>${title}</h2>
                <div class="content"></div>
            </div>
        `);

        this.breadcrumb.addItem($(`.page${numPageActive}`).find('h2').text(), numPageActive, numPageActive);

        Loader.loader();
        Api.getDirectoryByDirectoryAndMedia(file, "video").then((result) => {
            Loader.remove();
            if (result.result && result.result.files.length) {
                const files = result.result.files;
                files.forEach(item => {
                    const element = `
                        <div class="fileDirectory rowItem">
                            <a href="#" data-type="${item.filetype}" data-file="${item.file}" class="rowItem__link">
                                <i class="fa-solid ${item.filetype === 'directory' ? 'fa-folder-open' : 'fa-file'} rowItem__icon"></i>
                                <span class="rowItem__span">${item.label}</span>
                            </a>
                        </div>
                    `;
                    $(`.page${numPageActive + 1} .content`).append(element);

                    Utils.onClick(`.page${numPageActive + 1} .fileDirectory a`, (event) => {
                        const $element = $(event.currentTarget);
                        const filetype = $element.data('type');
                        const file = $element.data('file');
                        if (filetype === "directory") {
                            this.loadFilesVideo(file, $element.find('.rowItem__span').text(), numPageActive + 1);
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
            Api.scanLibraryVideo().then((result) => {
                Loader.remove();
            });
        });

        Utils.onClick('#clean', (event) => {
            Loader.loader();
            Api.cleanLibraryVideo().then((result) => {
                Loader.remove();
            });
        });

        Utils.onClick('#export', (event) => {
            Loader.loader();
            Api.exportLibraryVideo().then((result) => {
                Loader.remove();
            });
        });
    }
}