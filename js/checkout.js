
const URL = "../db/data.json"

let carrito = []
let productosDisponibles = []


const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('contenedor-carrito')
const totalCarrito = document.getElementById('carrito-total')
const checkoutForm = document.getElementById('checkout-form')

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
        .finally() 
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

        if (checkoutForm.checkValidity()) {

            swalWithBootstrapButtons.fire({
                title: "Seguro que deseas continuar con la compra?",
                text: "Tu compra se procesara inmediatamente",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, continuar",
                cancelButtonText: "No, cancelar",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    GuardarOrden()
                    window.location.href = "./thank_you.html"
                    
                }
                else if (result.dismiss === Swal.DismissReason.cancel) swalWithBootstrapButtons.fire({
                    title: "Cancelada",
                    text: "Tu compra fue cancelada",
                    icon: "error"
                });
            });

        }

        checkoutForm.classList.add('was-validated')




    } else if (carrito.length == 0) {
        Swal.fire({
            icon: "error",
            title: "ERROR",
            text: "El carrito esta vacio"

        });

    }
})

// almacenamos la orden realizada por el usuario con localstorage

function GuardarOrden() {
    const formData = new FormData(checkoutForm)
    const datosOrden = Object.fromEntries(formData.entries())
    const ordenJson = JSON.stringify(datosOrden)
    localStorage.setItem('ordenDetercop', ordenJson)

}


window.onload = () => {
    obtenerProductos()
    cargarCarritoLocalStorage()



}


