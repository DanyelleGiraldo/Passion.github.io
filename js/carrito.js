let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Título</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-ml">
                <small>Presentación</small>
                <p>${producto.ml}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>$${producto.precio.toFixed(3)}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>$${(producto.precio * producto.cantidad).toFixed(3)}</p>
            </div>
            <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado.toFixed(3)}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    // Obtén la información de los productos para incluirla en el mensaje de WhatsApp
    const mensajeWhatsApp = generarMensajeWhatsApp(productosEnCarrito);

    // Obtén el elemento select
    const vendedoraSelect = document.querySelector("#vendedora select");

    // Verifica si hay una opción seleccionada
    if (vendedoraSelect.selectedIndex !== -1) {
        // Obtén la información de la vendedora seleccionada
        const vendedoraSeleccionada = vendedoraSelect.options[vendedoraSelect.selectedIndex].text;

        // Agrega la información de la vendedora al objeto
        productosEnCarrito.forEach(producto => {
            producto.vendedora = vendedoraSeleccionada;
        });

        // Abre WhatsApp con el mensaje predefinido
        abrirWhatsAppConMensaje(mensajeWhatsApp);

        // Limpiar el carrito después de la compra
        productosEnCarrito.length = 0;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        // Actualizar la interfaz
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
    } else {
        // Muestra una alerta o realiza alguna acción adecuada si no hay una opción seleccionada
        console.error("No se ha seleccionado ninguna vendedora.");
    }
}

function generarMensajeWhatsApp(productos) {
    let mensaje = "¡Hola! Estoy interesado en comprar los siguientes productos:\n";

    const vendedoraSelect = document.querySelector("#vendedora select");

    if (vendedoraSelect) {
        const vendedoraSeleccionada = vendedoraSelect.options[vendedoraSelect.selectedIndex].text;

        productos.forEach(producto => {
            mensaje += `${producto.cantidad} x ${producto.titulo} (${producto.ml}) : $${(producto.precio * producto.cantidad).toFixed(3)}\n`;
        });

        mensaje += `\nVendedora: ${vendedoraSeleccionada}`;
        mensaje += `\nTotal: $${productos.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0).toFixed(3)}`;
    } else {
        // Muestra una alerta o realiza alguna acción adecuada si el elemento select no se ha encontrado
        console.error("No se ha encontrado el elemento select con id 'vendedora'.");
    }

    return mensaje;
}


async function abrirWhatsAppConMensaje(mensaje) {
    const numeroWhatsApp = '573228357126'; // Reemplaza con el número de teléfono deseado

    // Simula una operación asíncrona, por ejemplo, una solicitud a un servidor
    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo

    // Construye la URL de WhatsApp con el mensaje
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    // Intenta abrir la URL en una nueva ventana o pestaña
    window.open(urlWhatsApp, '_blank');
}



