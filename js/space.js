
document.addEventListener('DOMContentLoaded', function () {
    let btnBuscar = document.getElementById('btnBuscar');
    let inputBuscar = document.getElementById('inputBuscar');
    let contenedor = document.getElementById('contenedor');

    // Función de búsqueda
    btnBuscar.addEventListener('click', function () {
        let busqueda = inputBuscar.value.trim();

        if (busqueda) {
            let url = `https://images-api.nasa.gov/search?q=${busqueda}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    mostrarResultados(data.collection.items);
                })
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                });
        }
    });

    // Función para mostrar resultados
    function mostrarResultados(items) {
        contenedor.innerHTML = ''; 

        if (items.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron resultados.</p>';
            return;
        }

        let fila = '<div class="row">'; 

        items.forEach(item => {
            let { title, description, date_created } = item.data[0];
            let imagen = item.links ? item.links[0].href : 'https://via.placeholder.com/150';

            // reducir el texto si es demasiado larga
            let descripcionCorta = description;
            let descripcionCompleta = descripcionCorta;
            if (descripcionCorta.length > 100) {
                descripcionCorta = descripcionCorta.slice(0, 100) + '...';
            }

            // Crear la tarjeta con Bootstrap
            let tarjeta = `
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <img src="${imagen}" class="card-img-top" alt="${title}">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${descripcionCorta}</p>
                            <button class="btn btn-outline-secondary ver-mas"> + </button>
                            <p class="d-none card-text descripcion-completa">${descripcionCompleta}</p>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><small class="text-body-secondary">Fecha: ${new Date(date_created).toLocaleDateString()}</small></li>
                        </ul>
                    </div>
                </div>
            `;

            fila += tarjeta;
        });

        fila += '</div>'; 
        contenedor.innerHTML = fila;

        // Agregar eventos a los botones "Seguir leyendo"
        document.querySelectorAll('.ver-mas').forEach((btn, index) => {
            btn.addEventListener('click', function () {
                let descripcionCompleta = btn.nextElementSibling;
                if (descripcionCompleta.classList.contains('d-none')) {
                    descripcionCompleta.classList.remove('d-none');
                    btn.textContent = ' - ';
                } else {
                    descripcionCompleta.classList.add('d-none');
                    btn.textContent = ' + ';
                }
            });
        });
    }
});
