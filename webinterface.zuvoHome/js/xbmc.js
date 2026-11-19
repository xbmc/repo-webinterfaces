// @ts-nocheck

class Xbmc {

    static send(command) {
        return new Promise((resolve, reject) => {
            $.ajax({
                async: false,
                type: 'POST',
                contentType: 'application/json',
                url: '/jsonrpc?zuvoHome',
                data: command,
                dataType: 'json',
                cache: false,
                timeout: 10000,
                success: function (result, textStatus, XMLHttpRequest) {
                    if (XMLHttpRequest.readyState == 4 && XMLHttpRequest.status == 0) {
                        reject({ "error": { "ajaxFailed": true, "xhr": XMLHttpRequest, "status": textStatus } });
                    }
                    if (result.error) {
                        reject(result);
                    }
                    resolve(result);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    reject({ "error": { "ajaxFailed": true, "xhr": XMLHttpRequest, "status": textStatus } });
                }
            });
        });
    }

}