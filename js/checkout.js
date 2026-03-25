
// Hola Fran, gracias por enviar tu pre entrega 2 , en general muy buen avance. La entrega cumple con los requisitos de la consigna al integrar JavaScript con HTML mediante manipulación del DOM y uso de eventos. Los productos se renderizan dinámicamente en la página, se capturan eventos en los botones para agregar o eliminar productos del carrito y se actualiza el contenido del carrito directamente en la interfaz. También se utiliza un array para almacenar los productos seleccionados y localStorage para guardar la información y recuperarla al recargar la página. El flujo de entrada, proceso y salida es claro y las funciones están separadas para tareas específicas como renderizar productos, actualizar el carrito y calcular el total. Para alcanzar un nivel óptimo, sería recomendable mejorar algunos detalles de organización del código, por ejemplo manejar todos los eventos con addEventListener en lugar de mezclarlo con onclick, y mantener un criterio más uniforme en la manipulación del DOM. También podría agregarse un manejo de cantidades en el carrito en lugar de repetir productos iguales en el array

// FALTAN AGREGAR LIBRERIAS

const URL = "../db/data.json"

let carrito = []
let productosDisponibles = []


const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('contenedor-carrito')
const totalCarrito = document.getElementById('carrito-total')

const btnFinalizar = document.getElementById('btnFinalizar')

function obtenerProductos() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            productosDisponibles = data
            
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                title: "ERROR",
                text: "NO SE PUDIERON CARGAR LOS PRODUCTOS"

            });
        })
        .finally(() => console.log("ha terminado la peticion"))
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
        texto.innerText = ` ${producto.cantidad} - ${producto.nombre} - $${producto.precio} - $${producto.subtotal}`


      


        item.appendChild(texto)
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
    console.log(carritoGuardado)
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado)
        actualizarCarritoDOM();
    }
}






btnFinalizar.addEventListener('click', () => {
    if (carrito.length > 0) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Seguro que deseas continuar con la compra?",
            text: "Tu compra se procesara inmediatamente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, continuar",
            cancelButtonText: "No, cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) swalWithBootstrapButtons.fire({
                title: "Gracias",
                text: "Tu compra fue procesada",
                icon: "success"
            });
            else if (result.dismiss === Swal.DismissReason.cancel) swalWithBootstrapButtons.fire({
                title: "Cancelada",
                text: "Tu compra fue cancelada",
                icon: "error"
            });
        });
    }
})



window.onload = () => {
    obtenerProductos()
    cargarCarritoLocalStorage()
}