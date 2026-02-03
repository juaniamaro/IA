document.addEventListener("DOMContentLoaded", () => {

  let apuntes = [];

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const search = document.getElementById("search");
  const catDiv = document.getElementById("category-search");

  // ===============================
  // Cargar JSON desde GitHub
  // ===============================
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

  // ===============================
  // Renderizar menú jerárquico
  // ===============================
  function renderMenu(lista, filtroCat = null, filtroTexto = "") {
    menu.innerHTML = "";

    lista.forEach(cat => {
      if (filtroCat && cat.categoria !== filtroCat) return;

      const catH2 = document.createElement("h2");
      catH2.textContent = cat.categoria;
      menu.appendChild(catH2);

      cat.carpetas.forEach(carpeta => {
        const carpetaH3 = document.createElement("h3");
        carpetaH3.textContent = carpeta.titulo;
        menu.appendChild(carpetaH3);

        if (carpeta.sub) {
          const subDiv = document.createElement("div");
          subDiv.className = "sub-menu";

          carpeta.sub.forEach(apunte => {
            if (!apunte.ruta) return;

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

  // ===============================
  // Cargar apuntes
  // ===============================
  function loadApunte(ruta) {
    fetch(ruta)
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        initCarousel();   // 👈 ACTIVAMOS CARRUSEL CUANDO CARGA HTML
      })
      .catch(err => {
        console.error("Error al cargar apunte:", err);
        content.innerHTML = "<p>No se pudo cargar este apunte.</p>";
      });
  }

  // ===============================
  // Botones categorías
  // ===============================
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

      btn.addEventListener("click", () => {
        renderMenu(apuntes, cat.categoria, search.value);
      });
    });
  }

  // ===============================
  // Buscador
  // ===============================
  search.addEventListener("input", e => {
    renderMenu(apuntes, null, e.target.value);
  });

  // ===============================
  // CARRUSEL PRO
  // ===============================
  function initCarousel() {

    const carousel = document.getElementById("carousel");
    if (!carousel) return; // 👈 Si no hay carrusel en ese HTML, no hace nada

    const slides = carousel.querySelectorAll(".slide");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const dotsContainer = document.querySelector(".dots");

    let index = 0;
    let interval;
    const delay = 3500;

    dotsContainer.innerHTML = "";

    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (i === 0) dot.classList.add("active");
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function updateCarousel() {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove("active"));
      dots[index].classList.add("active");
    }

    function goToSlide(i) {
      index = i;
      updateCarousel();
      resetAutoplay();
    }

    next.onclick = () => {
      index = (index + 1) % slides.length;
      updateCarousel();
      resetAutoplay();
    };

    prev.onclick = () => {
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel();
      resetAutoplay();
    };

    function startAutoplay() {
      interval = setInterval(() => {
        index = (index + 1) % slides.length;
        updateCarousel();
      }, delay);
    }

    function resetAutoplay() {
      clearInterval(interval);
      startAutoplay();
    }

    startAutoplay();

    // Pausa al pasar ratón
    carousel.parentElement.addEventListener("mouseenter", () => clearInterval(interval));
    carousel.parentElement.addEventListener("mouseleave", startAutoplay);

    // Swipe móvil
    let startX = 0;

    carousel.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchend", e => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) next.click();
        else prev.click();
      }
    });

  }

});
