// @ts-nocheck

class Footer {

    kodiSocket;
    progressTimer;
    playerId = undefined;
    playerType = undefined;
    pause = false;
    rewindTimer = undefined;

    constructor() {

        $('.sliderPlayed').slider({
            range: 'min',
            min: 0,
            max: 100,
            value: 0,
            stop: (event, ui) => {
                if (this.playerId !== undefined) {
                    Api.getSeekByPlayerIdAndValue({ "percentage": ui.value }, this.playerId);
                }
            }
        });

        $('#volume-controls').slider({
            range: 'min',
            min: 0,
            max: 100,
            value: 0,
            stop: (event, ui) => {
                Api.setVolume(ui.value);
            },
            create: (event, ui) => {
                Loader.loader();
                Api.getVolumeAndMuted().then((result) => {
                    Loader.remove();
                    setTimeout(() => {
                        if (result.result.muted) {
                            $('#volume-controls').slider({ value: 0 });
                            $('#volume-controls').slider("disable");
                            $('.volume .volume-text .volume-icon').addClass('fa-volume-xmark');
                        } else {
                            $('#volume-controls').slider({ value: result.result.volume });
                            $('#volume-controls').slider("enable");
                            $('.volume .volume-text .volume-icon').addClass('fa-volume');
                        }
                    }, 0);
                });
            }
        });

        this.init();

        this.loadOnClickButtons();
    }

    init() {
        this.kodiSocket = new WebSocket(`ws://${location.hostname}:9090/jsonrpc`);

        this.kodiSocket.onopen = async () => {
            // Recupera il player attualmente attivo
            this.getActivePlayer();
        };

        this.kodiSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            // Risposta a una richiesta JSON-RPC
            if (message.id && pendingRequests.has(message.id)) {
                const resolve = pendingRequests.get(message.id);
                pendingRequests.delete(message.id);
                resolve(message.result);
                return;
            }

            // Notifiche inviate da Kodi
            if (message.method) {
                this.handleKodiNotification(message);
            }
        };

        this.kodiSocket.onclose = () => {
            this.stopProgressMonitoring();
            this.init();
        };

