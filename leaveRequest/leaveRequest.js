function manageNavVisibility() {
  const role = localStorage.getItem("user_role");
  if (role === "employee") {
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
  } else {
    window.location.href = "../salary/salary.html";
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

  const leaveBalanceElement = $("#leave-balance");
  // Function to fetch leave balance
  function fetchLeaveBalance(employeeId) {
    $.ajax({
      url: `http://localhost:3005/leave/balance/${employeeId}`,
      method: "GET",
      success: function (response) {
        leaveBalanceElement.text(response);
        console.log(response);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching leave balance:", error);
        alert("An error occurred while fetching leave balance.");
      },
    });
  }
  // Call the function to fetch leave balance
  fetchLeaveBalance(employeeID);

  const leaveRequestForm = $("#leave-request-form");
  const requestStatusElement = $("#request-status");
  const submitButton = leaveRequestForm.find('button[type="submit"]');
  const spinner = submitButton.find(".spinner-border");

  leaveRequestForm.on("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const employeeId = localStorage.getItem("employeeID"); // Assuming employeeId is stored in localStorage

    // Get start and end date values
    const startDate = new Date($("#start-date").val());
    const endDate = new Date($("#end-date").val());

    // Get current year
    const currentYear = new Date().getFullYear();

    // Check if both start and end dates are within the current year
    if (
      startDate.getFullYear() !== currentYear ||
      endDate.getFullYear() !== currentYear
    ) {
      // Display error message
      requestStatusElement
        .text("Leave dates must be within the current year")
        .css("color", "red");
      return; // Exit the function to prevent further execution
    }

    // Check if start date is completely greater than end date or vice versa
    if (startDate > endDate) {
      // Display error message
      requestStatusElement
        .text("Start date must be before end date")
        .css("color", "red");
      return; // Exit the function to prevent further execution
    }

    // Append employeeId to formData
    const formData = $(this).serializeArray();

    // Show the spinner
    spinner.removeClass("d-none");

    $.ajax({
      url: `http://localhost:3005/leave/requests/${employeeId}`,
      method: "POST",
      data: formData,
      success: function (data) {
        requestStatusElement.text(data.message).css("color", "green");
        leaveRequestForm[0].reset();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error submitting leave request:",
          textStatus,
          errorThrown
        );
        requestStatusElement
          .text("Error submitting leave request")
          .css("color", "red");
      },
      complete: function () {
        // Hide the spinner
        spinner.addClass("d-none");
      },
    });
  });

  function fetchLeaveRequests(employeeID) {
    $.ajax({
      url: `http://localhost:3005/leave/requests/${employeeID}`,
      method: "GET",
      success: function (data) {
        $("#leave-requests-table").empty();
        data.forEach(function (request) {
          const formattedStartDate = moment(request.start_date).format(
            "MM DD, YYYY"
          );
          const formattedEndDate = moment(request.end_date).format(
            "MM DD, YYYY"
          );
          let statusColor = "";
          if (request.status === "approved") {
            statusColor = "green";
          } else if (request.status === "rejected") {
            statusColor = "red";
          }
          const row = `
            <tr>
              <td>${request.employee_name}</td>
              <td>${formattedStartDate}</td>
              <td>${formattedEndDate}</td>
              <td>${request.reason}</td>
              <td style="color: ${statusColor}">${request.status}</td>
            </tr>
          `;
          $("#leave-requests-table").append(row);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching leave requests:", error);
      },
    });
  }
  fetchLeaveRequests(employeeID);
});
