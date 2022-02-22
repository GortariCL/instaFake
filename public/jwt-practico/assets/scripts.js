// 1.Darles ids o nombres para identificar los elementos del formulario que
// necesitamos manipulaar
// jwt-email - jwt-password - jwt-formulario


//2. Crear el evento submit del formulario
//3.En el evento submit obtener los valores de email y password ingresados

$('#jwt-formulario').submit(async (e) => {
    e.preventDefault();

    const email = document.getElementById('jwt-email').value;
    const password = document.getElementById('jwt-password').value; 

    const JWT = await postData(email, password);
    getPosts(JWT);
    //llenadoTabla(resultado, "jwt-tabla-post");
    //toggleFormularioTabla('jwt-div-form', 'jwt-tabla-div');
});

//4. Crear un llamado al endpoint de login http://localhost:3000/api/login

const postData = async (emailIng, passwordIng) =>{
    try{
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({email: emailIng, password: passwordIng})
        });
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);
    }catch(err){
        console.log(`Error: ${err}`);
    };
};

/*
// -- Usar JWT para obtener datos de la API
1. Crear identificadores para manipular el html de la tabla
2. Crear una funcion que revisa el JWT y haga el llamado a la API de post
3. Completar la tabla con los datos que vienen de la API
4. Ocultar el formulario y mostrar la tabla
*/

//Codificar solucion según los paseos de las tareas identificados:
//1. Crear identificadores para manipular el html de la tabla
//jwt-tabla-div - jwt-tabla-post

//2. Crear una funcion que revisa el JWT y haga el llamado a la API de post
const getPosts = async (jwt) => {
    try{
        const response = await fetch('http://localhost:3000/api/posts',{
        method: 'GET',
        headers: {
            Authorization: `Bearer ${jwt}`
        }
        })
        const { data } = await response.json();
        if(data){
            toggleFormularioTabla('jwt-div-form', 'jwt-tabla-div');
            llenadoTabla(data, "jwt-tabla-post");
        }
        // return data;
    }catch(err){
        console.log(`Error: ${err}`);
    };
};

//3. Completar la tabla con los datos que vienen de la API
const llenadoTabla = (datos, tabla) => {
    let filas = "";
    $.each(datos, (indice, elemento) => {
        //console.log(elemento);
        //console.log(elemento.title);
        filas += `<tr>
            <td> ${elemento.title}</td>
            <td> ${elemento.body}</td>
            </tr>`;
    });
    $(`#${tabla} tbody`).append(filas);
};

//4. Ocultar el formulario y mostrar la tabla

const toggleFormularioTabla = (formulario, tabla) => {
    $(`#${formulario}`).toggle();
    $(`#${tabla}`).toggle();
};

/* 
Persistir JWT
Para cumplir el objetivo, utilizaremos LocalStorage

Identificar las pequeñas tareas que hay que realizar:

1. Guardar el JWT, luego de hacer el login en localStorage
2. Al momento de cargar nuestra página revisar si existe un  JWT,
de existir debemos mostrar la tabla y ocultar el formulario.
3. Controlar la vigencia del token, es decir, mostrar el formulario
*/

/*
Para añadir un valor en el localStorage se utiliza la siguiente istrucción:
localStorage.setItem('llave-para-identificar', 'valor-guardado');

Y para acceder al valor guardado del localStorage se utiliza la siguiente instrucción:

localStorage.getItem('llave-para-identificar');
*/

//1. Guardar el JWT, luego de hacer el login en el localStorage.
//localStorage.setItem('jwt-token', token);

const inicio = (async () => {
    const token = localStorage.getItem('jwt-token');
    if(token){
        //const resultado = await  getPosts(token);
        getPosts(token);
    }
})();