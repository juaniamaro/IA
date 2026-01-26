document.addEventListener("DOMContentLoaded", () => {
  let apuntes = [];

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const search = document.getElementById("search");

  // Cargar apuntes desde GitHub raw JSON
  fetch("https://raw.githubusercontent.com/juaniamaro/IA/main/data/apuntes.json")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar el JSON");
      return res.json();
    })
    .then(data => {
      apuntes = data;
      renderMenu(apuntes);
    })
    .catch(err => {
      console.error("Error al cargar JSON:", err);
      menu.innerHTML = "<p>No se pudieron cargar los apuntes.</p>";
    });

  // Renderizar menú lateral
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

  // Cargar un apunte en Markdown
  function loadApunte(ruta) {
    fetch(ruta)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el apunte");
        return res.text();
      })
      .then(md => {
        content.innerHTML = marked.parse(md);
      })
      .catch(err => {
        console.error("Error al cargar apunte:", err);
        content.innerHTML = "<p>No se pudo cargar este apunte.</p>";
      });
  }

  // Buscador
  search.addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();
    const filtrados = apuntes.filter(a =>
      a.titulo.toLowerCase().includes(texto)
    );
    renderMenu(filtrados);
  });
});
