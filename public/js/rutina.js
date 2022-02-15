/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */

/* -------------------------------------------------------------------------- */
let isEditingRoutine = false;

window.addEventListener('load', () => {
    initRutina();
})
cargarDatosRutinaTabla();


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initRutina() {

    handleAddExercise();
    handleClickExersiceTable();

    handleSubmitFormModal();
    handleButtonsClearCloseModal();
    handleButtonsEditDeleteExercise();

}

function handleButtonsClearCloseModal(){
    const btnResetForm = document.getElementById('btnResetForm');
    const btnCloseModal = document.getElementById('btnCloseModal');

    btnResetForm?.addEventListener('click',()=>{
        limpiarFormCampos();
    })

    btnCloseModal?.addEventListener('click',()=>{
        limpiarFormCampos();
        closeModal();
    })
}



async function cargarDatosRutinaTabla() {
    const $tbodyRutina = document.getElementById('tbody-rutina');
    const $fragment = document.createDocumentFragment();
    const url = `${location.origin}/api/rutina/`;
    try {
        const { data } = await axios.get(url);
        const rutinas = data.data;
        $tbodyRutina.innerHTML = '';
        rutinas.forEach((rutina, index) => {
            const tr = document.createElement('TR');
            tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${rutina.nombre}</td>
            <td>${returnListaEjerciciosVista(rutina.ejercicios)}
            </td>
            <td class="d-flex" data-id-rutina="${rutina.id_rutina}">
                <button class="btn btn-danger mx-2" data-btn-action="delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn btn-primary" data-btn-action="edit" data-toggle="modal"
                data-target="#modalRutina">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </td>
            `;
            $fragment.appendChild(tr);
        });
        $tbodyRutina.appendChild($fragment);
    } catch (err) {
        console.error(err);
    }
}

function returnListaEjerciciosVista(ejercicios) {
    ejercicios = JSON.parse(ejercicios);
    let html = '<ul>';
    ejercicios.forEach(ejercicio => {
        html += `<li>${ejercicio.nombre} - ${ejercicio.repeticiones}</li>`
    })
    html += '</ul>';
    return html;
}

function handleButtonsEditDeleteExercise() {
    const $contenedor = document.getElementById('tbody-rutina');
    $contenedor?.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="edit"]')) {
            const id = e.target.parentElement.dataset.idRutina;
            cargarDatosFormEditarExersice(id);
        } else if (e.target.matches('[data-btn-action="delete"]')) {
            const id = e.target.parentElement.dataset.idRutina;
            eliminarRutina(id);
        }
    })
}

async function cargarDatosFormEditarExersice(id){
    isEditingRoutine = true;
    const formRutina = document.getElementById('formRutinaModal');
    const url = `${location.origin}/api/rutina/${id}`;
    try {
        const { data: request } = await axios.get(url);
        const rutina = request.data[0];

        formRutina.inputNombreRutina.value = rutina.nombre;
        formRutina.inputJsonEjerRutina.value = rutina.ejercicios;
        formRutina.inputIdRutina.value = rutina.id_rutina;

        cargarEjercicioTablaModal();

    } catch (error) {
        console.log(error.response.data);
        mostrarAlerta('error', 'Opps...!', error.response.data.message)
    }
}

function handleSubmitFormModal() {
    const formRutina = document.getElementById('formRutinaModal');
    formRutina.addEventListener('submit', e => {
        e.preventDefault();
        const newRutina = {
            ejercicios: formRutina.inputJsonEjerRutina.value,
            nombre: formRutina.inputNombreRutina.value,
        }

        if (newRutina.ejercicios == "") mostrarAlerta('warning', 'Advertencia', 'Debe registrar almenos un ejercicio');

        if (isEditingRoutine) {
            newRutina.id = formRutina.inputIdRutina.value;
            registerUpdateRoutine('put', newRutina);
        } else {
            registerUpdateRoutine('post', newRutina);
        }
        isEditingRoutine = false;
        limpiarFormCampos();
        closeModal();
    })
}

async function registerUpdateRoutine(method, rutina) {
    const config = {
        method: method,
        baseURL: 'http://localhost:3000/api',
        url: '/rutina',
        data: rutina,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    }
    try {
        const { data: request } = await axios(config);
        if (method == "POST") {
            mostrarAlerta('success', 'Registro Agregado!', 'El registro se ingreso correctamente', true)

        } else {
            mostrarAlerta('success', 'Registro Actualizado!', 'El registro se actualizo correctamente', true)
        }
    } catch (error) {
        isEditingRoutine = false;
        if (error.response) {
            console.log(error.response.data);
            console.log(error.request);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}

function eliminarRutina(id_rutina) {
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
            const url = `${location.origin}/api/rutina/${id_rutina}`;
            axios.delete(url)
                .then(resp => {
                    Swal.fire(
                        'Borrado!',
                        'La rutina ha sido eliminada',
                        'success'
                    ).then(()=>location.reload())
                }).catch(err => {
                    mostrarAlerta('error', 'Oppss...', 'Hubo un error intentalo más tarde')
                })
        }
    }).catch(err => console.log(err))

}

/* -------------------------------------------------------------------------- */
/*                   funciones agregar ejercicios en rutina                   */
/* -------------------------------------------------------------------------- */

function handleClickExersiceTable() {
    const tabla = document.getElementById('tbodyModalEjercicios');
    tabla.addEventListener('click', e => {
        if (e.target.matches('[data-btn-action="delete"]')) {
            const id = e.target.parentElement.dataset.idExersice;
            const ejercicios = getExersiceList();
            const newArray = ejercicios.filter(ele => ele.id_ejercicios != id);
            updateExerciseList(newArray);
        }
    })
}

function handleAddExercise() {
    const btnAddExercise = document.getElementById('btnAddExercise');
    const inputListExer = document.getElementById('inputExersiceList');
    const inputRepeat = document.getElementById('inputExersiceRepetitions');

    btnAddExercise.addEventListener('click', async () => {
        const idEjercicio = Number.parseInt(inputListExer.value);
        const repeticiones = Number.parseInt(inputRepeat.value);
        if (idEjercicio && repeticiones) {
            const url = `http://localhost:3000/api/ejercicios/${idEjercicio}`;
            const { data: request } = await axios.get(url);
            const ejercicio = request.data[0];
            ejercicio.repeticiones = repeticiones;

            inputListExer.selectedIndex = 0
            inputRepeat.value = 1;
            setExerciseList(ejercicio);
            cargarEjercicioTablaModal();
        } else {
            mostrarAlerta('warning', 'Advertencia', 'Debe elegir un ejercicio y un número de repetición válido');
        }
    })
}

