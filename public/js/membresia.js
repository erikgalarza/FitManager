/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */
let editarMembresia = false;
window.addEventListener('load', () => {
    console.log('Cargo la pagina');
    initMembresia();
})


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initMembresia() {
    tableContenido();
    cargarDatosMembresiaTabla();
    registrarEditarMembresia();
}

function tableContenido() {
    const $contenedor = document.getElementById('contenedor-membresia');
    $contenedor?.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="edit"]')) {
            const id_membresia = e.target.parentElement.dataset.idClient;
            cargarDatosFormEditar(id_membresia);
        } else if (e.target.matches('[data-btn-action="delete"]')) {
            const id_membresia = e.target.parentElement.dataset.idClient;
            eliminarMembresia(id_membresia);
        }
    })
}

async function cargarDatosMembresiaTabla() {
    const $tbodyMembresia = document.getElementById('tbody-membresia');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/membresia/`;
    try {
        const { data } = await axios.get(url);
        const membresias = data.data;
        $tbodyMembresia.innerHTML = '';
        membresias.forEach(membresia => {
            membresia.fecha_fin=membresia.fecha_fin.split("T", 1);
            let estado;
            if(membresia.estado=="0"){
                estado=`<span class="badge badge-danger">Inactivo</span>`;
            }else{
                estado=`<span class="badge badge-success">Activo</span> `;
            }
            if(membresia.notificado=="0"){
                membresia.notificado="No";
            }else{
                membresia.notificado="Si";
            }
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${membresia.id_membresia}</td>
            <td>${membresia.cedula}</td>
            <td>${membresia.fecha_fin}</td>
            <td>${estado}</td>
            <td>${membresia.notificado}</td>
            <td class="d-flex" data-id-client="${membresia.id_membresia}">
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
        $tbodyMembresia.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}

function registrarEditarMembresia() {
    const $formMembresiaModal = document.getElementById('formMembresiaModal');
    const $closeModal = document.getElementById('closeModal');
    $formMembresiaModal.addEventListener('submit', e => {
        e.preventDefault();

        const membresia = {
            id_membresia: $formMembresiaModal.inputID.value,
            cedula: $formMembresiaModal.inputCedula.value,
            fecha_fin: $formMembresiaModal.inputFecha.value,
            estado: $formMembresiaModal.inputEstado.value,
            notificado: $formMembresiaModal.inputNotificado.value
        }
        console.log(membresia)
        if (editarMembresia) {
            requestPutMembresia(membresia);

        } else {
            requestPostMembresia(membresia);
        }
        cargarDatosMembresiaTabla();
        $formMembresiaModal.reset();
        $closeModal.click();
        editarMembresia = false;
    })
}

async function requestPostMembresia(data) {
    try {
        const url = `${location.origin}/api/membresia/`;
        const { data: request } = await axios.post(url, data);
        mostrarAlerta('success', 'Membresia Registrada!', 'La membresia se registro correctamente')
    } catch (error) {
        if (error.response) {
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
            console.log(error.response.data);
        }
    }
}

async function cargarDatosFormEditar(id_membresia) {
    editarMembresia = true;
    const $formMembresiaModal = document.getElementById('formMembresiaModal');
    $formMembresiaModal.setAttribute('data-action-request', 'true');
    const url = `${location.origin}/api/membresia/${id_membresia}`;
    axios.get(url).then(resp => {

        console.log(resp.data);
    });
        
    try {
            const { data:request } = await axios.get(url);
        console.log(url);
        const membresia = request.data[0];
        
        $formMembresiaModal.inputID.value = membresia.id_membresia;
        $formMembresiaModal.inputCedula.value = membresia.cedula;
        $formMembresiaModal.inputFecha.value = membresia.fecha_fin;
        $formMembresiaModal.inputEstado.value = membresia.estado;
        $formMembresiaModal.inputNotificado.value = membresia.notificado;

    } catch (error) {
        console.log(error.response.data);
        mostrarAlerta('error', 'Opps...!', error.response.data.message)
    }

}

async function requestPutMembresia(data) {
    try {
        console.log('Editar');
        const url = `${location.origin}/api/membresia/`;
        const { data: request } = await axios.put(url, data);
        mostrarAlerta('success', 'Registro Actualizado!', 'El registro se registro correctamente')
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.request);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}

function eliminarMembresia(id_membresia) {
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
            const url = `${location.origin}/api/membresia/${id_membresia}`;
            axios.delete(url)
                .then(resp => {
                    cargarDatosMembresiaTabla();
                    Swal.fire(
                        'Borrado!',
                        'La membresía ha sido eliminada',
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