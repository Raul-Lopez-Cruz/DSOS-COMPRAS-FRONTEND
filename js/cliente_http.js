const clientHttp = (() => {

    const _getAll = (url, fnExito, fnFallo) => {
        fetch(url).
            then((resp) => resp.json()).
            then(fnExito).catch(fnFallo);
    };

    const _get = (url, id, fnExito, fnFallo) => {
        fetch(url+id).
            then((resp) => resp.json()).
            then(fnExito).catch(fnFallo);
    };

    const _put = (url, id, data)=>{
        fetch(url+id, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).
        then((resp) => resp.json()).
        then(
            functions_compras.updateInfo
        ).catch(log_error);
    };

    const _post = (url, data, fnExito, fnFallo) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).
        then((resp) => resp.json()).
        then(fnExito).catch(fnFallo);
    };

    const _delete = (url, id) => {
        fetch(url+id, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).
        then((resp) => resp.json()).
        then(functions_compras.updateInfo).catch(log_error);
    };

    const log_error = (resp)=>{
        console.log("Algo salió mal: ",resp);
    };

    return {
        get: _get,
        getAll: _getAll,
        post:_post,
        delete:_delete,
        put:_put
    };
})();