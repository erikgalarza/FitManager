/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */
window.addEventListener('load', () => {
    initProgreso();
})


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initProgreso() {
    manejoClickBotonEliminarProgreso();
    cargarDatosProgresoTabla();
    registrarProgreso();
}

function manejoClickBotonEliminarProgreso() {
    const $contenedor = document.getElementById('contenedor-clientes');
    $contenedor?.addEventListener('click', e => {
     if (e.target.matches('[data-btn-action="delete"]')) {
            const id = e.target.parentElement.dataset.idClient;
            eliminarProgreso(id);
        }
    })
}

async function cargarDatosProgresoTabla() {
    const $tbodyClient = document.getElementById('tbody-client');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/progreso/`;
    try {
        const { data } = await axios.get(url);
        const progresos = data.data;
        $tbodyClient.innerHTML = '';
        progresos.forEach(progreso => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${progreso.id_progeso}</td>
            <td>${progreso.cedula}</td>
            <td>${progreso.peso}</td>
            <td>${progreso.altura}</td>
            <td>${progreso.imc}</td>
            <td class="d-flex" data-id-client="${progreso.id_progeso}">
                <button class="btn btn-danger mx-2" data-btn-action="delete">
                    <i class="fas fa-trash-alt"></i>
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

function registrarProgreso() {
    const $formClienteModal = document.getElementById('formClienteModal');
    const $closeModal = document.getElementById('closeModal');

    $formClienteModal.addEventListener('submit', e => {
        e.preventDefault();

        const progreso = {
            id: $formClienteModal.inputID.value,
            cedula: $formClienteModal.inputCedula.value,
            peso: $formClienteModal.inputPeso.value,
            altura: $formClienteModal.inputAltura.value,
            //imc: $formClienteModal.inputIMC.value
        }

        requestPostProgreso(progreso);

        cargarDatosProgresoTabla();

        $formClienteModal.reset();
        $closeModal.click();
    })
}
async function requestPostProgreso(data) {
    try {
        const url = `${location.origin}/api/progreso/`;
        const { data: request } = await axios.post(url, data);
        mostrarAlerta('success', 'Progreso Registrado!', 'El Progreso del cliente se registro correctamente')
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}

function eliminarProgreso(id_progeso) {
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
            const url = `${location.origin}/api/progreso/${id_progeso}`;
            axios.delete(url)
                .then(resp => {
                    cargarDatosProgresoTabla();
                    Swal.fire(
                        'Borrado!',
                        'El progreso del cliente ha sido eliminado',
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