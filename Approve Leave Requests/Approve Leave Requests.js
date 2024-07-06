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

  if (!token) {
    // Redirect to the login page if token is not present
    window.location.href = "../login/login.html";
    return; // Stop further execution
  }
  manageNavVisibility();

  //log out
  document.getElementById("logout-btn").addEventListener("click", function () {
    // Remove token from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("employeeID");
    // Redirect to sign-in page
    window.location.href = "../login/login.html";
  });

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch("http://localhost:3005/leave/requests");
      const leaveRequests = await response.json();
      return leaveRequests;
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      alert("Error fetching leave requests");
    }
  };
  const formatDate = (dateString) => {
    const options = {year: "numeric", month: "long", day: "numeric"};
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  let table;

  const loadTableData = async () => {
    const leaveRequests = await fetchLeaveRequests();

    if (!table) {
      // Initialize DataTable if it's not already initialized
      table = $("#leaveRequestsTable").DataTable({
        columns: [
          {title: "Employee ID", visible: false}, // Hide the column
          {title: "Employee Name"},
          {title: "Start Date"},
          {title: "End Date"},
          {title: "Reason"},
          {title: "Status"},
          {title: "Leave Balance"},
          {title: "Actions"},
        ],
      });
    } else {
      // Clear existing data if DataTable is already initialized
      table.clear().draw();
    }

    for (const request of leaveRequests) {
      const statusClass =
        request.status === "approved"
          ? "text-success"
          : request.status === "rejected"
          ? "text-danger"
          : "";
      table.row.add([
        request.employee_id,
        request.employee_name,
        formatDate(request.start_date),
        formatDate(request.end_date),
        request.reason,
        `<span class="${statusClass}">${request.status}</span>`,
        request.balance,
        `<i class="fa fa-edit edit-icon" data-id="${request.id}"></i>
         <i class="fa fa-trash delete-icon" data-id="${request.id}"></i>`,
      ]);
    }
    table.draw();
  };

  loadTableData();

  $("#leaveRequestsTable tbody").on("click", ".delete-icon", function () {
    const requestId = $(this).data("id");

    // Send a DELETE request to delete the leave request
    $.ajax({
      url: `http://localhost:3005/leave/requests/${requestId}`,
      method: "DELETE",
      success: function (data) {
        alert(data.message); // Show success message
        // Reload the table data after successful deletion
        loadTableData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error deleting leave request:", textStatus, errorThrown);
        alert("Error deleting leave request. Please try again.");
      },
    });
  });

  $("#leaveRequestsTable tbody").on("click", ".edit-icon", function () {
    const requestId = $(this).data("id");
    // Populate the hidden input with the request ID
    $("#editRequestId").val(requestId);
    // Show the modal
    $("#editLeaveRequestModal").modal("show");
  });

  // Handle form submission
  $("#editLeaveRequestForm").on("submit", async function (e) {
    e.preventDefault();
    const requestId = $("#editRequestId").val();
    const status = $("#editStatus").val();

    // Show spinner
    $(".spinner-border").removeClass("d-none");

    try {
      const response = await fetch(
        `http://localhost:3005/leave/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({status}),
        }
      );

      if (response.ok) {
        alert("Leave request status updated successfully");
        // Hide the modal
        $("#editLeaveRequestModal").modal("hide");
        loadTableData(); // Refresh the table data
      } else {
        alert("Error updating leave request status");
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
    } finally {
      // Hide spinner
      $(".spinner-border").addClass("d-none");
    }
  });
});
