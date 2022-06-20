const compras_auth = (() => {

    // Guarda el token en una cookie
    function _saveJWT(jwt) {
        var c = document.cookie;
        if (c == "") {
            document.cookie = "jwt=" + jwt;
        } else {
            document.cookie = "jwt=" + jwt;
        }
        var d = new Date();
        d.setTime(d.getTime() + (30 * 60 * 1000));        
        var expires = "expires=" + d.toUTCString();
        document.cookie = "jwt=" + jwt + ";" + expires + ";path=/;samesite=strict";
    }

    // Obtiene el token de la cookie
    function _getJWT() {
        let jwt = document.cookie.split(";").find(cookie => cookie.startsWith("jwt="));
        if (jwt) {
            return jwt.split("=")[1];
        } else {
            return null;
        }
    }

    //xmlHttpRequest para obtener el JWT y pasarlo a la función saveJWT
    function _getJWTFromServer(data) {
        $("#loadingmodal").modal("show");
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://autenticacion-t.herokuapp.com/login/auth/user", true);
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

    //logout function which deletes the JWT cookie
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
                location.reload();
            }, 500);
        }
    }

    return {
        getJWT: _getJWT,
        login: _getJWTFromServer,
        logout: _logout
    }
})();