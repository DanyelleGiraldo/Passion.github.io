let productoz = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productoz = data;

        // Filtrar un producto por cada categoría
        const productosSeleccionados = {};
        productoz.forEach(producto => {
            if (!productosSeleccionados[producto.categoria.id]) {
                productosSeleccionados[producto.categoria.id] = producto;
            }
        });

        // Convertir el objeto de productos seleccionados en un arreglo
        const productosFinales = Object.values(productosSeleccionados);

        cargarProductos(productosFinales);
    });

const contenedorProductoz = document.querySelector("#projects");

function cargarProductos(productosElegidos) {
    contenedorProductoz.innerHTML = "";

    productosElegidos.forEach(producto => {
        const article = document.createElement("article");
        article.className = "project";

        const imageWrap = document.createElement("div");
        imageWrap.className = "image-wrap";
        const image = document.createElement("img");
        image.src = producto.imagen;
        image.alt = "";
        imageWrap.appendChild(image);

        const projectInfo = document.createElement("div");
        projectInfo.className = "project-info";
        const productName = document.createElement("a");
        productName.href = './productos.html';
        productName.textContent = producto.titulo;
        const productType = document.createElement('p');
        productType.textContent = producto.des;

        projectInfo.appendChild(productName);
        projectInfo.appendChild(productType);

        article.appendChild(imageWrap);
        article.appendChild(projectInfo);

        contenedorProductoz.appendChild(article);
    });
}
