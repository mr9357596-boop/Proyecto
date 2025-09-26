// Evento de botón para mostrar/ocultar contacto
document.getElementById("btnContacto").addEventListener("click", function() {
  const contacto = document.getElementById("contacto");
  contacto.style.display = (contacto.style.display === "block") ? "none" : "block";
});
