$(document).ready(function () {
  // =================================url API========================================
  const url = "http://localhost:3000/v1/security/user/login";

  //====================================data struc=======================================
  const dataLogin = {
    Login: "",
    Password: "",
    TypeApp: "WEB",
    TypeUser: "TEACHER-EMPLOYEE",
    DeviceId: "1",
    DeviceToken: "1",
    TimeZone: "-0600",
    Zone: "Mexico/Merida",
  };

  // Evento de clic para el botón de inicio de sesión
  $("button.btn-primary").click(function () {
    // Obtener valores del formulario
    var email = $("#form3Example3").val();
    var password = $("#form3Example4").val();

    // Asignar los valores al objeto dataLogin
    dataLogin.Login = email;
    dataLogin.Password = password;

    // Realizar la solicitud AJAX
    $.ajax({
      url: url,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(dataLogin),
      headers: {
        "Content-Type": "application/json",
      },
      success: function (data) {
        if (data.Records && data.Records.Token) {
          // Almacena el token en el localStorage
          localStorage.setItem("token", data.Records.Token);

          // Redirige a la página deseada (por ejemplo, index.html)
          window.location.href = "dash.html";
        } else {
          // El inicio de sesión no fue exitoso, puedes mostrar un mensaje de error o realizar otras acciones.
          console.error("Inicio de sesión fallido");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error al realizar la solicitud:",
          textStatus,
          errorThrown
        );
      },
    });
  });
});