function cargarEjercicioTablaModal() {
    const jsonExersice = getExersiceList();
    const tabla = document.getElementById('tbodyModalEjercicios');
    const fragment = document.createDocumentFragment();
    tabla.innerHTML = '';
    jsonExersice.forEach((ele, index) => {
        const tr = document.createElement('TR');
        tr.innerHTML =
            `<th>${index + 1}</th>
        <th>${ele.nombre}</th>
        <th>${ele.descripcion}</th>
        <th>${ele.repeticiones}</th>
        <th data-id-exersice="${ele.id_ejercicios}">
            <button type="button" class="btn btn-danger mx-2" data-btn-action="delete">
                <i class="fas fa-trash-alt"></i>
            </button>
        </th>
        `
        fragment.appendChild(tr);
    });
    tabla.appendChild(fragment);
}

function updateExerciseList(ejercicios) {
    try {
        const inputJson = document.getElementById('inputJsonEjerRutina');
        inputJson.value = JSON.stringify(ejercicios);
        cargarEjercicioTablaModal();
    } catch (error) {
        console.log(error)
    }
}
function setExerciseList(ejercicio) {
    try {
        const inputJson = document.getElementById('inputJsonEjerRutina');
        const json = getExersiceList();
        json.push(ejercicio);
        inputJson.value = JSON.stringify(json);
    } catch (error) {
        console.log(error)
    }
}
function getExersiceList() {
    try {
        const inputJson = document.getElementById('inputJsonEjerRutina');
        const jsonText = inputJson.value;
        const json = JSON.parse(jsonText);
        return json;
    } catch (error) {
        // console.log(error)
        return [];
    }
}

function limpiarFormCampos() {
    const tabla = document.getElementById('tbodyModalEjercicios');
    const formRutina = document.getElementById('formRutinaModal');
    formRutina.reset();
    formRutina.inputJsonEjerRutina.value = "";
    formRutina.inputIdRutina.value = "";
    tabla.innerHTML = '';
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