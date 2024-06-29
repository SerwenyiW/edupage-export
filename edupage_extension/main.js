function getTimetable() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const timetableRows = document.querySelectorAll(".print-nobreak > div:not(:first-child) > div:not(:first-child) > div > div:not(:first-child) > div > div");
    const timetableDR = document.querySelectorAll(".print-nobreak > div:not(:first-child) > div:not(:first-child) > div:first-child > div > div");
    let valueCounter = 3;

    timetableDR.forEach((day, index) => {
        if(index < 2) {
            day.setAttribute('value', index + 1);
        } else if(day.textContent.trim() !== "") {
            day.setAttribute('value', valueCounter);
            if(valueCounter === 5) {
                valueCounter = 1;
            } else {
                valueCounter++;
            }
        }
    });
    
    var osztaly = document.querySelector(".print-font-resizable").textContent;
    let oraadatszam = 0;
    let timetableData = [];
    let ora = {
        day: "",
        csoport: "",
        tanar: "",
        tanterem: "",
        tantargy: "",
        rendes: ""
    };

    timetableRows.forEach((row) => {
        if(row.textContent !== "") {
            oraadatszam++;
            if(row.style.height === "104px") {
                if(oraadatszam === 1) ora.tanterem = row.textContent;
                if(oraadatszam === 2) ora.tanar = row.textContent;
                if(oraadatszam === 3) ora.tantargy = tantargyak(row.textContent, ora.csoport);
                if(oraadatszam === 3) {
                    ora.rendes = rendes(row);
                    ora.day = iskolanap(row.parentElement.getAttribute("value"));
                    timetableData.push({ ...ora });
                    oraadatszam = 0;
                    ora = { day: "", csoport: "", tanar: "", tantargy: "", tanterem: "", rendes: "" };
                }
            } else {
                if(oraadatszam === 1) ora.csoport = row.textContent;
                if(oraadatszam === 2) ora.tanterem = row.textContent;
                if(oraadatszam === 3) ora.tanar = row.textContent;
                if(oraadatszam === 4) ora.tantargy = tantargyak(row.textContent, ora.csoport);
                if(oraadatszam === 4) {
                    ora.rendes = rendes(row);
                    ora.day = iskolanap(row.parentElement.getAttribute("value"));
                    timetableData.push({ ...ora });
                    oraadatszam = 0;
                    ora = { day: "", csoport: "", tanar: "", tantargy: "", tanterem: "", rendes: "" };
                }
            }
        }
    });
    if(oraadatszam > 0) timetableData.push({ ...ora });
    return { osztaly, timetableData };
}

function rendes(row) {
    if(row.style.width === "155px" || row.style.width === "152px" ||row.style.width === "156px") return "egyoras";
    if(row.style.width === "313px" || row.style.width === "310px") return "dupla";
    if(row.style.width === "472px") return "tripla";
    if(row.style.width === "630px") return "negyszeres";
}

const button = document.createElement("button");
button.style.cssText = "width: 70px; height: 50px;z-index: 100; position:absolute;top: 0;right: 200px";
button.textContent = "ALMAAA";
button.addEventListener("click", ()=>{
    console.log(getTimetable());
});
document.body.appendChild(button);

function iskolanap(index) {
    /*const napok = {
        "Hé": "Hétfő",
        "Ke": "Kedd",
        "Sz": "Szerda",
        "Cs": "Csütörtök",
        "Pé": "Péntek"
    };*/
    const napoktomb = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];
    return napoktomb[index-1];
}

function tantargyak(ora, csoport) {
    const tanorak = {
        "Bio": "Biológia",
        "Ké": "Kémia",
        "MaNy": "Magyar nyelv",
        "TsNe": "Testnevelés",
        "Dk": "Digitális kultúra",
        "Mat": "Matematika",
        "An": "Angol nyelv",
        "Ha": "Honvédelmi alapismeretek",
        "Tört": "Történelem",
        "Nm": "Német nyelv",
        "Nt": "Német tehetséggondozás",
        "MaIr": "Magyar irodalom",
        "At": "Angol tehetséggondozás",
        "Fdr": "Földrajz",
        "Én": "Ének-zene",
        "KnNy": "Kínai nyelv",
        "Fr": "Francia nyelv",
        "Has": "Honvédelmi alapismeretek szakkör",
        "Fiz": "Fizika",
        "Oszt": "Osztályfőnöki",
        "V": "Vizuális-kultúra",
    };
    if(csoport.includes("matek fel")) {
        tanorak["Mf"] = "Matematika felzárkóztató";
    } else {
        tanorak["Mf"] = "Magyar felzárkóztató";
    }
    return tanorak[ora] || "Nincs benne a listában";
}
