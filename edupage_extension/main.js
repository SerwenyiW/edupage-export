function getTimetable() {
    const timetableRows = document.querySelectorAll(".print-nobreak > div:not(:first-child) > div:not(:first-child) > div > div:not(:first-child) > div > div");
    const timetableDR = document.querySelectorAll(".print-nobreak > div:not(:first-child) > div:not(:first-child) > div:first-child > div > div");
    const talanazido = document.querySelectorAll(".print-nobreak > div > div:first-child > div:not(first-child) > div > div > span:not(:first-child)");
    let valueCounter = 3;

    timetableDR.forEach((day, index) => {//Napok beállítása
        if (index < 2) {
            day.setAttribute('value', index + 1);
        } else if (day.textContent.trim() !== "") {
            day.setAttribute('value', valueCounter);
            if (valueCounter === 5) {
                valueCounter = 1;
            } else {
                valueCounter++;
            }
        }
    });
    
    var osztaly = document.querySelector(".print-font-resizable").textContent;
    console.log(osztaly);
    let oraadatszam = 0; // Ez a edupage anti dump agyalása miatt kell, mert minden egymás mellett van divekben
    let timetableData = [];
    let ora = {day: "", csoport: "nincs", tanar: "", tanterem: "", tantargy: "", rendes: "", cstipus: "", color: "", hossz: ""};

    timetableRows.forEach((row) => {
        if(row.textContent !== "") {
            if(!isNaN(osztaly[0])) {//Ha van az osztály elsőkarakterében szám, ezzel ellenőrizve hogy nem tanári órarendet nézzünk
                oraadatszam++;
                if(row.style.height === "104px") {//Ha nem csoportos az óra
                    if(oraadatszam === 1) ora.tanterem = row.textContent;
                    if(oraadatszam === 2) ora.tanar = row.textContent;
                    if(oraadatszam === 3) ora.tantargy = tantargyak(row.textContent, ora.csoport, ora.tanar, osztaly);
                    if(oraadatszam === 3) {
                        oraadatszam = 0;
                        ora.rendes = rendes(row);
                        ora.cstipus = hanycsoport(row);
                        ora.day = iskolanap(parseInt(row.parentElement.getAttribute("value")));
                        ora.color = row.children[0] !== undefined ? row.children[0].getAttribute("style").replace("background-color: ", "").replace("background: ", "") : "LINEAR GRADIENT Háttér";
                        ora.hossz = hanyadikora(hanycsoport(row), iskolanap(row.parentElement.getAttribute("value")), rendes(row));
                        timetableData.push({ ...ora });
                        ora = { day: "", csoport: "nincs", tanar: "", tantargy: "", tanterem: "", rendes: "", cstipus: "", color: "", hossz: ""};
                    }
                } else {//Hogyha nem egyenlő 104px-el akkor 999%, hogy ez csoportos óra
                    if(oraadatszam === 1) ora.csoport = row.textContent;
                    if(oraadatszam === 2) ora.tanterem = row.textContent;
                    if(oraadatszam === 3) ora.tanar = row.textContent;
                    if(oraadatszam === 4) ora.tantargy = tantargyak(row.textContent, ora.csoport, ora.tanar, osztaly);
                    if(oraadatszam === 4) {
                        oraadatszam = 0;
                        ora.rendes = rendes(row);
                        ora.cstipus = hanycsoport(row);
                        ora.day = iskolanap(parseInt(row.parentElement.getAttribute("value")));
                        ora.color = row.children[0].getAttribute("style").replace("background-color: ", "").replace("background: ", "");
                        ora.hossz = hanyadikora(hanycsoport(row), iskolanap(row.parentElement.getAttribute("value")), rendes(row));
                        timetableData.push({ ...ora });
                        ora = { day: "", csoport: "nincs", tanar: "", tantargy: "", tanterem: "", rendes: "", cstipus: "", color: "", hossz: ""};
                    }
                }
            } else {//ez itt a tanári óra készítő akar lenni, hát lehetetlen.
                //FEJLESZTÉS ALATT, de az is lehet soha nem lesz kész. Köszi edupage
                oraadatszam++;
                if(oraadatszam === 1) ora.tanterem = row.textContent;
                if(oraadatszam === 2) ora.tanar = row.textContent;
                if(oraadatszam === 3) ora.tantargy = tantargyak(row.textContent, ora.csoport, ora.tanar, osztaly);
                if(oraadatszam === 3) {
                    oraadatszam = 0;
                    ora.rendes = rendes(row);
                    ora.cstipus = hanycsoport(row);
                    ora.day = iskolanap(parseInt(row.parentElement.getAttribute("value")));
                    ora.color = row.children[0] !== undefined ? row.children[0].getAttribute("style").replace("background-color: ", "").replace("background: ", "") : "LINEAR GRADIENT Háttér";
                    ora.hossz = hanyadikora(hanycsoport(row), iskolanap(row.parentElement.getAttribute("value")), rendes(row));
                    timetableData.push({ ...ora });
                    ora = { day: "", csoport: "nincs", tanar: "", tantargy: "", tanterem: "", rendes: "", cstipus: "", color: "", hossz: ""};
                }
            }
        }
    });
    if(oraadatszam > 0) timetableData.push({ ...ora });
    return { osztaly, timetableData }; //Óra adatok visszaküldése
}

