
const productosNombres = ["Escobas", "Guantes", "Microfibras", "Regadera", "Rejilla"]
const productosPrecios = [7000, 5300, 2800, 3700, 6000]

let carritoNombres = []
let carritoPrecios = []


function generarMenu(listaNombres, listaPrecios) {
    let menu = "CATÁLOGO DETERCOP:\n\n"
    let contador = 0 

    for (const nombre of listaNombres) {
        let precio = listaPrecios[contador]
        menu = menu + "- " + nombre + " ($" + precio + ")\n" 
        contador = contador + 1
    }
    return menu
}


function agregarCompra(nombreIngresado, listaNombres, listaPrecios) {
    
    let nombreUsuario = nombreIngresado.toLowerCase()
    
    let encontrado = false
    let contador = 0 

    
    for (const nombreOriginal of listaNombres) {
        
        if (nombreOriginal.toLowerCase() === nombreUsuario) {
            carritoNombres.push(nombreOriginal)
            carritoPrecios.push(listaPrecios[contador])
            alert("Agregaste " + nombreOriginal + " al carrito")
            console.log("Agregado:", nombreOriginal)
            
            encontrado = true 
        }
        
        contador = contador + 1 
    }

    
    if (encontrado === false) {
        alert("No encontramos el producto '" + nombreIngresado + "'. Escríbilo como aparece.")
    }
}


function calcularTotal(listaDePrecios) {
    let sumaTotal = 0
    for (const precio of listaDePrecios) {
        sumaTotal = sumaTotal + precio
    }
    return sumaTotal
}



let seguirComprando = true

while (seguirComprando) {
    let opcion = parseInt(prompt(
        "BIENVENIDO A DETERCOP\n" +
        "1. Ver productos y comprar\n" +
        "2. Ver total a pagar\n" +
        "3. Salir"))

    switch (opcion) {
        case 1:
            let textoMenu = generarMenu(productosNombres, productosPrecios)
            
            
            let nombreProducto = prompt(textoMenu + "\n Escriba el NOMBRE del producto:")

            if (nombreProducto) {
                agregarCompra(nombreProducto, productosNombres, productosPrecios)
            } else {
                alert("tenes que escribir un nombre.")
            }
            break

        case 2:
            let total = calcularTotal(carritoPrecios)
            if (carritoPrecios[0] !== undefined) {
                alert("Total a pagar: $" + total)
            } else {
                alert("El carrito está vacío.")
            }
            break;

        case 3:
            alert("Muchas gracias, vuelva pronto.")
            seguirComprando = false
            break

        default:
            alert("Opción incorrecta.")
           
    }
}