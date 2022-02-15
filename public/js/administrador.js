/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */
let editarAdministrador = false;
window.addEventListener('load', () => {
    console.log('Cargo la pagina');
    initAdministrador();
})


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initAdministrador() {
    tableContenido();
    cargarDatosAdministradorTabla();
    registrarEditarAdministrador();
}

function tableContenido() {
    const $contenedor = document.getElementById('contenedor-administradores');
    $contenedor?.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="edit"]')) {
            const id = e.target.parentElement.dataset.idClient;
            cargarDatosFormEditar(id);
        } else if (e.target.matches('[data-btn-action="delete"]')) {
            const id = e.target.parentElement.dataset.idClient;
            eliminarAdministrador(id);
        }
    })
}

async function cargarDatosAdministradorTabla() {
    const $tbodyAdmin = document.getElementById('tbody-admin');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/administrador/`;
    try {
        const { data } = await axios.get(url);
        const administrador = data.data;
        $tbodyAdmin.innerHTML = '';
        administrador.forEach(administrador => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${administrador.id_administrador}</td>
            <td>${administrador.nombres}</td>
            <td>${administrador.correo}</td>
            <td class="d-flex" data-id-client="${administrador.id_administrador}">
                <button class="btn btn-danger mx-2" data-btn-action="delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn btn-primary" data-btn-action="edit" data-toggle="modal"
                data-target="#modalProductos">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </td>
            `;
            $fragment.appendChild(tr);
        });
        $tbodyAdmin.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}

function registrarEditarAdministrador() {
    const $formAdministradorModal = document.getElementById('formAdministradorModal');
    const $closeModal = document.getElementById('closeModal');
    $formAdministradorModal.addEventListener('submit', e => {
        e.preventDefault();

        const administrador = {
            id: $formAdministradorModal.inputID.value,
            nombres: $formAdministradorModal.inputNombres.value,
            correo: $formAdministradorModal.inputCorreo.value,
            password: $formAdministradorModal.inputNewPwd.value
        }

        if (editarAdministrador) {
            administrador.oldPassword = $formAdministradorModal.inputOldPwd.value;
            requestPutAdministrador(administrador);

        } else {
            requestPostAdministrador(administrador);
        }
        cargarDatosAdministradorTabla();
        $formAdministradorModal.reset();
        $closeModal.click();
        editarAdministrador = false;
    })
}
async function requestPostAdministrador(data) {
    try {
        const url = `${location.origin}/api/administrador/`;
        const { data: request } = await axios.post(url, data);
        mostrarAlerta('success', 'Administrador Registrado!', 'El administrador se registro correctamente')
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}
async function cargarDatosFormEditar(id_administrador) {
    editarAdministrador = true;
    const $formAdministradorModal = document.getElementById('formAdministradorModal');
    $formAdministradorModal.setAttribute('data-action-request', 'true');
    const url = `${location.origin}/api/administrador/${id_administrador}`;
    $formAdministradorModal.inputNewPwd.removeAttribute('readonly');
    $formAdministradorModal.inputNewPwd.setAttribute('placeholder','Dejar en blanco si no desea actualizar')
    try {
        const { data:request } = await axios.get(url);
        const administrador = request.data[0];
        $formAdministradorModal.inputID.value = administrador.id_administrador;
        $formAdministradorModal.inputNombres.value = administrador.nombres;
        $formAdministradorModal.inputCorreo.value = administrador.correo;
        $formAdministradorModal.inputOldPwd.value = administrador.password;

    } catch (error) {
        console.log(error.response.data);
        mostrarAlerta('error', 'Opps...!', error.response.data.message)
    }

}
async function requestPutAdministrador(data) {
    try {
        console.log('Editar');
        const url = `${location.origin}/api/administrador/`;
        const { data:request } = await axios.put(url, data);
        mostrarAlerta('success', 'Registro Actualizado!', 'El registro se registro correctamente')
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.request);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}
function eliminarAdministrador(id_administrador) {
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
            const url = `${location.origin}/api/administrador/${id_administrador}`;
            axios.delete(url)
                .then(resp => {
                    cargarDatosAdministradorTabla();
                    Swal.fire(
                        'Borrado!',
                        'El Administrador ha sido eliminado',
                        'success'
                    )
                }).catch(err => {
                    mostrarAlerta('error', 'Oppss...', 'Hubo un error intentalo más tarde')
                })
        }
    }).catch(err => console.log(err))
}


function mostrarAlerta(icon = 'success', title = 'Exito', sms = '') {
    Swal.fire({
        icon: icon,
        title: title,
        text: sms,
        showConfirmButton: true,
        timer: 4000
    })
}