function LoadView(url) {
  $.ajax({
    method: "get",
    url: url,
    success: (response) => {
      $("section").html(response);
    },
  });
}

// jQuery Load Action

$(() => {
  if ($.cookie("uname")) {
    LoadDashBoard();
  } else {
    LoadView("/public/home.html");
  }

  $(document).on("click", "#home-register-button", () => {
    LoadView("/public/register.html");
  });

  $(document).on("click", "#home-login-button", () => {
    LoadView("/public/login.html");
  });

  $(document).on("click", "#btn-home", () => {
    LoadView("/public/home.html");
  });

  // Verify User Name

  $(document).on("keyup", "#txtUserName", () => {
    $.ajax({
      method: "get",
      url: "https://task-backend-1-03f2.onrender.com/users",
      success: (users) => {
        for (var user of users) {
          if (user.username === $("#txtUserName").val()) {
            $("#lblUserError")
              .html("User Name Taken - Try Another")
              .css("color", "red");
            break;
          } else {
            $("#lblUserError")
              .html("User Name Available")
              .css("color", "green");
          }
        }
      },
    });
  });

  // Register Click

  $(document).on("click", "#btnRegister", () => {
    var user = {
      username: $("#txtUserName").val(),
      password: $("#txtPassword").val(),
      email: $("#txtEmail").val(),
    };

    $.ajax({
      method: "post",
      url: "https://task-backend-1-03f2.onrender.com/users",
      data: JSON.stringify(user),
    });
    alert("Registered Successfully..");
  });

  function LoadDashBoard() {
    $.ajax({
      method: "get",
      url: "./dashboard.html",
      success: (response) => {
        $("section").html(response);
        $("#active-user").html($.cookie("uname"));
        $.ajax({
          method: "get",
          url: "https://task-backend-1-03f2.onrender.com/appointments",
          success: (appointments) => {
            var results = appointments.filter(
              (appointment) => appointment.username === $.cookie("uname")
            );

            results.map((appointment) => {
              $(`<div class="alert mx-2 alert-success">
                                        <h3>${appointment.title}</h3>
                                        <p>${appointment.description}</p>
                                        <div class="bi bi-calendar"> ${appointment.date} </div>
                                        <div>
                                          <button id="btn-edit" value=${appointment.id} data-bs-target="#edit-appointment" data-bs-toggle="modal" class="bi bi-pen-fill btn btn-warning"></button>
                                          <button id="btn-delete" value=${appointment.id} class="bi bi-trash-fill btn btn-danger mx-2"></button>
                                        </div>
                                    </div>`).appendTo("#appointment-cards");
            });
          },
        });
      },
    });
  }

  // Login Click

  $(document).on("click", "#btnLogin", () => {
    $.ajax({
      method: "get",
      url: "https://task-backend-1-03f2.onrender.com/users",
      success: (users) => {
        var user = users.find(
          (item) => item.username === $("#txtUserName").val()
        );
        if (user) {
          if (user.password === $("#txtPassword").val()) {
            $.cookie("uname", $("#txtUserName").val(), { expires: 2 });
            LoadDashBoard();
          } else {
            alert("Invalid Password");
          }
        } else {
          alert("Invalid User Name");
        }
      },
    });
  });

  // Signout Click

  $(document).on("click", "#btn-signout", () => {
    $.removeCookie("uname");
    LoadView("/public/home.html");
  });

  // Add Appointment Click

  $(document).on("click", "#btn-add", () => {
    var appointment = {
      title: $("#appointment-title").val(),
      description: $("#appointment-description").val(),
      date: $("#appointment-date").val(),
      username: $.cookie("uname"),
    };

    $.ajax({
      method: "post",
      url: "https://task-backend-1-03f2.onrender.com/appointments",
      data: JSON.stringify(appointment),
    });

    LoadDashBoard();
  });

  // Delete Appointment

  $(document).on("click", "#btn-delete", (e) => {
    var flag = confirm("Are you sure?\nWant to Delete?");
    if (flag === true) {
      $.ajax({
        method: "delete",
        url: `https://task-backend-1-03f2.onrender.com/appointments/${e.target.value}`,
      });
      LoadDashBoard();
    }
  });

  // Edit Appointment
  $(document).on("click", "#btn-edit", (e) => {
    $.ajax({
      method: "get",
      url: `https://task-backend-1-03f2.onrender.com/appointments/${e.target.value}`,
      success: (appointment) => {
        console.log(appointment);
        $("#edit-appointment-id").val(appointment.id);
        $("#edit-appointment-title").val(appointment.title);
        $("#edit-appointment-description").val(appointment.description);
        $("#edit-appointment-date").val(appointment.date);
      },
    });
  });

  // Update & Save Appointment
  $(document).on("click", "#btn-save", () => {
    console.log($("#edit-appointment-id").val());

    var appointment = {
      id: $("#edit-appointment-id").val(),
      title: $("#edit-appointment-title").val(),
      description: $("#edit-appointment-description").val(),
      date: $("#edit-appointment-date").val(),
      username: $.cookie("uname"),
    };

    $.ajax({
      method: "put",
      url: `https://task-backend-1-03f2.onrender.com/appointments/${$(
        "#edit-appointment-id"
      ).val()}`,
      data: JSON.stringify(appointment),
    });
    LoadDashBoard();
  });
});
