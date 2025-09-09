// Mostrar ou esconder o botão conforme o scroll
window.onscroll = function() {
  var btn = document.getElementById("btn-topo");
  if (document.body.scrollTop > 120 || document.documentElement.scrollTop > 120) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

// Função para rolar para o topo suavemente
document.getElementById("btn-topo").onclick = function() {
  window.scrollTo({top: 0, behavior: 'smooth'});
};
