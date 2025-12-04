/* Kullanıcı seçimi */
const userItems = document.querySelectorAll(".user-item");

userItems.forEach(item => {
  item.addEventListener("click", () => {
    document.querySelector(".user-item.active")?.classList.remove("active");
    item.classList.add("active");

    // Backend olunca: Burada mesajları DB'den çekeceksiniz.
  });
});

const chatBox = document.getElementById("chatBox");
const msgInput = document.getElementById("msgInput");
const fileUpload = document.getElementById("fileUpload");

let messages = JSON.parse(localStorage.getItem("messages") || "[]");
renderMessages();

/* MESAJLARI EKRANA BAS */
function renderMessages() {
    chatBox.innerHTML = "";
    messages.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("message", msg.type);

        const time = `<small class="timestamp">${msg.time || getTime()}</small>`;
        div.innerHTML = `${msg.text}<br>${time}`;

        chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* SAAT */
function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* MESAJ GÖNDER */
function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    const msg = { text, type: "sent", time: getTime() };
    messages.push(msg);
    localStorage.setItem("messages", JSON.stringify(messages));
    msgInput.value = "";
    renderMessages();

    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();

        const reply = {
            text: "💬 Landlord: Thanks for your message!",
            type: "received",
            time: getTime()
        };

        messages.push(reply);
        localStorage.setItem("messages", JSON.stringify(messages));
        renderMessages();
    }, 1200);
}

/* ENTER → mesaj gönder  
   SHIFT + ENTER → satır atla */
msgInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

/* DOSYA YÜKLEME */
function uploadFile() {
    fileUpload.click();

    fileUpload.onchange = () => {
        const fileName = fileUpload.files[0]?.name;

        if (fileName) {
            const fileMsg = {
                text: `📎 Uploaded: <strong>${fileName}</strong>`,
                type: "sent",
                time: getTime()
            };

            messages.push(fileMsg);
            localStorage.setItem("messages", JSON.stringify(messages));
            renderMessages();
        }
    };
}

/* ÖZEL İSTEK */
function makeRequest() {
    const request = prompt("Enter your special request (e.g., Hosting a party on Saturday):");

    if (request) {
        const reqMsg = {
            text: `🎉 Request Sent: ${request}`,
            type: "sent",
            time: getTime()
        };

        messages.push(reqMsg);
        localStorage.setItem("messages", JSON.stringify(messages));
        renderMessages();

        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();

            const reply = {
                text: "✅ Landlord: Your request has been approved!",
                type: "received",
                time: getTime()
            };

            messages.push(reply);
            localStorage.setItem("messages", JSON.stringify(messages));
            renderMessages();
        }, 2000);
    }
}

/* TYPING ANIM */
function showTypingIndicator() {
    const typing = document.createElement("div");
    typing.id = "typingIndicator";
    typing.className = "typing-indicator";
    typing.innerText = "Landlord is typing...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.getElementById("typingIndicator");
    if (typing) typing.remove();
}
