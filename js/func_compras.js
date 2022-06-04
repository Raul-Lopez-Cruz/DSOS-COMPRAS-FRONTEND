const functions_compras = (() => {
    const $table = document.getElementById("tablaCompras");
    const $contadorTotal =  document.getElementById("contadorTotal");
    const $contadorCompras= document.getElementById("contadorCompras");

    const _createRow = (id, total, fecha, cliente, producto) => {
        //Creación de celdas
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.className="columnaID";
        const $celda_total = document.createElement("td");
        const $celda_fecha = document.createElement("td");
        const $celda_cliente = document.createElement("td");
        const $celda_producto = document.createElement("td");
        const $celda_acciones = document.createElement("td");
        const $btn_editar = _createButton("editar");
        const $btn_borrar = _createButton("borrar");
        const $btn_detalles = _createButton("info");

        //Asignación de valores
        $celda_id.innerText = intToFixedLength(id,8);
        $celda_total.innerText = moneyFormat(total);
        $celda_fecha.innerText = fecha;
        $celda_cliente.innerText = intToFixedLength(cliente,8);
        $celda_producto.innerHTML = intToFixedLength(producto,8);
        //Agregar celdas a la fila
        $celda_acciones.appendChild($btn_editar);
        $celda_acciones.appendChild($btn_borrar);
        $celda_acciones.appendChild($btn_detalles);
        $row.appendChild($celda_id);
        $row.appendChild($celda_total);
        $row.appendChild($celda_fecha);
        $row.appendChild($celda_cliente);
        $row.appendChild($celda_producto);
        $row.appendChild($celda_acciones);

        //Agregar la fila a la tabla
        $table.appendChild($row);

        //Actualiza información desplegada
        const comprasActual = parseInt($contadorCompras.innerText);
        const totalActual = parseFloat($contadorTotal.innerText.replace(',',''));
        $contadorCompras.innerText = comprasActual+1;
        $contadorTotal.innerText = moneyFormat(totalActual+total).replace('$','');
    };

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
                $row = $cell.parentElement;
                id = $row.querySelector('.columnaID').innerText;
                z = document.getElementById("delete_ok");
                z.parentNode.replaceChild(z.cloneNode(1), z);
                z = document.getElementById("delete_ok");
                z.addEventListener("click", () => {
                    clientHttp.delete("https://dsos-test.herokuapp.com/api/compras/", id);
                    //Delete row (without reload page)
                    $row.parentNode.removeChild($row);
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
                $row = $cell.parentElement;
                id = $row.querySelector('.columnaID').innerText;
                //Get values
                var columnas = $row.childNodes;
                temp_id = columnas[0].innerText;
                temp_total = columnas[1].innerText.replace('$','').replace(',','');
                temp_date = columnas[2].innerText.replace(' ','T');
                temp_client = columnas[3].innerText;
                temp_product = columnas[4].innerText;
                //Show values
                document.getElementById("edit_input_id").value = temp_id;
                document.getElementById("edit_input_total").value = temp_total;
                document.getElementById("edit_input_date").value = temp_date;
                document.getElementById("edit_input_client").value = temp_client;
                document.getElementById("edit_input_product").value = temp_product;
                //Reasignar edit target
                z = document.getElementById("edit_ok");
                z.parentNode.replaceChild(z.cloneNode(1), z);
                z = document.getElementById("edit_ok");
                z.addEventListener("click", () => {
                    //VALIDATE
                    var todoOK = document.getElementById("edit_Form").checkValidity();
                    //Get NEW values
                    if(todoOK){
                        data = {
                            costoTotal: document.getElementById("edit_input_total").value,
                            fechaCompra: document.getElementById("edit_input_date").value,
                            idCliente: document.getElementById("edit_input_client").value,
                            idProducto: document.getElementById("edit_input_product").value
                        };
                        //Send request
                        clientHttp.put("https://dsos-test.herokuapp.com/api/compras/", id, data);
                        //Update row (without reload page)
                        columnas[1].innerText=moneyFormat(document.getElementById("edit_input_total").value);
                        columnas[2].innerText=document.getElementById("edit_input_date").value.replace('T',' ');
                        columnas[3].innerText=intToFixedLength(document.getElementById("edit_input_client").value,8);
                        columnas[4].innerText=intToFixedLength(document.getElementById("edit_input_product").value,8);
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

    function intToFixedLength(int,len){
        if(int.toString().length >= len){
            return String (int);
        }else{
            res = '0'.repeat(len-int.toString().length);
            return String (res.toString()+int.toString());
        }
    }

    function moneyFormat(num){  //Formatea un número a formato moneda
        return '$'+num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    function moneyFormat(amount){
        return parseFloat(amount).toLocaleString("es-MX", {style: "currency", currency: "MXN", minimumFractionDigits: 2})
    }

    const fetchTotals = (response) =>{
        var sumaTotal=0;
        for (let index = 0; index < response.data.length; index++) {
            sumaTotal = sumaTotal + response.data[index].costoTotal; 
        }
        $contadorCompras.innerText=response.data.length;
        $contadorTotal.innerText=moneyFormat(sumaTotal);
    }

    const _updateInfo = (response)=>{
        console.log(response);
        clientHttp.getAll("https://dsos-test.herokuapp.com/api/compras/", fetchTotals, console.log);
    };


    return {
        createRow: _createRow,
        updateInfo: _updateInfo
    }
})();