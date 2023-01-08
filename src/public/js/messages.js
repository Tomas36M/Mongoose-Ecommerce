const socket = io();

const messagesContainer = document.getElementById("mesagge-cards");
const createMessageForm = document.getElementById("create-message-form");

socket.on("messages", (messages) => {
    const allMessagesElements = messages.map((message) => ` 
            <div class="card m-2">
                <div class="card-header">${message.user}</div>
                <div class="card-body">                  
                    <p>${message.message}</p>
                </div>
            </div>`).join(" ");

    messagesContainer.innerHTML = allMessagesElements;
});

createMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(createMessageForm);

    const message = {};

    for (const field of formData.entries()) {
        message[field[0]] = field[1];
    }

    const response = await fetch("/api/messages", {
        body: JSON.stringify(message),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const responseJson = await response.json();
    console.log(responseJson);
});