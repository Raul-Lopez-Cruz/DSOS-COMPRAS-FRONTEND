const compras_fetch = (() => {
    
    const _get = (url, fnExito, fnFallo) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                fnExito(JSON.parse(xhr.responseText));
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                fnFallo(xhr);
            }
        }
        xhr.send();
    }

    const get = (url, fnExito, fnFallo) => {
        fetch(url).
            then((resp) => resp.json()).
            then(fnExito).catch(fnFallo);
    };

    const _put = (url, data) => {
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': compras_auth.getJWT()
            }
        }).
            then((resp) => resp.json()).
            then(compras_functions.putExito).catch(compras_functions.logError);
    };

    const _post = (url, data, fnExito, fnFallo) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': compras_auth.getJWT()
            }
        }).
            then((resp) => resp.json()).
            then(fnExito).catch(fnFallo);
    };

    const _delete = (url) => {
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': compras_auth.getJWT()
            }
        }).
            then((resp) => resp.json()).
            then(console.log).catch(compras_functions.logError);
    };

    return {
        get: _get,
        post: _post,
        delete: _delete,
        put: _put
    };
})();