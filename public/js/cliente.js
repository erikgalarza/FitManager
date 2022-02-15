/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */
let editarCliente = false;
window.addEventListener('load', () => {
    initCliente();
})


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initCliente() {
    manejoClickBotonesEditarEliminarCL();
    cargarDatosClientesTabla();
    registrarEditarCliente();
}

function manejoClickBotonesEditarEliminarCL() {
    const $contenedor = document.getElementById('contenedor-clientes');
    $contenedor?.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="edit"]')) {
            const id = e.target.parentElement.dataset.idClient;
            cargarDatosFormEditar(id);
        } else if (e.target.matches('[data-btn-action="delete"]')) {
            const id = e.target.parentElement.dataset.idClient;
            eliminarCliente(id);
        }
    })
}

async function cargarDatosClientesTabla() {
    const $tbodyClient = document.getElementById('tbody-client');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/clientes/`;
    try {
        const { data } = await axios.get(url);
        const clientes = data.data;
        $tbodyClient.innerHTML = '';
        clientes.forEach(cliente => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${cliente.cedula}</td>
            <td>${cliente.nombres}</td>
            <td>${cliente.correo}</td>
            <td>${cliente.impedimentos}</td>
            <td class="d-flex" data-id-client="${cliente.cedula}">
                <button class="btn btn-danger mx-2" data-btn-action="delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn btn-primary" data-btn-action="edit" data-toggle="modal"
                data-target="#modalClientes">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </td>
            `;
            $fragment.appendChild(tr);
        });
        $tbodyClient.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}

function registrarEditarCliente() {
    const $formClienteModal = document.getElementById('formClienteModal');
    const inputCedula = $formClienteModal.inputCedula;
    inputCedula.addEventListener('blur', consultarNombreCliente);
    
    $formClienteModal.addEventListener('submit', e => {
        e.preventDefault();

        const cliente = {
            cedula: inputCedula.value,
            nombres: $formClienteModal.inputNombres.value,
            correo: $formClienteModal.inputCorreo.value,
            password: $formClienteModal.inputNewPwd.value,
            impedimentos: $formClienteModal.inputFisicos.value
        }

        if (editarCliente) {
            cliente.oldPassword = $formClienteModal.inputOldPwd.value;
            requestPutCliente(cliente);
            console.log('editandooo');

        } else {
            requestPostCliente(cliente);
        }
        $formClienteModal.reset();
        closeModal();
        editarCliente = false;
    })
}

async function requestPostCliente(data) {
    try {
        const url = `${location.origin}/api/clientes/`;
        const { data: request } = await axios.post(url, data);
        mostrarAlerta('success', 'Cliente Registrado!', 'El cliente se registro correctamente', true)
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}
async function cargarDatosFormEditar(cedula) {
    editarCliente = true;
    const $formClienteModal = document.getElementById('formClienteModal');
    const url = `${location.origin}/api/clientes/${cedula}`;
    $formClienteModal.inputNewPwd.removeAttribute('readonly');
    $formClienteModal.inputNewPwd.setAttribute('placeholder','Dejar en blanco si no desea actualizar')
    try {
        const { data:request } = await axios.get(url);
        const cliente = request.data[0];
        formClienteModal.inputCedula.value = cliente.cedula;
        $formClienteModal.inputNombres.value = cliente.nombres;
        $formClienteModal.inputCorreo.value = cliente.correo;
        $formClienteModal.inputFisicos.value = cliente.impedimentos;
        $formClienteModal.inputOldPwd.value = cliente.password;

    } catch (error) {
        console.log(error.response.data);
        mostrarAlerta('error', 'Opps...!', error.response.data.message)
    }

}
async function requestPutCliente(data) {
    try {
        console.log('edito');
        const url = `${location.origin}/api/clientes/`;
        const { data: request } = await axios.put(url, data);
        mostrarAlerta('success', 'Registro Actualizado!', 'El registro se actualizo correctamente',true)
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.request);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}
function eliminarCliente(id) {
    Swal.fire({
        title: 'Esta seguro de eliminarlo?',
        text: "Una vez eliminado no podrá revertirlo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const url = `${location.origin}/api/clientes/${id}`;
            axios.delete(url)
                .then(resp => {
                    Swal.fire(
                        'Borrado!',
                        'El cliente ha sido eliminado',
                        'success'
                    ).then(()=>{
                        location.reload();
                    })
                }).catch(err => {
                    mostrarAlerta('error', 'Oppss...', 'Hubo un error intentalo más tarde')
                })
        }
    }).catch(err => console.log(err))
}

async function consultarNombreCliente() {
    const inputNombres = document.getElementById('inputNombres');
    if(this.value.length < 10) return;
    
    const inputPwd = document.getElementById('inputNewPwd');
    const url = `https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion/${this.value}/`;
    inputNombres.setAttribute('readonly', 'true');
    try {
        const { data } = await axios.get(url);
        const nombre = data.contribuyente.nombreComercial;
        inputPwd.value = this.value;
        inputNombres.value = '';
        inputNombres.value = nombre;
    } catch (error) {
        console.log(error);
        mostrarAlerta('error', 'Usuario no encontrado', 'Revisa si el número número de ceula está correcto, si lo está ingrese el nombre manualmente');
        inputNombres.value = '';
        inputNombres.removeAttribute('readonly')
    }
}

function mostrarAlerta(icon = 'success', title = 'Exito', sms = '', reload = false) {
    Swal.fire({
        icon: icon,
        title: title,
        text: sms,
        showConfirmButton: true,
        timer: 4000
    }).then(()=>{
        if(reload){
            location.reload();
        }
    })
}