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
document.getElementById("entry-icon").addEventListener("click", function () {
  const now = new Date();
  alert(
    `Arrive at work at ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
  );
});

// Event handler for exit icon click
document.getElementById("exit-icon").addEventListener("click", function () {
  const now = new Date();
  alert(
    `Leave work at ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
  );
});

// Call the function immediately

$(document).ready(function () {
  const role = localStorage.getItem("user_role");
  const token = localStorage.getItem("auth_token");
  const employeeID = localStorage.getItem("employeeID");

  // log out
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
  const employeeSalariesTable = $("#employee-salaries-table").DataTable({
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
    url: "http://localhost:3002/employee-salaries",
    method: "GET",
    success: function (data) {
      // Clear existing table data
      employeeSalariesTable.clear().draw();

      // Loop through each salary record and append it to the table
      data.forEach(function (record) {
        const formattedDate = moment(record.payout_date).format("YYYY-MM-DD");
        employeeSalariesTable.row
          .add([
            record.id,
            record.first_name,
            record.last_name,
            record.base_salary,
            record.bonus,
            record.deduction,
            formattedDate,
            `<i class="fas fa-edit edit-btn" data-id="${record.id}" title="Edit" data-bs-toggle="modal" data-bs-target="#editSalaryModal"></i>
                 <i class="fas fa-trash delete-btn" data-id="${record.id}" title="Delete"></i>`,
          ])
          .draw(false);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching salary records:", error);
    },
  });

  // Handle click events on action icons
  $("#employee-salaries-table").on("click", ".edit-btn", function () {
    const employeeId = $(this).data("id");

    // Fetch data for the clicked employee ID from the table
    const rowData = employeeSalariesTable.row($(this).closest("tr")).data();

    // Populate the modal with the row data
    $("#editSalaryModal #employeeId").val(rowData[0]);
    $("#editSalaryModal #firstName").val(rowData[1]);
    $("#editSalaryModal #lastName").val(rowData[2]);
    $("#editSalaryModal #baseSalary").val(rowData[3]);
    $("#editSalaryModal #bonus").val(rowData[4]);
    $("#editSalaryModal #deduction").val(rowData[5]);
    $("#editSalaryModal #payoutDate").val(
      moment(rowData[6]).format("YYYY-MM-DD")
    );
  });

  // Add event listener to the input fields for formatting values with two decimal places
  $("#baseSalary, #bonus, #deduction").on("input", function () {
    // Get the entered value
    let value = $(this).val();

    // Format the value to include two decimal places
    value = parseFloat(value).toFixed(2);

    // Update the input field with the formatted value
    $(this).val(value);
  });

  // Handle submission of the edit form
  $("#editSalaryForm").submit(function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Show the spinner
    $(this).find(".spinner-border").removeClass("d-none");

    // Get the form data
    const formData = $(this).serializeArray();

    // Filter the formData array to include only the fields you want to update
    const filteredFormData = formData.filter((field) => {
      return ["base_salary", "bonus", "payout_date", "deduction"].includes(
        field.name
      );
    });

    // Get the employeeId
    const employeeId = formData.find(
      (field) => field.name === "employeeId"
    ).value;

    // Make an AJAX request to update the salary record
    $.ajax({
      url: "http://localhost:3002/salaries/" + employeeId,
      method: "PUT",
      data: filteredFormData, // Send only the filtered form data
      success: function () {
        // Close the modal and wait for it to be fully hidden
        $("#editSalaryModal")
          .one("hidden.bs.modal", function (e) {
            const row = employeeSalariesTable.row(
              $(`#employee-salaries-table [data-id="${employeeId}"]`).closest(
                "tr"
              )
            );

            if (row) {
              // Update the row data with new values from the form
              row
                .data([
                  employeeId,
                  $("#editSalaryModal #firstName").val(),
                  $("#editSalaryModal #lastName").val(),
                  $("#editSalaryModal #baseSalary").val(),
                  $("#editSalaryModal #bonus").val(),
                  $("#editSalaryModal #deduction").val(),
                  moment($("#editSalaryModal #payoutDate").val()).format(
                    "YYYY-MM-DD"
                  ),
                  `<i class="fas fa-edit edit-btn" data-id="${employeeId}" title="Edit" data-bs-toggle="modal" data-bs-target="#editSalaryModal"></i>
                  <i class="fas fa-trash delete-btn" data-id="${employeeId}" title="Delete"></i>`,
                  // ... (rest of the data if applicable)
                ])
                .draw(); // Update the row and redraw
            } else {
              console.warn(
                "Row not found for updated employee ID:",
                employeeId
              );
            }

            // Reload the DataTable to reflect the changes
            // Reload the DataTable
            // Reload only if not using server-side processing
            // Hide the spinner
            $("#editSalaryForm").find(".spinner-border").addClass("d-none");
            // Show success alert
            alert("Salary record updated successfully");
          })
          .modal("hide");
      },
      error: function (xhr, status, error) {
        console.error("Error updating salary record:", error);
        alert("Error updating record. Please check server logs."); // Provide user feedback
        // Hide the spinner
        $("#editSalaryForm").find(".spinner-border").addClass("d-none");
      },
    });
  });

  $("#employee-salaries-table").on("click", ".delete-btn", function () {
    const employeeId = $(this).data("id");

    // Display confirmation prompt before deleting
    const confirmation = confirm(
      "Are you sure you want to delete this salary record?"
    );

    if (confirmation) {
      // Send DELETE request to backend if confirmed
      $.ajax({
        url: `http://localhost:3002/salaries/${employeeId}`, // Use template literal for route with ID
        method: "DELETE", // Use DELETE method for deletion
        success: function () {
          // Remove deleted record from DataTables
          employeeSalariesTable
            .row($(".delete-btn[data-id='" + employeeId + "']").closest("tr"))
            .remove()
            .draw();
          console.log("Salary record deleted successfully");
        },
        error: function (xhr, status, error) {
          console.error("Error deleting salary record:", error);
          alert("Error deleting record. Please check server logs."); // Provide user feedback
        },
      });
    }
  });

  // Fetch employees and populate select options
  $.ajax({
    url: "http://localhost:3003/employees/role/employee",
    method: "GET",
    success: function (data) {
      const employeeSelect = $("#employeeSelect");
      data.forEach(function (employee) {
        const option = `<option value="${employee.first_name} ${employee.last_name}">${employee.first_name} ${employee.last_name}</option>`;
        employeeSelect.append(option);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching employees:", error);
    },
  });

  // Add salary

  $("#addSalaryForm").submit(function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Show the spinner
    $(this).find(".spinner-border").removeClass("d-none");

    // Get the selected employee ID from the select field

    const formData = $(this).serializeArray();

    // Make an AJAX request to add the salary record
    $.ajax({
      url: "http://localhost:3002/salaries",
      method: "POST",
      data: formData,
      success: function () {
        $("#addSalaryForm")[0].reset();

        // Close the modal and wait for it to be fully hidden
        $("#addSalaryModal")
          .one("hidden.bs.modal", function (e) {
            // Reload the DataTable to reflect the changes
            // Hide the spinner
            $("#addSalaryForm").find(".spinner-border").addClass("d-none");
            // Show success alert
            alert("Salary record added successfully");
          })
          .modal("hide");

        // redraw the data table
        $.ajax({
          url: "http://localhost:3002/employee-salaries",
          method: "GET",
          success: function (data) {
            employeeSalariesTable.clear().draw();
            // Loop through each salary record and append it to the table
            data.forEach(function (record) {
              const formattedDate = moment(record.payout_date).format(
                "YYYY-MM-DD"
              );
              employeeSalariesTable.row
                .add([
                  record.id,
                  record.first_name,
                  record.last_name,
                  record.base_salary,
                  record.bonus,
                  record.deduction,
                  formattedDate,
                  `<i class="fas fa-edit edit-btn" data-id="${record.id}" title="Edit" data-bs-toggle="modal" data-bs-target="#editSalaryModal"></i>
                         <i class="fas fa-trash delete-btn" data-id="${record.id}" title="Delete"></i>`,
                ])
                .draw(false);
            });
          },
          error: function (xhr, status, error) {
            console.error("Error fetching salary records:", error);
          },
        });
      },
      error: function (xhr, status, error) {
        console.error("Error adding salary record:", error);
        alert("Error adding record. Please check server logs."); // Provide user feedback
        // Hide the spinner
        $("#addSalaryForm").find(".spinner-border").addClass("d-none");
      },
    });
  });

  const exportSalariesBtn = document.getElementById("export-salaries-btn");

  exportSalariesBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:3002/export-salaries");

      if (!response.ok) {
        throw new Error(`Error exporting salaries: ${response.statusText}`);
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "salaries.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting salaries:", error);
      alert("Error exporting salaries. Please check server logs."); // User feedback
    }
  });
});
