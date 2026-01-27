document.addEventListener("DOMContentLoaded", () => {

  let apuntes = [];

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const search = document.getElementById("search");
  const catDiv = document.getElementById("category-search");

  // Cargar JSON desde GitHub
  fetch("https://raw.githubusercontent.com/juaniamaro/IA/main/data/apuntes.json")
    .then(res => res.json())
    .then(data => {
      apuntes = data;
      renderMenu(apuntes);
      renderCategoryButtons(apuntes);
    })
    .catch(err => {
      console.error("Error al cargar JSON:", err);
      menu.innerHTML = "<p>No se pudieron cargar los apuntes.</p>";
    });

  // Renderizar menú jerárquico
  function renderMenu(lista, filtroCat = null, filtroTexto = "") {
    menu.innerHTML = "";

    lista.forEach(cat => {
      if (filtroCat && cat.categoria !== filtroCat) return;

      // Categoría
      const catH2 = document.createElement("h2");
      catH2.textContent = cat.categoria;
      menu.appendChild(catH2);

      cat.carpetas.forEach(carpeta => {
        // Carpeta
        const carpetaH3 = document.createElement("h3");
        carpetaH3.textContent = carpeta.titulo;
        menu.appendChild(carpetaH3);

        if (carpeta.sub) {
          const subDiv = document.createElement("div");
          subDiv.className = "sub-menu";

          carpeta.sub.forEach(apunte => {
            if (!apunte.ruta) return; // Validación

            if (apunte.titulo.toLowerCase().includes(filtroTexto.toLowerCase())) {
              const div = document.createElement("div");
              div.className = "apunte-link";
              div.textContent = apunte.titulo;
              div.onclick = () => loadApunte(apunte.ruta);
              subDiv.appendChild(div);
            }
          });

          menu.appendChild(subDiv);
        }
      });
    });
  }

  // Función para cargar apuntes como HTML
  function loadApunte(ruta) {
    if (!ruta) {
      console.warn("Este apunte no tiene ruta definida");
      return;
    }

    fetch(ruta)
      .then(res => res.text())
      .then(html => { content.innerHTML = html; }) // Ya no se usa marked
      .catch(err => {
        console.error("Error al cargar apunte:", err);
        content.innerHTML = "<p>No se pudo cargar este apunte.</p>";
      });
  }

  // Renderizar botones de categorías con imágenes
  function renderCategoryButtons(lista) {
    catDiv.innerHTML = "";

    lista.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "cat-btn";
      btn.dataset.cat = cat.categoria;

      if (cat.icono) {
        const img = document.createElement("img");
        img.src = cat.icono;
        img.alt = cat.categoria;
        img.style.width = "24px";
        img.style.height = "24px";
        img.style.marginRight = "5px";
        btn.appendChild(img);
      }

      btn.appendChild(document.createTextNode(cat.categoria));
      catDiv.appendChild(btn);

      // Click para filtrar categoría
      btn.addEventListener("click", () => {
        renderMenu(apuntes, cat.categoria, search.value);
      });
    });
  }

  // Buscador por palabras
  search.addEventListener("input", e => {
    renderMenu(apuntes, null, e.target.value);
  });
});
