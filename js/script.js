let apuntes = [];

fetch("data/apuntes.json")
  .then(res => res.json())
  .then(data => {
    apuntes = data;
    mostrarApuntes(apuntes);
  });

function mostrarApuntes(lista) {
  const container = document.getElementById("apuntes-container");
  container.innerHTML = "";

  lista.forEach(apunte => {
    const div = document.createElement("div");
    div.className = "apunte";
    div.innerHTML = `
      <h3>${apunte.titulo}</h3>
      <small>${apunte.categoria}</small>
      <p>${apunte.contenido}</p>
    `;
    container.appendChild(div);
  });
}

document.getElementById("buscador").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();
  const filtrados = apuntes.filter(a =>
    a.titulo.toLowerCase().includes(texto) ||
    a.contenido.toLowerCase().includes(texto)
  );
  mostrarApuntes(filtrados);
});

