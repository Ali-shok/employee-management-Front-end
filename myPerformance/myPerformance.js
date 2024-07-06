function manageNavVisibility() {
  const role = localStorage.getItem("user_role");

  if (role === "employee") {
    document.getElementById("nav-leave-request").style.display = "block";
    const elementsToHide = [
      "nav-employees",
      "nav-salaries",
      "nav-performance",
      "nav-approve-leave-request",
    ];

    elementsToHide.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.visibility = "hidden";
        element.style.width = "0";
        element.style.height = "0";
        element.style.padding = "0";
        element.style.margin = "0";
        element.style.border = "0";
      }
    });
  } else {
    window.location.href = "../salary/salary.html";
    const leaveRequestNav = document.getElementById("nav-leave-request");
    if (leaveRequestNav) {
      leaveRequestNav.style.visibility = "hidden";
      leaveRequestNav.style.width = "0";
      leaveRequestNav.style.height = "0";
      leaveRequestNav.style.padding = "0";
      leaveRequestNav.style.margin = "0";
      leaveRequestNav.style.border = "0";
    }

    const approveLeaveRequestNav = document.getElementById(
      "nav-approve-leave-request"
    );
    if (approveLeaveRequestNav) {
      approveLeaveRequestNav.style.display = "block";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  manageNavVisibility();

  $(document).ready(function () {
    const role = localStorage.getItem("user_role");
    const token = localStorage.getItem("auth_token");
    const employeeID = localStorage.getItem("employeeID");

    if (!token) {
      // Redirect to the login page if token is not present
      window.location.href = "../login/login.html";
      return; // Stop further execution
    }

    // log out
    document
      .getElementById("logout-btn")
      .addEventListener("click", function () {
        // Remove token from localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("employeeID");
        // Redirect to sign-in page
        window.location.href = "../login/login.html";
      });
    function displayEmployeePerformance(employeeID) {
      $.ajax({
        url: `http://localhost:3004/performance/${employeeID}`,
        method: "GET",
        success: function (data) {
          if (data && Object.keys(data).length > 0) {
            // Format the review date using Moment.js
            const formattedReviewDate = moment(data.review_date).format(
              "MMMM DD, YYYY"
            );

            // Populate the performance details in the card
            $("#employee-name").text("Employee: " + data.employee_name);
            $("#review-date").text("Review Date: " + formattedReviewDate);
            $("#performance-rating").text(
              "Performance Rating: " + data.performance_rating
            );
            $("#notes").text("Notes: " + data.notes);
          } else {
            $("#employee-name").text("Employee: Not available");
            $("#review-date").text("Review Date: Not available");
            $("#performance-rating").text("Performance Rating: Not available");
            $("#notes").text("Notes: Not available");
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching performance details:", error);
          let errorMessage;
          try {
            errorMessage = JSON.parse(xhr.responseText).message;
          } catch (e) {
            errorMessage = "Unknown error occurred.";
          }
          alert(errorMessage);
        },
      });
    }
    displayEmployeePerformance(employeeID);
  });
});
