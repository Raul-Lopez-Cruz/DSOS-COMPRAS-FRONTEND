const compras_dom = (() => {
    // --------------- DOM ELEMENTS --------------- 
    const $btnConfirmCompra = document.getElementById("btnConfirmCompra");
    const $btnBorrarCarrito = document.getElementById("btnBorrarCarrito");
    const $btnComprar = document.getElementById("btnComprar");
    const $btnCancel = document.getElementById("create_cancel");
    const $btnLogout = document.getElementById("logout");  
    const $btnUpdate = document.getElementById("btnUpdate");
    const $btnCreate = document.getElementById("create_ok");
    const $btnLogin = document.getElementById("login");
    const $create_input_pcompra = document.getElementById("create_input_pcompra");
    const $create_input_pventa = document.getElementById("create_input_pventa");
    const $create_input_modelo = document.getElementById("create_input_modelo");
    const $create_input_stock = document.getElementById("create_input_stock");
    const $create_input_talla = document.getElementById("create_input_talla");
    const $create_input_color = document.getElementById("create_input_color");
    const $create_input_marca = document.getElementById("create_input_marca");
    const $edit_input_pventa = document.getElementById("edit_input_pventa");
    const $edit_input_stock = document.getElementById("edit_input_stock");
    const $searchBar = document.getElementById("searchBar");
    const $tabProductos = document.getElementById("tabProductos");
    const $tabCompras = document.getElementById("tabCompras");
    // --------------- LISTENERS ---------------
    $btnConfirmCompra.addEventListener("click", compras_functions.confirmarCompra);
    $btnBorrarCarrito.addEventListener("click", compras_functions.borrarCarrito);
    $btnComprar.addEventListener("click", compras_functions.showCarrito);
    $btnCreate.addEventListener("click",compras_functions.crearProductoEnCarrito);
    $btnCancel.addEventListener("click", compras_functions.reiniciaCampos);
    $btnLogout.addEventListener("click", compras_auth.logout);
    $btnUpdate.addEventListener("click", compras_functions.updateTables);
    $btnLogin.addEventListener("click", compras_functions.iniciarSesion);
    $create_input_pcompra.addEventListener("keyup", compras_functions.validateFloatNumber); 
    $create_input_pcompra.addEventListener("keyup", compras_functions.validarPrecios); 
    $create_input_pventa.addEventListener("keyup", compras_functions.validateFloatNumber);  
    $create_input_pventa.addEventListener("keyup", compras_functions.validarPrecios);  
    $create_input_modelo.addEventListener("change", compras_functions.validarModelo);
    $create_input_marca.addEventListener("change", compras_functions.validarMarca);
    $create_input_stock.addEventListener("keyup", compras_functions.validateIntegerNumber);
    $create_input_talla.addEventListener("change", compras_functions.validarTalla);
    $create_input_color.addEventListener("change", compras_functions.validarColor);
    $edit_input_pventa.addEventListener("keyup", compras_functions.validateFloatNumber);  
    $edit_input_stock.addEventListener("keyup", compras_functions.validateIntegerNumber);
    $searchBar.addEventListener("keyup", compras_functions.filtrarTabla);
    $tabProductos.addEventListener("click", compras_functions.showPanelProductos);
    $tabCompras.addEventListener("click", compras_functions.showPanelCompras);
    // --------------- CALLS ---------------
    compras_functions.loadPage();
    compras_functions.reiniciaCampos();
})();