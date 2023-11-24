$(document).ready(function () {
  // Otro archivo.js

  // Obtener el token almacenado en el localStorage
  var authorizationToken = localStorage.getItem("token");

  // Verificar si se obtuvo un token
  if (authorizationToken) {
    // Puedes imprimirlo en la consola para verificar
    console.log("Token obtenido:", authorizationToken);
  } else {
    // No se encontró un token en el localStorage
    console.error("No se encontró un token en el localStorage");
  }

  // ==========================  tokens  ===============================
  // const authorizationToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoiMTQzZTNiN2QtMWIzMC00N2Y5LWFmNmMtODIzMjFmMjliYWE2IiwiVHlwZUFwcCI6IldFQiIsIlR5cGVVc2VyIjoiVEVBQ0hFUi1FTVBMT1lFRSIsImV4cCI6MTcwMDg0NzIxNCwianRpIjoiMTQzZTNiN2QtMWIzMC00N2Y5LWFmNmMtODIzMjFmMjliYWE2IiwiaXNzIjoiU2lzdGVtZXhpY28ubmV0Iiwic3ViIjoiVmFsaWRhdGlvbiBUb2tlbiJ9.pfnq7IZcgBjpqGznUl3EFDcjPcC89JYX-FOrUCLNc6M";

  const campus =
    "e8a8901f-068e-48d6-b98e-9f3443af8883;e397449c-0d59-4da0-8f2b-67906e48b9b2;4b0ebcab-32ff-4f13-8f5f-5c0af01c8806;7fa7372f-b621-4e1c-847f-b70f15ed956c;0ea2fd9c-5f70-4f0b-a23a-c861ceeffe36;65a21e6d-d78b-4ac0-bd4d-cc9c6aa69318;68433430-2526-40dc-9700-77a803a21887;f6731140-488f-4e94-8e3c-a5d0a61b7f07;8566b125-9445-498e-9419-dfe4f97accff;5d28ed52-a0b1-406c-a91c-07627c67c4e1;1b4c571d-8117-441f-ae3a-14fbb6db70e5;439e7a1e-4aa4-416d-8240-7e0f8cc432e3;0295bb20-5a1f-41c8-a698-abba693a068e";

  // ======================strucs para datos ==========================
  const datosParaEnviar = {
    IdTutor: "",
    Code: "",
    LastName: "",
    MotherLastName: "",
    Name: "",
    Curp: null,
    Active: true,
    idAlumn: "",
    Only: true,
    CountryCode: null,
    Pagination: {
      CurrentPage: "1",
      IncludesRelations: ["Alumn", "Tutor", "Tutor.Address", "ListPermission"],
      PerPager: "1000",
    },
  };

  const dataStatusRequest = {
    IdStatusAlumn: "",
    Description: "",
    Pagination: {
      CurrentPage: "1",
      IncludesRelations: ["Alumn", "Tutor", "Tutor.Address", "ListPermission"],
      PerPager: "1000",
    },
  };

  // ====================== URLS API ==========================
  const url = "http://localhost:3000/v1/alumn/alumn/find";
  const urlStatus = "http://localhost:3000/v1/alumn/statusalumn/find";

  //==================================Ajax que obtiene los datos de los alumnos para imprimirlos en la tabla==========================================
  $.ajax({
    url: url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datosParaEnviar),
    headers: {
      "Content-Type": "application/json",
      Campus: `Bearer ${campus}`,
      Authorization: `Bearer ${authorizationToken}`,
    },
    success: function (dataAlumn) {
      //================================ajax que obtiene  los 5 posibles status del alumno==================================
      $.ajax({
        url: urlStatus,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataStatusRequest),
        headers: {
          "Content-Type": "application/json",
          Campus: `Bearer ${campus}`,
          Authorization: `Bearer ${authorizationToken}`,
        },
        success: function (dataStatus) {
          console.log(dataStatus);

          // Imprimir los datos de la tabla al recibir los datos de status
          printData(dataAlumn, dataStatus);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(
            "Error al realizar la solicitud de status:",
            textStatus,
            errorThrown
          );
        },
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error al realizar la solicitud:", textStatus, errorThrown);
    },
  });

  // Imprime los datos de la tabla
  function printData(dataAlumn, dataStatus) {
    // Obtener el mapeo de IdStatusAlumn a Description
    const statusMapping = {};
    dataStatus.Records.forEach((status) => {
      statusMapping[status.IdStatusAlumn] = status.Description;
    });

    //obtiene los datos del ajax y los imprime
    if (dataAlumn.Records && Array.isArray(dataAlumn.Records)) {
      // Llenar DataTable
      $("#tableAlumns").DataTable({
        destroy: true,
        data: dataAlumn.Records,
        columns: [
          { data: "Name" },
          { data: "LastName" },
          { data: "Email" },
          { data: "Curp" },
          {
            data: null,
            render: function (data, type, row) {
              // Obtener la Description correspondiente al IdStatusAlumn
              const description = statusMapping[row.IdStatusAlumn];
              return `<span>${description}</span>`;
            },
          },
          {
            data: null,
            defaultContent:
              '<button class="btn btn-info btn-sm btn-edit"><i class="bi bi-pencil-square"></i></button>' +
              '<button class="btn btn-warning btn-sm btn-details"><i class="bi bi-info-circle"></i></button>',
            targets: -1,
          },
        ],
      });
      // Resto del código ...
    } else {
      console.error("No se encuentran datos en el servidor");
    }
  }
});
