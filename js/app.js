document.addEventListener("DOMContentLoaded", () => {
  if (typeof marked === "undefined") {
    console.error("marked no está definido. Revisa que el script de marked.min.js esté cargado correctamente.");
    return;
  }

  let apuntes = [];

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const search = document.getElementById("search");

  fetch("https://raw.githubusercontent.com/juaniamaro/IA/main/data/apuntes.json")
    .then(res => res.json())
    .then(data => {
      apuntes = data;
      renderMenu(apuntes);
    })
    .catch(err => {
      console.error("Error al cargar JSON:", err);
      menu.innerHTML = "<p>No se pudieron cargar los apuntes.</p>";
    });

  function renderMenu(lista) {
    menu.innerHTML = "";
    lista.forEach(apunte => {
      const div = document.createElement("div");
      div.className = "apunte-link";
      div.textContent = apunte.titulo;
      div.onclick = () => loadApunte(apunte.ruta);
      menu.appendChild(div);
    });
  }

  function loadApunte(ruta) {
    fetch(ruta)
      .then(res => res.text())
      .then(md => {
        content.innerHTML = marked.parse(md);
      })
      .catch(err => {
        console.error("Error al cargar apunte:", err);
        content.innerHTML = "<p>No se pudo cargar este apunte.</p>";
      });
  }

  search.addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();
    const filtrados = apuntes.filter(a =>
      a.titulo.toLowerCase().includes(texto)
    );
    renderMenu(filtrados);
  });
});
