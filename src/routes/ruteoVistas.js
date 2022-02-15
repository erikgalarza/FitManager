const {
    Router,
    request,
    response
} = require('express');
const {
    checkRoleAuth
} = require('../middleware/roleAuth');
const {
    isAuthenticate
} = require('../middleware/session');
const axios = require('axios');
const router = Router();
const {
    verificarfecha
} = require('../../src/logic/IMembresiaDAO');
/* -------------------------------------------------------------------------- */
/*                       Ruteo para paginas del cliente                       */
/* -------------------------------------------------------------------------- */
router.get('/', isAuthenticate, (req, res) => {
    res.redirect('/dashboard')
})

router.get('/actualizar', isAuthenticate, checkRoleAuth(['cliente']), async (req, res) => {
    try {
        const {rol} = req.userLoged;
        const datos = req.userLoged;
        const request = await axios.get('http://localhost:3000/api/clientes');
        const personas = request.data.data;
        const datosCliente = personas.find(pers => pers.cedula == datos.id);
        if(datosCliente == undefined){
            res.redirect('/dashboard');
        }else{
            res.render('actualizarview',{title: "Actualizar Datos", datosCliente, rol})
        }

    } catch (error) {
        res.redirect('/dashboard');
    }

});


router.get('/dashboard', isAuthenticate, checkRoleAuth(['cliente']), async(req, res) => {

    const datos = req.userLoged;
    const {rol} = req.userLoged;
    const arr = datos.name.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
    }
    const nombre = arr.join(" ");
    const request = await axios.get('http://localhost:3000/api/membresia');
    const request2 = await axios.get('http://localhost:3000/api/progreso');
    const request3 = await axios.get('http://localhost:3000/api/asignacion_rutina');
    const membresias = request.data.data;
    const progresos = request2.data.data;
    const rutinas = request3.data.data;
    const membresiaCliente = membresias.find(membresia => membresia.cedula == datos.id);
    let progresoCliente = [];
    progresos.forEach(progreso => {
        if (progreso.cedula == datos.id) {
            progresoCliente.push(progreso);
        }
    });
    let rutinasCliente = [];
    let rutinasCliente2 = [];
    let colores = [];
    let lunes = "-";
    let martes = "-";
    let miercoles = "-";
    let jueves = "-";
    let viernes = "-";
    let sabado = "-";
    let colorlunes = "gradient-1";
    let colormartes = "gradient-1";
    let colormiercoles = "gradient-1";
    let colorjueves = "gradient-1";
    let colorviernes = "gradient-1";
    let colorsabado = "gradient-1";
    var today = new Date();
    var day = today.getDay();
    var daylist = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    var hoy = daylist[day];
    if (hoy == daylist[1]) {
        colorlunes = "gradient-4";
    }
    if (hoy == daylist[2]) {
        colormartes = "gradient-4";
    }
    if (hoy == daylist[3]) {
        colormiercoles = "gradient-4";
    }
    if (hoy == daylist[4]) {
        colorjueves = "gradient-4";
    }
    if (hoy == daylist[5]) {
        colorviernes = "gradient-4";
    }
    if (hoy == daylist[6]) {
        colorsabado = "gradient-4";
    }

    colores.push(colorlunes, colormartes, colormiercoles, colorjueves, colorviernes, colorsabado);
    rutinas.forEach(rutina => {
        if (rutina.cedula == datos.id) {
            rutinasCliente.push(rutina);
        }
    });
    rutinasCliente.forEach(rutina => {
        if (rutina.dia_asginado == daylist[1]) {
            lunes = rutina.id_rutina;
        }
        if (rutina.dia_asginado == daylist[2]) {
            martes = rutina.id_rutina;
        }
        if (rutina.dia_asginado == daylist[3]) {
            miercoles = rutina.id_rutina;
        }
        if (rutina.dia_asginado == daylist[4]) {
            jueves = rutina.id_rutina;
        }
        if (rutina.dia_asginado == daylist[5]) {
            viernes = rutina.id_rutina;
        }
        if (rutina.dia_asginado == daylist[6]) {
            sabado = rutina.id_rutina;
        }
    });
    rutinasCliente2.push(lunes,martes,miercoles,jueves,viernes,sabado);
    let lastProgreso= progresoCliente[progresoCliente.length-1];
    if(membresiaCliente == undefined){
        res.redirect('login/logout');
    }else{
        membresiaCliente.fecha_fin=membresiaCliente.fecha_fin.split("T", 1);
        if(progresoCliente.length==0){
            lastProgreso={
               peso: "- ",
                altura: "- ",
                imc: "- "
            }
            progresoCliente.push(lastProgreso);
        }
        res.render('dashboard', { title: 'Dash', datos, nombre, membresiaCliente, lastProgreso, rutinasCliente2, colores, rol });
    }

});

