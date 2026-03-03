
const productosDisponibles = [
    { id: 1, nombre: "Escobas", precio: 7000 },

    { id: 2, nombre: "Guantes", precio: 5300 },

    { id: 3, nombre: "Microfibras", precio: 2800 },

    { id: 4, nombre: "Regadera", precio: 3700 },

    { id: 5, nombre: "Rejilla", precio: 6000 }
]

let carrito = []


const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('contenedor-carrito')
const totalCarrito = document.getElementById('carrito-total')

const btnFinalizar = document.getElementsByClassName('btn-comprar')[0]
const btnVaciar = document.getElementsByClassName('btn-secundario')[0]

function renderizarProductos(lista) {
    contenedorProductos.innerHTML = ''

    lista.forEach((producto) => {
        const card = document.createElement('div')
        card.setAttribute('class', 'producto-card') 
        
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button class="btn-agregar" id="${producto.id}">Agregar</button>
        `;
        contenedorProductos.appendChild(card)
    })

    const botonesAgregar = document.getElementsByClassName('btn-agregar')

    for (const boton of botonesAgregar) {
        boton.onclick = (evento) => {
            const idProductoSeleccionado = evento.target.id
            agregarAlCarrito(idProductoSeleccionado)
        }
    }
}


function agregarAlCarrito(idProducto) {
    const productoElegido = productosDisponibles.find((p) => p.id == idProducto)
    
    if (productoElegido) {
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
        
        const texto = document.createElement('span')
        texto.innerText = `${producto.nombre} - $${producto.precio}`
        
        const btnEliminar = document.createElement('button')
        btnEliminar.innerText = "X"
        
        
        btnEliminar.setAttribute('class', 'btn-eliminar')
        
        btnEliminar.onclick = () => {
            eliminarDelCarrito(producto.id)
        }

        item.appendChild(texto)
        item.appendChild(btnEliminar)
        contenedorCarrito.appendChild(item)
    })

    const totalFinal = calcularTotal()
    totalCarrito.innerHTML = `<p>Total: $${totalFinal}</p>`
}

function calcularTotal() {
    let totalAcumulado = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0)
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



btnVaciar.onclick = () => {
    carrito = []
    localStorage.removeItem('carritoDetercop')
    actualizarCarritoDOM()
}

btnFinalizar.onclick = () => {
    if (carrito.length > 0) {
        carrito = []
        localStorage.removeItem('carritoDetercop')
        actualizarCarritoDOM()
    }
}

window.onload = () => {
    renderizarProductos(productosDisponibles)
    cargarCarritoLocalStorage()
}