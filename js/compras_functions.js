const compras_functions = (() => {

    /**
     * Variables globales.
     */
    const BORRAR = 0;
    const EDITAR = 1;
    const DETALLES = 2;

    /**
     * Crea una fila con los datos de una compra y lo agrega a la tabla de Compras
     * @param {Number} id Id del producto
     * @param {Number} total Total de la compra
     * @param {Number} fecha Fecha de la compra
     */
    const _createCompraRow = (id, total, fecha) => {
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.classList.add("columnaID");
        const $celda_fecha = document.createElement("td"); $celda_fecha.classList.add("columnaFecha");
        const $celda_total = document.createElement("td"); $celda_total.classList.add("columnaTotal");
        const $celda_acciones = document.createElement("td"); $celda_acciones.classList.add("text-center");
        const $btn_detalles = _createButton(DETALLES);
        $celda_id.innerText = id;
        $celda_fecha.innerText = fecha;
        $celda_total.innerText = _toMoneyFormat(total);
        $celda_acciones.appendChild($btn_detalles);
        $row.appendChild($celda_id);
        $row.appendChild($celda_fecha);
        $row.appendChild($celda_total);
        $row.appendChild($celda_acciones);
        document.getElementById("tablaCompras-body").appendChild($row);
    }

    /**
     * Función que crea una fila con los datos de un producto. Esta función trabaja de forma dinámica, la tabla objetivo es definida en los parámetros
     * y dependiendo del objetivo, los elementos creados son diferentes.
     * @param {String} objetivo Cadena que define la tabla objetivo y los elementos que se crearán para la fila.
     * @param {JSON} datos Objeto JSON con los datos del producto
     * @see _updateAfterCreate
     * @see _toMoneyFormat
     * @see _intToFixedLength
     */
    const _createProductoRow = (objetivo, datos) => {
        /*Creación de elementos*/
        const $row = document.createElement("tr");
        const $celda_pventa = document.createElement("td"); $celda_pventa.classList.add("columnaPVenta");
        const $celda_stock = document.createElement("td"); $celda_stock.classList.add("columnaStock");
        const $celda_talla = document.createElement("td"); $celda_talla.classList.add("columnaTalla");
        const $celda_color = document.createElement("td"); $celda_color.classList.add("columnaColor");
        const $celda_marca = document.createElement("td"); $celda_marca.classList.add("columnaMarca");
        const $celda_modelo = document.createElement("td"); $celda_modelo.classList.add("columnaModelo");
        const $celda_acciones = document.createElement("td"); $celda_acciones.classList.add("text-center");
        const $btn_borrar = _createButton(BORRAR);
        const $celda_pcompra = document.createElement("td"); $celda_pcompra.classList.add("columnaPCompra");
        const $celda_idmarca = document.createElement("td"); $celda_idmarca.style.display = "none";
        const $celda_idmodelo = document.createElement("td"); $celda_idmodelo.style.display = "none";
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.classList.add("columnaID");
        const $btn_editar = _createButton(EDITAR);
        /*Asignación de contenido*/
        $celda_pventa.innerText = _toMoneyFormat(datos.precioVenta);
        $celda_stock.innerText = datos.stock;
        $celda_talla.innerText = datos.talla;
        $celda_color.innerText = datos.color;
        $celda_marca.innerText = datos.marca;
        $celda_modelo.innerText = datos.modelo;
        $celda_acciones.appendChild($btn_borrar);
        if (objetivo === "carrito") {
            $celda_pcompra.innerText = _toMoneyFormat(datos.precioCompra);
            $celda_idmarca.innerText = datos.idMarca;
            $celda_idmodelo.innerText = datos.idModelo;
        } else if (objetivo === "inventario") {
            $celda_id.innerText = _intToFixedLength(datos.idProducto, 4);
            $celda_acciones.appendChild($btn_editar);
        }
        /*Ensamblaje*/
        if (objetivo === "inventario") $row.appendChild($celda_id);
        if (objetivo === "carrito") $row.appendChild($celda_pcompra);
        $row.appendChild($celda_pventa);
        $row.appendChild($celda_stock);
        $row.appendChild($celda_talla);
        $row.appendChild($celda_color);
        if (objetivo === "carrito") $row.appendChild($celda_idmarca);
        $row.appendChild($celda_marca);
        if (objetivo === "carrito") $row.appendChild($celda_idmodelo);
        $row.appendChild($celda_modelo);
        $row.appendChild($celda_acciones);
        /*Montado*/
        if (objetivo === "carrito") {
            document.getElementById("tablaCarrito-body").appendChild($row);
            let totalActual = parseFloat(document.getElementById("totalCarrito").innerText.replace(/[^0-9.]/g, ""));
            document.getElementById("totalCarrito").innerText = "Total: " + _toMoneyFormat(totalActual + (datos.precioCompra * datos.stock));
        } else if (objetivo === "inventario") {
            document.getElementById("tablaProductos-body").appendChild($row);
            _updateAfterCreate(datos.stock);
        }
    };

    /**
     * @Deprecated
     * @see _createProductoRow
     * 
     * Crea una fila con los datos de un producto y lo agrega a la tabla de Carrito de compras
     * @param {Number} precioCompra precio de compra del producto (por unidad)
     * @param {Number} precioVenta precio de venta del producto (por unidad)
     * @param {Number} stock stock del producto
     * @param {Number} talla talla del producto
     * @param {String} color color del producto
     * @param {String} marca marca del producto
     * @param {String} modelo modelo del producto
     */
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
        $celda_pcompra.innerText = _toMoneyFormat(precioCompra);
        $celda_pventa.innerText = _toMoneyFormat(precioVenta);
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
        document.getElementById("totalCarrito").innerText = "Total: " + _toMoneyFormat(totalActual + (precioCompra * stock));
    };

    /**
     * @Deprecated
     * @see _createProductoRow
     * 
     * Crea una fila con los datos de un producto y lo agrega a la tabla de Productos
     * @param {Number} id Id del producto
     * @param {Number} precioVenta precio de venta del producto
     * @param {Number} stock stock del producto
     * @param {Number} talla talla del producto
     * @param {String} color color del producto
     * @param {String} marca marca del producto
     * @param {String} modelo modelo del producto
     */
    const _createInventarioRow = (id, precioVenta, stock, talla, color, marca, modelo) => {
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
        $celda_pventa.innerText = _toMoneyFormat(precioVenta);
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
        _updateAfterCreate(stock);
    };

    /**
     * Actualiza el número de productos y el número de modelos totales (desplegados en el panel de control)
     * @param {Number} stock El número de productos que se agregaron 
     */
    const _updateAfterCreate = (stock) => {
        contadorModelos = document.getElementById("contadorModelos");
        contadorProductos = document.getElementById("contadorProductos");
        const numModelos = parseInt(contadorModelos.innerText);
        const numProductos = parseInt(contadorProductos.innerText.replace(',', ''));
        contadorModelos.innerText = numModelos + 1;
        contadorProductos.innerText = numProductos + stock;
    }

    /**
     * Actualiza el número de productos y el número de modelos totales (desplegados en el panel de control)
     * @param {Number} stock El número de productos que tenía el modelo antes de ser borrado
     */
    const updateAfterDelete = (stock) => {
        contadorModelos = document.getElementById("contadorModelos");
        contadorProductos = document.getElementById("contadorProductos");
        const numModelos = parseInt(contadorModelos.innerText);
        const numProductos = parseInt(contadorProductos.innerText.replace(',', ''));
        contadorModelos.innerText = numModelos - 1;
        contadorProductos.innerText = numProductos - stock;
    }

    /**
     * Actualiza el número de productos totales (desplegado en el panel de control)
     * @param {Number} oldStock la cantidad de productos antes de la modificación
     * @param {Number} newStock la cantidad de productos despues de la modificación
     */
    const _updateAfterPut = (oldStock, newStock) => {
        contadorProductos = document.getElementById("contadorProductos");
        const numProductos = parseInt(contadorProductos.innerText.replace(',', ''));
        contadorProductos.innerText = numProductos + (newStock - oldStock);
    }

    /**
     * Crea un botón y le asigna una clase y una función dependiendo del tipo de botón requerido por el parámetro
     * @param {Number} opcion Opción del botón que se desea crear: BORRAR = 0, EDITAR = 1, DETALLES = 2
     * @returns un elemento de tipo <button> con un estilo y función asignada de forma dinámica
     */
    const _createButton = (opcion) => {
        const $button = document.createElement("button");
        const $icon = document.createElement("i");
        $button.appendChild($icon);
        var $cell;
        if (opcion == BORRAR) {
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
                    let jwt = compras_auth.getJWT();
                    if (jwt === null) {
                        alert("Debe iniciar sesión para realizar esta acción");
                        return;
                    }
                    compras_fetch.delete("https://compras-testing.herokuapp.com/api/compras/" + id);
                    $row.parentNode.removeChild($row);
                    updateAfterDelete($row.querySelector('.columnaStock').innerText);
                    $('#modalConfirmarEliminar').modal('hide');
                });
                $('#modalConfirmarEliminar').modal('show');
            });
        } else if (opcion == EDITAR) {
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
                    let jwt = compras_auth.getJWT();
                    if (jwt === null) {
                        alert("Debe iniciar sesión para realizar esta acción");
                        return;
                    }
                    var todoOK = document.getElementById("edit_Form").checkValidity();
                    if (todoOK) {
                        data = {
                            idProducto: parseInt(temp_id),
                            precioVenta: parseFloat(document.getElementById("edit_input_pventa").value),
                            stock: parseInt(document.getElementById("edit_input_stock").value)
                        };
                        compras_fetch.put("https://compras-deploy.herokuapp.com/api/v1/productos/" + parseInt(temp_id), data, _putExito, _logError);
                        $('#modalEditarProducto').modal('hide');
                    }
                });
                $('#modalEditarProducto').modal('show');
            });
        } else if (opcion == DETALLES) {
            $button.className = "btn btn-label-info mx-1";
            $icon.className = "fa-solid fa-question";
            $button.addEventListener("click", (event) => {
                if ($(event.target).is("i"))
                    $cell = event.target.parentElement.parentElement;
                else
                    $cell = event.target.parentElement;
                var $row = $cell.parentElement;
                var temp_id = $row.querySelector('.columnaID').innerText;
                //empty table tablaDetalles-body
                var tablaDetallesBody = document.getElementById("tablaDetalles-body");
                tablaDetallesBody.innerHTML = "";
                compras_fetch.get("https://compras-deploy.herokuapp.com/api/v1/compras-detalle/" + parseInt(temp_id), _cargarDetalles, _logError);
                $('#modalDetalles').modal('show');
            });

        }

        return $button;
    }

    /**
     * Agrega ceros a la izquierda de un número para que tenga una longitud determinada
     * @param {Number} int es el número al que se le quiere agregar ceros a la izquierda
     * @param {Number} len es el tamaño esperado de la cadena de caracteres
     * @returns una cadena de caracteres con el número y ceros a la izquierda
     */
    const _intToFixedLength = (int, len) => {
        if (int.toString().length >= len) {
            return String(int);
        } else {
            res = '0'.repeat(len - int.toString().length);
            return String(res.toString() + int.toString());
        }
    }

    /**
     * Transforma un número en una cadena de caracteres con el formato de moneda
     * @param {Number} value un número entero o flotante que se quiere formatear
     * @returns una cadena de caracteres con el número formateado
     * 
     * @example _formatMoney(123.456) => '$ 123.46'
     */
    function _toMoneyFormat(value) {
        return '$ ' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    /**
     * Reinicia los campos del formulario de compra de productos
     * Simula eventos de cambio en los elementos de tipo select, lo que funciona como trigger para las validaciones
     */
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


    /**
     * Valida que el contenido del campo que llama al evento sea un número de punto flotante
     * @param {event} event el evento que llama a la función
     */
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

    /**
     * Valida que el contenido del campo que llama al evento sea un número entero
     * @param {event} event el evento que llama a la función
     */
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

    /**
     * Valida que el precio de venta sea mayo que el precio de compra, si no, muestra una advertencia
     * @param {event} event el evento que llama a la función
     * @returns nothing, en caso de que alguno de los dos campos esté vacío o tenga un valor no numérico
     */
    const _validarPrecios = (event) => {
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

    /**
     * Valida que el contenido del campo que llama al evento sea un número válido y en caso contrario, muestra el tooltip de error
     * @param {event} event el evento que llama a la función
     */
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

    /**
     * Valida que el contenido del campo que llama al evento sea una marca válida y en caso contrario, muestra el tooltip de error
     * @param {event} event el evento que llama a la función
     */
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

    /**
     * Valida que el contenido del campo que llama al evento sea un color válido y en caso contrario, muestra el tooltip de error
     * @param {event} event el evento que llama a la función
     */
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

    /**
     * Valida que el contenido del campo que llama al evento sea un modelo válido y en caso contrario, muestra el tooltip de error
     * @param {event} event el evento que llama a la función
     */
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

    /**
     * Valida todos los campos del formulario que llama al evento, si son válidos obtiene los valores de los campos y llama a la función _createCarritoRow
     * para agregar una fila, con los datos ingresados, a la tabla de carrito
     * @param {event} target el evento que llama a la función
     * @see _createProductoRow
     */
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
            data = {
                "precioCompra": precioCompra,
                "precioVenta": precioVenta,
                "stock": stock,
                "talla": talla,
                "color": color,
                "idMarca": idMarca,
                "marca": marca,
                "idModelo": idModelo,
                "modelo": modelo
            }
            _createProductoRow("carrito", data);

            $('#modalAgregarProducto').modal('hide');
            form.classList.remove("was-validated");
            _reiniciaCampos();
        }
    }

    /**
     * Obtiene los atributos de cada producto en la respuesta de la petición GET, y crea una fila por cada producto
     * @param {JSON} response Objeto JSON que contiene un arreglo de productos con sus atributos
     * @see _createInventarioRow
     */
    const _cargarProductos = (response) => {
        console.log(response.data);
        const tbody = document.getElementById("tablaProductos-body");
        tbody.innerHTML = "";
        var sumaTotal = 0;
        for (let index = 0; index < response.data.length; index++) {
            const idProducto = response.data[index].idProducto;
            const precioVenta = response.data[index].precioVenta;
            const stock = response.data[index].stock;
            const talla = response.data[index].talla;
            const color = response.data[index].color;
            const marca = response.data[index].marca.nombreMarca;
            const modelo = response.data[index].modelo.nombreModelo;
            sumaTotal = sumaTotal + response.data[index].stock;
            data = {
                "idProducto": idProducto,
                "precioVenta": precioVenta,
                "stock": stock,
                "talla": talla,
                "color": color,
                "marca": marca,
                "modelo": modelo
            }
            _createProductoRow("inventario", data);
        }
        document.getElementById("contadorModelos").innerText = response.data.length;
        document.getElementById("contadorProductos").innerText = sumaTotal;
    };

    /**
     * Obtiene los atributos de cada compra en la respuesta de la petición y crea una fila por cada compra
     * @param {JSON} response Objeto JSON que contiene un arreglo de compras con sus atributos
     * @see _createCompraRow
     */
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
    };

    /**
     * Obtiene los atributos de cada marca en la respuesta de la petición.
     * Por cada marca, crea un elemento de tipo <option> en el campo de selección de marcas
     * @param {JSON} response Objeto JSON que contiene un arreglo de marcas con sus atributos
     */
    const _cargarMarcas = (response) => {
        marcas = response.data;
        var select = document.getElementById("create_input_marca");
        for (let index = 0; index < marcas.length; index++) {
            const option = document.createElement("option");
            option.value = marcas[index].idMarca;
            option.text = marcas[index].nombreMarca;
            select.add(option);
        }
    }

    /**
     * Obtiene los atributos de cada modelo en la respuesta de la petición (estos atributos incluyen el ID de la marca a la que pertenece el modelo)
     * Crea una función que se ejecuta cuando se selecciona una marca, que dependiendo de la marca seleccionada, 
     * genera los elementos de tipo <option> en el campo de selección de modelos.
     * @param {JSON} response Objeto JSON que contiene un arreglo de modelos con sus atributos
     */
    const _cargarModelos = (response) => {
        modelos = response.data;
        const marcaSelect = document.getElementById("create_input_marca");
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
        });
    }

    /**
     * Obtiene los atributos del detalle de la compra, que incluyen id de la compra, fecha y productos adquiridos.
     * Coloca estos atributos en una tabla del modal de detalle de compra.
     * @param {JSON} response  Objeto JSON que contiene un arreglo de detalles de compra con sus atributos
     */
    const _cargarDetalles = (response) => {
        detalles_label = document.getElementById("detalles-label");
        var date = new Date(response.data[0].fechaAdquirido);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        detalles_label.innerText = "ID de la compra: " + response.data[0].idCompra + "\xa0\xa0\xa0-\xa0\xa0\xa0Realizada el " + day + "/" + month + "/" + year + " a las " + hours + ":" + minutes;
        tablaDetallesBody = document.getElementById("tablaDetalles-body");
        sumaTotal = 0;
        for (let index = 0; index < response.data[1].length; index++) {
            const row = document.createElement("tr");
            const idProducto = document.createElement("td");
            const marca = document.createElement("td");
            const modelo = document.createElement("td");
            const talla = document.createElement("td");
            const color = document.createElement("td");
            const precioCompra = document.createElement("td");
            const unidades = document.createElement("td");
            const total = document.createElement("td");
            idProducto.innerText = _intToFixedLength(response.data[1][index].producto.idProducto, 4);
            marca.innerText = response.data[1][index].producto.marca.nombreMarca;
            modelo.innerText = response.data[1][index].producto.modelo.nombreModelo;
            talla.innerText = response.data[1][index].producto.talla;
            color.innerText = response.data[1][index].producto.color;
            precioCompra.innerText = _toMoneyFormat(response.data[1][index].producto.precioCompra);
            unidades.innerText = response.data[1][index].producto.stock;
            total.innerText = _toMoneyFormat(response.data[1][index].producto.precioCompra * response.data[1][index].producto.stock);
            sumaTotal += response.data[1][index].producto.precioCompra * response.data[1][index].producto.stock;
            row.appendChild(idProducto);
            row.appendChild(marca);
            row.appendChild(modelo);
            row.appendChild(talla);
            row.appendChild(color);
            row.appendChild(precioCompra);
            row.appendChild(unidades);
            row.appendChild(total);
            tablaDetallesBody.appendChild(row);
        }
        const totalDetalle = document.getElementById("totalDetalle");
        totalDetalle.innerText = _toMoneyFormat(sumaTotal);
    }

    /**
     * Función que se ejecuta cada vez que se cambia el contenido de la tabla de búsqueda de productos.
     * Busca coincidencias en las columnas ID, color, marca y modelo de la tabla de productos. Oculta las filas que no tienen coincidencias.
     */
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

    /**
     * Hace dos peticiones GET para actualizar los datos de las tablas de productos y compras.
     * Reinicia y asigna eventos dinámicamente al botón de actualizar.
     * @see _cargarProductos
     * @see _cargarCompras
     * @see compras_fetch.get
     */
    const _updateTables = () => {
        var aux = document.getElementById("btnUpdate");
        aux.parentNode.replaceChild(aux.cloneNode(1), aux);
        aux = document.getElementById("btnUpdate");
        compras_fetch.get("https://compras-deploy.herokuapp.com/api/v1/productos/", _cargarProductos, _logError);
        compras_fetch.get("https://compras-deploy.herokuapp.com/api/v1/compras/", _cargarCompras, _logError);
        const tablaCompras = $('#tablaCompras').DataTable({
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
        const tablaProdcutos = $('#tablaProductos').DataTable({
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
        aux.addEventListener("click", (() => {
            tablaProdcutos.destroy();
            tablaCompras.destroy();
            _updateTables();
        }));
        console.log("Las tablas se han actualizado correctamente.")
    };

    /**
     * Actualiza los datos del producto que fue modificado sin realizar ninguna petición adicional.
     * @param {JSON} response Objeto JSON que contiene los atributos del producto modificado.
     * @see _updateAfterPut
     */
    const _putExito = (response) => {
        var table = document.getElementById("tablaProductos-body");
        var row = table.getElementsByTagName("tr");
        var oldStock;
        for (let index = 0; index < row.length; index++) {
            const id = row[index].childNodes[0].innerText;
            if (id == response.data.idProducto) {
                oldStock = row[index].childNodes[2].innerText;
                row[index].childNodes[1].innerText = _toMoneyFormat(response.data.precioVenta);
                row[index].childNodes[2].innerText = response.data.stock;
                row[index].childNodes[3].innerText = response.data.talla;
                row[index].childNodes[4].innerText = response.data.color;
                row[index].childNodes[5].innerText = response.data.marca.nombreMarca;
                row[index].childNodes[6].innerText = response.data.modelo.nombreModelo;
            }
        }
        _updateAfterPut(oldStock, response.data.stock);
        console.log(response);
    }

    /**
     * Imprime la respuesta del servidor en la consola del navegador. Utilizado en caso de error.
     * @param {JSON} response Objeto JSON que contiene la respuesta del servidor.
     */
    const _logError = (response) => {
        console.log("Algo salió mal...", response);
    };

    /**
     * Obtiene los datos de inicio de sesión introducidos por el usuario y los envía a compras_auth, en donde son evaluados.
     * @see compras_auth.login
     */
    const _iniciarSesion = () => {
        const usuario = document.getElementById("userid").value;
        const contraseña = document.getElementById("password").value;
        data = {
            usernameOrEmail: usuario,
            password: contraseña
        };
        compras_auth.login(data);
    }

    /**
     * Oculta el panel de productos y muestra el panel de compras, utilizando los efectos fadeIn y fadeOut de jQuery.
     */
    const _showPanelCompras = () => {
        $("#panelProductos").slideUp(function () {
            $("#panelCompras").slideDown();
        });
        $("#tabCompras").addClass("active");
        $("#tabProductos").removeClass("active");
    }

    /**
     * Oculta el panel de compras y muestra el panel de productos, utilizando los efectos fadeIn y fadeOut de jQuery.
     */
    const _showPanelProductos = () => {
        $("#panelCompras").slideUp(function () {
            $("#panelProductos").slideDown();
        });
        $("#tabCompras").removeClass("active");
        $("#tabProductos").addClass("active");
    }

    /**
     * Oculta el panel de control y muestra el panel de carrito de compras, utilizando los efectos fadeIn y fadeOut de jQuery.
     * @param {event} event Evento que llama a la función.
     */
    const _showCarrito = (event) => {
        event.target.blur();
        $("#controlPanel").fadeOut(function () {
            $("#panelCarrito").fadeIn();
        });
    }

    /**
     * Oculta el panel de carrito de compras y muestra el panel de control, utilizando los efectos fadeIn y fadeOut de jQuery.
     * Elimina todo el contenido de la tabla de carrito de compras y establece el total de la compra a 0.
     */
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

    /**
     * Método que hace todas las peticiones GET necesarias para cargar todo el contenido de la página.
     * No debe usarse más de una vez, ya que el tiempo que consumen las peticiones es significativo y puede afectar la experiencia del usuario.
     * @see _cargarProductos
     * @see _cargarCompras
     * @see _cargarMarcas
     * @see _cargarModelos
     * @see compras_fetch.get
     */
    const _loadPage = () => {
        compras_fetch.get("https://compras-deploy.herokuapp.com/api/v1/productos/", _cargarProductos, _logError);
        compras_fetch.get("https://compras-deploy.herokuapp.com/api/v1/modelos/", _cargarModelos, _logError);
        document.getElementById("btnUpdate").dispatchEvent(new Event('click'));
    }

    /**
     * Obtiene los datos de cada producto en la tabla de carrito de compras. Transforma los datos en objetos JSON y los almacena en un arreglo.
     * Este arreglo es enviado al servidor para crear un registro de compra y un registro de Producto por cada producto en la tabla.
     * @see _updateTables
     * @see compras_fetch.post
     */
    const _confirmarCompra = () => {
        let jwt = compras_auth.getJWT();
        if (jwt === null) {
            alert("Debe iniciar sesión para realizar esta acción");
            return;
        }
        var table = document.getElementById("tablaCarrito-body");
        var row = table.getElementsByTagName("tr");
        var data = [];
        for (let index = 0; index < row.length; index++) {
            const precioCompra = parseFloat(row[index].childNodes[0].innerText.replace(/\$|\s/g, ''));
            const precioVenta = parseFloat(row[index].childNodes[1].innerText.replace(/\$|\s/g, ''));
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
        compras_fetch.post("https://compras-deploy.herokuapp.com/api/v1/compras/new/", data,
            document.getElementById("btnUpdate").dispatchEvent(new Event('click')), _logError);
        _borrarCarrito();
    };

    /**
     * Al cargar la página valida si has iniciado sesión anteriormente, es decir, varifica
     * si existe un JWT en el navegador, si es así, inicia sesión automáticamente.
     * @returns nothing
     * @see compras_auth.getJWT
     */
    const _checkIfAlreadyLoggedIn = () => {
        let jwt = compras_auth.getJWT();
        if (jwt === null) {
            return;
        }
        $("#ingresar").addClass("d-none");
        $("#registrarse").addClass("d-none");
        $("#logout").removeClass("d-none");
        console.log("Tu sesión sigue abierta");
    };

    return {
        checkIfAlreadyLoggedIn: _checkIfAlreadyLoggedIn,
        crearProductoEnCarrito: _crearProductoEnCarrito,
        validateIntegerNumber: _validateIntegerNumber,
        validateFloatNumber: _validateFloatNumber,
        showPanelProductos: _showPanelProductos,
        showPanelCompras: _showPanelCompras,
        confirmarCompra: _confirmarCompra,
        reiniciaCampos: _reiniciaCampos,
        validarPrecios: _validarPrecios,
        borrarCarrito: _borrarCarrito,
        validarModelo: _validarModelo,
        iniciarSesion: _iniciarSesion,
        updateTables: _updateTables,
        filtrarTabla: _filtrarTabla,
        validarTalla: _validarTalla,
        validarMarca: _validarMarca,
        validarColor: _validarColor,
        showCarrito: _showCarrito,
        loadPage: _loadPage,
        logError: _logError,
    }
})();