
/* -------------------------------------------------------------------------- */
let editarPago = false;
window.addEventListener('load', () => {
    console.log('Cargo la pagina');
    initPago();
})


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initPago() {
    tableContenido();
    cargarDatosPagoTabla();
    registrarEditarPago();
    cargarMembresias();
}

function cargarMembresias() {
    const inputMembresia = document.getElementById('inputMembresia');
    const inputCedula = document.getElementById('inputCedula');
    const fragment = document.createDocumentFragment();

    inputCedula.addEventListener('blur', async () => {
        try {
            const { data: request } = await axios.get(`http://localhost:3000/api/membresia2/${inputCedula.value}`);
            const membresias = request.data;
            inputMembresia.innerHTML = '';

            const opDefault = document.createElement('OPTION');
            opDefault.setAttribute('selected', 'true');
            opDefault.setAttribute('disabled', 'true');
            opDefault.textContent = 'Seleccionar Membresia';
            fragment.appendChild(opDefault)

            membresias.forEach(membresia => {
                const op = document.createElement('OPTION');
                op.value = membresia.id_membresia;
                op.text = membresia.id_membresia;
                fragment.appendChild(op);
                console.log(op);
            });
            console.log(fragment);
            inputMembresia.appendChild(fragment);
            console.log(inputMembresia);
        } catch (error) {
            console.error(error);
        }
    });
}

function tableContenido() {
    const $contenedor = document.getElementById('tbody-pago');
    $contenedor?.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="edit"]')) {
            const id_pago = e.target.parentElement.dataset.idPago;
            console.log(id_pago);
            cargarDatosFormEditar(id_pago);
        } else if (e.target.matches('[data-btn-action="delete"]')) {
            const id_pago = e.target.parentElement.dataset.idPago;
            eliminarPago(id_pago);
        }
    })
}

async function cargarDatosPagoTabla() {
    const $tbodyPago = document.getElementById('tbody-pago');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/pago/`;
    try {
        const { data } = await axios.get(url);
        const pagos = data.data;
        $tbodyPago.innerHTML = '';
        pagos.forEach(pago => {
            pago.fecha_pago = pago.fecha_pago.split("T", 1);
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${pago.id_pago}</td>
            <td>${pago.cedula_cliente}</td>
            <td>${pago.valor_cancelado}</td>
            <td>${pago.id_membresia}</td>
            <td>${pago.fecha_pago}</td>
            <td class="d-flex" data-id-pago="${pago.id_pago}">
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
        $tbodyPago.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}

function registrarEditarPago() {
    const $formPagoModal = document.getElementById('formPagoModal');
    const $closeModal = document.getElementById('closeModal');
    $formPagoModal.addEventListener('submit', e => {
        e.preventDefault();

        const pago = {
            id_pago: $formPagoModal.inputPago.value,
            cedula_cliente: $formPagoModal.inputCedula.value,
            valor_cancelado: $formPagoModal.inputValor.value,
            id_membresia: $formPagoModal.inputMembresia.value,
            fecha_pago: $formPagoModal.inputFecha.value
        }
        console.log(pago)
        if (editarPago) {
            requestPutPago(pago);

        } else {
            requestPostPago(pago);
        }
        cargarDatosPagoTabla();
        $formPagoModal.reset();
        $closeModal.click();
        editarPago = false;
    })
}

async function requestPostPago(data) {
    try {
        const url = `${location.origin}/api/pago/`;
        const { data: request } = await axios.post(url, data);
        mostrarAlerta('success', 'Pago Registrado!', 'La pago se registro correctamente')
    } catch (error) {
        if (error.response) {
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
            console.log(error.response.data);
        }
    }
}

async function cargarDatosFormEditar(id_pago) {
    editarPago = true;
    const $formPagoModal = document.getElementById('formPagoModal');
    $formPagoModal.setAttribute('data-action-request', 'true');
    const url = `${location.origin}/api/pago/${id_pago}`;
    console.log(url);
    axios.get(url).then(resp => {
        console.log(resp.data);

    });

    try {
        const { data: request } = await axios.get(url);
        const pago = request.data[0];
        console.log(pago);
        $formPagoModal.inputPago.value = pago.id_pago;
        $formPagoModal.inputCedula.value = pago.cedula_cliente;
        $formPagoModal.inputValor.value = pago.valor_cancelado;
        $formPagoModal.inputMembresia.value = pago.id_membresia;
        $formPagoModal.inputFecha.value = pago.fecha_pago;

    } catch (error) {
        console.log(error.response.data);
        mostrarAlerta('error', 'Opps...!', error.response.data.message)
    }

}

async function requestPutPago(data) {
    try {
        console.log('Editar');
        const url = `${location.origin}/api/pago/`;
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

function eliminarPago(id_pago) {
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
            const url = `${location.origin}/api/pago/${id_pago}`;
            axios.delete(url)
                .then(resp => {
                    cargarDatosPagoTabla();
                    Swal.fire(
                        'Borrado!',
                        'La pago ha sido eliminada',
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