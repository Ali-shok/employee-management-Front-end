function manageNavVisibility() {
  const role = localStorage.getItem("user_role");
  if (role === "employee") {
    document.getElementById("nav-leave-request").style.display = "block";
    document.getElementById("nav-Approve-leave-request").style.visibility =
      "hidden";
    document.getElementById("nav-Approve-leave-request").style.width = "0";
    document.getElementById("nav-Approve-leave-request").style.height = "0";
    document.getElementById("nav-Approve-leave-request").style.padding = "0";
    document.getElementById("nav-Approve-leave-request").style.margin = "0";
    document.getElementById("nav-Approve-leave-request").style.border = "0";
    document.getElementById("nav-employees").style.visibility = "hidden";
    document.getElementById("nav-employees").style.width = "0";
    document.getElementById("nav-employees").style.height = "0";
    document.getElementById("nav-employees").style.padding = "0";
    document.getElementById("nav-employees").style.margin = "0";
    document.getElementById("nav-employees").style.border = "0";
    document.getElementById("nav-salaries").style.visibility = "hidden";
    document.getElementById("nav-salaries").style.width = "0";
    document.getElementById("nav-salaries").style.height = "0";
    document.getElementById("nav-salaries").style.padding = "0";
    document.getElementById("nav-salaries").style.margin = "0";
    document.getElementById("nav-salaries").style.border = "0";
    document.getElementById("nav-performance").style.visibility = "hidden";
    document.getElementById("nav-performance").style.width = "0";
    document.getElementById("nav-performance").style.height = "0";
    document.getElementById("nav-performance").style.padding = "0";
    document.getElementById("nav-performance").style.margin = "0";
    document.getElementById("nav-performance").style.border = "0";
    window.location.href = "../mySalary/mySalary.html";
  } else {
    document.getElementById("nav-leave-request").style.visibility = "hidden";
    document.getElementById("nav-leave-request").style.width = "0";
    document.getElementById("nav-leave-request").style.height = "0";
    document.getElementById("nav-leave-request").style.padding = "0";
    document.getElementById("nav-leave-request").style.margin = "0";
    document.getElementById("nav-leave-request").style.border = "0";
    document.getElementById("nav-Approve-leave-request").style.display =
      "block";
  }
}
// Call the function immediately

