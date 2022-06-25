const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
let audio = new Audio("message.mp3");

let scrollToend = () => {
    let container = document.querySelector(".container");
    container.scrollTop = container.scrollHeight;
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`<p>${message}</p>`, "right");
    socket.emit("send", message);
    messageInput.value = "";
    scrollToend();
});

const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === "left") audio.play();
};

let UserName = prompt("Enter your name");
while (UserName === null || UserName === "")
    UserName = prompt(
        "You have not entered your name!! Enter your name to continue"
    );
socket.emit("new-user-joined", UserName);

socket.on("user-joined", (name) => {
    append(`${name} joined the chat`, "left-join");
    scrollToend();
});

socket.on("receive", (data) => {
    append(`<h6>${data.name}</h6> <p>${data.message}</p>`, "left");
    scrollToend();
});

socket.on("left", (name) => {
    append(`${name} left the chat`, "left-join");
    scrollToend();
});
