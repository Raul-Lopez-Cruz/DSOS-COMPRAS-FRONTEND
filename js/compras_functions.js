const compras_functions = (() => {
    
    //Funciones públicas (constantes)

    //Funciones privadas (funciones)
    
    const _createRow = (id, precioCompra, precioVenta, stock, talla, color, marca, modelo) => {
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.classList.add("columnaID");
        //const $celda_pcompra = document.createElement("td");
        const $celda_pventa = document.createElement("td"); $celda_pventa.classList.add("columnaPVenta");
        const $celda_stock = document.createElement("td"); $celda_stock.classList.add("columnaStock");
        const $celda_talla = document.createElement("td"); $celda_talla.classList.add("columnaTalla");
        const $celda_color = document.createElement("td"); $celda_color.classList.add("columnaColor");
        const $celda_marca = document.createElement("td"); $celda_marca.classList.add("columnaMarca");
        const $celda_modelo = document.createElement("td"); $celda_modelo.classList.add("columnaModelo");
        const $celda_acciones = document.createElement("td"); $celda_acciones.classList.add("text-center");
        const $btn_editar = _createButton("editar");
        const $btn_borrar = _createButton("borrar");

        $celda_id.innerText = _intToFixedLength(id,4);
        //$celda_pcompra.innerText = '$'+precioCompra;
        $celda_pventa.innerText = toMoneyFormat(precioVenta);
        $celda_stock.innerText = stock;
        $celda_talla.innerText = talla;
        $celda_color.innerText = color;
        $celda_marca.innerText = marca;
        $celda_modelo.innerText = modelo;

        $celda_acciones.appendChild($btn_editar);
        $celda_acciones.appendChild($btn_borrar);

        $row.appendChild($celda_id);
        //$row.appendChild($celda_pcompra);
        $row.appendChild($celda_pventa);
        $row.appendChild($celda_stock);
        $row.appendChild($celda_talla);
        $row.appendChild($celda_color);
        $row.appendChild($celda_marca);
        $row.appendChild($celda_modelo);
        $row.appendChild($celda_acciones);

        document.getElementById("tablaProductos").appendChild($row);

        updateAfterCreate(stock);
    };

    const updateAfterCreate = (stock) => {
        contadorModelos=document.getElementById("contadorModelos");
        contadorProductos=document.getElementById("contadorProductos");
        const numModelos = parseInt(contadorModelos.innerText);
        const numProductos = parseInt(contadorProductos.innerText.replace(',',''));
        contadorModelos.innerText = numModelos+1;
        contadorProductos.innerText = numProductos+stock;
    }

    const updateAfterDelete = (stock) => {
        contadorModelos=document.getElementById("contadorModelos");
        contadorProductos=document.getElementById("contadorProductos");
        const numModelos = parseInt(contadorModelos.innerText);
        const numProductos = parseInt(contadorProductos.innerText.replace(',',''));
        contadorModelos.innerText = numModelos-1;
        contadorProductos.innerText = numProductos-stock;
    }

    const updateAfterUpdate = (oldStock,newStock) => {
        contadorProductos=document.getElementById("contadorProductos");
        const numProductos = parseInt(contadorProductos.innerText.replace(',',''));
        contadorProductos.innerText = numProductos+(newStock-oldStock);
    }

    const _createButton = (texto) => {
        const $button = document.createElement("button");
        const $icon = document.createElement("i");
        $button.appendChild($icon);
        var $cell;

        if (texto == "borrar") {
            $button.className = "btn btn-s-rojo mx-1";
            $icon.className = "bi bi-trash";
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
                    compras_fetch.delete("https://compras-testing.herokuapp.com/api/compras/"+id);
                    $row.parentNode.removeChild($row);
                    updateAfterDelete($row.querySelector('.columnaStock').innerText);
                    $('#modalConfirmarEliminar').modal('hide');
                });
                $('#modalConfirmarEliminar').modal('show');
            });
        } else if (texto == "editar"){
            $button.className = "btn btn-s-amarillo mx-1";
            $icon.className = "bi bi-pencil-square";
            $button.addEventListener("click", (event) => {
                if ($(event.target).is("i"))
                    $cell = event.target.parentElement.parentElement;
                else
                    $cell = event.target.parentElement;
                var $row = $cell.parentElement;
                var temp_id =      $row.querySelector('.columnaID').innerText;
                var temp_pventa =  $row.querySelector('.columnaPVenta').innerText.replace('$ ','').replace(',','');
                var temp_stock =   $row.querySelector('.columnaStock').innerText;
                document.getElementById("edit_input_id").value = temp_id;
                document.getElementById("edit_input_pventa").value = temp_pventa;
                document.getElementById("edit_input_stock").value = temp_stock;
                var aux = document.getElementById("edit_ok");
                aux.parentNode.replaceChild(aux.cloneNode(1), aux);
                aux = document.getElementById("edit_ok");
                aux.addEventListener("click", () => {
                    var todoOK = document.getElementById("edit_Form").checkValidity();
                    if(todoOK){
                        data = {
                            idProducto: parseInt(temp_id),
                            precioVenta: parseFloat(document.getElementById("edit_input_pventa").value),
                            stock: parseInt(document.getElementById("edit_input_stock").value)
                        };
                        compras_fetch.put("https://compras-testing.herokuapp.com/api/compras/"+temp_id, data);
                        $('#modalEditarProducto').modal('hide');
                    }
                });
                $('#modalEditarProducto').modal('show');
            });
        }else{
            $button.className = "btn btn-s-azul mx-1";
            $icon.className = "bi bi-eye";
        }

        return $button;
    }

    //Transforma un entero en un String de determinado tamaño con ceros a la izquierda
    const _intToFixedLength = (int,len) =>{
        if(int.toString().length >= len){
            return String (int);
        }else{
            res = '0'.repeat(len-int.toString().length);
            return String (res.toString()+int.toString());
        }
    }

    //Función que toma un valor integer o float y lo transforma en un String con el formato de moneda
    function toMoneyFormat(value){
        return '$ '+value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    //Función que vacía el contenido de los campos del formulario de crear producto
    const _reiniciaCampos = ()=> {
        document.getElementById("create_input_pcompra").value = "";
        document.getElementById("create_input_pventa").value = "";
        document.getElementById("create_input_stock").value = "";
        document.getElementById("create_input_talla").value = "Selecciona una talla...";
        document.getElementById("create_input_color").value = "Selecciona un color...";
        document.getElementById("create_input_marca").value = "Selecciona una marca...";
        document.getElementById("create_input_modelo").value = "Primero selecciona una marca.";
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
        if  (pventa > pcompra) {
            document.getElementById("advertencia").classList.remove("d-block");
            document.getElementById("advertencia").classList.add("d-none");
        } else {
            document.getElementById("advertencia").classList.remove("d-none");
            document.getElementById("advertencia").classList.add("d-block");
        }
    };
    
    const _fillSelects = ()=>{
        //fill selector create_input_modelo with data depending on the selected value in create_input_marca
        const marca = document.getElementById("create_input_marca").value;
        const modelo = document.getElementById("create_input_modelo");
        if(marca === "" || marca === "Selecciona una marca..."){
            modelo.innerHTML = "<option value=''>Primero selecciona una marca.</option>";
        }//if adidas is selected, then the options in modelo will be: Duramo SL, Ultraboost, Racer TR21 and Adizero Boston.
        else if(marca === "Adidas"){
            modelo.innerHTML = "<option value='' hidden>Selecciona un modelo...</option><option value='Duramo SL'>Duramo SL</option><option value='Ultraboost'>Ultraboost</option><option value='Racer TR21'>Racer TR21</option><option value='Adizero Boston'>Adizero Boston</option><option value='ASWEEMOVE'>ASWEEMOVE</option>";
        }//if nike is selected, then the options in modelo will be: Revolution 6, Jordan Essentials, Dri-FIT, LeBron 19, and Air Max 1.
        else if(marca === "Nike"){
            modelo.innerHTML = "<option value='' hidden>Selecciona un modelo...</option><option value='Revolution 6'>Revolution 6</option><option value='Jordan Essentials'>Jordan Essentials</option><option value='Dri-FIT'>Dri-FIT</option><option value='LeBron 19'>LeBron 19</option><option value='Air Max 1'>Air Max 1</option>";
        }//if underarmour is selected, then the options in modelo will be: UA Hovr, UA Charged, UA Surge, UA Mojo, UA Flow and UA Valsetz.
        else if(marca === "UnderArmour"){
            modelo.innerHTML = "<option value='' hidden>Selecciona un modelo...</option><option value='UA Hovr'>UA Hovr</option><option value='UA Charged'>UA Charged</option><option value='UA Surge'>UA Surge</option><option value='UA Mojo'>UA Mojo</option><option value='UA Flow'>UA Flow</option><option value='UA Valsetz'>UA Valsetz</option>";
        }//if Reebok is selected, then the options in modelo will be: Resonator Mid, Royal Techque, Turbo Restyle, Leather Pj, Nanoflex TR, Nano X2.
        else if(marca === "Reebok"){
            modelo.innerHTML = "<option value='' hidden>Selecciona un modelo...</option><option value='Resonator Mid'>Resonator Mid</option><option value='Royal Techque'>Royal Techque</option><option value='Turbo Restyle'>Turbo Restyle</option><option value='Leather Pj'>Leather Pj</option><option value='Nanoflex TR'>Nanoflex TR</option><option value='Nano X2'>Nano X2</option>";
        }//if Converse is selected, then the options in modelo will be: All Star, GLF 2.0, Chuck Taylor, Aeon Active Cx, Stüssy Chuck and Weapon Cx.
        else if(marca === "Converse"){
            modelo.innerHTML = "<option value='' hidden>Selecciona un modelo...</option><option value='All Star'>All Star</option><option value='GLF 2.0'>GLF 2.0</option><option value='Chuck Taylor'>Chuck Taylor</option><option value='Aeon Active Cx'>Aeon Active Cx</option><option value='Stüssy Chuck'>Stüssy Chuck</option><option value='Weapon Cx'>Weapon Cx</option>";
        }
        else{
            modelo.innerHTML = "<option value='' hidden>Selecciona un modelo...</option>";
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
        if (value === 'Selecciona una marca...') {
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
        if (value === '' || value === 'Selecciona un color...') {
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
        if (value === 'Selecciona un modelo...' || value === 'Primero selecciona una marca.') {
            input.setCustomValidity('Debe seleccionar un modelo');
            invalid_tooltip.innerText = 'Debe seleccionar un modelo';
        } else {
            input.setCustomValidity('');
        }
    }

    const _crearRegistro = (target) => {
        target.preventDefault();        
        form = document.getElementById("create_Form");
        form.classList.add("was-validated");
        var todoOK = form.checkValidity();
        if (todoOK) {
            const pcompra = document.getElementById("create_input_pcompra").value;
            const pventa = document.getElementById("create_input_pventa").value;
            const stock = document.getElementById("create_input_stock").value;
            const talla = document.getElementById("create_input_talla").value;
            const color = document.getElementById("create_input_color").value;
            const marca = document.getElementById("create_input_marca").value;
            const modelo = document.getElementById("create_input_modelo").value;
            data = {
                precioCompra: pcompra,
                precioVenta: pventa,
                talla: talla,
                stock: stock,
                color: color,
                marca: marca,
                modelo: modelo
            };
            compras_fetch.post("https://compras-testing.herokuapp.com/api/compras/", data, _postExito, _logError);
            $('#modalAgregarProducto').modal('hide');
            form.classList.remove("was-validated");
            _reiniciaCampos();
        }
    };

    function recargarDatos() {
        compras_fetch.get("https://compras-testing.herokuapp.com/api/compras/", _cargarDatos, _logError);
    }

    const _cargarDatos = (response) => {
        response.data = response.data.sort(function(a, b) {
            return a.idProducto - b.idProducto;
        });
        var sumaTotal=0;
        for (let index = 0; index < response.data.length; index++) {
            const idProducto = response.data[index].idProducto;
            const precioCompra = response.data[index].precioCompra;
            const precioVenta = response.data[index].precioVenta;
            const stock = response.data[index].stock;
            const talla = response.data[index].talla;
            const color = response.data[index].color;
            const marca = response.data[index].marca;
            const modelo = response.data[index].modelo;
            sumaTotal = sumaTotal + response.data[index].stock; 
            _createRow(idProducto, precioCompra, precioVenta, stock, talla, color, marca, modelo);
        }
        document.getElementById("contadorModelos").innerText = response.data.length;
        document.getElementById("contadorProductos").innerText = sumaTotal;
        console.log("Contenido cargado correctamente.");
    };

    const _filtrarTabla = () => {
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchBar");
        filter = input.value.toUpperCase();
        table = document.getElementById("tablaProductos");
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
    const _postExito = (response) => {
        const idProducto = response.data.idProducto;
        const precioCompra = response.data.precioCompra;
        const precioVenta = response.data.precioVenta;
        const stock = response.data.stock;
        const talla = response.data.talla;
        const color = response.data.color;
        const marca = response.data.marca;
        const modelo = response.data.modelo;
        _createRow(idProducto, precioCompra, precioVenta, stock, talla, color, marca, modelo);
        console.log(response);
    };
    
    /*Función que actualiza los datos de la tabla después de un PUT, sin hacer una petición GET*/
    const _putExito = (response) => {
        var table = document.getElementById("tablaProductos");
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
        console.log("Algo salió mal...",response);
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

    return {
        validateFloatNumber: _validateFloatNumber,
        validateIntegerNumber: _validateIntegerNumber,        
        reiniciaCampos: _reiniciaCampos,
        validatePrice: _validatePrice,
        crearRegistro: _crearRegistro,
        cargarDatos: _cargarDatos,
        filtrarTabla: _filtrarTabla,
        postExito: _postExito,
        putExito: _putExito,
        logError: _logError,
        createRow: _createRow,
        createButton: _createButton,
        intToFixedLength: _intToFixedLength,
        validarTalla: _validarTalla,
        fillSelects: _fillSelects,
        validarMarca: _validarMarca,
        validarModelo: _validarModelo,
        validarColor: _validarColor,
        iniciarSesion: _iniciarSesion,
    }
})();