/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */

window.addEventListener('load', () => {
    initAsig();
})

/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initAsig() {
    tableContenido();
    cargarDatosAsigTabla();
    registrarPago();
}


function tableContenido() {
    const $contenedor = document.getElementById('tbody-asignar');
    $contenedor?.addEventListener('click', e => {
        
        if (e.target.matches('[data-btn-action="delete"]')) {
            const cedula = e.target.parentElement.dataset.idCedula;
            const ced = e.target.parentElement.dataset.idRutina;
            eliminarAsig(cedula, ced);
        }
    })
}

async function cargarDatosAsigTabla() {
    const $tbodyAsig = document.getElementById('tbody-asignar');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/asignacion_rutina/`;
    try {
        const { data } = await axios.get(url);
        const asignar = data.data;
        $tbodyAsig.innerHTML = '';
        console.log(asignar)
        asignar.forEach(asig => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${asig.cedula}</td>
            <td>${asig.id_rutina}</td>
            <td>${asig.dia_asginado}</td>
            <td class="d-flex" data-id-cedula="${asig.cedula}"  data-id-rutina="${asig.id_rutina}" >
            <button class="btn btn-danger mx-2" data-btn-action="delete">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
            `;
            $fragment.appendChild(tr);
        });
        $tbodyAsig.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}

function registrarPago() {
    const $formAsignarModal = document.getElementById('formAsignarModal');
    const $closeModal = document.getElementById('closeModal');
    $formAsignarModal.addEventListener('submit', e => {
        e.preventDefault();

        const asi = {
            cedula: $formAsignarModal.inputCedula.value,
            id_rutina: $formAsignarModal.inputRuti.value,
            dia_asginado: $formAsignarModal.inputDia.value
        }
        requestPostAsig(asi);
        cargarDatosAsigTabla();
        $formAsignarModal.reset();
        $closeModal.click();
    })
}

async function requestPostAsig(data) {
    try {
        const url = `${location.origin}/api/asignacion_rutina/`;
        const { data: request } = await axios.post(url, data);
        mostrarAlerta('success', 'Asignación Registrada!', 'La Asignación se registro correctamente')
    } catch (error) {
        if (error.response) {
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
            console.log(error.response.data);
        }
    }
}


function eliminarAsig(cedula, id_rutina) {
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
            console.log(id_rutina);
            const url = `${location.origin}/api/asignacion_rutina/${cedula}/${id_rutina}`;
            axios.delete(url)
                .then(resp => {
                    cargarDatosAsigTabla();
                    Swal.fire(
                        'Borrado!',
                        'La Asignación ha sido eliminada',
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