        this.kodiSocket.onerror = (error) => {
            console.error("Errore WebSocket Kodi:", error);
        };
    }

    loadOnClickButtons() {

        Utils.onClick('.volume .volume-text', (event) => {
            Loader.loader();
            const $element = $(event.currentTarget);
            const $volumeIcon = $element.find('.volume-icon');
            if ($volumeIcon.hasClass('fa-volume')) {
                $volumeIcon.removeClass('fa-volume').addClass('fa-volume-xmark');
                $('#volume-controls').slider({ value: 0 });
                $('#volume-controls').slider("disable");
                Api.setMute(true);
                Loader.remove();
            } else if ($volumeIcon.hasClass('fa-volume-xmark')) {
                $volumeIcon.removeClass('fa-volume-xmark').addClass('fa-volume');
                Api.getVolumeAndMuted().then(result => {
                    $('#volume-controls').slider({ value: result.result.volume });
                });
                $('#volume-controls').slider("enable");
                Api.setMute(false);
                Loader.remove();
            }
        });

        Utils.onClick('a.pause', (event) => {
            if (this.playerId !== undefined && !this.pause) {
                this.pause = true;
                Api.getPlayPauseByPlayerId(this.playerId);
            }
        });

        Utils.onClick('a.play', (event) => {
            if (this.playerId !== undefined && this.pause) {
                this.pause = false;
                Api.getPlayPauseByPlayerId(this.playerId);
            }
        });

        Utils.onMouseDownTouchStart('a.rewind', (event) => {
            if (this.playerId !== undefined) {
                clearInterval(this.rewindTimer);

                Api.getSeekByPlayerIdAndValue({ "seconds": -5 }, this.playerId);

                this.rewindTimer = setInterval(() => {
                    Api.getSeekByPlayerIdAndValue({ "seconds": -5 }, this.playerId);
                }, 1000);
            }
        });

        Utils.onMouseUpOnTouchCancel('a.rewind', (event) => {
            clearInterval(this.rewindTimer);
            this.rewindTimer = null;
        });

        Utils.onMouseDownTouchStart('a.fastforward', (event) => {
            if (this.playerId !== undefined) {
                clearInterval(this.forwardTimer);

                Api.getSeekByPlayerIdAndValue({ "seconds": 5 }, this.playerId);

                this.forwardTimer = setInterval(() => {
                    Api.getSeekByPlayerIdAndValue({ "seconds": 5 }, this.playerId);
                }, 1000);
            }
        });

        Utils.onMouseUpOnTouchCancel('a.fastforward', (event) => {
            clearInterval(this.forwardTimer);
            this.forwardTimer = null;
        });

        Utils.onClick('a.stop', (event) => {
            if (this.playerId !== undefined) {
                Api.getStopByPlayerId(this.playerId);
            }
        });

        Utils.onClick('a.next', (event) => {
            if (this.playerId !== undefined) {
                Api.getGoToNextByPlayerId(this.playerId);
            }
        });

        Utils.onClick('a.prev', (event) => {
            if (this.playerId !== undefined) {
                Api.getGoToPreviousByPlayerId(this.playerId);
            }
        });
    }

    getActivePlayer() {
        setTimeout(() => {
            Api.getActivePlayer().then((result) => {
                if (result.result.length > 0) {
                    this.playerId = result.result[0].playerid;
                    this.playerType = result.result[0].type;
                    this.startProgressMonitoring();
                } else {
                    this.playerType = undefined;
                    this.playerId = undefined;
                    this.stopProgressMonitoring();
                    this.updateProgress(undefined, undefined, undefined);
                }
            }).catch(error => console.log(error));
        }, 100);
    }

    startProgressMonitoring() {
        this.stopProgressMonitoring();

        this.getPlaybackProgress();

        this.progressTimer = setInterval(() => {
            this.getPlaybackProgress();
        }, 1000);
    }

    stopProgressMonitoring() {
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = undefined;
        }
    }

    getPlaybackProgress() {
        if (this.playerId === undefined) return;
        if (this.playerType === undefined) return;

        Api.getProperties(this.playerId).then((result) => {
            let command;
            if (this.playerType === 'audio') {
                command = {
                    "jsonrpc": "2.0",
                    "method": "Player.GetItem",
                    "params": {
                        "properties": [
                            "art",
                            "title",
                            "album",
                            "artist",
                            "duration",
                            "thumbnail",
                            "file",
                            "fanart",
                            "streamdetails"
                        ],
                        "playerid": 0
                    },
                    "id": "OnPlayGetItem"
                };
            } else if (this.playerType === 'video') {
                command = {
                    "jsonrpc": "2.0",
                    "method": "Player.GetItem",
                    "params": {
                        "properties": [
                            "art",
                            "title",
                            "album",
                            "artist",
                            "season",
                            "episode",
                            "duration",
                            "showtitle",
                            "tvshowid",
                            "thumbnail",
                            "file",
                            "fanart",
                            "streamdetails"
                        ],
                        "playerid": 1
                    },
                    "id": "OnPlayGetItem"
                };
            }
            let position = result.result.position;
            Xbmc.send(JSON.stringify(command)).then((response) => {
                Api.getPlaylistItemsByPlaylistId(this.playerId).then((res) => {
                    let nextItem;
                    if (res.result.limits.total > 1 && typeof res.result.items[position + 1] !== 'undefined') {
                        nextItem = res.result.items[position + 1];
                    } else {
                        nextItem = false;
                    }
                    this.updateProgress(result.result, response.result.item, nextItem);
                });
            });
        }).catch(error => console.log(error));
    }

    handleKodiNotification(message) {
        switch (message.method) {
            case "Player.OnPlay":
            case "Player.OnResume":
                this.getActivePlayer();
                break;
            case "Player.OnPause":
                this.getPlaybackProgress();
                break;
            case "Player.OnSeek":
                this.getPlaybackProgress();
                break;
            case "Player.OnStop":
                this.playerId = undefined;
                this.stopProgressMonitoring();
                this.updateProgress(undefined, undefined, undefined);
                break;
        }
    }

    updateProgress(data, item, nextItem) {
        if (!data) {
            $('.sliderPlayed').slider('value', 0);
            $('.timeRemain').text("00:00");
            $('.timeTotal').text("00:00");
            $('#now .label').text(``);
            $('#next .nextTitle').text(``);
            return;
        }
        const percentage = data.percentage || 0;
        $('.sliderPlayed').slider('value', percentage);
        $(".timeRemain").text(this.formatTime(data.time));
        $(".timeTotal").text(this.formatTime(data.totaltime));
        $('#now .label').text(`${item.showtitle ? item.showtitle : item.artist.join(' ')} - ${item.title}`);
        if (nextItem) {
            $('#next .nextTitle').text(`${nextItem.title}`);
        }
        else {
            $('#next .nextTitle').text(``);
        }
    }

    formatTime(time) {
        if (!time) return "00:00";

        const hours = time.hours || 0;
        const minutes = time.minutes || 0;
        const seconds = time.seconds || 0;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        const pad = n => String(n).padStart(2, "0");

        return h > 0
            ? `${pad(h)}:${pad(m)}:${pad(s)}`
            : `${pad(m)}:${pad(s)}`;
    }

}