/* -------------------------------------------------------------------------- */
/*                           Iniciacion de funciones                          */
/* -------------------------------------------------------------------------- */

window.addEventListener('load', () => {
    initActu();
})


/* -------------------------------------------------------------------------- */
/*                              funciones propias                             */
/* -------------------------------------------------------------------------- */
function initActu() {
    actualizarCliente();
}

function actualizarCliente() {
    const $formActualizarModal = document.getElementById('formActualizarModal');
    
    $formActualizarModal.addEventListener('submit', e => {
        e.preventDefault();

        const cliente = {
            cedula: $formActualizarModal.inputCedula.value,
            nombres: $formActualizarModal.inputNombre.value,
            correo: $formActualizarModal.inputCorreo.value,
            password: $formActualizarModal.inputNewPwd.value,
            impedimentos: $formActualizarModal.inputFisicos.value,
            oldPassword: $formActualizarModal.inputOldPwd.value
        }
        console.log(cliente);
        requestPutActu(cliente);

    })
}

async function requestPutActu(data) {
    try {
        const url = `${location.origin}/api/clientes/`;
        const { data: request } = await axios.put(url, data);
        mostrarAlerta('success', 'Registro Actualizado!', 'El registro se registro correctamente', true)
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.request);
            mostrarAlerta('error', 'Opps...!', error.response.data.message)
        }
    }
}

function mostrarAlerta(icon = 'success', title = 'Exito', sms = '', reload =false) {
    Swal.fire({
        icon: icon,
        title: title,
        text: sms,
        showConfirmButton: true,
        timer: 4000
    }).then(()=> {
        if(reload){
            location.reload();
        }
    })
}