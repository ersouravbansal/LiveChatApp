$(document).ready(function () {
    const socket = io();

    // Fetch available chatrooms when the page loads
    fetchChatrooms();

    // Handle chatroom selection
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
        getMessages(selectedChatroom);
      }
    });

    // Handle creating a new chatroom
    $("#createRoom").click(function () {
      const newRoomName = prompt("Enter the name for the new room:");
      if (newRoomName) {
        createChatroom(newRoomName);
      }
    });

    $("#send").click(function () {
      sendMessage({
        name: $("#name").val(),
        message: $("#message").val(),
        chatroom: $(".chatroom-block.selected").data("chatroom"),
      });
    });

    socket.on("message", addMessage);

    // Listen for newRoom event
    socket.on("newRoom", function (newRoomName) {
      // Add the new room to the list
      addChatroom(newRoomName);
    });

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
      $("#messages").prepend(`
      <div class="message">
        <strong>${message.name}:</strong> ${message.message}
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
      $.post("/messages", message);
      $("#name").val("");
      $("#message").val("");
    }

    function createChatroom(newRoomName) {
      // Emit an event to the server to create the new chatroom
      socket.emit("createRoom", newRoomName);
    }
  });
