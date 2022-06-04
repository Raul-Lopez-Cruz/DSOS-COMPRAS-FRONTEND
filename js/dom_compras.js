const dom_compras = (() => {
    // --------------- DOM ELEMENTS --------------- 
    const $contadorTotal =  document.getElementById("contadorTotal");
    const $contadorCompras= document.getElementById("contadorCompras");
    const $createForm =     document.getElementById("create_Form");
    const $createTotal =    document.getElementById("create_input_total");
    const $createClient =   document.getElementById("create_input_client");
    const $createProduct =  document.getElementById("create_input_product");
    const $createOK =       document.getElementById("create_ok");
    const $createCancel =   document.getElementById("create_cancel");
    const $deleteForm =     document.getElementById("delete_Form");
    const $deleteOK =       document.getElementById("delete_ok");
    const $deleteCancel =   document.getElementById("delete_cancel");
    const $editForm =       document.getElementById("edit_Form");
    const $editOK =         document.getElementById("edit_ok");
    const $editCancel =     document.getElementById("edit_cancel");
    const $searchBar =      document.getElementById("searchBar");
    // --------------- FUNCTIONS ---------------
    const reiniciaCampos = ()=> {
        $createTotal.value = "";
        $createClient.value = "";
        $createProduct.value = "";
        $createForm.classList.remove("was-validated");
    };

    const validarNumeroEntero = (e) => {
        valor = e.target.value; //Valor
        campo = e.target;
        if (isNaN(valor)) { //Verifica que valor sea un número
            campo.setCustomValidity("Debes introducir un número, sin letras ni símbolos");
        } else if (parseInt(valor) > 0) { //Verifica que valor sea mayor a 0
            campo.setCustomValidity("");
        } else {
            campo.setCustomValidity("El número debe ser mayor a 0");
        }
    };

    const validarNumeroDecimal = (e) => {
        valor = parseFloat(e.target.value); //Valor
        campo = e.target;
        if (isNaN(valor)) { //Verifica que valor sea un número
            campo.setCustomValidity("Debes introducir un número, sin letras ni símbolos");
        } else if (parseFloat(valor) > 0) { //Verifica que valor sea mayor a 0
            campo.setCustomValidity("");
        } else {
            campo.setCustomValidity("El número debe ser mayor a 0");
        }
    };

    const crearRegistro = (target) => {
        target.preventDefault(); //Evita que la página se recargue al enviar el formulario
        $createForm.classList.add("was-validated");
        var todoOK = $createForm.checkValidity(); //Verifica si algún campo está incorrecto
        if (todoOK) {
            const inputTotal = $createTotal.value;
            const inputIdCliente = $createClient.value;
            const inputIdProducto = $createProduct.value;
            data = {
                costoTotal: inputTotal,
                idCliente: inputIdCliente,
                idProducto: inputIdProducto
            };
            clientHttp.post("https://dsos-test.herokuapp.com/api/compras/", data, postExito, logError); //Envía la petición HTTP
            $('#modalAgregarProducto').modal('hide'); //Ocultar el formulario
            $createForm.classList.remove("was-validated");
            reiniciaCampos();
        }
    };

    const loadTable = (response) => {
        for (let index = 0; index < response.data.length; index++) {
            const id = response.data[index].compraID;
            const total = response.data[index].costoTotal;
            const fecha = response.data[index].fechaCompra.replace('T',' ').substring(0,16);
            const cliente = response.data[index].idCliente;
            const prodcuto = response.data[index].idProducto;
            functions_compras.createRow(id, total, fecha, cliente, prodcuto);
        }
        console.log("Content loaded successfully. response:",response);
    };

    function filtrarTabla() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("searchBar");
        filter = input.value;
        table = document.getElementById("tablaCompras");
        tr = table.getElementsByTagName("tr");
      
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("th")[0];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }

    const postExito = (response) => {
        const id = response.data.compraID;
        const total = response.data.costoTotal;
        const fecha = response.data.fechaCompra.replace('T',' ').substring(0,16);
        const cliente = response.data.idCliente;
        const prodcuto = response.data.idProducto;
        functions_compras.createRow(id, total, fecha, cliente, prodcuto);
        console.log(response);
    };

    const logError = (response) => {
        console.log(response);
        console.log("Algo salió mal");
    };

    // --------------- LISTENERS / EVENT HANDLERS ---------------
    $createOK.addEventListener("click", crearRegistro);
    $createCancel.addEventListener("click",reiniciaCampos);
    $createClient.addEventListener("keyup", validarNumeroEntero);
    $createProduct.addEventListener("keyup", validarNumeroEntero);
    $createTotal.addEventListener("keyup", validarNumeroDecimal);
    $searchBar.addEventListener("keyup",filtrarTabla);
    
    // --------------- CALLS ---------------
    clientHttp.getAll("https://dsos-test.herokuapp.com/api/compras/", loadTable, logError);
})();