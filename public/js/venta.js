/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */
let editarVenta = false;
window.addEventListener('load', () => {
    console.log('Cargo la pagina');
    initVenta();
})


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initVenta() {
    tableContenido();
    cargarDatosVentaTabla();
    registrarEditarVenta();
}

function tableContenido() {
    const $contenedor = document.getElementById('contenedor-venta');
    $contenedor?.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="edit"]')) {
            const id_venta = e.target.parentElement.dataset.idVenta;
            cargarDatosFormEditar(id_venta);
        } else if (e.target.matches('[data-btn-action="delete"]')) {
            const id_venta = e.target.parentElement.dataset.idVenta;
            eliminarVenta(id_venta);
        }
    })
}

async function cargarDatosVentaTabla() {
    const $tbodyVenta = document.getElementById('tbody-venta');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/venta/`;
    try {
        const { data } = await axios.get(url);
        const ventas = data.data;
        $tbodyVenta.innerHTML = '';
        ventas.forEach(venta => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${venta.id_venta}</td>
            <td>${venta.descripcion}</td>
            <td>${venta.valor_cancelado}</td>
            <td>${venta.cantidad}</td>
            <td class="d-flex" data-id-venta="${venta.id_venta}">
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
        $tbodyVenta.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}
function registrarEditarVenta() {
    const $formVentaModal = document.getElementById('formVentaModal');
    const $closeModal = document.getElementById('closeModal');
    $formVentaModal.addEventListener('submit', e => {
        e.preventDefault();

        const venta = {
            id_venta: $formVentaModal.inputID.value,
            descripcion: $formVentaModal.inputDescripcion.value,
            valor_cancelado: $formVentaModal.inputValor.value,
            cantidad: $formVentaModal.inputCantidad.value
        }
        if (editarVenta) {
            requestPutVenta(venta);

        } else {
            requestPostVenta(venta);
        }
        cargarDatosVentaTabla();
        $formVentaModal.reset();
        $closeModal.click();
        editarVenta = false;
    })
}

async function requestPostVenta(data) {
    try {
        const url = `${location.origin}/api/venta/`;
        const { data: request } = await axios.post(url, data);
        mostrarAlerta('success', 'Venta Registrada!', 'La venta se registro correctamente')
    } catch (error) {
        if (error.response) {
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
            console.log(error.response.data);
        }
    }
}

async function cargarDatosFormEditar(id_venta) {
    editarVenta = true;
    const $formVentaModal = document.getElementById('formVentaModal');
    $formVentaModal.setAttribute('data-action-request', 'true');
    const url = `${location.origin}/api/venta/${id_venta}`;
    axios.get(url).then(resp => {

        console.log(resp.data);
    });
        
    try {
            const { data:request } = await axios.get(url);
        console.log(url);
        const venta = request.data[0];
        
        $formVentaModal.inputID.value = venta.id_venta;
        $formVentaModal.inputDescripcion.value = venta.descripcion;
        $formVentaModal.inputValor.value = venta.valor_cancelado;
        $formVentaModal.inputCantidad.value = venta.cantidad;

    } catch (error) {
        console.log(error.response.data);
        mostrarAlerta('error', 'Opps...!', error.response.data.message)
    }

}

async function requestPutVenta(data) {
    try {
        console.log('Editar');
        const url = `${location.origin}/api/venta/`;
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

function eliminarVenta(id_venta) {
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
            const url = `${location.origin}/api/venta/${id_venta}`;
            axios.delete(url)
                .then(resp => {
                    cargarDatosVentaTabla();
                    Swal.fire(
                        'Borrado!',
                        'La venta ha sido eliminada',
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