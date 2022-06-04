const functions_compras = (() => {
    const $table = document.getElementById("tablaCompras");
    const $contadorProductos =  document.getElementById("contadorProductos");
    const $contadorModelos= document.getElementById("contadorModelos");

    const _createRow = (id, precioCompra, precioVenta, stock, talla, color, marca, modelo) => {
        //Creación de celdas
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.className="columnaID";
        const $celda_pcompra = document.createElement("td");
        const $celda_pventa = document.createElement("td");
        const $celda_stock = document.createElement("td");
        const $celda_talla = document.createElement("td");
        const $celda_color = document.createElement("td");
        const $celda_marca = document.createElement("td");
        const $celda_modelo = document.createElement("td");
        const $celda_acciones = document.createElement("td");
        const $btn_editar = _createButton("editar");
        const $btn_borrar = _createButton("borrar");
        //const $btn_detalles = _createButton("info");

        //Asignación de valores
        $celda_id.innerText = intToFixedLength(id,4);
        $celda_pcompra.innerText = moneyFormat(precioCompra);
        $celda_pventa.innerText = moneyFormat(precioVenta);
        $celda_stock.innerText = stock;
        $celda_talla.innerText = talla;
        $celda_color.innerText = color;
        $celda_marca.innerText = marca;
        $celda_modelo.innerText = modelo;

        //Agregar celdas a la fila
        $celda_acciones.appendChild($btn_editar);
        $celda_acciones.appendChild($btn_borrar);
        //$celda_acciones.appendChild($btn_detalles);
        $row.appendChild($celda_id);
        $row.appendChild($celda_pcompra);
        $row.appendChild($celda_pventa);
        $row.appendChild($celda_stock);
        $row.appendChild($celda_talla);
        $row.appendChild($celda_color);
        $row.appendChild($celda_marca);
        $row.appendChild($celda_modelo);
        $row.appendChild($celda_acciones);

        //Agregar la fila a la tabla
        $table.appendChild($row);

        //Actualiza información desplegada
        const numModelos = parseInt($contadorModelos.innerText);
        const numProductos = parseFloat($contadorProductos.innerText.replace(',',''));
        $contadorModelos.innerText = numModelos+1;
        $contadorProductos.innerText =numProductos+stock;
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
                    clientHttp.delete("https://compras-develop.herokuapp.com/api/compras/", id);
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
                temp_id =       columnas[0].innerText;
                temp_pventa =   columnas[1].innerText.replace('$','').replace(',','');
                temp_pcompra =  columnas[2].innerText.replace('$','').replace(',','');
                temp_stock =    columnas[3].innerText;
                temp_talla =    columnas[4].innerText;
                temp_color =    columnas[5].innerText;
                temp_marca =    columnas[6].innerText;
                temp_modelo =   columnas[7].innerText;
                //Show values
                document.getElementById("edit_input_id").value = temp_id;
                document.getElementById("edit_input_pventa").value = temp_pventa;
                document.getElementById("edit_input_pcompra").value = temp_pcompra;
                document.getElementById("edit_input_stock").value = temp_stock;
                document.getElementById("edit_input_talla").value = temp_talla;
                document.getElementById("edit_input_color").value = temp_color;
                document.getElementById("edit_input_marca").value = temp_marca;
                document.getElementById("edit_input_modelo").value = temp_modelo;
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
                            idProducto: parseInt(document.getElementById("edit_input_id").value),
                            precioCompra: parseFloat(document.getElementById("edit_input_pcompra").value),
                            precioVenta: parseFloat(document.getElementById("edit_input_pventa").value),
                            stock: parseInt(document.getElementById("edit_input_stock").value),
                            talla: document.getElementById("edit_input_talla").value,
                            color: document.getElementById("edit_input_color").value,
                            marca: document.getElementById("edit_input_marca").value,
                            modelo: document.getElementById("edit_input_modelo").value
                        };
                        //Send request
                        clientHttp.put("https://compras-develop.herokuapp.com/api/compras/", id, data);
                        //Update row (without reload page)
                        columnas[1].innerText = '$'+data.precioVenta;
                        columnas[2].innerText = '$'+data.precioCompra;
                        columnas[3].innerText = data.stock;
                        columnas[4].innerText = data.talla;
                        columnas[5].innerText = data.color;
                        columnas[6].innerText = data.marca;
                        columnas[7].innerText = data.modelo;
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
            sumaTotal = sumaTotal + response.data[index].stock; 
        }
        $contadorModelos.innerText=response.data.length;
        $contadorProductos.innerText=sumaTotal;
    }

    const _updateInfo = (response)=>{
        console.log(response);
        clientHttp.getAll("https://compras-develop.herokuapp.com/api/compras/", fetchTotals, console.log);
    };


    return {
        createRow: _createRow,
        updateInfo: _updateInfo
    }
})();