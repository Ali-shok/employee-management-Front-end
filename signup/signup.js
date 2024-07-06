const signUpForm = document.getElementById("sign-up-form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const positionInput = document.getElementById("position");
const departmentInput = document.getElementById("department");
const dobInput = document.getElementById("dob"); // Assuming you have an input with id 'dob' for date of birth
const phoneNumberInput = document.getElementById("phone-number");
const salaryInput = document.getElementById("salary");
const roleInput = document.getElementById("role");
const signUpButton = document.getElementById("sign-up-btn");
const spinner = document.getElementById("spinner");

signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Clear any previous errors
  const errorMessages = [];

  // Validate first name
  if (firstNameInput.value.trim() === "") {
    errorMessages.push("First name is required");
  }

  // Validate last name
  if (lastNameInput.value.trim() === "") {
    errorMessages.push("Last name is required");
  }

  if (roleInput.value.trim() === "") {
    errorMessages.push("role is required");
  }

  // Validate email
  if (emailInput.value.trim() === "") {
    errorMessages.push("Email is required");
  } else if (!isEmailValid(emailInput.value)) {
    errorMessages.push("Invalid email format");
  }

  // Validate password
  if (passwordInput.value.trim() === "") {
    errorMessages.push("Password is required");
  } else if (passwordInput.value.length < 6) {
    errorMessages.push("Password must be at least 6 characters long");
  }

  // Validate position
  if (positionInput.value.trim() === "") {
    errorMessages.push("Position is required");
  }

  // Validate department
  if (departmentInput.value.trim() === "") {
    errorMessages.push("Department is required");
  }

  // Validate phone number (basic check for empty value)
  if (phoneNumberInput.value.trim() === "") {
    errorMessages.push("Phone number is required");
  }

  // Validate salary (basic check for empty value and number)
  if (salaryInput.value.trim() === "" || isNaN(salaryInput.value)) {
    errorMessages.push("Salary is required and must be a number");
  }

  // Display error messages if any
  if (errorMessages.length > 0) {
    alert(errorMessages.join("\n"));
    return;
  }

  // Show loading spinner
  spinner.classList.remove("d-none");

  try {
    const response = await $.ajax({
      url: "http://localhost:3001/signup",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        position: positionInput.value,
        department: departmentInput.value,
        date_of_hire: new Date().toISOString().slice(0, 10), // Assuming you don't have a separate field for date of hire
        address: "", // Address field can be included here if needed
        phone_number: phoneNumberInput.value,
        salary: salaryInput.value,
        leave_balance: 0, // Assuming leave balance is set to 0 initially
        dob: dobInput.value,
        role: roleInput.value,
      }),
      success: function (data) {
        alert(data.message); // Display success message

        signUpForm.reset(); // Clear form fields
        window.location.href = "../login/login.html";
      },
      error: function (xhr, status, error) {
        alert(xhr.responseJSON.error); // Display error message from backend
      },
      complete: function () {
        spinner.classList.add("d-none"); // Hide loading spinner
      },
    });
  } catch (error) {
    console.error("Error signing up:", error);
    alert("An error occurred. Please try again later.");
    spinner.classList.add("d-none"); // Hide loading spinner
  }
});

function isEmailValid(email) {
  // Implement a regular expression or a more robust email validation check here
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
