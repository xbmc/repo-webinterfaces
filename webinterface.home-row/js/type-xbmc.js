YUI().use("json","io","transition", "node", "substitute", "history", function(Y){
    var TypeXBMC = function(el){
        var root = el,
            searchBar = root.one(".search-bar"),
            form = root.one(".search-form"),
            input = root.one(".search-box"),
            results = root.one(".results"),
            template = root.one(".templates .item").cloneNode(true),
            infoBox = root.one(".info-box"),
            backBox = root.one(".back"),
            statusBar = root.one(".status-bar"),
            media = root.one(".media"),
            status = root.one(".status"),
            tools = root.one(".tools"),
            breadCrumbs = root.one(".bread-crumbs"),
            crumbTemplate = breadCrumbs.one(".home").removeClass("home"),
            historyManager = new Y.HistoryHash();
            
        var baseJSON = {
                jsonrpc: "2.0",
                method: "",
                params : [],
                "id": 1,
                sort: "ascending"
            },
        
            navTree = {
                name:"Home",
                list:[
                    {
                        name:"Movies",
                        title:"Movies",
                        commands:{
                            open:{
                                command:"VideoLibrary.GetMovies",
                                fields:["title","tumbnail","fanart","file"]
                            }
                        },
                        list:null,
                        subItems:{
                            name:"Movie",
                            list:null,
                            commands:{
                                play:{
                                    command:"XBMC.Play",
                                    params:["file"]
                                }
                            }
                        }
                    },
                    {
                        name:"Recent Movies",
                        title:"Recent Movies",
                        noSort:true,
                        commands:{
                            open:{
                                command:"VideoLibrary.GetRecentlyAddedMovies",
                                fields:["title","tumbnail","fanart","file"]
                            }
                        },
                        subItems:{
                            name:"Movie",
                            commands:{
                                play:{
                                    command:"XBMC.Play",
                                    params:["file"]
                                }
                            },
                            list:null
                        }
                    },
                    {
                        name:"Television",
                        title:"Television",
                        commands:{
                            open:{
                                command:"VideoLibrary.GetTVShows",
                                fields:["title","tumbnail","fanart","tvshowid"]
                            }
                        },
                        list:null,
                        subItems:{
                            name:"TV Show",
                            commands:{
                                open:{
                                    command:"VideoLibrary.GetSeasons",
                                    params:["tvshowid"],
                                    fields:["title","tumbnail","fanart","tvshowid","season"]
                                }
                            },
                            list:null,
                            subItems:{
                                name:"Season",
                                commands:{
                                    open:{
                                        command:"VideoLibrary.GetEpisodes",
                                        params:["tvshowid","season" ],
                                        fields:["title","tumbnail","fanart","file","episode"]
                                    }
                                },
                                inherit:["tvshowid"],
                                list:null,
                                subItems:{
                                    name:"Episode",
                                    specialName:"{episode}. {title}",
                                    commands:{
                                        play:{
                                            command:"XBMC.Play",
                                            params:["file"]
                                        }
                                    },
                                    list:null
                                }
                            }
                        }
                    },
                    {
                        name:"Recent Episodes",
                        title:"Recent Episodes",
                        noSort:true,
                        commands:{
                            open:{
                                command:"VideoLibrary.GetRecentlyAddedEpisodes",
                                fields:["title","tumbnail","fanart","file","showtitle","season","episode"]
                            }
                        },
                        subItems:{
                            name:"Episode",
                            specialName:"{showtitle} - s{season}e{episode} - {title}",
                            commands:{
                                play:{
                                    command:"XBMC.Play",
                                    params:["file"]
                                }
                            },
                            list:null
                        }
                    },
                    {
                        name:"Artists",
                        title:"Artists",
                        commands:{
                            open:{
                                command:"AudioLibrary.GetArtists",
                                fields:["title","tumbnail","fanart","artistid"]
                            }
                        },
                        list:null,
                        subItems:{
                            name:"Artist",
                            commands:{
                                open:{
                                    command:"AudioLibrary.GetAlbums",
                                    params:["artistid"],
                                    fields:["title","tumbnail","fanart","albumid"]
                                }
                            },
                            list:null,
                            subItems:{
                                name:"Album",   
                                list:null,
                                commands:{
                                    open:{
                                        command:"AudioLibrary.GetSongs",
                                        params:["albumid"],
                                        fields:["title","tumbnail","fanart","file","albumid"]
                                    }
                                },
                                inherit:["artistid"],
                                subItems:{
                                    name:"song",
                                    list:null,
                                    inherit:["albumid"],
                                    commands:{
                                        queueAndPlay:{
                                            command:"AudioPlaylist.Play",
                                            params:["songid"]
                                        },
                                        queue:{
                                            command:"AudioPlaylist.Add",
                                            params:["file"]
                                        },
                                        clearQueue:{
                                            command:"AudioPlaylist.Clear"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        name:"Albums",
                        title:"Albums",
                        commands:{
                            open:{
                                command:"AudioLibrary.GetAlbums",
                                fields:["title","tumbnail","fanart","albumid"]
                            }
                        },
                        list:null,
                        subItems:{
                            name:"Album",   
                            list:null,
                            commands:{
                                open:{
                                    command:"AudioLibrary.GetSongs",
                                    params:["albumid"],
                                    fields:["title","tumbnail","fanart","file","albumid"]
                                }
                            },
                            subItems:{
                                name:"song",
                                list:null,
                                inherit:["albumid"],
                                commands:{
                                    queueAndPlay:{
                                        command:"AudioPlaylist.Play",
                                        params:["songid"]
                                    },
                                    queue:{
                                        command:"AudioPlaylist.Add",
                                        params:["file"]
                                    },
                                    clearQueue:{
                                        command:"AudioPlaylist.Clear"
                                    }
                                }
                            }
                        }
                    },
                    {
                        name:"Video Fliles",
                        title:"Video Files",
                        commands:{
                            open:{
                                command:"Files.GetSources",
                                params:[
                                    {name:"media",fn:function(){return "video";}}
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
                                    command:"XBMC.Play",
                                    params:["file"]
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
                                    {name:"media",fn:function(){return "music";}}
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
                                    command:"XBMC.Play",
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
            },
            
            types = {
                movies:"Movies",
                tv:"Television",
                music:"Music",
                pictures:"Pictures"
            },
            
            defaultValue = input.get("value"),
            
            nodes = [],
            currentNode,
            selectableSubNodes = [].
            selectedSubNode;
            
            
        
        var init = function(){
            resize();
            Y.on("resize",resize);
            
            backBox.on("click",function(){
                history.back();
            });
            
            infoBox.on("click",function(){
                input.focus();
            });
            
            input.on("blur",blur);
            input.on("focus",focus);
            input.on("keyup", keyHandler);
            input.on("keydown", keyDown);
            input.focus();
            
            tools.on("click", clickTool);
            
            form.on("submit",submit);

            historyManager.on("history:change", function(e){
                if(e.changed.nodeIndex){
                    var idx = e.changed.nodeIndex.newVal;
                    if(e.src != Y.HistoryBase.SRC_ADD){
                        if(nodes[idx]){
                            back(nodes[idx], true);
                        }else if(idx != 0){
                            back(nodes[nodes.length -1]);
                        }
                    }
                }
            })
            
            open(navTree);
            
            checkMedia();
        };
        
        var clickTool = function(e){
            var buttonClass = e.target.get("className").split(" ")[0];
            var buttonMapping = {
                "previous":{postfix:".SkipPrevious",msg:"Skip Previous"},
                "skip-back":{postfix:".BigSkipBackward",msg:"Skip Back Big"},
                "skip-back-short":{postfix:".SmallSkipBackward",msg:"Skip Back Small"},
                "play-pause":{postfix:".PlayPause",msg:"Play Pause"},
                "stop":{postfix:".Stop",msg:"Stop"},
                "skip-forward-short":{postfix:".SmallSkipForward",msg:"Skip Forward Small"},
                "skip-forward":{postfix:".BigSkipForward",msg:"Skip Forward Big"},
                "next":{postfix:".SkipNext",msg:"Skip Next"}
            };
            getSimpleRPC("Player.GetActivePlayers",{},function(rslt){
                var prefix = "VideoPlayer";
                prefix = rslt.audio ? "AudioPlayer" : prefix;
                bark(buttonMapping[buttonClass].msg);
                getSimpleRPC(prefix+buttonMapping[buttonClass].postfix,{},function(){
                    bark(buttonMapping[buttonClass].msg+" Complete");
                });
            });
        };
        
        var checkMedia = function(){
            getSimpleRPC("Player.GetActivePlayers",{},function(results){
                if(!results.audio && !results.video){
                    statusBar.hide(1);
                }else{
                    statusBar.show(1);
                    getSimpleRPC("System.GetInfoLabels",{
                        params:[
                            "Player.Time",
                            "Player.Duration",
                            "Player.FinishTime",
                            "VideoPlayer.Title",
                            "VideoPlayer.TVShowTitle",
                            "MusicPlayer.Title",
                            "ListItem.Icon",
                            "VideoPlayer.Cover",
                            "MusicPlayer.Cover",
                            "ListItem.Thumb"
                        ]
                    },function(rslt){
                        var imgURL = rslt["ListItem.Icon"] ||
                                     rslt["ListItem.Thumb"] ||
                                     rslt["MusicPlayer.Cover"] ||
                                     rslt["VideoPlayer.Cover"] ||
                                     null,
                            icon = media.one("p.icon");
                                 
                        if(imgURL){
                            icon.show(1);
                            icon.one("img").set("src",imgURL);
                        }else{
                            icon.hide(1);
                        }
                        
                        media.one(".label").set("text",
                            rslt["VideoPlayer.Title"] ? rslt["VideoPlayer.Title"] : rslt["MusicPlayer.Title"]
                        );
                    
                        media.one(".progress").set("text", rslt["Player.Time"]);
                        media.one(".duration").set("text", rslt["Player.Duration"]);
                        media.one(".finish-time").set("text", rslt["Player.FinishTime"]);
                    });
                }
            });
            setTimeout(checkMedia, 3000);
        };
        
        var getSimpleRPC = function(method, obj, cb){
            cb = cb || function(){};
            var jsonObj = Y.clone(baseJSON);
            Y.aggregate(jsonObj, obj, true);
            jsonObj.method = method;
            Y.io("/jsonrpc",{
                method:"POST",
                data:Y.JSON.stringify(jsonObj),
                on:{success:function(id,res){
                    cb(Y.JSON.parse(res.responseText).result);
                }}
            });
        };
        
        var filter = function(value){
            selectableSubNodes = [];
            
            if(value !== "" || value != defaultValue){
                infoBox.addClass("hide");
                Y.Array.each(currentNode.list, function(subItem){
                    var title = subItem.title || subItem.label || "";
                    if(title.toLowerCase().match(value.toLowerCase())){
                        selectableSubNodes.push(subItem);
                        subItem.listEl.removeClass("hide");
                    }else{
                        subItem.listEl.addClass("hide");
                    }
                });
            }else{
                infoBox.removeClass("hide");
                Y.Array.each(currentNode.list, function(subItem){
                    selectableSubNodes.push(subItem);
                    subItem.listEl.removeClass("hide");
                });
            }
            select(0);
        };
        
        var blur = function(){
            var value = input.get("value");
            if(value === "" || value == defaultValue){
                input.set("value",defaultValue);
            }
        };
        
        var focus = function(){
            var value = input.get("value");
            if(value === "" || value == defaultValue){
                input.set("value","");
            }
        };
        
        var submit = function(e){
            e.preventDefault();
            if(selectedSubNode.commands.getDirectory){
                if(selectedSubNode.file.match(/[^\/]+$/)){
                    play(selectedSubNode);
                }else{
                    selectedSubNode.commands.open = selectedSubNode.commands.getDirectory;
                    open(selectedSubNode);
                }
            }else
            if(selectedSubNode.commands.open){
                open(selectedSubNode);
            }else
            if(selectedSubNode.commands.play){
                play(selectedSubNode);
            }else
            if(selectedSubNode.commands.queueAndPlay){
                queueAndPlay(currentNode.list, selectedSubNode);
            }
        };
        
        var keyDown = function(e){
            if(input.get("value") === "" && e.keyCode == 8 && nodes.length > 1){
                history.back();
            }
            if(e.keyCode == 38 || e.keyCode == 40){
                e.preventDefault();
                select(
                    Y.Array.indexOf(selectableSubNodes, selectedSubNode) +
                    (e.keyCode == 40 ? 1 : -1)
                );
            }
        };
        
        var keyHandler = function(e){
            if((e.keyCode > 45 && e.keyCode < 106) || e.keyCode == 8){
                filter(input.get("value"));
            }else{
                e.preventDefault();
            }
        };
        
        var select = function(num){
            num = num < selectableSubNodes.length ? num : 0;
            num = num < 0 ? selectableSubNodes.length -1 : num;
            Y.Array.each(nodes[nodes.length-1].list,function(item){
                item.listEl.removeClass("selected");
            });
            selectedSubNode = selectableSubNodes[num];
            selectedSubNode.listEl.addClass("selected");
            window.scroll(0,selectedSubNode.listEl.getY()-searchBar.get("region").height);
            
        };
        
        var back = function(item, noUpdate){
            nodes.splice(Y.Array.indexOf(nodes,item),nodes.length);
            open(item, noUpdate);
        };
        
        var open = function(item, noUpdate){
            bark("Opening: "+(item.title || item.label || item.name));
            nodes.push(item);
            currentNode = item;

            breadCrumbs.empty();
            var hash = ""
            Y.Array.each(nodes, function(node){
                var crumbEl = crumbTemplate.cloneNode(true)
                    .set("text", node.label || node.name || "none");
                crumbEl.on("click", function(){
                   back(node);
                });
                breadCrumbs.append(crumbEl);
                hash += crumbEl.get("text")+"-";
            });
            if(!noUpdate){
                historyManager.add({
                    url:hash
                        .replace(" ","_")
                        .replace(/-$/,""),
                    nodeIndex:nodes.length-1
                });
            }

            if(item.list){
                bark("Opened: "+(item.title || item.label || item.name));
                renderItems(item.list);
            }else{
                var cmd = item.commands.open,
                    params = gatherParams(item, cmd);
                
                getData(cmd.command, params, cmd.fields, function(list){
                    bark("Opened: "+(item.title || item.label || item.name));
                    item.list = [];
                    Y.Array.each(list, function(subItem,n){
                        item.list.push(
                            Y.aggregate(subItem, item.subItems)
                        );
                        if(subItem.inherit){
                            Y.Array.each(subItem.inherit, function(param){
                                if(Y.Lang.isString){
                                    subItem[param] = item[param];
                                }else{
                                    subItem[param.name] = param.fn(item);
                                }
                            });
                        }
                        if(subItem.specialName){
                            subItem.title = Y.substitute(subItem.specialName,subItem);
                        }
                    });
                    if(!item.noSort){
                        item.list.sort(function(a,b){
                            var ta = a.title || a.label,
                                tb = b.title || b.label;
                            if(parseInt(ta, 10) && parseInt(tb, 10)){
                                ta = parseInt(ta, 10);
                                tb = parseInt(tb, 10);
                            }
                            if(tb === ta){
                                return 0;
                            }
                            return  ta > tb ? 1 : -1;
                        });
                    }
                    renderItems(item.list);
                });
            }
        };
        
        var play = function(item){
            bark("Playing: "+(item.title || item.label || item.name));
            var jsonObj = prepCommand(item.commands.play.command,gatherParams(item, item.commands.play));

            Y.io("/jsonrpc",{
                data:Y.JSON.stringify(jsonObj),
                method:"POST"
            });
            
            input.set("value","");
            input.focus();
            filter("");
        };

        var queueAndPlay = function(nodesToQueue, nodeToPlay){
            var i=0,
                playIdx =0,
                jsonObj;

            var queueNext = function(){
                var item = nodesToQueue[i];
                if(item){
                    playIdx = item == nodeToPlay ? i : playIdx;
                    item[item.commands.queueAndPlay.params[0]] = i;
                    queueFile(item, queueNext);
                    i++;
                }else{
                    bark("Playing "+getTitle(nodeToPlay));

                    jsonObj = prepCommand(
                        nodeToPlay.commands.queueAndPlay.command,
                        gatherParams(nodeToPlay,nodeToPlay.commands.queueAndPlay)
                    );

                    jsonObj.params = nodeToPlay[nodeToPlay.commands.queueAndPlay.params[0]]

                    Y.io("/jsonrpc",{
                        data:Y.JSON.stringify(jsonObj),
                        method:"POST"
                    });
                }
            };

            if(nodeToPlay.commands.clearQueue){
                bark("Clearing Queue")
                jsonObj = prepCommand(nodeToPlay.commands.clearQueue.command);

                Y.io("/jsonrpc",{
                    data:Y.JSON.stringify(jsonObj),
                    method:"POST",
                    on:{success:function(){
                        queueNext();
                    }
                }});
            }else{
                queueNext();
            }
        };

        var queueFile = function(item, cb){
            bark("Queueing Item");
            cb = cb || function(){};
            var jsonObj = prepCommand(item.commands.queue.command,gatherParams(item, item.commands.queue));

            Y.io("/jsonrpc",{
                data:Y.JSON.stringify(jsonObj),
                method:"POST",
                on:{success:function(){
                    cb();
                }
            }});
        }
        
        var info = function(){
            
        };
        
        var gatherParams = function(item, cmd){
            var params = {};
            if(cmd.params){
                Y.Array.each(cmd.params, function(param){
                    if(Y.Lang.isString(param)){
                        if(item[param] !== null){
                            params[param] = item[param];
                        }else{
                            Y.log("Param not found on item: "+param);
                        }
                    }else{
                        params[param.name] = param.fn(item);
                    }
                });
            }
            return params;
        };
        
        var prepCommand = function(command, params, fields){
            var jsonObj = Y.clone(baseJSON);
            
            jsonObj.method = command;
            jsonObj.params = params || {};
            
            if(fields){
                jsonObj.params.fields = fields;
            }
            
            return jsonObj;
        };

        var getTitle = function(item){
            return item.title || item.label || item.name;
        }
        
        var getData = function(command, params, fields, cb){
            cb = cb || function(){};
            
            var jsonObj = prepCommand(command,params,fields);
            
            Y.io("/jsonrpc",{
                data:Y.JSON.stringify(jsonObj),
                method:"POST",
                on:{complete:function(id, response){
                    var json = Y.JSON.parse(response.responseText),
                        newList;
                    Y.each(json.result,function(obj){
                        if(Y.Lang.isArray(obj)){
                            newList = obj;
                        }
                    });
                    Y.Array.each(newList,function(newItem){
                        Y.each(newItem,function(value,param){
                            if(value.match && value.match("special://")){
                                newItem[param] = "/vfs/"+value;
                            }
                        });
                    });
                    cb(newList);
                }}
            });
        };
        
        var renderItems = function(list){
            results.empty();
            Y.Array.each(list, function(item){
                results.append(renderItem(item));
            });
            input.set("value","");
            input.focus();
            filter("");
        };
        
        var renderItem = function(item){
            var li = template.cloneNode(true),
                thumb = li.one(".thumb"),
                img = li.one(".thumb img"),
                title = li.one(".title");
            if(item.thumbnail){
                img.set("src",item.thumbnail);
            }else{
                thumb.addClass("no-image");
                thumb.set("text","No image");
            }
            title.set("text",item.title || item.label || "Unknown");
            li.on("click",function(e){
                selectedSubNode = item;
                submit(e);
            });
            item.listEl = li;
            return li;
        };
        
        var barkTimeout;
        
        var bark = function(msg){
            status.show(1);
            clearTimeout(barkTimeout);
            status.one(".button").set("text",msg);
            barkTimeout = setTimeout(function(){
                status.hide(1);
            }, 2500);
        };
        
        var resize = function(){
        };
        
        init();
    };
    
    Y.on("domready",function(){
        typeXBMC = new TypeXBMC(Y.one(".type-xbmc"));
    });
});