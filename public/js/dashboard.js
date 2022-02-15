
window.addEventListener('load', () => {
    initVisualizar();
})
function initVisualizar() {
    cargarDatosProgreso();
}
/*

*/
async function cargarDatosProgreso() {
    const $barras = document.getElementById('barras');
    const $id = document.getElementById('id_mio');
    const url = `${location.origin}/api/progreso/`;
   
    try {
        const { data } = await axios.get(url);
        
        const progresos = data.data;
        let progresoCliente= [];
         progresos.forEach(progreso => {
        if(progreso.cedula == $id.textContent){
            progresoCliente.push(progreso);
        }
    });
        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: $barras,
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: progresoCliente,
            // The name of the data record attribute that contains x-values.
            xkey: 'id_progeso',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['peso','imc'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Peso','IMC'],
            lineColors: ['#FF9900', '#9097c4'],
            hideHover: true
          });
    } catch (err) {
        console.error(err);
    }
}