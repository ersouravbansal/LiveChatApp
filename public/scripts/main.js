$(document).ready(function () {
  const socket = io();
  let visitorId;

  // Fetch available chatrooms when the page loads
  fetchChatrooms();

  // Handle chatroom selection
  $(document).on("click", ".chatroom-block", function () {
    // Remove the 'selected' class from all chatroom blocks
    $(".chatroom-block").removeClass("selected");

    const selectedChatroom = $(this).data("chatroom");
    if (selectedChatroom) {
      const passcode = prompt("Enter the passcode for the room:");

      if (passcode) {
        // Add the 'selected' class to the clicked chatroom block
        $(this).addClass("selected");

        // Join the selected chatroom
        socket.emit("join", { chatroom: selectedChatroom, passcode });

        // Fetch messages for the selected chatroom
        getMessages(selectedChatroom);
      }
    }
  });

  // Handle creating a new chatroom
  $("#createRoom").click(function () {
    const newRoomName = prompt("Enter the name for the new room:");
    const newRoomPasscode = prompt("Enter the passcode for the new room:");

    if (newRoomName && newRoomPasscode) {
      createChatroom(newRoomName, newRoomPasscode);
    }
  });

  // ... (rest of your code remains unchanged)

  function createChatroom(newRoomName, newRoomPasscode) {
    // Emit an event to the server to create the new chatroom with passcode
    socket.emit("createRoom", { name: newRoomName, passcode: newRoomPasscode });
  }
});
