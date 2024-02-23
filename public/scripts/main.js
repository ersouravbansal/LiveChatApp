$(document).ready(function () {
  const socket = io();
  let visitorId;
  let isLoggedIn = false;
  let loggedInUsername = "";
  $("#loginForm").hide();
  $("#signupForm").hide();

  $(document).on("click", function (e) {
    // Check if the click is outside the login block
    if (!$(e.target).closest("#loginBlock").length && !$(e.target).is("#loginBlock")) {
      $("#loginForm").hide();
    }

    // Check if the click is outside the signup block
    if (!$(e.target).closest("#signupBlock").length && !$(e.target).is("#signupBlock")) {
      $("#signupForm").hide();
    }
  });
  // Fetch available chatrooms when the page loads
  fetchChatrooms();

  // Initialize the visitor identification
  const fpPromise = import("https://openfpcdn.io/fingerprintjs/v4").then(
    (FingerprintJS) => FingerprintJS.load()
  );

  // Get the visitor identifier
  fpPromise
    .then((fp) => fp.get())
    .then((result) => {
      visitorId = result.visitorId;
      console.log("Device ID:", visitorId);
    });

  // Event listeners for login, logout, and signup
  setupEventListeners();

  function setupEventListeners() {
    $("#createRoom").click(function () {
      const newRoomName = prompt("Enter the name for the new chatroom:");
      if (newRoomName) {
        createChatroom(newRoomName);
      }
    });
        // Event listener for the login block
        $("#loginBlock").click(function () {
          $("#loginForm").show();
        });
    
        // Event listener for the signup block
        $("#signupBlock").click(function () {
          $("#signupForm").show();
        });

    $("#send").click(function () {
      if (!isLoggedIn) {
        alert("Please log in to send messages.");
        return;
      }
      sendMessage({
        name: $("#name").val(),
        message: $("#message").val(),
        chatroom: $(".chatroom-block.selected").data("chatroom"),
        userId: visitorId,
      });
    });

    socket.on("message", addMessage);

    socket.on("newRoom", function (newRoomName) {
      addChatroom(newRoomName);
    });

    checkLoginStatus(); // Initial check

    $("#login").click(function () {
      const loginEmail = $("#loginEmail").val();
      const loginPassword = $("#loginPassword").val();

      $.ajax({
        type: "POST",
        url: "/login",
        data: { username: loginEmail, password: loginPassword },
        success: function (response) {
          isLoggedIn = true;
          loggedInUsername = response.username; 
          $("#name").val(loggedInUsername); 
          $("#welcomeuser").text(loggedInUsername); 
          checkLoginStatus();
        },
        error: function (xhr, status, error) {
          alert("Login failed: " + xhr.responseJSON.message);
        },
      });
    });

    $("#logout").click(function () {
      $.ajax({
        type: "POST",
        url: "/logout",
        success: function (response) {
          isLoggedIn = false;
          loggedInUsername = "";
          $("#name").val(""); 
          $("#loginEmail").val(""); 
          $("#loginPassword").val(""); 
          checkLoginStatus();
        },
        error: function (xhr, status, error) {
          alert("Logout failed: " + xhr.responseJSON.message);
        },
      });
    });

    $("#signup").click(function () {
      const signupEmail = $("#signupEmail").val();
      const signupPassword = $("#signupPassword").val();

      $.ajax({
        type: "POST",
        url: "/register",
        data: { username: signupEmail, password: signupPassword },
        success: function (response) {
          alert("Signup successful, please log in.");
        },
        error: function (xhr, status, error) {
          alert("Signup failed: " + xhr.responseJSON.message);
        },
      });
    });
  }

  function checkLoginStatus() {
    $("#name").hide();
    if (isLoggedIn) {
      $("#loginBlock").hide();
      $("#signupBlock").hide();
      $("#welcomeMessage").show();
      $("#welcomeuser").text(loggedInUsername);
    } else {
      $("#loginBlock").show();
      $("#signupBlock").show();
      $("#welcomeMessage").hide();
    }
  }

  function fetchChatrooms() {
    $.get("/chatrooms", function (data) {
      data.forEach((chatroom) => {
        addChatroom(chatroom);
      });
    });
  }

  function addChatroom(chatroom) {
    $("#chatroomList").append(`
      <div class="chatroom-block" data-chatroom="${chatroom}">
        ${chatroom}
      </div>
    `);
  }

  function addMessage(message) {
    const senderName = message.name || loggedInUsername || "Unknown User";
    $("#messages").prepend(`
      <div class="message">
        <strong>${senderName}:</strong> ${message.message}
      </div>
    `);
  }

  function getMessages(chatroom) {
    $.get(`/messages/${chatroom}`, function (data) {
      $("#messages").empty();
      data.forEach(addMessage);
    });
  }

  function sendMessage(message) {
    const trimmedMessage = message.message.trim();
    if (trimmedMessage === "") {
      alert("Please enter a valid message.");
      return;
    }
  
    $("#name").val("");
    $("#message").val("");
    $.post("/messages", message);
  }

  function createChatroom(newRoomName) {
    // Emit an event to the server to create the new chatroom
    socket.emit("createRoom", newRoomName);
  }

  // Event listener for the logout button
  $("#logout").click(function () {
    // Make AJAX request to logout endpoint
    $.ajax({
      type: "POST",
      url: "/logout",
      success: function (response) {
        // Handle successful logout
        alert("LoggedOut Successfully!.");
        console.log("Logout successful:", response);
        // Optionally, you can redirect the user to the login page or update the UI accordingly
      },
      error: function (error) {
        // Handle logout error
        console.error("Logout error:", error.responseJSON.message);
      },
    });
    checkLoginStatus();
  });

  // Event listener for the login button
  $("#login").click(function () {
    const loginEmail = $("#loginEmail").val();
    const loginPassword = $("#loginPassword").val();

    // Make AJAX request to login endpoint
    $.ajax({
      type: "POST",
      url: "/login",
      data: { username: loginEmail, password: loginPassword },
      success: function (response) {
        // Handle successful login
        console.log("Login successful:", response);
        isLoggedIn = true;
        loggedInUsername = response.user.username;
        $("#name").val(loggedInUsername);
        $("#welcomeuser").html(loggedInUsername);
      },
      error: function (error) {
        // Handle login error
        console.error("Login error:", error.responseJSON.message);
      },
    });
    checkLoginStatus();
  });

  // Event listener for the signup button
  $("#signup").click(function () {
    const signupEmail = $("#signupEmail").val();
    const signupPassword = $("#signupPassword").val();

    // Make AJAX request to register endpoint
    $.ajax({
      type: "POST",
      url: "/register",
      data: { username: signupEmail, password: signupPassword },
      success: function (response) {
        // Handle successful registration
        console.log("Registration successful:", response);
      },
      error: function (error) {
        // Handle registration error
        console.error("Registration error:", error.responseJSON.message);
      },
    });
  });
  $(document).on("click", ".chatroom-block", function () {
    // Remove the 'selected' class from all chatroom blocks
    $(".chatroom-block").removeClass("selected");

    const selectedChatroom = $(this).data("chatroom");
    if (selectedChatroom) {
      // Add the 'selected' class to the clicked chatroom block
      $(this).addClass("selected");

      // Join the selected chatroom
      socket.emit("join", selectedChatroom);

      // Fetch messages for the selected chatroom
      getMessages(selectedChatroom); // Ensure this function is called
    }
  });
});
