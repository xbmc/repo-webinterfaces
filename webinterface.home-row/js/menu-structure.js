YUI.add("HomeRowMenus", function(Y){
    var Movie = {
        name:"Movie",
        list:null,
        commands:{
            play:{
                command:"Player.Open",
                params:[
                    {
                        name:"item",
                        fn:function(item){
                            return { movieid: item.movieid };
                        }
                    }
                ]
            },
            queue:true,
            batchCommand:{
                hideMenu:true,
                command:"Playlist.Add",
                params:[
                    {
                        name:"playlistid",
                        value:1
                    },
                    {
                        name:"item",
                        fn:function(item){
                            return {movieid: item.movieid};
                        }
                    }
                ]
            }
        }
    };

    var Episode = {
        name:"Episode",
        specialName:"{showtitle} {label}",
        commands:{
            play:{
                command:"Player.Open",
                params:[
                    {
                        name:"item",
                        fn:function(item){
                            return { episodeid: item.episodeid };
                        }
                    }
                ]
            },
            queue:true,
            batchCommand:{
                hideMenu:true,
                command:"Playlist.Add",
                params:[
                    {
                        name:"playlistid",
                        value:1
                    },
                    {
                        name:"item",
                        fn:function(item){
                            return {episodeid: item.episodeid};
                        }
                    }
                ]
            }
        },
        list:null
    };

    var Album = {
        name:"Album",
        noSort:true,
        list:null,
        commands:{
            open:{
                command:"AudioLibrary.GetSongs",
                params:[
                    {
                        name:"filter",
                        fn:function(item){
                            return {albumid: item.albumid};
                        }
                    },
                    {
                        name:"sort",
                        value:{
                            order:"ascending",
                            method:"track"
                        }
                    }
                ]
            }
        },
        subItems:{
            name:"song",
            list:null,
            inherit:["albumid"],
            commands:{
                queueAndPlay:{title:"Queue And Play"},
                queue:true,
                batchGatherCommand:{
                    hideMenu:true,
                    command:"AudioLibrary.GetSongs",
                    params:[
                        {
                            name:"filter",
                            fn:function(item){
                                return {albumid: item.albumid};
                            }
                        },
                        {
                            name:"sort",
                            value:{
                                order:"ascending",
                                method:"track"
                            }
                        }
                    ],
                    results:function(res){
                        return res.result.songs;
                    }
                },
                batchCommand:{
                    hideMenu:true,
                    command:"Playlist.Add",
                    params:[
                        {
                            name:"playlistid",
                            value:1
                        },
                        {
                            name:"item",
                            fn:function(item){
                                return {songid: item.songid};
                            }
                        }
                    ]
                },
                batchCompleteCommand:{
                    hideMenu:true,
                    command:"Player.Open",
                    params:[
                        {
                            name:"item",
                            fn:function(item){
                                return {playlistid:1, position: item.idx};
                            }
                        }
                    ]
                }
            }
        }
    };

    Y.homeRowMenus = {
        name:"Home",
        loaded: true,
        list:[
            {
                name:"Playlist",
                title:"Playlist",
                noSort:true,
                alwaysRefreshList:true,
                commands:{
                    open:{
                        command:"Playlist.GetItems",
                        properties:["thumbnail"],
                        params:[{
                            name:"playlistid",
                            value:1
                        },{
                            name:"sort",
                            value:{
                                order:"ascending",
                                method:"playlist"
                            }
                        }]
                    }
                },
                list:null,
                subItems:{
                    name:"Playlist Object",
                    list:null,
                    commands:{
                        play:{
                            command:"Player.Open",
                            params:[
                                {
                                    name:"item",
                                    fn:function(item){
                                        return { position: item.idx, playlistid:1 };
                                    }
                                }
                            ]
                        },
                        remove:{
                            command:"Playlist.remove",
                            params:[
                                {
                                    name:"playlistid",
                                    value:1
                                },
                                {
                                    name:"position",
                                    fn:function(item){
                                        return item.idx;
                                    }
                                }
                            ]
                        },
                        clear:{
                            command:"Playlist.clear",
                            params:[
                                {
                                    name:"playlistid",
                                    value:1
                                }
                            ]
                        }
                    }
                }
            },
            {
                name:"Movies",
                title:"Movies",
                commands:{
                    open:{
                        command:"VideoLibrary.GetMovies",
                        properties:["thumbnail"]
                    }
                },
                list:null,
                subItems:Y.clone(Movie)
            },
            {
                name:"Recent Movies",
                title:"Recent Movies",
                noSort:true,
                alwaysRefreshList:true,
                commands:{
                    open:{
                        command:"VideoLibrary.GetRecentlyAddedMovies",
                        properties:["thumbnail"]
                    }
                },
                subItems:Y.clone(Movie)
            },
            {
                name:"Television",
                title:"Television",
                commands:{
                    open:{
                        command:"VideoLibrary.GetTVShows",
                        properties:["title","file","thumbnail","fanart"]
                    }
                },
                list:null,
                subItems:{
                    name:"TV Show",
                    commands:{
                        open:{
                            command:"VideoLibrary.GetSeasons",
                            params:["tvshowid"],
                            properties:["thumbnail","season", "fanart"]
                        },
                        queueAndPlay:{title:"Queue And Play"},
                        queue:true,
                        batchGatherCommand:{
                            hideMenu:true,
                            command:"VideoLibrary.GetEpisodes",
                            params:[
                                "tvshowid",
                                {
                                    name:"sort",
                                    value:{
                                        order:"ascending",
                                        method:"episode"
                                    }
                                }
                            ],
                            properties:["episode","season"],
                            results:function(res){
                                return res.result.episodes;
                            }
                        },
                        batchCommand:{
                            hideMenu:true,
                            command:"Playlist.Add",
                            params:[
                                {
                                    name:"playlistid",
                                    value:1
                                },
                                {
                                    name:"item",
                                    fn:function(item){
                                        return {episodeid: item.episodeid};
                                    }
                                }
                            ]
                        }
                    },
                    list:[{
                        title:"All Seasons",
                        alwaysRefreshList:true
                    }],
                    subItems:{
                        name:"Season",
                        commands:{
                            open:{
                                command:"VideoLibrary.GetEpisodes",
                                params:["tvshowid","season" ],
                                properties:["showtitle","season","episode","thumbnail", "plot", "streamdetails", "resume"]
                            },
                            queueAndPlay:{title:"Queue And Play"},
                            queue:true,
                            batchGatherCommand:{
                                hideMenu:true,
                                command:"VideoLibrary.GetEpisodes",
                                params:[ "tvshowid", "season",
                                    {
                                        name:"sort",
                                        value:{
                                            order:"ascending",
                                            method:"episode"
                                        }
                                    } ],
                                results:function(res){
                                    return res.result.episodes;
                                }
                            },
                            batchCommand:{
                                hideMenu:true,
                                command:"Playlist.Add",
                                params:[
                                    {
                                        name:"playlistid",
                                        value:1
                                    },
                                    {
                                        name:"item",
                                        fn:function(item){
                                            return {episodeid: item.episodeid};
                                        }
                                    }
                                ]
                            }
                        },
                        inherit:["tvshowid"],
                        list:null,
                        subItems:Y.clone(Episode)
                    }
                }
            },
            {
                name:"Recent Episodes",
                title:"Recent Episodes",
                noSort:true,
                alwaysRefreshList:true,
                commands:{
                    open:{
                        command:"VideoLibrary.GetRecentlyAddedEpisodes",
                        properties:["showtitle","season","episode","thumbnail", "plot", "streamdetails", "resume"]
                    }
                },
                subItems:Y.clone(Episode)
            },
            {
                name:"Artists",
                title:"Artists",
                commands:{
                    open:{
                        command:"AudioLibrary.GetArtists",
                        properties:["thumbnail","fanart"]
                    }
                },
                list:null,
                subItems:{
                    name:"Artist",
                    commands:{
                        open:{
                            command:"AudioLibrary.GetAlbums",
                            params:[
                                {
                                    name:"filter",
                                    fn:function(item){
                                        return {artistid: item.artistid};
                                    }
                                }
                            ],
                            properties:["thumbnail","fanart"]
                        }
                    },
                    list:null,
                    subItems:Y.clone(Album)
                }
            },
            {
                name:"Albums",
                title:"Albums",
                commands:{
                    open:{
                        command:"AudioLibrary.GetAlbums",
                        properties:["thumbnail","fanart"]
                    }
                },
                list:null,
                subItems:Y.clone(Album)
            },
            {
                name:"Video Fliles",
                title:"Video Files",
                commands:{
                    open:{
                        command:"Files.GetSources",
                        params:[
                            {name:"media",value:"video"}
                        ]
                    }
                },
                list:null,
                subItems:{
                    name:"Files",
                    list:null,
                    commands:{
                        getDirectory:{
                            command:"Files.GetDirectory",
                            params:[
                                {name:"directory",fn:function(item){return item.file;}}
                            ]
                        },
                        play:{
                            command:"Player.open",
                            params:[{
                                name:"item",
                                fn:function(item){
                                    return {file:item.file};
                                }
                            }]
                        }
                    },
                    subItems:{
                        name:"File",
                        inherit:["commands","subItems"],
                        list:null
                    }
                }
            },
            {
                name:"Music Fliles",
                title:"Music Files",
                commands:{
                    open:{
                        command:"Files.GetSources",
                        params:[
                            {name:"media",value:"music"}
                        ]
                    }
                },
                list:null,
                subItems:{
                    name:"Files",
                    list:null,
                    commands:{
                        getDirectory:{
                            command:"Files.GetDirectory",
                            params:[
                                {name:"directory",fn:function(item){return item.file;}}
                            ]
                        },
                        play:{
                            command:"Player.open",
                            params:["file"]
                        }
                    },
                    subItems:{
                        name:"File",
                        inherit:["commands","subItems"],
                        list:null
                    }
                }
            }
        ]
    };

},"0.0.1",{
    requires:["oop"]
});