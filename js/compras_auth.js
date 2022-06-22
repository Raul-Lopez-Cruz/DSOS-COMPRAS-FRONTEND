const compras_auth = (() => {

    /**
     * Guarda el token en una cookie que expira 30 minutos después de la hora de creación o al finalizar la sesión.
     * @param {string} jwt El token a guardar.
     * @see {@link https://developer.mozilla.org/es/docs/Web/API/Document/cookie}
     */
    function _saveJWT(jwt) {
        //save jwt in a cookie with samesite, secure and a lifetime of 30 mins
        document.cookie = `jwt=${jwt}; expires=${new Date(Date.now() + 30 * 60 * 1000).toUTCString()}; path=/; samesite=strict; secure`;
    }

    /**
     * Obtiene el token almacenado en la cookie.
     * @returns {string} El token almacenado en la cookie; en caso de no existir devuelve null.
     */
    function _getJWT() {
        let jwt = document.cookie.split(";").find(cookie => cookie.startsWith("jwt="));
        if (jwt) {
            return jwt.split("=")[1];
        } else {
            return null;
        }
    }

    /**
     * Hace una petición XHR al servidor de autenticación, enviando credenciales. Si son correctas, guarda el token recibido en una cookie.
     * @param {JSON} data Objeto JSON que contiene los datos de usuario y contraseña para ser enviados al servidor.
     * @see _saveJWT
     * @see {@link https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest}
     */
    function _getJWTFromServer(data) {
        $("#loadingmodal").modal("show");
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://autenticacion-p.herokuapp.com/login/auth/user", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jwt = JSON.parse(xhr.responseText).data;
                _saveJWT(jwt);
                setTimeout(function () {
                    console.log("Bienvenido.");
                    $("#AuthError").slideUp();
                    $("#ingresar").addClass("d-none");
                    $("#registrarse").addClass("d-none");
                    $("#logout").removeClass("d-none");
                    $("#loadingmodal").modal("hide");
                    $("#modalLogin").modal("hide");
                    $("#userid").removeClass("is-invalid");
                    $("#password").removeClass("is-invalid");
                }, 1000);
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                setTimeout(function () {
                    $("#loadingmodal").modal("hide");
                    $("#AuthError").slideDown();
                    $("#userid").addClass("is-invalid");
                    $("#password").addClass("is-invalid");
                    console.log("El usuario y/o contraseña son incorrectos.");
                }, 1000);
            }
        }
        xhr.send(JSON.stringify(data));
    }

    /**
     * Función que se ejecuta al cerrar sesión. Destruye la cookie que contiene el token de autenticación.
     */
    function _logout() {
        $("#loadingmodal").modal("show");
        var jwt = document.cookie.split(";").find(cookie => cookie.startsWith("jwt="));
        if (jwt) {
            setTimeout(function () {
                $("#loadingmodal").modal("hide");
                document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                $("#ingresar").removeClass("d-none");
                $("#registrarse").removeClass("d-none");
                $("#logout").addClass("d-none");
                console.log("Has cerrado sesión.");
            }, 500);
        }
    }

    return {
        getJWT: _getJWT,
        login: _getJWTFromServer,
        logout: _logout
    }
})();