$(document).ready(function () {
  const role = localStorage.getItem("user_role");
  const token = localStorage.getItem("auth_token");
  const employeeID = localStorage.getItem("employeeID");

  //log out
  document.getElementById("logout-btn").addEventListener("click", function () {
    // Remove token from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("employeeID");
    // Redirect to sign-in page
    window.location.href = "../login/login.html";
  });

  //auth token for enter the page

  if (!token) {
    // Redirect to the login page if token is not present
    window.location.href = "../login/login.html";
    return; // Stop further execution
  }
  manageNavVisibility();

  // Initialize DataTable
  const employeeTable = $("#employee-table").DataTable({
    columnDefs: [
      {
        targets: -1, // Actions column
        className: "dt-center", // Center align the content
      },
    ],
    pageLength: 15,
    lengthMenu: [15, 20, 25],
  });

  // Fetch data from the backend
  $.ajax({
    url: "http://localhost:3003/employees",
    method: "GET",
    success: function (data) {
      // Clear existing table data
      employeeTable.clear().draw();

      // Loop through each employee record and append it to the table
      data.forEach(function (record) {
        employeeTable.row
          .add([
            record.id,
            record.first_name,
            record.last_name,
            record.email,
            record.position,
            record.department,
            record.address,
            record.phone_number,
            record.salary,
            record.leave_balance,
            record.role,
            `<i class="fas fa-edit edit-btn" data-id="${record.id}" title="Edit" data-bs-toggle="modal" data-bs-target="#editEmployeeModal"></i>
                        <i class="fas fa-trash delete-btn" data-id="${record.id}" title="Delete"></i>`,
          ])
          .draw(false);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching employee records:", error);
    },
  });
  // Delet employee
  $("#employee-table").on("click", ".delete-btn", function () {
    const employeeId = $(this).data("id");

    // Display confirmation prompt before deleting
    const confirmation = confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmation) {
      // Send DELETE request to backend if confirmed
      $.ajax({
        url: `http://localhost:3003/employees/${employeeId}`, // Use template literal for route with ID
        method: "DELETE", // Use DELETE method for deletion
        success: function () {
          // Remove deleted record from DataTables
          employeeTable
            .row($(".delete-btn[data-id='" + employeeId + "']").closest("tr"))
            .remove()
            .draw();
          console.log("Employee deleted successfully");
        },
        error: function (xhr, status, error) {
          console.error("Error deleting employee:", error);
          alert("Error deleting employee. Please check server logs."); // Provide user feedback
        },
      });
    }
  });

  // Function to populate the edit modal with employee data
  $("#employee-table").on("click", ".edit-btn", function () {
    // Fetch data for the clicked employee ID from the table
    const rowData = employeeTable.row($(this).closest("tr")).data();

    // Populate the modal with the row data
    $("#editEmployeeModal #editEmployeeId").val(rowData[0]);
    $("#editEmployeeModal #editFirstName").val(rowData[1]);
    $("#editEmployeeModal #editLastName").val(rowData[2]);
    $("#editEmployeeModal #editEmail").val(rowData[3]);
    $("#editEmployeeModal #editPosition").val(rowData[4]);
    $("#editEmployeeModal #editDepartment").val(rowData[5]);
    $("#editEmployeeModal #editAddress").val(rowData[6]);
    $("#editEmployeeModal #editPhoneNumber").val(rowData[7]);
    $("#editEmployeeModal #editSalary").val(rowData[8]);
    $("#editEmployeeModal #editLeaveBalance").val(rowData[9]);
    $("#editEmployeeModal #editRole").val(rowData[10]);
  });

  // Handle submission of the edit form
  $("#editEmployeeForm").submit(function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Show the spinner
    $(this).find(".spinner-border").removeClass("d-none");

    // Get the form data
    const formData = $(this).serializeArray();

    // Get the employee ID from the form
    const employeeId = $("#editEmployeeId").val();

    // Make an AJAX request to update the employee record
    $.ajax({
      url: "http://localhost:3003/employees/" + employeeId,
      method: "PUT",
      data: formData, // Send all form data
      success: function () {
        // Close the modal and wait for it to be fully hidden
        $("#editEmployeeModal")
          .one("hidden.bs.modal", function (e) {
            // Reload the employee data in the table or update as needed
            alert("Employee details updated successfully");

            $("#editEmployeeForm").find(".spinner-border").addClass("d-none");
          })
          .modal("hide");

        const row = employeeTable.row(
          $(`#employee-table [data-id="${employeeId}"]`).closest("tr")
        );
        if (row) {
          row
            .data([
              employeeId,
              $("#editFirstName").val(),
              $("#editLastName").val(),
              $("#editEmail").val(),
              $("#editPosition").val(),
              $("#editDepartment").val(),
              $("#editAddress").val(),
              $("#editPhoneNumber").val(),
              $("#editSalary").val(),
              $("#editLeaveBalance").val(),
              $("#editRole").val(),
              `<i class="fas fa-edit edit-btn" data-id="${employeeId}" title="Edit" data-bs-toggle="modal" data-bs-target="#editEmployeeModal"></i>
                 <i class="fas fa-trash delete-btn" data-id="${employeeId}" title="Delete"></i>`,
            ])
            .draw();
        } else {
          console.warn("Row not found for updated employee ID:", employeeId);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error updating employee record:", error);
        let errorMessage = "Error updating employee record.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        }
        alert(errorMessage); // Provide user feedback
        // Hide the spinner
        $("#editEmployeeForm").find(".spinner-border").addClass("d-none");
      },
    });
  });

  // Handle submission of the add employee form
  $("#addEmployeeForm").submit(function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Show the spinner
    $(this).find(".spinner-border").removeClass("d-none");

    // Get the form data
    const formData = $(this).serializeArray();

    // Make an AJAX request to add the new employee
    $.ajax({
      url: "http://localhost:3003/employees",
      method: "POST",
      data: formData, // Send all form data
      success: function (response) {
        employeeTable.clear().draw();
        $("#addEmployeeForm")[0].reset();
        // Close the modal and wait for it to be fully hidden
        $("#addEmployeeModal")
          .one("hidden.bs.modal", function (e) {
            $("#addEmployeeForm").find(".spinner-border").addClass("d-none");

            // Show success alert
            alert("Employee added successfully");
          })
          .modal("hide");

        $.ajax({
          url: "http://localhost:3003/employees",
          method: "GET",
          success: function (data) {
            // Loop through each employee record and append it to the table
            data.forEach(function (record) {
              employeeTable.row
                .add([
                  record.id,
                  record.first_name,
                  record.last_name,
                  record.email,
                  record.position,
                  record.department,
                  record.address,
                  record.phone_number,
                  record.salary,
                  record.leave_balance,
                  record.role,
                  `<i class="fas fa-edit edit-btn" data-id="${record.id}" title="Edit" data-bs-toggle="modal" data-bs-target="#editEmployeeModal"></i>
                   <i class="fas fa-trash delete-btn" data-id="${record.id}" title="Delete"></i>`,
                ])
                .draw(false);
            });
          },
          error: function (xhr, status, error) {
            console.error("Error fetching employee records:", error);
          },
        });
      },
      error: function (xhr, status, error) {
        console.error("Error adding employee:", error);
        let errorMessage = "Error adding employee.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        }
        alert(errorMessage); // Provide user feedback

        // Hide the spinner
        $("#addEmployeeForm").find(".spinner-border").addClass("d-none");
      },
    });
  });
});
