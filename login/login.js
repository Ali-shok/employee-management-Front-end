$(document).ready(function () {
  // Handle sign-in form submission
  $("#sign-in-form").submit(function (event) {
    event.preventDefault();

    // Reference form elements
    const emailInput = $("#email");
    const passwordInput = $("#password");
    const signInButton = $("#sign-in-btn");
    const spinner = $("#spinner");

    // Clear any previous error messages
    $("#sign-in-form").removeClass("was-validated");

    // Basic validation
    if (emailInput.val() === "" || passwordInput.val() === "") {
      $("#sign-in-form").addClass("was-validated");
      return; // Prevent submission if fields are empty
    }

    // Show spinner and disable button
    spinner.removeClass("d-none"); // Show the spinner
    signInButton.attr("disabled", true); // Disable the button

    // Get form data
    const formData = {
      email: emailInput.val(),
      password: passwordInput.val(),
    };

    // Send POST request to login endpoint (replace URL with yours)
    $.ajax({
      type: "POST",
      url: "http://localhost:3001/login", // Assuming your backend is running on this URL
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        console.log(response);
        // Hide spinner and enable button on success
        spinner.addClass("d-none"); // Hide the spinner
        signInButton.attr("disabled", false); // Enable the button

        // Extract and store token in local storage (assuming response has a "token" property)
        const role = response.user.role;
        const token = response.token;
        const employeeID = response.user.userId;
        if (token) {
          localStorage.setItem("auth_token", token); // Store token in local storage
          localStorage.setItem("user_role", role); // Store user role in local storage
          localStorage.setItem("employeeID", employeeID); // Store user ID in local storage
          if (role === "employye") {
            window.location.href = "../mySalary/mySalary.html";
            return;
          } else {
            window.location.href = "../salary/salary.html";
          }

          // Redirect to home page after successful sign-in
        } else {
          alert("An unexpected error occurred. Please try again later.");
        }
      },
      error: function (xhr, status, error) {
        // Hide spinner and enable button on error
        spinner.addClass("d-none");
        signInButton.attr("disabled", false);

        // Handle error response based on status code
        switch (xhr.status) {
          case 400:
            // Bad request (e.g., validation errors)
            const errorMessage = xhr.responseJSON.error;
            alert(errorMessage);
            $("#sign-in-form").addClass("was-validated"); // Mark form as validated
            break;
          case 401:
            // Unauthorized error
            alert("Invalid email or password. Please try again.");
            break;
          case 500:
            // Server error
            alert("An unexpected error occurred. Please try again later.");
            break;
          default:
            // Handle other errors (optional)
            alert("An unknown error occurred.");
        }
      },
    });
  });

  // Show forgot password modal when "Forgot Password?" link is clicked
  $(".forgot-password").click(function (event) {
    event.preventDefault();
    $("#forgotPasswordModal").modal("show");
  });

  // Handle forgot password form submission
  $("#forgot-password-form").submit(function (event) {
    event.preventDefault();

    // Reference form elements
    const emailInput = $("#forgot-email");
    const submitButton = $("#forgot-password-form button");
    const spinner = $("#forgotPasswordModal .spinner-border");
    const errorMessageElement = $("#forgot-password-error");

    // Basic validation
    if (emailInput.val() === "") {
      alert("Please enter your email.");
      return;
    }

    // Disable submit button
    submitButton.attr("disabled", true);

    // Show spinner
    spinner.removeClass("d-none");

    const formData = {email: emailInput.val()};

    // Basic validation
    $.ajax({
      type: "POST",
      url: "http://localhost:3001/forgot-password", // Assuming your backend endpoint URL
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        // Enable submit button
        submitButton.attr("disabled", false);
        spinner.addClass("d-none"); // Hide the spinner

        // Hide any previous error messages
        errorMessageElement.addClass("d-none");
        // Show success message
        alert("Password recovery email sent to: " + formData.email);
        // Reset form
        emailInput.val("");
        // Hide the modal
        $("#forgotPasswordModal").modal("hide");
      },
      error: function (xhr, status, error) {
        // Enable submit button
        submitButton.attr("disabled", false);

        let errorMessage;
        if (xhr.status === 404) {
          errorMessage =
            "Email not found. Please try a different email or create an account."; // More informative message
        } else {
          errorMessage =
            xhr.responseJSON.error || "An unexpected error occurred.";
        }
        // Display error message in alert
        alert(errorMessage);
        spinner.addClass("d-none"); // Hide the spinner
      },
    }); // Simulating a delay of 1 second (remove this in your actual implementation)
  });
});