function iskolanap(index) {//Napok
    return ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"][index-1];
}

function rendes(row) {//Meddig tart egy adott óra
    let pxcut = `${row.style.width}`.split("px")[0];
    if(pxcut >= 150 && pxcut <= 157) return "egyoras";
    if(pxcut >= 308 && pxcut <= 315) return "duplaoras";
    if(pxcut >= 470 && pxcut <= 475) return "triplaoras";
    if(pxcut >= 625 && pxcut <= 635) return "negyoras";
    if(pxcut >= 785 && pxcut <= 792) return "otoras";
}

function hanycsoport(row) {//Hány csoportból áll az óra, ha külön órák vannak
    let pxcut = `${row.style.height}`.split("px")[0];
    if(pxcut >= 98 && pxcut <= 107) return "nincscsoport";
    if(pxcut >= 48 && pxcut <= 53) return "2csoport";
    if(pxcut >= 30 && pxcut <= 35) return "3csoport";
    if(pxcut >= 22 && pxcut <= 27) return "4csoport";
}

let oraszam = 0;
let skipNumb = 1;
let prevDay = "Hétfő";
function hanyadikora(cstipus, nap, rendes) {//Ezzel fixálni tudom azt hogy a csoportos órákat és/vagy a 1 óránál több órákat külön óránként kezelje
    const ido = [
        "Hibaa-Hibaa",
        "07:50-08:35",
        "08:40-09:25",
        "09:35-10:20",
        "10:30-11:15",
        "11:25-12:10",
        "12:15-13:00",
        "13:05-13:50",
        "13:55-14:40",
        "14:45-15:30"
    ];
    if(prevDay !== nap) { //Ha új nap jön, akkor az óra legyen 0, mert minden napnál külön kell számolni.
        prevDay = nap;
        oraszam = 0;
    }
    let hosszToNumb = [{"egyoras": 1, "duplaoras": 2,"triplaoras": 3, "negyoras": 4, "otoras": 5}]; //Azért kell, hogy az indexelést eltudjuk végezni

    if(cstipus === "nincscsoport") {//Ha nincs csoport, akkor ne rakja a háttérbe az amúgy sem létező (mert csak 1 csoport van, ha ez a feltétel igaz) csoportokat
        oraszam++;
        if(hosszToNumb[0][rendes] !== 1) {//Ha több órás lenne, akkor tudja, hogy hány órás, és hogy mettől meddig tart
            let startInd = `${ido[oraszam]}`.slice(0,5);
            let endInd = `${ido[oraszam+hosszToNumb[0][rendes]-1]}`.slice(6,11);
            oraszam += hosszToNumb[0][rendes]-1;
            //console.log(skipNumb + ` NINCS CSOPORT Óraszám: ${oraszam} | Óra hossz: ${startInd}-${endInd} | Nap: ${nap}`);
            skipNumb = 1;
            return `${startInd}-${endInd} ${oraszam}`; 
        } else if(hosszToNumb[0][rendes] === 1) {//Ha 1 órás, akkor nincs is nagyon semmi teendő.
            //console.log(skipNumb + ` NINCS CSOPORT Óraszám: ${oraszam} | Óra hossz: ${ido[oraszam]} | Nap: ${nap}`);
            skipNumb = 1;
            return `${ido[oraszam]} ${oraszam}`;
        }
    } else {//Ha van csoport
        //console.log(skipNumb + ` ${cstipus[0]}`);
        if(skipNumb == parseInt(cstipus[0])) {//Ha a skipNumb = a csoportszámal pl: 2csoport -> 2, akkor végezze el a megfelelő műveletet
            if(hosszToNumb[0][rendes] !== 1) {//Ha több órás lenne, akkor tudja, hogy hány órás, és hogy mettől meddig tart
                let startInd = `${ido[oraszam]}`.slice(0,5);
                let endInd = `${ido[oraszam+hosszToNumb[0][rendes]-1]}`.slice(6,11);
                oraszam += hosszToNumb[0][rendes]-1;
                //console.log(skipNumb + ` VAN CSOPORT Óraszám: ${oraszam} Óra hossz: ${startInd}-${endInd} | Nap: ${nap}`);
                skipNumb = 1;
                return `${startInd}-${endInd} ${oraszam}`; 
            }else if(hosszToNumb[0][rendes] === 1) {//Ha 1 órás, akkor nincs is nagyon semmi teendő.
                //console.log(skipNumb + ` VAN CSOPORT Óraszám: ${oraszam} Óra hossz: ${ido[oraszam]} | Nap: ${nap}`);
                skipNumb = 1;
                return `${ido[oraszam]} ${oraszam}`;
            }
        } else {//Ha skipNumb nem = 2csoport -> 2-vel, akkor valószínűleg új csoportot számol, azaz 1 órával több lesz, mert ez egy új óra, és egy órába számolja a tantárgyakat
            if(skipNumb == 1) oraszam++;
            skipNumb++;
        }
    }
    /*Ez itt azért kell mert ha több csoport van pl 3 csoport, akkor ezt írná ki:
    9.A n;9.A nyelv;Szerda;Német nyelv;PLB;F004 (9.A);CSOPORT;egyoras;3csoport;09:35-11:15 4; -> 09:35-11:15 4
    9.A n;9.A nyelv;Szerda;Német nyelv;CsG;köny;CSOPORT;egyoras;3csoport;09:35-11:15 4; -> 09:35-11:15 4
    9.A n;9.A nyelv;Szerda;Kínai nyelv;CX;K;CSOPORT;egyoras;3csoport;10:30-11:15 4; -> 10:30-11:15 4
    De mivel ez 3 csoport és egy időben van, ezért az első kettőnek olyannak kell lennie mint a harmadik óra idejének. Azaz mind3 az 10:30-11:15
    */
    let startInd = `${ido[oraszam]}`.slice(0,5);
    let endInd = `${ido[oraszam+hosszToNumb[0][rendes]-1]}`.slice(6,11);
    return `${startInd}-${endInd} ${oraszam}`; 
}

