const compras_functions = (() => {

    const EDITAR = 1;
    const BORRAR = 0;
    const DETALLES = 2;

    const _createCompraRow = (id, total, fecha) => {
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.classList.add("columnaID");
        const $celda_fecha = document.createElement("td"); $celda_fecha.classList.add("columnaFecha");
        const $celda_total = document.createElement("td"); $celda_total.classList.add("columnaTotal");
        const $celda_acciones = document.createElement("td"); $celda_acciones.classList.add("text-center");
        const $btn_detalles = _createButton(DETALLES);

        $celda_id.innerText = id;
        $celda_fecha.innerText = fecha;
        $celda_total.innerText = toMoneyFormat(total);

        $celda_acciones.appendChild($btn_detalles);

        $row.appendChild($celda_id);
        $row.appendChild($celda_fecha);
        $row.appendChild($celda_total);
        $row.appendChild($celda_acciones);

        document.getElementById("tablaCompras-body").appendChild($row);
    }

    const _createCarritoRow = (precioCompra, precioVenta, stock, talla, color, idMarca, marca, idModelo, modelo) => {
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.classList.add("columnaID");
        const $celda_pventa = document.createElement("td"); $celda_pventa.classList.add("columnaPVenta");
        const $celda_pcompra = document.createElement("td"); $celda_pcompra.classList.add("columnaPCompra");
        const $celda_stock = document.createElement("td"); $celda_stock.classList.add("columnaStock");
        const $celda_talla = document.createElement("td"); $celda_talla.classList.add("columnaTalla");
        const $celda_color = document.createElement("td"); $celda_color.classList.add("columnaColor");
        const $celda_idmarca = document.createElement("td"); $celda_idmarca.style.display = "none";
        const $celda_marca = document.createElement("td"); $celda_marca.classList.add("columnaMarca");
        const $celda_idmodelo = document.createElement("td"); $celda_idmodelo.style.display = "none";
        const $celda_modelo = document.createElement("td"); $celda_modelo.classList.add("columnaModelo");
        const $celda_acciones = document.createElement("td"); $celda_acciones.classList.add("text-center");
        const $btn_borrar = _createButton(BORRAR);

        $celda_pcompra.innerText = toMoneyFormat(precioCompra);
        $celda_pventa.innerText = toMoneyFormat(precioVenta);
        $celda_stock.innerText = stock;
        $celda_talla.innerText = talla;
        $celda_color.innerText = color;
        $celda_idmarca.innerText = idMarca;
        $celda_marca.innerText = marca;
        $celda_idmodelo.innerText = idModelo;
        $celda_modelo.innerText = modelo;

        $celda_acciones.appendChild($btn_borrar);

        $row.appendChild($celda_pcompra);
        $row.appendChild($celda_pventa);
        $row.appendChild($celda_stock);
        $row.appendChild($celda_talla);
        $row.appendChild($celda_color);
        $row.appendChild($celda_idmarca);
        $row.appendChild($celda_marca);
        $row.appendChild($celda_idmodelo);
        $row.appendChild($celda_modelo);
        $row.appendChild($celda_acciones);

        document.getElementById("tablaCarrito-body").appendChild($row);
        let totalActual = parseFloat(document.getElementById("totalCarrito").innerText.replace(/[^0-9.]/g, ""));
        document.getElementById("totalCarrito").innerText = "Total: " + toMoneyFormat(totalActual + (precioCompra * stock));
    };

    const _createProductoRow = (id, precioCompra, precioVenta, stock, talla, color, marca, modelo) => {
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.classList.add("columnaID");
        const $celda_pventa = document.createElement("td"); $celda_pventa.classList.add("columnaPVenta");
        const $celda_stock = document.createElement("td"); $celda_stock.classList.add("columnaStock");
        const $celda_talla = document.createElement("td"); $celda_talla.classList.add("columnaTalla");
        const $celda_color = document.createElement("td"); $celda_color.classList.add("columnaColor");
        const $celda_marca = document.createElement("td"); $celda_marca.classList.add("columnaMarca");
        const $celda_modelo = document.createElement("td"); $celda_modelo.classList.add("columnaModelo");
        const $celda_acciones = document.createElement("td"); $celda_acciones.classList.add("text-center");
        const $btn_editar = _createButton(EDITAR);
        const $btn_borrar = _createButton(BORRAR);

        $celda_id.innerText = _intToFixedLength(id, 4);
        $celda_pventa.innerText = toMoneyFormat(precioVenta);
        $celda_stock.innerText = stock;
        $celda_talla.innerText = talla;
        $celda_color.innerText = color;
        $celda_marca.innerText = marca;
        $celda_modelo.innerText = modelo;

        $celda_acciones.appendChild($btn_editar);
        $celda_acciones.appendChild($btn_borrar);

        $row.appendChild($celda_id);
        $row.appendChild($celda_pventa);
        $row.appendChild($celda_stock);
        $row.appendChild($celda_talla);
        $row.appendChild($celda_color);
        $row.appendChild($celda_marca);
        $row.appendChild($celda_modelo);
        $row.appendChild($celda_acciones);

        document.getElementById("tablaProductos-body").appendChild($row);

        updateAfterCreate(stock);
    };

    const updateAfterCreate = (stock) => {
        contadorModelos = document.getElementById("contadorModelos");
        contadorProductos = document.getElementById("contadorProductos");
        const numModelos = parseInt(contadorModelos.innerText);
        const numProductos = parseInt(contadorProductos.innerText.replace(',', ''));
        contadorModelos.innerText = numModelos + 1;
        contadorProductos.innerText = numProductos + stock;
    }

    const updateAfterDelete = (stock) => {
        contadorModelos = document.getElementById("contadorModelos");
        contadorProductos = document.getElementById("contadorProductos");
        const numModelos = parseInt(contadorModelos.innerText);
        const numProductos = parseInt(contadorProductos.innerText.replace(',', ''));
        contadorModelos.innerText = numModelos - 1;
        contadorProductos.innerText = numProductos - stock;
    }

    const updateAfterUpdate = (oldStock, newStock) => {
        contadorProductos = document.getElementById("contadorProductos");
        const numProductos = parseInt(contadorProductos.innerText.replace(',', ''));
        contadorProductos.innerText = numProductos + (newStock - oldStock);
    }

    const _createButton = (opcion) => {
        const $button = document.createElement("button");
        const $icon = document.createElement("i");
        $button.appendChild($icon);
        var $cell;

        if (opcion == 0) {
            $button.className = "btn btn-label-danger mx-1";
            $icon.className = "fa-solid fa-trash-can";
            $button.addEventListener("click", (event) => {
                if ($(event.target).is("i"))
                    $cell = event.target.parentElement.parentElement;
                else
                    $cell = event.target.parentElement;
                var $row = $cell.parentElement;
                var id = $row.querySelector('.columnaID').innerText;
                var aux = document.getElementById("delete_ok");
                aux.parentNode.replaceChild(aux.cloneNode(1), aux);
                aux = document.getElementById("delete_ok");
                aux.addEventListener("click", () => {
                    compras_fetch.delete("https://compras-testing.herokuapp.com/api/compras/" + id);
                    $row.parentNode.removeChild($row);
                    updateAfterDelete($row.querySelector('.columnaStock').innerText);
                    $('#modalConfirmarEliminar').modal('hide');
                });
                $('#modalConfirmarEliminar').modal('show');
            });
        } else if (opcion == 1) {
            $button.className = "btn btn-label-warning mx-1";
            $icon.className = "fa-solid fa-pen-to-square";
            $button.addEventListener("click", (event) => {
                if ($(event.target).is("i"))
                    $cell = event.target.parentElement.parentElement;
                else
                    $cell = event.target.parentElement;
                var $row = $cell.parentElement;
                var temp_id = $row.querySelector('.columnaID').innerText;
                var temp_pventa = $row.querySelector('.columnaPVenta').innerText.replace('$ ', '').replace(',', '');
                var temp_stock = $row.querySelector('.columnaStock').innerText;
                document.getElementById("edit_input_id").value = temp_id;
                document.getElementById("edit_input_pventa").value = temp_pventa;
                document.getElementById("edit_input_stock").value = temp_stock;
                var aux = document.getElementById("edit_ok");
                aux.parentNode.replaceChild(aux.cloneNode(1), aux);
                aux = document.getElementById("edit_ok");
                aux.addEventListener("click", () => {
                    var todoOK = document.getElementById("edit_Form").checkValidity();
                    if (todoOK) {
                        data = {
                            idProducto: parseInt(temp_id),
                            precioVenta: parseFloat(document.getElementById("edit_input_pventa").value),
                            stock: parseInt(document.getElementById("edit_input_stock").value)
                        };
                        compras_fetch.put("https://compras-testing.herokuapp.com/api/compras/" + temp_id, data);
                        $('#modalEditarProducto').modal('hide');
                    }
                });
                $('#modalEditarProducto').modal('show');
            });
        } else {
            $button.className = "btn btn-s-azul mx-1";
            $icon.className = "bi bi-eye";
        }

        return $button;
    }

    //Transforma un entero en un String de determinado tamaño con ceros a la izquierda
    const _intToFixedLength = (int, len) => {
        if (int.toString().length >= len) {
            return String(int);
        } else {
            res = '0'.repeat(len - int.toString().length);
            return String(res.toString() + int.toString());
        }
    }

    //Función que toma un valor integer o float y lo transforma en un String con el formato de moneda
    function toMoneyFormat(value) {
        return '$ ' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    //Función que vacía el contenido de los campos del formulario de crear producto
    const _reiniciaCampos = () => {
        document.getElementById("create_input_pcompra").value = "";
        document.getElementById("create_input_pventa").value = "";
        document.getElementById("create_input_stock").value = "";
        document.getElementById("create_input_talla").value = "Seleccione una talla...";
        document.getElementById("create_input_color").value = "Seleccione un color...";
        document.getElementById("create_input_marca").value = "Seleccione una marca...";
        document.getElementById("create_input_modelo").value = "Primero seleccione una marca.";
        document.getElementById("create_input_talla").dispatchEvent(new Event('change'));
        document.getElementById("create_input_color").dispatchEvent(new Event('change'));
        document.getElementById("create_input_marca").dispatchEvent(new Event('change'));
        document.getElementById("create_input_modelo").dispatchEvent(new Event('change'));
        document.getElementById("create_Form").classList.remove("was-validated");
    };

    //Función que vacía el contenido de los campos del formulario de editar producto
    const _validateFloatNumber = (event) => {
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

    const _validateIntegerNumber = (event) => {
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

    /*Función que valida que el campo de precio de compra no sea mayor al de precio de venta*/
    const _validatePrice = (event) => {
        const pventa = parseFloat(document.getElementById("create_input_pventa").value);
        const pcompra = parseFloat(document.getElementById("create_input_pcompra").value);
        if (isNaN(pventa) || isNaN(pcompra)) {
            return;
        }
        if (pventa > pcompra) {
            document.getElementById("advertencia").classList.remove("d-block");
            document.getElementById("advertencia").classList.add("d-none");
        } else {
            document.getElementById("advertencia").classList.remove("d-none");
            document.getElementById("advertencia").classList.add("d-block");
        }
    };

    const _validarTalla = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        if (value === '' || isNaN(value)) {
            input.setCustomValidity('Debe seleccionar una talla');
            invalid_tooltip.innerText = 'Debe seleccionar una talla';
        } else {
            input.setCustomValidity('');
        }
    }

    const _validarMarca = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        if (value === 'Seleccione una marca...') {
            input.setCustomValidity('Debe seleccionar una marca');
            invalid_tooltip.innerText = 'Debe seleccionar una marca';
        } else {
            input.setCustomValidity('');
        }
    }

    const _validarColor = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        if (value === '' || value === 'Seleccione un color...') {
            input.setCustomValidity('Debe seleccionar un color');
            invalid_tooltip.innerText = 'Debe seleccionar un color';
        } else {
            input.setCustomValidity('');
        }
    }

    const _validarModelo = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        if (value == 'Seleccione un modelo...' || value == 'Primero seleccione una marca.') {
            input.setCustomValidity('Debe seleccionar un modelo');
            invalid_tooltip.innerText = 'Debe seleccionar un modelo';
        } else {
            input.setCustomValidity('');
        }
    }

    const _crearProductoEnCarrito = (target) => {
        target.preventDefault();
        form = document.getElementById("create_Form");
        form.classList.add("was-validated");
        var todoOK = form.checkValidity();
        if (todoOK) {
            const precioCompra = parseFloat(document.getElementById("create_input_pcompra").value);
            const precioVenta = parseFloat(document.getElementById("create_input_pventa").value);
            const stock = parseInt(document.getElementById("create_input_stock").value);
            const talla = document.getElementById("create_input_talla").value;
            const color = document.getElementById("create_input_color").value;
            const idMarca = document.getElementById("create_input_marca").value;
            const marca = document.getElementById("create_input_marca").options[document.getElementById("create_input_marca").selectedIndex].text;
            const idModelo = document.getElementById("create_input_modelo").value;
            const modelo = document.getElementById("create_input_modelo").options[document.getElementById("create_input_modelo").selectedIndex].text;
            _createCarritoRow(precioCompra, precioVenta, stock, talla, color, idMarca, marca, idModelo, modelo);

            $('#modalAgregarProducto').modal('hide');
            form.classList.remove("was-validated");
            _reiniciaCampos();
        }
    }

    const _cargarProductos = (response) => {
        console.log(response.data);
        const tbody = document.getElementById("tablaProductos-body");
        tbody.innerHTML = "";
        var sumaTotal = 0;
        for (let index = 0; index < response.data.length; index++) {
            const idProducto = response.data[index].idProducto;
            const precioCompra = response.data[index].precioCompra;
            const precioVenta = response.data[index].precioVenta;
            const stock = response.data[index].stock;
            const talla = response.data[index].talla;
            const color = response.data[index].color;
            const marca = response.data[index].marca.nombreMarca;
            const modelo = response.data[index].modelo.nombreModelo;
            sumaTotal = sumaTotal + response.data[index].stock;
            _createProductoRow(idProducto, precioCompra, precioVenta, stock, talla, color, marca, modelo);
        }
        document.getElementById("contadorModelos").innerText = response.data.length;
        document.getElementById("contadorProductos").innerText = sumaTotal;
        console.log("Contenido cargado correctamente.");
    };

    const _cargarCompras = (response) => {
        console.log(response.data);
        const tbody = document.getElementById("tablaCompras-body");
        tbody.innerHTML = "";
        for (
            let index = 0; index < response.data.length; index++) {
            const idCompra = response.data[index].idCompra;
            const total = response.data[index].total;
            const fechaAdquirido = response.data[index].fechaAdquirido;
            _createCompraRow(idCompra, total, fechaAdquirido);
        }
        console.log("Contenido cargado correctamente.");
    };

    const _cargarMarcas = (response) => {
        //response has an array of {"idMarca":1,"nombreMarca":"Converse"} objects
        marcas = response.data;
        //fill selector create_input_marca with value = idMarca and text = nombreMarca
        var select = document.getElementById("create_input_marca");
        for (let index = 0; index < marcas.length; index++) {
            const option = document.createElement("option");
            option.value = marcas[index].idMarca;
            option.text = marcas[index].nombreMarca;
            select.add(option);
        }
    }

    const _cargarModelos = (response) => {
        //response has an array of {"idModelo":20,"nombreModelo":"171571C","marca":{"idMarca":1,"nombreMarca":"Converse"} objects
        modelos = response.data;
        //modelos[index].idModelo is the value of the option
        //modelos[index].nombreModelo is the text of the option
        const marcaSelect = document.getElementById("create_input_marca");
        //add event listener to the select with arrow fucnt
        marcaSelect.addEventListener("change", (event) => {
            const marca = event.target.value;
            const modeloSelect = document.getElementById("create_input_modelo");
            modeloSelect.innerHTML = "";
            const option = document.createElement("option");
            option.value = "Seleccione un modelo...";
            option.text = "Seleccione un modelo...";
            option.style.display = "none";
            modeloSelect.add(option);
            for (let index = 0; index < modelos.length; index++) {
                if (modelos[index].marca.idMarca == marca) {
                    const option = document.createElement("option");
                    option.value = modelos[index].idModelo;
                    option.text = modelos[index].nombreModelo;
                    modeloSelect.add(option);
                }
            }

        } //end of event listener
        );
    }

    const _filtrarTabla = () => {
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchBar");
        filter = input.value.toUpperCase();
        table = document.getElementById("tablaProductos-body");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            tr[i].style.display = "none";
            td = tr[i].childNodes;
            if (td) {
                idValue = td[0].innerText;
                tallaValue = td[4].innerText.toUpperCase();
                colorValue = td[5].innerText.toUpperCase();
                marcaValue = td[6].innerText.toUpperCase();
                modeloValue = td[7].innerText.toUpperCase();
                if (idValue.indexOf(filter) > -1 || tallaValue.indexOf(filter) > -1 || colorValue.indexOf(filter) > -1 || marcaValue.indexOf(filter) > -1 || modeloValue.indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }
    /*Función que actualiza los datos de la tabla después de un POST, sin hacer una petición GET*/
    const _updateTables = (response) => {
        document.getElementById("btnUpdate").disabled = true;
        console.log("Contenido actualizado. ",response);
        compras_fetch.get("https://compras-develop.herokuapp.com/api/v1/productos/", _cargarProductos, _logError);
        compras_fetch.get("https://compras-develop.herokuapp.com/api/v1/compras/", _cargarCompras, _logError);
        document.getElementById("btnUpdate").disabled = false;
        document.getElementById("btnUpdate").blur();
    };

    /*Función que actualiza los datos de la tabla después de un PUT, sin hacer una petición GET*/
    const _putExito = (response) => {
        var table = document.getElementById("tablaProductos-body");
        var row = table.getElementsByTagName("tr");
        var oldStock;
        for (let index = 0; index < row.length; index++) {
            const id = row[index].childNodes[0].innerText;
            if (id == response.data.idProducto) {
                oldStock = row[index].childNodes[2].innerText;
                row[index].childNodes[1].innerText = toMoneyFormat(response.data.precioVenta);
                row[index].childNodes[2].innerText = response.data.stock;
                row[index].childNodes[3].innerText = response.data.talla;
                row[index].childNodes[4].innerText = response.data.color;
                row[index].childNodes[5].innerText = response.data.marca;
                row[index].childNodes[6].innerText = response.data.modelo;

            }
        }
        updateAfterUpdate(oldStock, response.data.stock);
        console.log(response);
    }

    const _logError = (response) => {
        console.log("Algo salió mal...", response);
    };

    const _iniciarSesion = () => {
        const usuario = document.getElementById("userid").value;
        const contraseña = document.getElementById("password").value;
        data = {
            usernameOrEmail: usuario,
            password: contraseña
        };
        compras_auth.login(data);
    }

    const _showPanelCompras = () => {
        $("#panelProductos").slideUp(function () {
            $("#panelCompras").slideDown();
        });
        $("#tabCompras").addClass("active");
        $("#tabProductos").removeClass("active");
    }
    const _showPanelProductos = () => {
        $("#panelCompras").slideUp(function () {
            $("#panelProductos").slideDown();
        });
        $("#tabCompras").removeClass("active");
        $("#tabProductos").addClass("active");
    }

    const _showCarrito = (event) => {
        event.target.blur();
        $("#controlPanel").fadeOut(function () {
            $("#panelCarrito").fadeIn();
        });
    }

    const _borrarCarrito = () => {
        var table = document.getElementById("tablaCarrito-body");
        var row = table.getElementsByTagName("tr");
        for (let index = 0; index < row.length; index++) {
            table.removeChild(row[index]);
        }
        document.getElementById("totalCarrito").innerText = "Total: $0.00";
        $("#panelCarrito").fadeOut(function () {
            $("#controlPanel").fadeIn();
        });
    };

    const _loadPage = () => {
        //TODO: Cargar datos de la base de datos, tanto para el panel de productos como para el panel de compras.
        compras_fetch.get("https://compras-develop.herokuapp.com/api/v1/productos/", _cargarProductos, _logError);
        compras_fetch.get("https://compras-develop.herokuapp.com/api/v1/compras/", _cargarCompras, _logError);
        compras_fetch.get("https://compras-develop.herokuapp.com/api/v1/marcas/", _cargarMarcas, _logError);
        compras_fetch.get("https://compras-develop.herokuapp.com/api/v1/modelos/", _cargarModelos, _logError);
        $(document).ready(function () {
            $('#tablaCompras').DataTable({
                language: {
                    url: 'utils/es-ES.json'
                },
                ordering: false,
                "pageLength": 10,
                "lengthChange": false,
                "searching": false,
                "pagingType": "simple",
                "autoWidth": true,
            });
            $('#tablaProductos').DataTable({
                language: {
                    url: 'utils/es-ES.json'
                },
                ordering: false,
                "pageLength": 10,
                "lengthChange": false,
                "searching": false,
                "pagingType": "simple",
                "autoWidth": true,
            });
        });
    }

    const _confirmarCompra = () => {
        var table = document.getElementById("tablaCarrito-body");
        var row = table.getElementsByTagName("tr");
        var data = [];
        for (let index = 0; index < row.length; index++) {
            const precioCompra = row[index].childNodes[0].innerText.replace(/\$|\s/g, '');
            const precioVenta = row[index].childNodes[1].innerText.replace(/\$|\s/g, '');
            const stock = row[index].childNodes[2].innerText;
            const talla = row[index].childNodes[3].innerText;
            const color = row[index].childNodes[4].innerText;
            const idMarca = row[index].childNodes[5].innerText;
            const marca = row[index].childNodes[6].innerText;
            const idModelo = row[index].childNodes[7].innerText;
            const modelo = row[index].childNodes[8].innerText;
            data.push({
                precioCompra: precioCompra,
                precioVenta: precioVenta,
                stock: stock,
                talla: talla,
                color: color,
                marca: {
                    idMarca: idMarca,
                    nombreMarca: marca
                },
                modelo: {
                    idModelo: idModelo,
                    nombreModelo: modelo
                }
            }
            );
        }
        compras_fetch.post("https://compras-develop.herokuapp.com/api/v1/compras/new/", data, _updateTables, _logError);
    };

    return {
        updateTables: _updateTables,
        loadPage: _loadPage,
        validateFloatNumber: _validateFloatNumber,
        validateIntegerNumber: _validateIntegerNumber,
        reiniciaCampos: _reiniciaCampos,
        validatePrice: _validatePrice,
        filtrarTabla: _filtrarTabla,
        putExito: _putExito,
        logError: _logError,
        createButton: _createButton,
        intToFixedLength: _intToFixedLength,
        validarTalla: _validarTalla,
        validarMarca: _validarMarca,
        validarModelo: _validarModelo,
        validarColor: _validarColor,
        iniciarSesion: _iniciarSesion,
        showPanelCompras: _showPanelCompras,
        showPanelProductos: _showPanelProductos,
        showCarrito: _showCarrito,
        crearProductoEnCarrito: _crearProductoEnCarrito,
        confirmarCompra: _confirmarCompra,
        borrarCarrito: _borrarCarrito,
    }
})();