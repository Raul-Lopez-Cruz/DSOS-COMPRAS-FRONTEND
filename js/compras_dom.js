const compras_dom = (() => {
    // --------------- DOM ELEMENTS --------------- 
    const $create_input_pcompra = document.getElementById("create_input_pcompra");
    const $create_input_pventa = document.getElementById("create_input_pventa");
    const $create_input_stock = document.getElementById("create_input_stock");
    const $create_input_talla = document.getElementById("create_input_talla");
    const $create_input_color = document.getElementById("create_input_color");
    const $edit_input_pventa = document.getElementById("edit_input_pventa");
    const $edit_input_stock = document.getElementById("edit_input_stock");
    const $create_input_marca = document.getElementById("create_input_marca");
    const $create_input_modelo = document.getElementById("create_input_modelo");
    const $createOK = document.getElementById("create_ok");
    const $createCancel = document.getElementById("create_cancel");
    const $searchBar = document.getElementById("searchBar");
    const $login = document.getElementById("login");
    const $logout = document.getElementById("logout");  
    const $tabCompras = document.getElementById("tabCompras");
    const $tabProductos = document.getElementById("tabProductos");
    const $btnConfirmCompra = document.getElementById("btnConfirmCompra");
    const $btnBorrarCarrito = document.getElementById("btnBorrarCarrito");
    const $btnComprar = document.getElementById("btnComprar");
    const $btnUpdate = document.getElementById("btnUpdate");
    // --------------- LISTENERS ---------------
    $createOK.addEventListener("click",compras_functions.crearProductoEnCarrito);
    $createCancel.addEventListener("click", compras_functions.reiniciaCampos);
    $create_input_pcompra.addEventListener("keyup", compras_functions.validateFloatNumber); 
    $create_input_pventa.addEventListener("keyup", compras_functions.validateFloatNumber);  
    $create_input_pcompra.addEventListener("keyup", compras_functions.validatePrice); 
    $create_input_pventa.addEventListener("keyup", compras_functions.validatePrice);  
    $create_input_stock.addEventListener("keyup", compras_functions.validateIntegerNumber);
    $edit_input_pventa.addEventListener("keyup", compras_functions.validateFloatNumber);  
    $edit_input_stock.addEventListener("keyup", compras_functions.validateIntegerNumber);
    $create_input_talla.addEventListener("change", compras_functions.validarTalla);
    $create_input_color.addEventListener("change", compras_functions.validarColor);
    $searchBar.addEventListener("keyup", compras_functions.filtrarTabla);
    $create_input_marca.addEventListener("change", compras_functions.validarMarca);
    $create_input_modelo.addEventListener("change", compras_functions.validarModelo);
    $login.addEventListener("click", compras_functions.iniciarSesion);
    $logout.addEventListener("click", compras_auth.logout);
    $tabCompras.addEventListener("click", compras_functions.showPanelCompras);
    $tabProductos.addEventListener("click", compras_functions.showPanelProductos);
    $btnComprar.addEventListener("click", compras_functions.showCarrito);
    $btnConfirmCompra.addEventListener("click", compras_functions.confirmarCompra);
    $btnBorrarCarrito.addEventListener("click", compras_functions.borrarCarrito);
    $btnUpdate.addEventListener("click", compras_functions.updateTables);
    // --------------- CALLS ---------------
    compras_functions.loadPage();
    compras_functions.reiniciaCampos();
})();