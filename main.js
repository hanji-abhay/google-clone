const waffle = document.querySelector(".waffle-icon");
const apps = document.querySelector(".app-container");
waffle.addEventListener("click", (e) => {
    e.stopPropagation();
    apps.classList.toggle("open");
});
apps.addEventListener("click", e => e.stopPropagation());
document.addEventListener("click", () => {
    apps.classList.remove("open");
    });
document.querySelectorAll(".app").forEach(app => {
    app.addEventListener("click", () => {
        window.open(app.dataset.url, "_blank");
        });
});
const profileBtn = document.getElementById("profileBtn");
const accountPanel = document.getElementById("accountPanel");

profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    accountPanel.style.display =
        accountPanel.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", () => {
    accountPanel.style.display = "none";
});

const searchInput = document.querySelector(".search-container input");
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (!query) return;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
});
function doSearch(query) {
  if (!query) return;
  sessionStorage.setItem("searched", "true");
  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
const micBtn = document.querySelector(".mic");

micBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice search not supported in this browser");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(transcript)}`;
  };
});
micBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice search not supported");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    doSearch(transcript);
  };
});


const lensBtn = document.querySelector(".lens");

lensBtn.addEventListener("click", () => {
  window.open("https://lens.google.com/", "_blank");
});
const aiBtn = document.querySelector(".AI-mode");

aiBtn.addEventListener("click", () => {
  window.open("https://gemini.google.com/", "_blank");
});
window.addEventListener("pageshow", () => {
  if (sessionStorage.getItem("searched")) {
    searchInput.value = "";
    sessionStorage.removeItem("searched");
  }
});
const addBtn = document.getElementById("addShortcut");
const shortcuts = document.getElementById("shortcuts");
addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.querySelector(".shortcut-modal")) return;

    const modal = document.createElement("div");
    modal.className = "shortcut-modal";

    modal.innerHTML = `
        <strong>Add Shortcut</strong><br><br>
        <label>Name</label>
        <input type="text" id="nameInput" required>
        <label>URL</label>
        <input type="text" id="urlInput" required>

        <div class="modal-actions">
            <button class="cancel">Cancel</button>
            <button class="done" disabled>Done</button>
        </div>
    `;
    const nameInput = modal.querySelector("#nameInput");
const urlInput = modal.querySelector("#urlInput");
const doneBtn = modal.querySelector(".done");

function toggleDoneButton() {
    if (nameInput.value.trim() && urlInput.value.trim()) {
        doneBtn.disabled = false;
    } else {
        doneBtn.disabled = true;
    }
}

nameInput.addEventListener("input", toggleDoneButton);
urlInput.addEventListener("input", toggleDoneButton);


    document.body.appendChild(modal);
modal.querySelector(".cancel").addEventListener("click", () => {
        modal.remove();
    });

    modal.querySelector(".done").addEventListener("click", () => {

        const name = document.getElementById("nameInput").value.trim();
        let url = document.getElementById("urlInput").value.trim();

        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        createShortcut(name, url);
        modal.remove();
    });
    document.addEventListener("click", closeOnOutside);
    function closeOnOutside(ev) { 
        if (!modal.contains(ev.target) && ev.target !== addBtn) {
            modal.remove();
            document.removeEventListener("click", closeOnOutside);
        }
    }
});
function createShortcut(name, url) {
    const container = document.createElement("div");
    container.className = "shortcut-container custom-shortcut";
    container.innerHTML = `
        <div class="dots">&#x22EE;
            <div class="menu">
                <div  class="menu-item" data-action="edit">Edit</div>
                <div  class="menu-item" data-action="remove">Remove</div>
            </div>
        </div>
        <a href="${url}" target="_blank">
            <button>
                <span class="material-icons">language</span>
            </button>
        </a>
        <span>${name}</span>
    `;
shortcuts.insertBefore(container, addBtn);
}
document.addEventListener("click", (e) => {

    const menuItem = e.target.closest(".menu-item");
    if (menuItem) {
        e.stopPropagation();

        const container = menuItem.closest(".shortcut-container");
        const action = menuItem.dataset.action;

        if (action === "remove") {
            container.remove();
        }

        if (action === "edit") {
            openEditModal(container);
        }
        return;
    }

    const dots = e.target.closest(".dots");
    if (dots) {
        e.stopPropagation();

        // close others
        document.querySelectorAll(".menu.open").forEach(menu => menu.classList.remove("open"));
        document.querySelectorAll(".shortcut-container").forEach(c => c.classList.remove("menu-active"));

        const container = dots.closest(".shortcut-container");
        const menu = dots.querySelector(".menu");

        menu.classList.add("open");
        container.classList.add("menu-active");
        return;
    }

    // click outside → close all
    document.querySelectorAll(".menu.open").forEach(menu => menu.classList.remove("open"));
    document.querySelectorAll(".shortcut-container").forEach(c => c.classList.remove("menu-active"));
});
function openEditModal(container) {
    const nameSpan = container.querySelector("span");
    const link = container.querySelector("a");

    const modal = document.createElement("div");
    modal.className = "shortcut-modal";

    modal.innerHTML = `
        <strong>Edit Shortcut</strong>

        <label>Name</label>
        <input type="text" id="editName" value="${nameSpan.innerText}">

        <label>URL</label>
        <input type="text" id="editURL" value="${link.href}">

        <div class="modal-actions">
            <button class="cancel">Cancel</button>
            <button class="done">Done</button>
        </div>
    `;
    document.body.appendChild(modal);
    const nameInput = modal.querySelector("#editName")
    const urlInput = modal.querySelector("#editURL")

    modal.querySelector(".cancel").onclick = () => modal.remove();

    modal.querySelector(".done").onclick = () => {
        const newName = nameInput.value.trim();
        const newURL = urlInput.value.trim();

        if (newName) nameSpan.innerText = newName;
        if (newURL) link.href = newURL.startsWith("http") ? newURL : "https://" + newURL;

        modal.remove();
    };
}

