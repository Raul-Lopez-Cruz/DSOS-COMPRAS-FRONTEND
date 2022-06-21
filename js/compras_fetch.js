const compras_fetch = (() => {

    /**
     * Función que envía una petición XHR a la dirección indicada, con el método GET. Al recibir la respuesta, se ejecuta la función callback indicada.
     * @param {String} url Dirección a la que se envía la petición.
     * @param {Function} fnExito Función que se ejecuta cuando se recibe una respuesta positiva.
     * @param {Function} fnFallo Función que se ejecuta cuando se recibe una respuesta de error.
     */
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

    /**
     * Función que envía una petición Fetch a la dirección indicada, con el método GET. Al recibir la respuesta, se ejecuta la función callback indicada.
     * @param {String} url Dirección a la que se envía la petición.
     * @param {Function} fnExito Función que se ejecuta cuando se recibe una respuesta positiva.
     * @param {Function} fnFallo Función que se ejecuta cuando se recibe una respuesta de error.
     */
    const get = (url, fnExito, fnFallo) => {
        fetch(url).
            then((resp) => resp.json()).
            then(fnExito).catch(fnFallo);
    };

    /**
     * Función que envía una petición Fetch a la dirección indicada, con el método PUT. Al recibir la respuesta, se ejecuta la función callback indicada.
     * Agrega al header de la petición el token de autenticación.
     * @param {String} url Dirección a la que se envía la petición.
     * @param {JSON} data Objeto JSON que contiene los datos a enviar en el cuerpo de la petición.
     * @param {Function} fnExito Función que se ejecuta cuando se recibe una respuesta positiva.
     * @param {Function} fnFallo Función que se ejecuta cuando se recibe una respuesta de error.
     */
    const _put = (url, data, fnExito, fnFallo) => {
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': compras_auth.getJWT()
            }
        }).
            then((resp) => resp.json()).
            then(fnExito).catch(fnFallo);
    };

    /**
     * Función que envía una petición Fetch a la dirección indicada, con el método POST. Al recibir la respuesta, se ejecuta la función callback indicada.
     * Agrega al header de la petición el token de autenticación.
     * @param {String} url Dirección a la que se envía la petición.
     * @param {JSON} data Objeto JSON que contiene los datos a enviar en el cuerpo de la petición.
     * @param {Function} fnExito Función que se ejecuta cuando se recibe una respuesta positiva.
     * @param {Function} fnFallo Función que se ejecuta cuando se recibe una respuesta de error.
     */
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

    /**
     * Función que envía una petición Fetch a la dirección indicada, con el método DELETE. Al recibir la respuesta, se ejecuta la función callback indicada.
     * Agrega al header de la petición el token de autenticación.
     * @param {String} url Dirección a la que se envía la petición.
     */
    const _delete = (url) => {
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': compras_auth.getJWT()
            }
        }).
            then((resp) => resp.json()).
            then(console.log);
    };

    return {
        get: _get,
        post: _post,
        delete: _delete,
        put: _put
    };
})();