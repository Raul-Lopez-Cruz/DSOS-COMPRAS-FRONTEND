const dom_compras = (() => {
    // --------------- DOM ELEMENTS --------------- 
    const $contadorProductos =  document.getElementById("contadorProductos");
    const $contadorModelos= document.getElementById("contadorModelos");
    const $btnTEST = document.getElementById("btnTEST");
    //Create input fields
    const $createForm =     document.getElementById("create_Form");
    const $create_input_pcompra = document.getElementById("create_input_pcompra");
    const $create_input_pventa = document.getElementById("create_input_pventa");
    const $create_input_stock = document.getElementById("create_input_stock");
    const $create_input_talla = document.getElementById("create_input_talla");
    const $create_input_color = document.getElementById("create_input_color");
    const $create_input_marca = document.getElementById("create_input_marca");
    const $create_input_modelo = document.getElementById("create_input_modelo");
    const $advertencia = document.getElementById("advertencia");
    //Create buttons
    const $createOK =       document.getElementById("create_ok");
    const $createCancel =   document.getElementById("create_cancel");
    //Delete buttons
    const $deleteForm =     document.getElementById("delete_Form");
    const $deleteOK =       document.getElementById("delete_ok");
    const $deleteCancel =   document.getElementById("delete_cancel");
    //Update fields
    const $edit_input_pcompra = document.getElementById("edit_input_pcompra");
    const $edit_input_pventa = document.getElementById("edit_input_pventa");
    const $edit_input_stock = document.getElementById("edit_input_stock");
    const $edit_input_talla = document.getElementById("edit_input_talla");
    const $edit_input_color = document.getElementById("edit_input_color");
    const $edit_input_marca = document.getElementById("edit_input_marca");
    const $edit_input_modelo = document.getElementById("edit_input_modelo");
    const $edit_input_id = document.getElementById("edit_input_id");
    //Update buttons
    const $editForm =       document.getElementById("edit_Form");
    const $editOK =         document.getElementById("edit_ok");
    const $editCancel =     document.getElementById("edit_cancel");
    //Search bar
    const $searchBar =      document.getElementById("searchBar");

    // --------------- FUNCTIONS ---------------
    const reiniciaCampos = ()=> {
        $create_input_pcompra.value = "";
        $create_input_pventa.value = "";
        $create_input_stock.value = "";
        $create_input_talla.value = "";
        $create_input_color.value = "";
        $create_input_marca.value = "";
        $create_input_modelo.value = "";
        $createForm.classList.remove("was-validated");
    };

    //evento para validar que el campo tenga un número entero o flotante mayor a 0
    const validateFloatNumber = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        const reg = /^\d*\.?\d*$/;
        if (value === '' || reg.test(value)) {
            input.setCustomValidity('');
        } else {
            input.setCustomValidity('Debe ingresar un número entero o flotante mayor a 0');
            invalid_tooltip.innerText = 'Debe ingresar un número entero o flotante mayor a 0';
        }
    };

    //evento para validar que el campo tenga un número entero mayor a 0
    const validateIntegerNumber = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        const reg = /^\d+$/;
        if (value === '' || reg.test(value)) {
            input.setCustomValidity('');
        } else {
            input.setCustomValidity('Debe ingresar un número entero mayor a 0');
            invalid_tooltip.innerText = 'Debe ingresar un número entero mayor a 0';
        }
    };

    //evento para validar que el campo precio de venta sea mayor al precio de compra
    const validatePrice = (event) => {
        const pventa = parseFloat($create_input_pventa.value);
        const pcompra = parseFloat($create_input_pcompra.value);
        console.log(pventa,pcompra);
        if (isNaN(pventa) || isNaN(pcompra)) {
            return;
        }
        if  (pventa > pcompra) {
            //hide advertencia
            $advertencia.classList.remove("d-block");
            $advertencia.classList.add("d-none");
        } else {
            //show advertencia
            $advertencia.classList.remove("d-none");
            $advertencia.classList.add("d-block");
        }
    };

    const crearRegistro = (target) => {
        target.preventDefault(); //Evita que la página se recargue al enviar el formulario
        $createForm.classList.add("was-validated");
        var todoOK = $createForm.checkValidity(); //Verifica si algún campo está incorrecto
        if (todoOK) {
            const pcompra = $create_input_pcompra.value;
            const pventa = $create_input_pventa.value;
            const stock = $create_input_stock.value;
            const talla = $create_input_talla.value;
            const color = $create_input_color.value;
            const marca = $create_input_marca.value;
            const modelo = $create_input_modelo.value;
            data = {
                precioCompra: pcompra,
                precioVenta: pventa,
                talla: talla,
                stock: stock,
                color: color,
                marca: marca,
                modelo: modelo
            };
            clientHttp.post("https://compras-develop.herokuapp.com/api/compras/", data, postExito, logError); //Envía la petición HTTP
            $('#modalAgregarProducto').modal('hide'); //Ocultar el formulario
            $createForm.classList.remove("was-validated");
            reiniciaCampos();
        }
    };

    const loadTable = (response) => {
        for (let index = 0; index < response.data.length; index++) {
            const idProducto = response.data[index].idProducto;
            const precioCompra = response.data[index].precioCompra;
            const precioVenta = response.data[index].precioVenta;
            const stock = response.data[index].stock;
            const talla = response.data[index].talla;
            const color = response.data[index].color;
            const marca = response.data[index].marca;
            const modelo = response.data[index].modelo;
            functions_compras.createRow(idProducto, precioCompra, precioVenta, stock, talla, color, marca, modelo);
        }
        console.log("Content loaded successfully. response:",response);
    };

    function filtrarTabla() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("searchBar");
        filter = input.value.toUpperCase();
        table = document.getElementById("tablaCompras");
        tr = table.getElementsByTagName("tr"); //array de todas las filas de la tabla

        for (i = 0; i < tr.length; i++) {
            tr[i].style.display = "none"; //ocultar filas
            td = tr[i].childNodes;  //array de todas las celdas de la fila
            if (td) {
                idValue = td[0].innerText;
                tallaValue = td[3].innerText.toUpperCase();
                colorValue = td[4].innerText.toUpperCase();
                marcaValue = td[5].innerText.toUpperCase();
                modeloValue = td[6].innerText.toUpperCase();
                if (idValue.indexOf(filter) > -1 || tallaValue.indexOf(filter) > -1 || colorValue.indexOf(filter) > -1 || marcaValue.indexOf(filter) > -1 || modeloValue.indexOf(filter) > -1) {
                    tr[i].style.display = ""; //mostrar filas que coincidan con el filtro
                }
            }
        }
    }

    const postExito = (response) => {
        const idProducto = response.data.idProducto;
        const precioCompra = response.data.precioCompra;
        const precioVenta = response.data.precioVenta;
        const stock = response.data.stock;
        const talla = response.data.talla;
        const color = response.data.color;
        const marca = response.data.marca;
        const modelo = response.data.modelo;
        functions_compras.createRow(idProducto, precioCompra, precioVenta, stock, talla, color, marca, modelo);
        console.log(response);
    };

    const logError = (response) => {
        console.log(response);
        console.log("Algo salió mal");
    };

    // --------------- LISTENERS / EVENT HANDLERS ---------------
    $createOK.addEventListener("click", crearRegistro);
    $createCancel.addEventListener("click",reiniciaCampos);
    $create_input_pcompra.addEventListener("keyup", validateFloatNumber); //validar numero entero o float
    $create_input_pventa.addEventListener("keyup", validateFloatNumber);  //validar numero entero o float
    $create_input_pcompra.addEventListener("keyup", validatePrice); //validar numero entero o float
    $create_input_pventa.addEventListener("keyup", validatePrice);  //validar numero entero o float
    $create_input_stock.addEventListener("keyup", validateIntegerNumber); //validar numero entero
    $create_input_talla.addEventListener("keyup", validateFloatNumber);   //validar numero entero o float
    $edit_input_pcompra.addEventListener("keyup", validateFloatNumber); //validar numero entero o float
    $edit_input_pventa.addEventListener("keyup", validateFloatNumber);  //validar numero entero o float
    $edit_input_stock.addEventListener("keyup", validateIntegerNumber); //validar numero entero
    $edit_input_talla.addEventListener("keyup", validateFloatNumber);   //validar numero entero o float
    $btnTEST.addEventListener("click", () => {location.reload()});
    $searchBar.addEventListener("keyup",filtrarTabla);
    
    // --------------- CALLS ---------------
    clientHttp.getAll("https://compras-develop.herokuapp.com/api/compras/", loadTable, logError);
})();