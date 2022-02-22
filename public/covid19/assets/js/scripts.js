$(document).ready(function () {

//2. Consumir la API http://localhost:3000/api/total con JavaScript o jQuery.
    $.ajax({
        url: 'http://localhost:3000/api/total',
        success: (resp) => {
            //console.log(resp.data);
            let data = resp.data;
            let casosConfirmados = [];
            let casosActivos = [];
            let casosFallecidos = [];
            let casosRecuperados = [];

            let filas = "";

//3. Desplegar la información de la API en un gráfico de barra que debe mostrar sólo los
//países con más de 10000 casos activos.

            let confirmados = data.filter(e => {
                return e.confirmed >10000;
            });

            $.each(confirmados, (i, e) => {
                let activos = 
                {
                    label: e.location,
                    y: e.active,
                    color: "#fa6485"
                }
                casosActivos.push(activos);

                let confirmados =
                {
                    label: e.location,
                    y: e.confirmed,
                    color:"#fdcc58"
                }
                casosConfirmados.push(confirmados);

                let fallecidos =
                {
                    label: e.location,
                    y: e.deaths,
                    color:"#cbcccf"
                }
                casosFallecidos.push(fallecidos);

                let recuperados =
                {
                    label: e.location,
                    y: e.recovered,
                    color:"#4ac0be"
                }
                casosRecuperados.push(recuperados);
            });
//4. Desplegar toda la información de la API en una tabla.
            $.each(data, (i, e) => {
                filas += `<tr>
                <td class="fw-bold"> ${e.location}</td>
                <td class="fw-bold"> ${e.active}</td>
                <td class="fw-bold"> ${e.confirmed}</td>
                <td class="fw-bold"> ${e.deaths}</td>
                <td class="fw-bold"> ${e.recovered}</td>
                <td><a id="modal-${i}" class="text-decoration-none" href="#" data-bs-toggle="modal" 
                data-bs-target="#exampleModal">Ver detalles</a></td>
                </tr>`
            });
            $(`#jwt-tabla-post tbody`).append(filas);

            //Integración CanvasJS - Grafico de barras

            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    itemclick: toggleDataSeries,
                },
                data: [{
                    type: "column",
                    name: "Casos Activos",
                    legendText: "Casos Activos",
                    showInLegend: true,
                    legendMarkerColor: "#fa6485",
                    dataPoints: casosActivos
                },
                {
                    type: "column",
                    name: "Casos Confirmados",
                    legendText: "Casos Confirmados",
                    showInLegend: true,
                    legendMarkerColor: "#fdcc58",
                    dataPoints: casosConfirmados
                },
                {
                    type: "column",
                    name: "Casos Fallecidos",
                    legendText: "Casos Fallecidos",
                    showInLegend: true,
                    legendMarkerColor: "#cbcccf",
                    dataPoints: casosFallecidos
                },
                {
                    type: "column",
                    name: "Casos Recuperados",
                    legendText: "Casos Recuperados",
                    showInLegend: true,
                    legendMarkerColor: "#4ac0be",
                    dataPoints: casosRecuperados
                },
                ]
            });
            chart.render();

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else {
                    e.dataSeries.visible = true;
                }
                chart.render();
            }

// 5. Cada fila de la tabla debe incluir un link que diga "ver detalle", al hacer click levante
// un modal y muestre los casos activos, muertos, recuperados y confirmados en un
// gráfico, para obtener esta información debes llamar a la API
// http://localhost:3000/api/countries/{country} al momento de levantar el modal.

            $.each(data,(i,e) =>{
                $(`#modal-${i}`).on('click', () => {
                    $.ajax({
                        url: `http://localhost:3000/api/countries/${e.location}`,
                        success: () => {

                            let detallePie = [
                                {
                                    y: e.active,
                                    label: "Casos Activos",
                                    color: "#fa6485"
                                },
                                {
                                    y: e.confirmed,
                                    label: "Casos Confirmados",
                                    color:"#fdcc58"
                                },
                                {
                                    y: e.deaths,
                                    label: "Casos Fallecidos",
                                    color:"#cbcccf"
                                },
                                {
                                    y: e.recovered,
                                    label: "Casos Recuperados",
                                    color:"#4ac0be"
                                },
                            ];
                            //CANVAS JS PIE
                            var chart = new CanvasJS.Chart("chartContainer2", {
                                animationEnabled: true,
                                legend: {
                                    cursor: "pointer",
                                    verticalAlign: "top",
                                    itemclick: toggleDataSeries,
                                },
                                title: {
                                    text: e.location
                                },
                                data: [{
                                    type: "pie",
                                    startAngle: 240,
                                    indexLabel: "{label} {y}",
                                    showInLegend: "true",
		                            legendText: "{label}",
                                    dataPoints: detallePie
                                }]
                            });
                            chart.render();
                        },
                    });
                });
            }); 
        },
        error: function (err) {
            console.log(`Error: ${err}`);
        }
    });
});