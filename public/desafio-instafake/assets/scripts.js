//1. Obtener el JWT a través del formulario de login entregado.
$('#jwt-formulario').submit(async (e) => {
    e.preventDefault();

    const email = document.getElementById('jwt-email').value;
    const password = document.getElementById('jwt-password').value;
    const errEmail = document.getElementById('errorMessageEmail');
    const errPass = document.getElementById('errorMessagePass');

    if (email == "" && password == "") {
        errEmail.innerHTML = 'Debe llenar el campo Email address';
        errPass.innerHTML = 'Debe llenar el campo Password';
    } else if (email == "") {
        errEmail.innerHTML = 'Debe llenar el campo Email address';
        errPass.innerHTML = '';
    } else if (password == "") {
        errPass.innerHTML = 'Debe llenar el campo Password';
        errEmail.innerHTML = '';
    } else {
        photosData(email, password);
        errEmail.innerHTML = '';
        errPass.innerHTML = '';
    }
});

//Se busca al usuario en DB, si existe coincidencia se crea y devuelve el token
const photosData = async (emailIng, passwordIng) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: emailIng,
                password: passwordIng
            })
        });
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);

        getPhotos(token);
    } catch (err) {
        localStorage.clear();
        console.log(`Error: ${err}`);
    };
};

//4. Con el JWT consumir la API http://localhost:3000/api/photos.
const getPhotos = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/photos', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const { data } = await response.json();
        //console.log(data);
        //6. Cargar el feed de fotos cuando exista el JWT.
        if (data) {
            mostrarPhotos(data);
            toggleFormularioDiv();
        }
    } catch (err) {
        localStorage.clear();
        console.log(`Error: ${err}`);
    };
};

// 5. Manipular el JSON de respuesta de la API anterior y manipular el DOM con
// JavaScript para mostrar las imágenes.

//funcion para mostrar imagenes
const mostrarPhotos = (datos) => {
    let imgPost = "";
    $.each(datos, (indice, photo) => {
        imgPost += `
        <div class="card d-block my-3 px-0 mx-0" style="border: dashed solid">
            <img class="card-img-top" src="${photo.download_url}" alt="image-post" style="margin-inline: auto">
            <div>
                <p class="card-text p-3">Author: ${photo.author}</p>
            </div>
        </div>
    `
    });
    $(`#show-photos`).append(imgPost);
}

//3. Al momento de recibir el JWT ocultar el formulario y mostrar el feed principal con las
//fotos.
const toggleFormularioDiv = () => {
    $('#jwt-div-form').toggle();
    $('#jwt-photos').toggle();
};

//2. Persistir el token utilizando localStorage.
(async () => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
        getPhotos(token);
    }
})();

// 8. Crear botón de logout que elimine el JWT almacenado y vuelva la aplicación a su
// estado inicial.
document.getElementById('logout').addEventListener('click', () => {
    localStorage.clear()
    location.reload()
});

//7. En la parte inferior de la página, crear un botón que al presionarlo traiga más fotos
// (http://localhost:3000/api/photos?page=x), que deben ser añadidas al listado
// existente.
// evento de btn para mostrar las siguientes páginas de imagenes
let page = 2;
document.getElementById('showMoreBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('jwt-token')
    if (page <= 10) {
        try {
            const response = await fetch(`http://localhost:3000/api/photos?page=${page}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            const { data } = await response.json()
            if (data) {
                let imgPost = "";
                $.each(data, (i, photo) => {
                    imgPost += `<div class="card d-block my-5 px-0 mx-0" style="border: dashed solid">
                                    <img class="card-img-top" src="${photo.download_url}" alt=" " style="margin-inline: auto;">
                                    <div>
                                       <p class="card-text p-3">Autor: ${photo.author}</p>
                                    </div>
                                </div>`
                });
                $(`#show-photos`).append(imgPost);
            }
        } catch (err) {
            localStorage.clear();
            console.error(`Error: ${err}`);
        }
        page++
        if (page == 11) {
            document.getElementById('show-photos').innerHTML = "No existen imagenes disponibles"
        }
    }
})