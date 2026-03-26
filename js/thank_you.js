let carrito = []
let orden = {}

const contenedorCarrito = document.getElementById('contenedor-carrito')
const totalCarrito = document.getElementById('carrito-total')

function cargarCarritoLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoDetercop')
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado)
        actualizarCarritoDOM();
    }
}

function calcularTotal() {
    let totalAcumulado = carrito.reduce((acumulador, producto) => acumulador + producto.subtotal, 0)
    return totalAcumulado
}

function actualizarCarritoDOM() {
    contenedorCarrito.innerHTML = ''

    carrito.forEach((producto) => {
        const item = document.createElement('div')
        item.setAttribute('class', 'cart-item')
        const texto = document.createElement('span')
        texto.innerText = ` ${producto.cantidad} - ${producto.nombre} - $${producto.precio} - $${producto.subtotal}`
        item.appendChild(texto)
        contenedorCarrito.appendChild(item)


    })

    const totalFinal = calcularTotal()
    totalCarrito.innerHTML = `<p>Total: $${totalFinal}</p>`
    

}


function cargarOrden() {
    const ordenGuardado = localStorage.getItem('ordenDetercop')
    if (ordenGuardado) {
        orden = JSON.parse(ordenGuardado)

        const datosOrden = document.getElementById('datosOrden')
        datosOrden.innerHTML = `<div class = "estilos-orden">Nombre: ${orden.name}</div>
                                <div>Apellido: ${orden.surname}</div>
                                <div>Email: ${orden.email}</div>
                                <div>Localidad: ${orden.localidad}</div>
                                <div>Provincia: ${orden.provincia}</div>
                                <div>Codigo postal: ${orden.codigoPostal}</div>`
                                

    }

}


window.onload = () => {

cargarOrden()
cargarCarritoLocalStorage()


}