//Gomb integrálása a weboldalba
const button = document.createElement("button");
button.style.cssText = "width: 70px; height: 50px;z-index: 100; position:absolute;top: 0;right: 200px";
button.textContent = "ALMAAA";
button.addEventListener("click", ()=>{
    let timetable = getTimetable().timetableData;
    let osztaly = getTimetable().osztaly;
    let osztalyid = "";
    if(isNaN(osztaly[0])) {//Ha nem szám, akkor fix hogy tanári órarend
        osztalyid = osztaly;
    } else {//Ha egyik osztálynak órarendjét nézzük
        osztalyid = osztaly.slice(0, osztaly.indexOf(".")+4);
    }
    for(let i=0;i<=timetable.length; i++) {//Exportálás consoleon keresztül
        console.log(`${osztalyid};${osztaly};${timetable[i].day == undefined ? "aaaaaaaa" : timetable[i].day};${timetable[i].tantargy};${timetable[i].tanar};${timetable[i].tanterem};${timetable[i].csoport};${timetable[i].rendes};${timetable[i].cstipus};${timetable[i].hossz};${timetable[i].color}`);
    }  
});
document.body.appendChild(button);

function tantargyak(ora, csoport, tanar, osztaly) {//Tantárgyak, van amit nem érzékel azaz "Nincs benne a listában" ír ki, de nem érdekel.
    const tanorak = {
        "Bio": "Biológia",
        "Ké": "Kémia",
        "MaNy": "Magyar nyelv",
        "TsNe": "Testnevelés",
        "Dk": "Digitális kultúra",
        "Mat": "Matematika",
        "An": "Angol nyelv",
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
        //Többi titok
    };//Manuálisan kell hozzáadni az órákat:(
    return tanorak[ora] || "Nincs benne a listában";
}
