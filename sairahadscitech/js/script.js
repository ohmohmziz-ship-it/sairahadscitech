/* =========================
   DATABASE
========================= */

let clues = JSON.parse(
    localStorage.getItem("secretCodeClues") || "[]"
);


/* ใช้ตอนแก้ไข */

let editingId = null;


/* =========================
   POPUP
========================= */

function openRolePopup() {

    document
        .getElementById("rolePopup")
        .classList.add("show");
}


function closeRolePopup() {

    document
        .getElementById("rolePopup")
        .classList.remove("show");
}


/* =========================
   เลือก ROLE
========================= */

function chooseRole(role) {

    closeRolePopup();


    document
        .getElementById("homePage")
        .style.display = "none";


    document
        .getElementById("seniorPage")
        .style.display = "none";


    document
        .getElementById("juniorPage")
        .style.display = "none";


    if (role === "senior") {

        document
            .getElementById("seniorPage")
            .style.display = "block";


        showSeniorClues();

    }


    if (role === "junior") {

        document
            .getElementById("juniorPage")
            .style.display = "block";
    }
}


/* =========================
   กลับหน้าแรก
========================= */

function goBack() {

    document
        .getElementById("seniorPage")
        .style.display = "none";


    document
        .getElementById("juniorPage")
        .style.display = "none";


    document
        .getElementById("homePage")
        .style.display = "flex";


    editingId = null;

}


/* =========================
   SAVE CLUE
========================= */

function saveClue() {

    const seniorName =
        document
            .getElementById("seniorName")
            .value
            .trim();


    const juniorName =
        document
            .getElementById("juniorName")
            .value
            .trim();


    const clueText =
        document
            .getElementById("clueText")
            .value
            .trim();


    /* ตรวจข้อมูล */

    if (
        seniorName === "" ||
        juniorName === "" ||
        clueText === ""
    ) {

        alert(
            "กรุณากรอกข้อมูลให้ครบทุกช่อง"
        );

        return;
    }


    /* =========================
       EDIT
    ========================== */

    if (editingId !== null) {

        const clue =
            clues.find(
                item =>
                    item.id === editingId
            );


        if (clue) {

            clue.seniorName =
                seniorName;

            clue.juniorName =
                juniorName;

            clue.clueText =
                clueText;
        }


        editingId = null;


        document
            .getElementById("saveButton")
            .textContent =
            "💌 บันทึกคำใบ้";
    }


    /* =========================
       NEW
    ========================== */

    else {

        clues.push({

            id: Date.now(),

            seniorName:
                seniorName,

            juniorName:
                juniorName,

            clueText:
                clueText
        });
    }


    saveData();

    clearForm();

    showSeniorClues();


    alert(
        "บันทึกคำใบ้เรียบร้อยแล้ว 💗"
    );
}


/* =========================
   SHOW SENIOR CLUES
========================= */

function showSeniorClues() {

    const list =
        document
            .getElementById(
                "seniorClueList"
            );


    list.innerHTML = "";


    if (clues.length === 0) {

        list.innerHTML =
            `
            <p class="empty">
                ยังไม่มีคำใบ้
            </p>
            `;

        return;
    }


    clues.forEach(function (item) {

        const box =
            document.createElement("div");


        box.className =
            "clue-box";


        box.innerHTML =
            `
            <h4>
                👶 ถึงน้อง:
                ${escapeHTML(item.juniorName)}
            </h4>

            <p>
                ${escapeHTML(item.clueText)}
            </p>

            <div class="clue-buttons">

                <button
                    class="edit-button"
                    onclick="editClue(${item.id})">

                    ✏️ แก้ไข

                </button>

                <button
                    class="delete-button"
                    onclick="deleteClue(${item.id})">

                    🗑️ ลบ

                </button>

            </div>
            `;


        list.appendChild(box);

    });
}


/* =========================
   EDIT
========================= */

function editClue(id) {

    const clue =
        clues.find(
            item =>
                item.id === id
        );


    if (!clue) {
        return;
    }


    document
        .getElementById("seniorName")
        .value =
        clue.seniorName;


    document
        .getElementById("juniorName")
        .value =
        clue.juniorName;


    document
        .getElementById("clueText")
        .value =
        clue.clueText;


    editingId = id;


    document
        .getElementById("saveButton")
        .textContent =
        "💾 บันทึกการแก้ไข";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


/* =========================
   DELETE
========================= */

function deleteClue(id) {

    const answer =
        confirm(
            "คุณต้องการลบคำใบ้นี้หรือไม่?"
        );


    if (!answer) {
        return;
    }


    clues =
        clues.filter(
            item =>
                item.id !== id
        );


    saveData();

    showSeniorClues();
}


/* =========================
   SEARCH FOR JUNIOR
========================= */

function searchClue() {

    const name =
        document
            .getElementById("searchName")
            .value
            .trim();


    const result =
        document
            .getElementById("juniorResult");


    /* ไม่มีชื่อ */

    if (name === "") {

        result.innerHTML =
            `
            <p class="empty">
                กรุณากรอกชื่อของคุณ
            </p>
            `;

        return;
    }


    /* ค้นหาชื่อตรงกัน */

    const found =
        clues.filter(
            item =>
                item.juniorName
                    .toLowerCase() ===
                name.toLowerCase()
        );


    /* ไม่พบ */

    if (found.length === 0) {

        result.innerHTML =
            `
            <p class="empty">
                ไม่พบคำใบ้สำหรับชื่อ
                "${escapeHTML(name)}" 💭
            </p>
            `;

        return;
    }


    result.innerHTML = "";


    /* แสดงคำใบ้ */

    found.forEach(function (item) {

        const box =
            document.createElement("div");


        box.className =
            "result-box";


        box.innerHTML =
            `
            <div class="result-from">
                💌 คำใบ้จากพี่รหัส
            </div>

            <div class="result-message">
                ${escapeHTML(item.clueText)}
            </div>
            `;


        result.appendChild(box);

    });
}


/* =========================
   CLEAR FORM
========================= */

function clearForm() {

    document
        .getElementById("seniorName")
        .value = "";


    document
        .getElementById("juniorName")
        .value = "";


    document
        .getElementById("clueText")
        .value = "";
}


/* =========================
   LOCAL STORAGE
========================= */

function saveData() {

    localStorage.setItem(

        "secretCodeClues",

        JSON.stringify(clues)

    );
}


/* =========================
   ป้องกัน HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;
}