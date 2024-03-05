let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const caracteristicasp= document.querySelector("#caracteristicasdelproducto")



botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h6 class="producto-titulo">${producto.titulo}</h6>
                <p class="producto-precio">${producto.des}</p>
                <p class="producto-precio">$${producto.precio.toFixed(3)}</p>
                <button class="producto-detalless" id="${producto.id}">Detalles</button>    
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarbotondetalles();
    actualizarBotonesAgregar();
    abrirBoton();
    cerrarBoton();
}
function mostrarcaracteristicas(producto) {
    caracteristicasp.innerHTML = "";
    const div = document.createElement("div");
    div.classList.add("productoz");
    div.innerHTML = `
        <div class="productoizquierda">
            <img class="producto-imagen-descripcion" src="${producto.imagen}" alt="${producto.titulo}">
            <h6 class="producto-titulo-descripcion">${producto.titulo}</h6>
            <p class="producto-precio">${producto.des}</p>
            <p class="producto-precio" id="precioActual">$${producto.precio.toFixed(3)}</p>
            <button class="producto-agregar" id="${producto.id}">Agregar</button>
            <div class="lista-cantidad">
            ${Object.entries(producto.presentaciones).map(([presentacion, precio]) => `
                <input type="radio" name="ml_${producto.id}" class="producto-ml" value="${presentacion}" id="ml${presentacion}_${producto.id}">
                <label id="parrish" for="ml${presentacion}_${producto.id}">${presentacion}</label>
            `).join('')}
        </div>
        </div>      
        <div class="producto-detalles-descripcion">
            <div class="contenedordecaracteristicas" style="">
                <h1 class="titulosdecaracteristicas" style="margin: 0; font-size: 30px;">Que es?</h1>
                <p class="producto-caracteristicas" style="margin: 0; " id="${producto.quees}">${producto.quees}</p>
                <h1 class="titulosdecaracteristicas" style="margin: 0; font-size: 30px;">Que hace?</h1>
                <p class="producto-caracteristicas" style="margin: 0; " id="${producto.quehace}">${producto.quehace}</p>
                <h1 class="titulosdecaracteristicas" style="margin: 0; font-size: 30px;">Como funciona?</h1>
                <p class="producto-caracteristicas" style="margin: 0; " id="${producto.howw}">${producto.howw}</p>
            </div>
        </div>
    `;
    caracteristicasp.append(div);

    const radioButtons = document.querySelectorAll(`input[name="ml_${producto.id}"]`);
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener("change", () => {
            const selectedPresentation = radioButton.value;
            const selectedPrice = producto.presentaciones[selectedPresentation].toFixed(3);
            document.getElementById("precioActual").innerText = `$${selectedPrice}`;
        });
    });


    actualizarBotonesAgregar();
}



const cerrarBoton= ()=>{
    const modal = document.getElementById("modal");
        modal.style.display = "none";
}

const abrirBoton=()=>{
    botonesAgregar = document.querySelectorAll(".producto-detalless");
    botonesAgregar.forEach(boton=>{
        boton.addEventListener("click", abrirBoton)
    })
    
    const modal = document.getElementById("modal");
        modal.style.display="block";
}



botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});

function actualizarbotondetalles() {
    botondetalles = document.querySelectorAll(".producto-detalless");
    botondetalles.forEach(boton => {
        boton.addEventListener("click", seleccionarproducto);
    });
}

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
    
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

const seleccionarproducto = (e) => {
    const idboton = e.currentTarget.id;
    const productoseleccionado = productos.find(producto => producto.id === idboton);
    if (productoseleccionado) {
        mostrarcaracteristicas(productoseleccionado);
        abrirBoton(); // Asegúrate de que la ventana modal se abra al seleccionar el producto
    }
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
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
      const productoAgregado = productos.find(producto => producto.id === idBoton);
  
      // Obtener el valor del radio button seleccionado
      const radioButtons = document.querySelectorAll(`input[name="ml_${productoAgregado.id}"]:checked`);
  
      if (radioButtons.length > 0) {
        const mlSeleccionado = radioButtons[0].value;
        const selectedPrice = productoAgregado.presentaciones[mlSeleccionado];
  
          // Verificar si el producto ya está en el carrito con la misma presentación
          const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton && producto.ml === mlSeleccionado);
  
          if (productoEnCarrito) {
              // Incrementar la cantidad si el producto ya está en el carrito
              productoEnCarrito.cantidad++;
          } else {
              // Agregar un nuevo producto al carrito
              const nuevoProducto = {
                  imagen: productoAgregado.imagen,
                  id: productoAgregado.id,
                  titulo: productoAgregado.titulo,
                  precio: selectedPrice,
                  cantidad: 1,
                  ml: mlSeleccionado,
              };
  
              productosEnCarrito.push(nuevoProducto);
          }
  
          actualizarNumerito();
          localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
      } else {
          console.error("Por favor, selecciona una presentación antes de agregar al carrito.");
      }
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

