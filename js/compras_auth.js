const compras_auth = (() => {

//Function to save a JWT in cookies
function _saveJWT(jwt) {
    var c = document.cookie;
    if (c == "") {
        document.cookie = "jwt=" + jwt;
    } else {
        document.cookie = "jwt=" + jwt;
    }
    var d = new Date();
    d.setTime(d.getTime() + (1 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "jwt=" + jwt + ";" + expires + ";path=/;samesite=strict";
}

//Function to get the JWT from cookie named "jwt" if it exists, else return null
function _getJWT() {
    let jwt = document.cookie.split(";").find(cookie => cookie.startsWith("jwt="));
    if (jwt) {
        return jwt.split("=")[1];
    } else {
        return null;
    }
}

//xmlHttpRequest to get the JWT from the server with POST method
function _getJWTFromServer(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://autenticacion-t.herokuapp.com/login/auth/user", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var jwt = JSON.parse(xhr.responseText).data;
            _saveJWT(jwt);
            console.log("Bienvenido.");
            $("#ingresar").addClass("d-none");
            $("#registrarse").addClass("d-none");
            $("#logout").removeClass("d-none");
            $("#modalLogin").modal("hide");
            //userid and password remove class is-invalid and add class is-valid
            $("#userid").removeClass("is-invalid");
            $("#password").removeClass("is-invalid");
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            console.log("El usuario y/o contraseña son incorrectos.");
            //userid and password add class is-invalid to show red border
            $("#userid").addClass("is-invalid");
            $("#password").addClass("is-invalid");

        }
    }
    xhr.send(JSON.stringify(data));
}

//logout function which deletes the JWT cookie
function _logout() {
    var jwt = document.cookie.split(";").find(cookie => cookie.startsWith("jwt="));
    if (jwt) {
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        $("#ingresar").removeClass("d-none");
        $("#registrarse").removeClass("d-none");
        $("#logout").addClass("d-none");
        console.log("Has cerrado sesión.");
    }
}

return {
    getJWT: _getJWT,
    login: _getJWTFromServer,
    logout: _logout
}
})();