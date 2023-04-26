
const CLIENT_ID = "fn7LEV73EEkTpgz3";
const user = {
    name: getRandomName(),
    color: getRandomColor(),
}
const drone = new ScaleDrone(CLIENT_ID, {
    data: user
});
let members = [];
drone.on("open", (error) => {
    if (error) {
        return alert('Dogodila se greška,pokušajte ponovo!');
    }
   alert("Uspješno ste spojeni na Scaledrone servis!");
    const room = drone.subscribe("observable-room");
    room.on("open", (error) => {
        if (error) {
            return alert('Dogodila se greška,pokušajte ponovo!');;
        }
    });
    room.on("members", (m) => {
        members = m;
    });
    room.on("memberJoin", (member) => {
        members.push(member);
    });
    room.on("memberLeave", ({ id }) => {
        const index = members.findIndex((member) => member.id === id);
        members.splice(index, 1);
    });
    room.on("data", (text, member) => {
        if (member) {
            addMessageToList(text, member);
        } else {
        }
    });
});
drone.on("close", (event) => {
});
drone.on("error", (error) => {
});
function getRandomName() {
    const imena = [
        "Marin",
        "Luka",
        "Ivica",
        "Ivan",
        "Tomislav",
        "Jakov",
        "Nikola",
        "Dragan",
        "Marko",
        "Ante"
    ];
    return imena [Math.floor(Math.random() * imena.length)];
}
function getRandomColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}
const messages = document.querySelector(".messages");
const messageFormInput = document.querySelector(".messageFormInput");
const messageForm = document.querySelector(".messageForm");
messageForm.addEventListener("submit", sendMessage);

function sendMessage() {
    const value = messageFormInput.value;
    if (value.trim().length === 0) {
        return alert ('Prazna poruka se ne može poslati');
    };
    messageFormInput.value = "";
    drone.publish({
        room: "observable-room",
        message: value,
    }); 
}
function createMemberElement(member) {
    const { name, color } = member.clientData;
    const el = document.createElement("div");
    el.appendChild(document.createTextNode(name));
    el.className = "member";
    el.style.color = color;
    return el;
}
function createMessageElement(text, member) {
    const { name } = member.clientData;
    const el = document.createElement("div");
    el.appendChild(createMemberElement(member));
    el.appendChild(document.createTextNode(text));
    el.className = name === user.name ? "message active" : "message";
    return el;
}
function addMessageToList(text, member) {
    const el = messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessageElement(text, member));
    if (wasTop) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
    }
}