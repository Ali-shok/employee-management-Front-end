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

  const performanceReviewTable = $("#performance-review-table").DataTable({
    columnDefs: [
      {
        targets: -1, // Actions column
        className: "dt-center", // Center align the content
      },
    ],
    pageLength: 15,
    lengthMenu: [15, 20, 25],
  });

  // DataTable initialization
  $.ajax({
    url: "http://localhost:3004/performance",
    method: "GET",
    success: function (data) {
      // Clear existing table data
      performanceReviewTable.clear().draw();

      // Loop through each performance review record and append it to the table
      data.forEach(function (record) {
        const formattedDate = moment(record.review_date).format("YYYY-MM-DD");
        performanceReviewTable.row
          .add([
            record.id,
            record.employee_name,
            formattedDate,
            record.performance_rating,
            record.notes,
            `<i class="fas fa-edit edit-btn" data-id="${record.id}" title="Edit" data-bs-toggle="modal" data-bs-target="#editPerformanceReviewModal"></i>
             <i class="fas fa-trash delete-btn" data-id="${record.id}" title="Delete"></i>`,
          ])
          .draw(false);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching performance review records:", error);
    },
  });

  // Function to fetch all employees and populate the select input
  $.ajax({
    url: "http://localhost:3003/employees/role/employee",
    method: "GET",
    success: function (employees) {
      const employeeSelect = $("#employeeSelect");
      const editEmployeeName = $("#editEmployeeName");
      editEmployeeName.empty();
      employeeSelect.empty(); // Clear existing options
      employees.forEach(function (employee) {
        employeeSelect.append(
          `<option value="${employee.id}">${employee.first_name} ${employee.last_name}</option>`
        );
        editEmployeeName.append(
          `<option value="${employee.id}">${employee.first_name} ${employee.last_name}</option>`
        );
      });
    },

    error: function (xhr, status, error) {
      console.error("Error fetching employees:", error);
    },
  });

  // Fetch data from API and populate the DataTable
  $("#addPerformanceReviewForm").submit(function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Show spinner
    $(this).find(".spinner-border").removeClass("d-none");

    // Get form data
    const formData = $(this).serialize();

    // Make AJAX request to add performance review
    $.ajax({
      url: "http://localhost:3004/performance",
      method: "POST",
      data: formData,
      success: function (response) {
        $("#addPerformanceReviewForm")[0].reset();
        $("#addPerformanceReviewModal")
          .one("hidden.bs.modal", function (e) {
            // Hide spinner

            $("#addPerformanceReviewForm")
              .find(".spinner-border")
              .addClass("d-none");

            // Close modal
          })
          .modal("hide");

        $.ajax({
          url: "http://localhost:3004/performance",
          method: "GET",
          success: function (data) {
            performanceReviewTable.clear().draw();

            data.forEach(function (record) {
              const formattedDate = moment(record.review_date).format(
                "YYYY-MM-DD"
              );
              performanceReviewTable.row
                .add([
                  record.id,
                  record.employee_name,
                  formattedDate,
                  record.performance_rating,
                  record.notes,
                  `<i class="fas fa-edit edit-btn" data-id="${record.id}" title="Edit" data-bs-toggle="modal" data-bs-target="#editPerformanceReviewModal"></i>
                     <i class="fas fa-trash delete-btn" data-id="${record.id}" title="Delete"></i>`,
                ])
                .draw(false);
            });
          },
          error: function (xhr, status, error) {
            console.error("Error fetching performance reviews:", error);
          },
        });
        // Refresh DataTable

        // Show success alert
        alert("Performance review added successfully");
      },
      error: function (xhr, status, error) {
        console.error("Error adding performance review:", error);

        // Hide spinner
        $("#addPerformanceReviewForm")
          .find(".spinner-border")
          .addClass("d-none");

        // Show error alert
        alert("Error adding performance review. Please check server logs.");
      },
    });
  });

  // Delet Performance
  $("#performance-review-table").on("click", ".delete-btn", function () {
    const reviewId = $(this).data("id");

    // Display confirmation prompt before deleting
    const confirmation = confirm(
      "Are you sure you want to delete this performance review?"
    );

    if (confirmation) {
      // Send DELETE request to backend if confirmed
      $.ajax({
        url: `http://localhost:3004/performance/${reviewId}`, // Use template literal for route with ID
        method: "DELETE", // Use DELETE method for deletion
        success: function () {
          // Remove deleted record from DataTables
          performanceReviewTable
            .row($(".delete-btn[data-id='" + reviewId + "']").closest("tr"))
            .remove()
            .draw();
          console.log("Performance review deleted successfully");
        },
        error: function (xhr, status, error) {
          console.error("Error deleting performance review:", error);
          alert("Error deleting performance review. Please check server logs."); // Provide user feedback
        },
      });
    }
  });

  $("#performance-review-table").on("click", ".edit-btn", function () {
    const reviewId = $(this).data("id");
    // Fetch data for the clicked performance review ID from the table
    const rowData = performanceReviewTable.row($(this).closest("tr")).data();

    const formattedReviewDate = moment(rowData[2]).format("YYYY-MM-DD");

    // Populate the modal with the row data
    $("#editPerformanceReviewModal #editReviewId").val(rowData[0]);
    $("#editPerformanceReviewModal #editReviewDate").val(formattedReviewDate); // Assuming the review date is stored at index 2
    $("#editPerformanceReviewModal #editPerformanceRating").val(rowData[3]); // Assuming the performance rating is stored at index 3
    $("#editPerformanceReviewModal #editNotes").val(rowData[4]); // Assuming the notes are stored at index 4

    const selectedEmployeeName = rowData[1];

    // Find the employee option that matches the selected employee name
    const employeeOption = $("#editEmployeeName option").filter(function () {
      return $(this).text() === selectedEmployeeName;
    });

    // If the option exists, select it; otherwise, clear the selection
    if (employeeOption.length) {
      employeeOption.prop("selected", true);
    } else {
      $("#editEmployeeName").val(""); // Clear selection if option not found
    }
  });

  // Edit Performance
  $("#editPerformanceReviewForm").submit(function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Select the appropriate employee option based on ID (assuming reviewData[4] is employee ID)
    // Show the spinner
    $(this).find(".spinner-border").removeClass("d-none");

    // Get the form data
    const formData = $(this).serializeArray();

    // Get the performance review ID from the form
    const reviewId = $("#editReviewId").val();

    // Make an AJAX request to update the performance review record
    $.ajax({
      url: "http://localhost:3004/performance/" + reviewId,
      method: "PUT",
      data: formData, // Send all form data
      success: function () {
        // Close the modal and wait for it to be fully hidden
        $("#editPerformanceReviewModal")
          .one("hidden.bs.modal", function (e) {
            const row = performanceReviewTable.row(
              $(`#performance-review-table [data-id="${reviewId}"]`).closest(
                "tr"
              )
            );
            if (row) {
              row
                .data([
                  reviewId,
                  $(
                    "#editPerformanceReviewModal #editEmployeeName option:selected"
                  ).text(),
                  moment(
                    $("#editPerformanceReviewModal #editReviewDate").val()
                  ).format("YYYY-MM-DD"),
                  $("#editPerformanceReviewModal #editPerformanceRating").val(),
                  $("#editPerformanceReviewModal #editNotes").val(),
                  `<i class="fas fa-edit edit-btn" data-id="${reviewId}" title="Edit" data-bs-toggle="modal" data-bs-target="#editPerformanceReviewModal"></i> 
                    <i class="fas fa-trash delete-btn" data-id="${reviewId}" title="Delete"></i>`,
                ])
                .draw();
            } else {
              console.warn(
                "Row not found for updated performance review ID:",
                reviewId
              );
            }
            // Reload the performance review data in the table or update as needed
            alert("Performance review details updated successfully");

            $("#editPerformanceReviewForm")
              .find(".spinner-border")
              .addClass("d-none");
          })
          .modal("hide");
      },
      error: function (xhr, status, error) {
        console.error("Error updating performance review record:", error);
        let errorMessage = "Error updating performance review record.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        }
        alert(errorMessage); // Provide user feedback
        // Hide the spinner
        $("#editPerformanceReviewForm")
          .find(".spinner-border")
          .addClass("d-none");
      },
    });
  });
});
