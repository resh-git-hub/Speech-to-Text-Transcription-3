// =====================================
// SPEECH TO TEXT CRUD APPLICATION
// =====================================


// Get saved records from browser

let records =
    JSON.parse(localStorage.getItem("speechRecords")) || [];


// Variable for editing

let editId = null;


// =====================================
// CREATE
// =====================================

function createText() {

    let text =
        document.getElementById("textInput").value.trim();


    if (text === "") {

        alert("Please enter or speak some text.");

        return;
    }


    let record = {

        id: Date.now(),

        text: text,

        date: new Date().toLocaleString()

    };


    records.push(record);


    saveData();

    readTexts();

    clearText();

    alert("Text saved successfully!");

}


// =====================================
// READ
// =====================================

function readTexts() {

    let container =
        document.getElementById("records");


    let search =
        document
        .getElementById("search")
        .value
        .toLowerCase();


    let filtered =
        records.filter(function(record) {

            return record.text
                .toLowerCase()
                .includes(search);

        });


    container.innerHTML = "";


    if (filtered.length === 0) {

        container.innerHTML =
            "<p>No saved transcriptions found.</p>";

        return;
    }


    filtered
        .slice()
        .reverse()
        .forEach(function(record) {

            let div =
                document.createElement("div");


            div.className = "record";


            div.innerHTML = `

                <p>
                    <strong>🎙️ Transcription</strong>
                </p>

                <p>
                    ${escapeHTML(record.text)}
                </p>

                <small>
                    ${record.date}
                </small>

                <div class="buttons">

                    <button
                        class="edit"
                        onclick="openEdit(${record.id})">
                        ✏️ Edit
                    </button>

                    <button
                        class="delete"
                        onclick="deleteText(${record.id})">
                        🗑️ Delete
                    </button>

                </div>

            `;


            container.appendChild(div);

        });

}


// =====================================
// UPDATE
// =====================================

function openEdit(id) {

    let record =
        records.find(function(item) {

            return item.id === id;

        });


    if (!record) return;


    editId = id;


    document.getElementById("editInput").value =
        record.text;


    document.getElementById("editBox").style.display =
        "flex";

}


function updateText() {

    let newText =
        document
        .getElementById("editInput")
        .value
        .trim();


    if (newText === "") {

        alert("Text cannot be empty.");

        return;
    }


    let record =
        records.find(function(item) {

            return item.id === editId;

        });


    if (record) {

        record.text = newText;

        record.date =
            new Date().toLocaleString();

    }


    saveData();

    readTexts();

    closeEdit();

}


function closeEdit() {

    document.getElementById("editBox").style.display =
        "none";

    editId = null;

}


// =====================================
// DELETE
// =====================================

function deleteText(id) {

    let confirmation =
        confirm(
            "Are you sure you want to delete this text?"
        );


    if (!confirmation) return;


    records =
        records.filter(function(record) {

            return record.id !== id;

        });


    saveData();

    readTexts();

}


// =====================================
// SPEECH TO TEXT
// =====================================

function startSpeech() {

    let SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Speech recognition is not supported. " +
            "Please use Google Chrome."
        );

        return;
    }


    let recognition =
        new SpeechRecognition();


    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    recognition.start();


    document.getElementById("status").innerText =
        "🔴 Listening...";


    recognition.onresult =
        function(event) {

            let speech =
                event
                .results[0][0]
                .transcript;


            document.getElementById("textInput").value +=
                speech + " ";


            document.getElementById("status").innerText =
                "✅ Speech converted to text";

        };


    recognition.onerror =
        function() {

            document.getElementById("status").innerText =
                "❌ Speech recognition failed";

        };


    recognition.onend =
        function() {

            setTimeout(function() {

                document.getElementById("status").innerText =
                    "Ready";

            }, 2000);

        };

}


// =====================================
// CLEAR
// =====================================

function clearText() {

    document.getElementById("textInput").value = "";

}


// =====================================
// SAVE DATA
// =====================================

function saveData() {

    localStorage.setItem(
        "speechRecords",
        JSON.stringify(records)
    );

}


// =====================================
// SECURITY
// =====================================

function escapeHTML(text) {

    let div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =====================================
// LOAD DATA WHEN PAGE OPENS
// =====================================

readTexts();