router.get('/pago-cliente', isAuthenticate, checkRoleAuth(['cliente']), async (req, res) => {
    const datos = req.userLoged;
    const {rol} = req.userLoged;
    const request = await axios.get('http://localhost:3000/api/pago');
    const pagos = request.data.data;
    const pagosCliente = pagos.filter(pago => pago.cedula_cliente == datos.id);
    //const pag = JSON.parse(pagos)
    //console.log(pagos);
    // const pagosCliente = pagos.filter(pago => pago.cedula_cliente == datos.id);
    pagosCliente.forEach(p => {
        p.fecha_pago=p.fecha_pago.split("T", 1);
    });
    if (pagosCliente == undefined) {
        res.redirect('/dashboard')
    } else {
        res.render('pago-cliente', {
            title: 'pagos',
            pagosCliente,
            pagos,
            rol
        })
    }
});

router.get('/cliente-rutina', isAuthenticate, checkRoleAuth(['cliente']), async (req, res) => {
    try {
        const datos = req.userLoged;
        const { rol } = req.userLoged;
        const request = await axios.get(`http://localhost:3000/api/asignacion_rutina/${datos.id}`);
        const rutinasAsignadas = request.data.data;
        const rutinas = [];
        for (const rut of rutinasAsignadas) {
            const request2 = await axios.get(`http://localhost:3000/api/rutina/${rut.id_rutina}`);
            const rutinaAux = request2.data.data[0];
            rutinaAux.dia = rut.dia_asginado;
            rutinas.push(rutinaAux);
        }
        console.log(rutinas);
        //console.log(rutinas);
        res.render('cliente-rutina', {
            title: 'rutinas',
            rutinas,
            rol
        })
    } catch (error) {
        res.render('cliente-rutina', {
            title: 'rutinas',
            rutinas: [],
            rol: 'cliente'
        })
    }
});




/* -------------------------------------------------------------------------- */
/*                        Ruteo para paginas del Admin                        */
/* -------------------------------------------------------------------------- */

router.get('/inicio-admin', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    const {rol} = req.userLoged;
    res.render('inicio-admin', {
        title: "Inicio",rol
    });
});
router.get('/admin-admin', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    const { rol } = req.userLoged;
    res.render('admin-admin', {
        title: "Admin Admin", rol
    });
});

router.get('/admin-cliente', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    const { rol } = req.userLoged;
    res.render('admin-cliente', { rol });
});

router.get('/admin-ejercicios', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    const { rol } = req.userLoged;
    res.render('admin-ejercicios', { rol });
});

router.get('/admin-membresia', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    verificarfecha();
    const { rol } = req.userLoged;
    res.render('membresiaview', { title: "Membresías", rol });
});

router.get('/admin-venta', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    const { rol } = req.userLoged;
    res.render('ventaview', {
        title: "Ventas", rol
    })
});

router.get('/admin-pago', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    const { rol } = req.userLoged;
    res.render('pagoview', {
        title: "Pagos", rol
    })
});

router.get('/admin-rutina', isAuthenticate, checkRoleAuth(['admin']), async (req, res) => {
    const { rol } = req.userLoged;
    const request = await axios.get('http://localhost:3000/api/ejercicios');
    const ejercicios = request.data.data;

    res.render('rutinaview', {
        title: "Rutinas",
        ejercicios,
        rol
    })
});

router.get('/admin-progreso', isAuthenticate, checkRoleAuth(['admin']), (req, res) => {
    const { rol } = req.userLoged;
    res.render('admin-progreso', {
        title: "Progreso",
        rol
    })
});

router.get('/admin-asignar',isAuthenticate,checkRoleAuth(['admin']), async (req, res) =>{
    try {
        const {rol} = req.userLoged;
        const request = await axios.get('http://localhost:3000/api/rutina');
        const rutina = request.data.data;
    
        const request1 = await axios.get('http://localhost:3000/api/clientes');
        const cliente = request1.data.data;
    
        res.render('admin-asignar',{title: "Asignar Rutina", rutina, cliente, rol})
    } catch (error) {
        
        res.render('admin-asignar',{title: "Asignar Rutina", rutina:[], cliente:[], rol:'admin'})
    }

});


module.exports = router;
