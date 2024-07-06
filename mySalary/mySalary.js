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

document.getElementById("entry-icon").addEventListener("click", function () {
  const now = new Date();
  alert(
    `Arrive at work at ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
  );
});

document.getElementById("exit-icon").addEventListener("click", function () {
  const now = new Date();
  alert(
    `Leave work at ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
  );
});

document.addEventListener("DOMContentLoaded", () => {
  manageNavVisibility();

  $(document).ready(function () {
    const token = localStorage.getItem("auth_token");
    const employeeID = localStorage.getItem("employeeID");

    if (!token) {
      window.location.href = "../login/login.html";
      return;
    }

    document
      .getElementById("logout-btn")
      .addEventListener("click", function () {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("employeeID");
        window.location.href = "../login/login.html";
      });

    function displayEmployeeSalary(employeeID) {
      $.ajax({
        url: `http://localhost:3002/salaries/${employeeID}`,
        method: "GET",
        success: function (data) {
          if (data && Object.keys(data).length > 0) {
            $("#employee-name").text("Employee: " + data.employee_name);
            $("#salary").text(
              "Salary: $" + parseFloat(data.base_salary).toFixed(2)
            ); // Convert to number and format
            $("#next-salary-date").text(
              "Next Salary Date: " +
                moment(data.payout_date).format("YYYY-MM-DD")
            );
            $("#bonus").text("Bonus: $" + parseFloat(data.bonus).toFixed(2)); // Convert to number and format
            $("#deductions").text(
              "Deductions: $" + parseFloat(data.deduction).toFixed(2)
            ); // Convert to number and format
          } else {
            $("#employee-name").text("Employee: Not available");
            $("#salary").text("Salary: Not available");
            $("#next-salary-date").text("Next Salary Date: Not available");
            $("#bonus").text("Bonus: Not available");
            $("#deductions").text("Deductions: Not available");
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching salary record:", error);
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

    displayEmployeeSalary(employeeID);
  });
});
