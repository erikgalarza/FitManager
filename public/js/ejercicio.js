/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */
let editarEjercicio = false;
window.addEventListener('load', () => {
    console.log('Cargo la pagina');
    initEjercicios();
})

cargarDatosEjercicios();

/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initEjercicios() {
    manejoClickBotonesEditarEliminarEJ();
    registrarEditarEjercicio();
}

async function cargarDatosEjercicios() {
    const $tbodyExercise = document.getElementById('tbody-exercise');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/ejercicios/`;
    try {
        const { data } = await axios.get(url);
        const ejercicios = data.data;
        $tbodyExercise.innerHTML = '';
        ejercicios.forEach(ejercicio => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${ejercicio.id_ejercicios}</td>
            <td>${ejercicio.nombre}</td>
            <td>${ejercicio.descripcion}</td>
            <td class='max-width-150'><a href='${ejercicio.imagen}' target='_blank'>url de imagen</a></td>
            <td class="d-flex" data-id-ejercicio="${ejercicio.id_ejercicios}">
                <button class="btn btn-danger mx-2" data-btn-action="delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn btn-primary" data-btn-action="edit" data-toggle="modal"
                data-target="#modalEjercicio">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </td>
            `;
            $fragment.appendChild(tr);
        });
        $tbodyExercise.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}


function manejoClickBotonesEditarEliminarEJ() {
    const $contenedor = document.getElementById('tbody-exercise');
    $contenedor?.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="edit"]')) {
            const id = e.target.parentElement.dataset.idEjercicio;
            cargarDatosFormEditarEjer(id);
        } else if (e.target.matches('[data-btn-action="delete"]')) {
            const id = e.target.parentElement.dataset.idEjercicio;
            eliminarEjercicio(id);
        }
    })
}

async function cargarDatosFormEditarEjer(id) {
    editarEjercicio = true;
    const $formEjercicio = document.getElementById('formEjercicioModal');
    const url = `${location.origin}/api/ejercicios/${id}`;
    try {
        const { data: request } = await axios.get(url);
        const ejercicio = request.data[0];
        $formEjercicio.inputID.value = ejercicio.id_ejercicios;
        $formEjercicio.inputNombre.value = ejercicio.nombre;
        $formEjercicio.inputUrl.value = ejercicio.imagen;
        $formEjercicio.inputDesc.value = ejercicio.descripcion;

    } catch (error) {
        console.log(error.response.data);
        mostrarAlerta('error', 'Opps...!', error.response.data.message)
    }
}

function registrarEditarEjercicio() {
    const $formEjercicio = document.getElementById('formEjercicioModal');

    $formEjercicio.addEventListener('submit', e => {
        e.preventDefault();
        const ejercicio = {
            nombre: $formEjercicio.inputNombre.value,
            imagen: $formEjercicio.inputUrl.value,
            descripcion: $formEjercicio.inputDesc.value,
        }
        
        if (editarEjercicio) {
            ejercicio.id = $formEjercicio.inputID.value,
            registerUpdateExersice('PUT', ejercicio);
        } else {
            registerUpdateExersice('POST', ejercicio);
        }
        editarEjercicio = false;
        $formEjercicio.reset();
        closeModal();
    })
}

async function registerUpdateExersice(method, ejercicio) {
    const config = {
        method: method,
        baseURL: 'http://localhost:3000/api',
        url: '/ejercicios',
        data: ejercicio,
        headers:{'Content-Type': 'application/json;charset=UTF-8'}
    }
    try {
        const { data: request } = await axios(config);
        console.log(request);
        if (method == "POST") {
            mostrarAlerta('success', 'Registro Agregado!', 'El registro se ingreso correctamente', true)

        } else {
            mostrarAlerta('success', 'Registro Actualizado!', 'El registro se actualizo correctamente', true)
        }
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.request);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}

function eliminarEjercicio(id) {
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
            const url = `${location.origin}/api/ejercicios/${id}`;
            axios.delete(url)
                .then(resp => {
                    Swal.fire(
                        'Borrado!',
                        'El ejercicio ha sido eliminado',
                        'success'
                    ).then(()=>location.reload());
                }).catch(err => {
                    mostrarAlerta('error', 'Oppss...', 'Hubo un error intentalo más tarde')
                })
        }
    }).catch(err => console.log(err))
}


function mostrarAlerta(icon = 'success', title = 'Exito', sms = '', reload = false) {
    Swal.fire({
        icon: icon,
        title: title,
        text: sms,
        showConfirmButton: true,
        timer: 4000
    }).then(() => {
        if (reload) {
            location.reload();
        }
    })
}