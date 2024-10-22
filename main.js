
/**************************** color-mode ***********************************************************/

let botonColorMode = document.querySelector("#color-mode");

botonColorMode.addEventListener("click", () => {
    if (document.body.classList.contains("bright-mode")) {
        document.body.classList.remove("bright-mode");
        botonColorMode.innerHTML = '<i class="bi bi-brightness-high-fill"></i>'
     } else {
        document.body.classList.add("bright-mode");
        botonColorMode.innerHTML = '<i class="bi bi-moon-fill"></i>'
     }
})



/**************************** menu **************************************************************/

let menuArray = [];

function cargarMenuDesdeJSON() {
    fetch("./menu.json")
    .then(response => response.json())
    .then(data => {
        menuArray = data; 
        guardarEnLocalStorage();
        mostrarMenu(menuArray);
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}


function guardarEnLocalStorage() {
    localStorage.setItem('menu', JSON.stringify(menuArray));
}

function cargarMenuLocalStorage() {
    const menuGuardado = localStorage.getItem('menu');
    if (menuGuardado) {
        menuArray = JSON.parse(menuGuardado) || [];
        mostrarMenu(menuArray);
    } else {
        cargarMenuDesdeJSON();
    }
}

const menuBodegon = document.querySelector("#menu-container");
const menuVacio = document.querySelector("#menu-vacio");

function actualizarMenu () {
    if (menuArray.length === 0) {
        menuVacio.classList.remove("d-none");
        menuBodegon.classList.add("d-none");
    } else {
        menuVacio.classList.add("d-none");
        menuBodegon.classList.remove("d-none");
    }
}



/**************************** creacion y recorrido menu **************************************************************/


function mostrarMenu (menuArray) {
    menuBodegon.innerHTML = "";

    menuArray.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("menu-product");
 
        div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
        `;
    
        let button = document.createElement("button");
        button.classList.add("eliminate-product-btn");
        button.innerText = "✖";
 
        button.addEventListener("click", () => {
          eliminarProducto(producto)
        })
 
        div.append(button)
        menuBodegon.append(div)
 
    });

    actualizarMenu ();
}



/**************************** Filtrar por categoria **************************************************/

let menuCompleto = document.querySelector("#menu");
menuCompleto.addEventListener("click",() => {
    filtrarCategoria("menu")
} )

let menuEntradas = document.querySelector("#entradas");
menuEntradas.addEventListener("click",() => {
    filtrarCategoria("entradas")
} )

let menuPrincipales = document.querySelector("#principales");
menuPrincipales.addEventListener("click",() => {
    filtrarCategoria("principales")
} )

let menuBebidas = document.querySelector("#bebidas");
menuBebidas.addEventListener("click",() => {
    filtrarCategoria("bebidas")
} )

let menuTragos = document.querySelector("#tragos");
menuTragos.addEventListener("click",() => {
    filtrarCategoria("tragos")
} )

let menuPostres = document.querySelector("#postres");
menuPostres.addEventListener("click",() => {
    filtrarCategoria("postres")
} )

function filtrarCategoria(categoria) {
    if (categoria === "menu") {
        mostrarMenu(menuArray); 
    } else {
        const productosFiltrados = menuArray.filter((producto) => producto.categoria === categoria);
        mostrarMenu(productosFiltrados); 
    }

    actualizarMenu ();

}



/**************************** Eliminar producto del menu *********************************/


function eliminarProducto (productoEliminado) {
    
    Swal.fire ({
        text:`¿Estás seguro que deseas eliminar el producto ${productoEliminado.nombre} del menú?`,
        icon: "warning",
        showClosebutton: true,

        showConfirmButton: true,
        showCancelButton: true,

        confirmButtonText: "Eliminar producto",
        cancelButtonText: "Cancelar",

        customClass: "popup-eliminate-product"

    }).then((result) => {

        if (result.isConfirmed) {
            let indice = menuArray.findIndex((producto) => producto === productoEliminado);
            menuArray.splice(indice, 1);
            guardarEnLocalStorage();
            swal.fire ({
                text: `El producto ${productoEliminado.nombre} fue eliminado.`,
                icon: "success",
                customClass: "popup-eliminate-product"
            })
            actualizarMenu ();
            mostrarMenu(menuArray);
        }
    })

    actualizarMenu ();
    mostrarMenu(menuArray);
}


/**************************** Eliminar TODOS los producto del menu *********************************/

const BtnEliminarProducto = document.querySelector("#eliminate-menu");

BtnEliminarProducto.addEventListener("click", () => {

    Swal.fire ({
        text:`¿Estás seguro que deseas eliminar todo el menú? Esta acción no se puede deshacer.`,
        icon: "warning",
        showClosebutton: true,

        showConfirmButton: true,
        showCancelButton: true,

        confirmButtonText: "Eliminar menú",
        cancelButtonText: "Cancelar",

        customClass: "popup-eliminate-product"

    }).then((result) => {

        if (result.isConfirmed) {
            menuArray = [];
            swal.fire ({
                text: `El menú fue eliminado.`,
                icon: "success",
                customClass: "popup-eliminate-product"
            })
            guardarEnLocalStorage();
            actualizarMenu ();
            mostrarMenu(menuArray);
        }
     });

        guardarEnLocalStorage();

        actualizarMenu ();
        mostrarMenu(menuArray);
    })



/********************************** Formulario carga menu **************************************************/

const btnAgregarProducto = document.querySelector("#add-producto");
const formAdministracionMenu = document.querySelector("#form-administration-menu");

btnAgregarProducto.addEventListener("click", () => {
    formAdministracionMenu.classList.toggle("d-none");
});

const formAddProduct = document.querySelector("#form-add-product");
const inputProductName = document.querySelector("#product-name");
const inputProductPrice = document.querySelector("#product-price");
const selectProductCategory = document.querySelector("#product-category");
const btnClose = document.querySelector("#btn-close");

btnClose.addEventListener("click", () => {
    formAdministracionMenu.classList.add("d-none")

});


formAddProduct.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoProducto = {
        nombre: inputProductName.value,
        precio: Number(inputProductPrice.value),
        categoria: selectProductCategory.value
    };


    menuArray.push(nuevoProducto);

    guardarEnLocalStorage();

    mostrarMenu(menuArray);

    formAddProduct.reset();

    Toastify ({
        text: "Producto agregado!",
        duration: 1500,
        close:true
    }).showToast();

  })


cargarMenuLocalStorage();
mostrarMenu(menuArray);




