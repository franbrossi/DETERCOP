


const URL = "/db/data.json"

let carrito = []
let productosDisponibles = []


const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('contenedor-carrito')
const totalCarrito = document.getElementById('carrito-total')

const btnVaciar = document.getElementsByClassName('btn-secundario')[0]
const btnFinalizar = document.getElementById('btn-finalizar')

// obtengo los productos desde mi api simulada 

function obtenerProductos() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            productosDisponibles = data
            renderizarProductos(productosDisponibles)
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                title: "ERROR",
                text: "NO SE PUDIERON CARGAR LOS PRODUCTOS"

            });
        })
        .finally()  
}

// funcion para que se renderizen bien los productos 
function renderizarProductos(lista) {
    contenedorProductos.innerHTML = ''

    lista.forEach((producto) => {
        const card = document.createElement('div')
        card.setAttribute('class', 'producto-card')

        card.innerHTML = `
            <img src="${producto.imagen}" alt= ${producto.nombre}" class= "img-producto">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button class="btn-agregar" id="${producto.id}">Agregar</button>
        `;
        contenedorProductos.appendChild(card)
    })

    const botonesAgregar = document.getElementsByClassName('btn-agregar')

    for (const boton of botonesAgregar) {
        boton.addEventListener('click', (evento) => {
            const idProductoSeleccionado = evento.target.id
            agregarAlCarrito(idProductoSeleccionado)
        })
    }
}

// agrega al carrito haciendo un push y antes validando que el producto coincida con lo que esta en el array
function agregarAlCarrito(idProducto) {
    const productoElegido = productosDisponibles.find((p) => p.id == idProducto)
    const productoEnCarrito = carrito.find((c) => c.id == idProducto)
    if (productoEnCarrito) {
        agregarcantidad(idProducto)

    } else if (productoElegido) {

        productoElegido.cantidad = 1
        productoElegido.subtotal = productoElegido.precio
        carrito.push(productoElegido)
        actualizarCarritoDOM()

    }
}

// funcion para eliminar del carrito 

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter((p) => p.id !== idProducto)
    actualizarCarritoDOM()
}

// funcion para agregar varios productos del mismo tipo
function agregarcantidad(idProducto) {
    const productoEnCarrito = carrito.find((c) => c.id == idProducto)
    productoEnCarrito.cantidad++
    productoEnCarrito.subtotal = productoEnCarrito.precio * productoEnCarrito.cantidad
    actualizarCarritoDOM()
}

// funcion de restar la cantidad de productos de un mismo tipo con un contador

function restarcantidad(idProducto) {
    const productoEnCarrito = carrito.find((c) => c.id == idProducto)
    productoEnCarrito.cantidad--
    productoEnCarrito.subtotal = productoEnCarrito.precio * productoEnCarrito.cantidad
    actualizarCarritoDOM()
}

// funcion para ir actualizando ek carrito a medida que el usuario realice cambios y ademas guardandolo con localstorage
function actualizarCarritoDOM() {
    guardarCarritoLocalStorage()
    contenedorCarrito.innerHTML = ''

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>El carrito está vacío.</p>'
        totalCarrito.innerHTML = '<p>Total: $0</p>'
        return
    }

    carrito.forEach((producto) => {
        const item = document.createElement('div')
        item.setAttribute('class', 'cart-item')

        const inputsumarcantidad = document.createElement('button')
        const inputRestarCantidad = document.createElement('button')
        inputsumarcantidad.innerText = "+"
        inputRestarCantidad.innerText = "-"

        inputsumarcantidad.addEventListener('click', () => {
            agregarcantidad(producto.id)
        })



        inputRestarCantidad.addEventListener('click', () => {
            restarcantidad(producto.id)
        })



        const texto = document.createElement('span')
        texto.innerText = ` ${producto.cantidad} - ${producto.nombre} - $${producto.precio} - $${producto.subtotal}`


        const btnEliminar = document.createElement('button')
        btnEliminar.innerText = "X"


        btnEliminar.setAttribute('class', 'btn-eliminar')

        btnEliminar.addEventListener('click', () => {
            eliminarDelCarrito(producto.id)
        })



        item.appendChild(inputsumarcantidad)
        item.appendChild(inputRestarCantidad)
        item.appendChild(texto)
        item.appendChild(btnEliminar)
        contenedorCarrito.appendChild(item)
    })

    const totalFinal = calcularTotal()
    totalCarrito.innerHTML = `<p>Total: $${totalFinal}</p>`
}
// calcular el total de la compra
function calcularTotal() {
    let totalAcumulado = carrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0)
    return totalAcumulado
}

// guardamos el carrito en el localstorage
function guardarCarritoLocalStorage() {
    localStorage.setItem('carritoDetercop', JSON.stringify(carrito))
}
// carga el carrito si por accidente se cierra la pag y vuelve a cargar con los datos guardados 
function cargarCarritoLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoDetercop')
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado)
        actualizarCarritoDOM();
    }
}



btnVaciar.addEventListener('click', () => {
    carrito = []
    localStorage.removeItem('carritoDetercop')
    actualizarCarritoDOM()
})

btnFinalizar.addEventListener ('click', () => {
    
    if (carrito.length > 0) {
        window.location.href="pages/checkout.html"
        
    } else if (carrito.length < 1 ) {

        Swal.fire({
                icon: "error",
                title: "ERROR",
                text: "El carrito esta vacio por favor ingrese productos para continuar con la compra"

            });
        
    }
})





window.onload = () => {
    obtenerProductos()
    cargarCarritoLocalStorage()
}



