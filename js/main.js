
// Hola Fran, gracias por enviar tu pre entrega 2 , en general muy buen avance. La entrega cumple con los requisitos de la consigna al integrar JavaScript con HTML mediante manipulación del DOM y uso de eventos. Los productos se renderizan dinámicamente en la página, se capturan eventos en los botones para agregar o eliminar productos del carrito y se actualiza el contenido del carrito directamente en la interfaz. También se utiliza un array para almacenar los productos seleccionados y localStorage para guardar la información y recuperarla al recargar la página. El flujo de entrada, proceso y salida es claro y las funciones están separadas para tareas específicas como renderizar productos, actualizar el carrito y calcular el total. Para alcanzar un nivel óptimo, sería recomendable mejorar algunos detalles de organización del código, por ejemplo manejar todos los eventos con addEventListener en lugar de mezclarlo con onclick, y mantener un criterio más uniforme en la manipulación del DOM. También podría agregarse un manejo de cantidades en el carrito en lugar de repetir productos iguales en el array

const URL = "./db/data.json"

let carrito = []
let productosDisponibles= []


const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('contenedor-carrito')
const totalCarrito = document.getElementById('carrito-total')

const btnFinalizar = document.getElementsByClassName('btn-comprar')[0]
const btnVaciar = document.getElementsByClassName('btn-secundario')[0]

function obtenerProductos() {
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        productosDisponibles = data
        renderizarProductos(productosDisponibles)
    })
    .catch(err => console.log("ha ocurrido un error", err))
    .finally(()=> console.log("ha terminado la peticion"))
}

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
        boton.addEventListener('click',(evento) => {
            const idProductoSeleccionado = evento.target.id
            agregarAlCarrito(idProductoSeleccionado)
        })
    }
}


function agregarAlCarrito(idProducto) {
    const productoElegido = productosDisponibles.find((p) => p.id == idProducto)
    const productoEnCarrito = carrito.find((c)=> c.id == idProducto)
    if(productoEnCarrito)  {
        agregarcantidad(idProducto)        
    
    } else if (productoElegido) {
       
        productoElegido.cantidad = 1
        productoElegido.subtotal = productoElegido.precio
        carrito.push(productoElegido)
        actualizarCarritoDOM()
        guardarCarritoLocalStorage()
    }
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter((p) => p.id !== idProducto)
    actualizarCarritoDOM()
    guardarCarritoLocalStorage() 
}


function agregarcantidad(idProducto) {
    const productoEnCarrito = carrito.find((c)=> c.id == idProducto)
    productoEnCarrito.cantidad++
    productoEnCarrito.subtotal = productoEnCarrito.precio * productoEnCarrito.cantidad
    actualizarCarritoDOM()
    guardarCarritoLocalStorage()
}

function restarcantidad(idProducto) {
    const productoEnCarrito = carrito.find((c)=> c.id == idProducto)
    productoEnCarrito.cantidad--
    productoEnCarrito.subtotal = productoEnCarrito.precio * productoEnCarrito.cantidad
    actualizarCarritoDOM()
    guardarCarritoLocalStorage()
}

function actualizarCarritoDOM() {
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

        inputsumarcantidad.addEventListener ('click',() =>{
           agregarcantidad(producto.id) 
        })
            
        
        
        inputRestarCantidad.addEventListener ('click',() =>{
            restarcantidad(producto.id) 
        })
           
        
        
        const texto = document.createElement('span')
        texto.innerText = ` ${producto.cantidad} - ${producto.nombre} - $${producto.precio} - $${producto.subtotal}`

        
        const btnEliminar = document.createElement('button')
        btnEliminar.innerText = "X"
        
        
        btnEliminar.setAttribute('class', 'btn-eliminar')
        
        btnEliminar.addEventListener ('click',() => {
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

function calcularTotal() {
    let totalAcumulado = carrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0)
    return totalAcumulado
}

function guardarCarritoLocalStorage() {
    localStorage.setItem('carritoDetercop', JSON.stringify(carrito))
}

function cargarCarritoLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoDetercop')
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado)
        actualizarCarritoDOM();
    }
}



btnVaciar.addEventListener ('click',()=>{
   carrito = []
    localStorage.removeItem('carritoDetercop')
    actualizarCarritoDOM() 
})
    


btnFinalizar.addEventListener ('click', () => {
    if (carrito.length > 0) {
        carrito = []
        localStorage.removeItem('carritoDetercop')
        actualizarCarritoDOM()
    }
})
   


window.onload = () => {
    obtenerProductos()
    cargarCarritoLocalStorage()
}