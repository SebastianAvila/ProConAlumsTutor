$(document).ready(function () {
  // Obtener el token almacenado en el localStorage
  var authorizationToken = localStorage.getItem("token");

  // Verificar si se obtuvo un token
  if (authorizationToken) {
    // Puedes imprimirlo en la consola para verificar
    console.log("Token obtenido");
  } else {
    // No se encontró un token en el localStorage
    console.error("No se encontró un token en el localStorage");
  }

  const datosParaEnviar = {
    Code: "",
    Curp: "",
    IdTutor: "",
    LastName: "",
    MotherLastName: "",
    Name: "",
    Only: true,
    Pagination: {
      CurrentPage: "1",
      IncludesRelations: ["Alumn", "Tutor", "Tutor.Address", "ListPermission"],
      PerPager: "1000",
    },
    idAlumn: "",
  };

  const url = "http://localhost:3000/v1/alumn/tutor/find";

  $.ajax({
    url: url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datosParaEnviar),
    headers: {
      "Content-Type": "application/json",
      Campus:
        "e8a8901f-068e-48d6-b98e-9f3443af8883;e397449c-0d59-4da0-8f2b-67906e48b9b2;4b0ebcab-32ff-4f13-8f5f-5c0af01c8806;7fa7372f-b621-4e1c-847f-b70f15ed956c;0ea2fd9c-5f70-4f0b-a23a-c861ceeffe36;65a21e6d-d78b-4ac0-bd4d-cc9c6aa69318;68433430-2526-40dc-9700-77a803a21887;f6731140-488f-4e94-8e3c-a5d0a61b7f07;8566b125-9445-498e-9419-dfe4f97accff;5d28ed52-a0b1-406c-a91c-07627c67c4e1;1b4c571d-8117-441f-ae3a-14fbb6db70e5;439e7a1e-4aa4-416d-8240-7e0f8cc432e3;0295bb20-5a1f-41c8-a698-abba693a068e",
      Authorization: `Bearer ${authorizationToken}`,
    },
    success: function (data) {
      if (data.Records && Array.isArray(data.Records)) {
        const dataTable = $("#tableTutor").DataTable({
          destroy: true,
          data: data.Records,
          columns: [
            { data: "Name" },
            { data: "LastName" },
            { data: "Email" },
            { data: "Curp" },
            {
              data: "Suspended",
              render: function (data) {
                return data === true ? "Ina" : "Act";
              },
            },
            {
              data: null,
              defaultContent:
                // '<button class="btn btn-info btn-sm btn-edit"><i class="bi bi-pencil-square"></i></button>' +
                '<button class="btn btn-warning btn-sm btn-details"><i class="bi bi-info-circle"></i></button>',
              targets: -1,
            },
          ],
        });

        // Agregar eventos para los botones
        $("#tableTutor").on("click", ".btn-edit", function () {
          var data = $("#tableTutor")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
          // Lógica para editar utilizando los datos en 'data'
          console.log("Editar:", data);
        });

        $("#tableTutor").on("click", ".btn-delete", function () {
          var data = $("#tableTutor")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
          // Lógica para eliminar utilizando los datos en 'data'
          //   console.log("Eliminar:", data);

          var idTutor = data.IdTutor;
          // Resto de la lógica para editar utilizando el valor de IdTutor
          console.log("Id del tutor:", idTutor);
          const urlDelete = "http://localhost:3000/v1/alumn/tutor/delete";
          const dataId = {
            IdTutor: idTutor,
          };
          console.log("dataID json" + JSON.stringify(dataId));
          $.ajax({
            url: urlDelete,
            type: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(dataId),
            headers: {
              "Content-Type": "application/json",
              Campus:
                "e8a8901f-068e-48d6-b98e-9f3443af8883;e397449c-0d59-4da0-8f2b-67906e48b9b2;4b0ebcab-32ff-4f13-8f5f-5c0af01c8806;7fa7372f-b621-4e1c-847f-b70f15ed956c;0ea2fd9c-5f70-4f0b-a23a-c861ceeffe36;65a21e6d-d78b-4ac0-bd4d-cc9c6aa69318;68433430-2526-40dc-9700-77a803a21887;f6731140-488f-4e94-8e3c-a5d0a61b7f07;8566b125-9445-498e-9419-dfe4f97accff;5d28ed52-a0b1-406c-a91c-07627c67c4e1;1b4c571d-8117-441f-ae3a-14fbb6db70e5;439e7a1e-4aa4-416d-8240-7e0f8cc432e3;0295bb20-5a1f-41c8-a698-abba693a068e",
              Authorization: `Bearer ${authorizationToken}`,
            },
            success: function (data) {
              console.log(data);
            },
          });
        });

        $("#tableTutor").on("click", ".btn-details", function () {
          const rowData = dataTable.row($(this).parents("tr")).data();
          console.log(rowData);
          // Lógica para mostrar detalles utilizando los datos en 'data'
          // console.log("Detalles:", data);

          $("#modal-body-content").html(
            `<h1>Datos del Maestros</h1>
            <p><strong>id:</strong> ${rowData.IdTutor}</p>
             <p><strong>Nombre:</strong> ${rowData.Name}</p>
             <p><strong>Apellido:</strong> ${rowData.LastName}</p>
             <p><strong>Apellido Materno:</strong> ${rowData.MotherLastName}</p>
             <p><strong>Email:</strong> ${rowData.Email}</p>
             <p><strong>Curp:</strong> ${rowData.Curp}</p>
             <p><strong>Phone:</strong> ${rowData.Phone}</p>
             <p><strong>Cumpleaños:</strong> ${rowData.BirthDate}</p>
             <p><strong>Genero:</strong> ${rowData.Gender}</p>
             <p><strong>Active:</strong> ${rowData.Active}</p>
             
             `
          );
        });
      } else {
        console.error("No se encuentran datos en el servidor");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error al realizar la solicitud:", textStatus, errorThrown);
    },
  });
});
