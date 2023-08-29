//mainīgie
//speles lielums
var Size = 3;
//speles gājiena daudzums
var MoveCount = 0;
//spēles laiks (sekundes,minūtes)
var timeSeconds = 0;
var timeMinutes = 0;
//Vai ir uzvarējis
var victory = false;

//sadala spēles zonu vienādās daļās
function DivideGameArea(){
    //iztīra gājienu skaitu un laika skaitu
    MoveCount = 0;
    timeSeconds = 0;
    timeMinutes = 0;
    victory = false;
    let timeSecStr = "" + timeSeconds;
    let timeMinStr = "" + timeMinutes;
    document.getElementById("Timer").innerHTML = "<b>Laiks: " + timeMinStr.padStart(2, "0") + ":" + timeSecStr.padStart(2, "0") + "<b>";
    UpdateGajieni();
    //dabū un iztīra spēles zonu
    let GameArea = document.getElementById("GameArea");
    GameArea.innerHTML = "";
    //Aprēkina kastes lielumu
    Size= document.getElementById("Izmers").value;
    BoxSize = (500/Size)-1;

    //Ievieto kastes spēles laukumā
    for(let i = 0; i<Size; i++){
        for(let j = 0; j<Size; j++){
            //nosaka vai kaste ir ieslēgta vai izslēgta
            let State = Math.round(Math.random());
            if(State){
                //ievieto ieslegtu kasti
                GameArea.innerHTML += `<span style="background: #eeeeee; display: inline-block; relative; border: solid black 1px; height: `+ BoxSize +`px; width: `+ BoxSize +`px; float: left; " id="`+((i*10)+j)+`" onclick="ChangeState(`+((i*10)+j)+`)"></span>`;
            }else{
                //ievieto izslegtu kasti
                GameArea.innerHTML += `<span style="background: gray; display: inline-block; relative; border: solid black 1px; height: `+ BoxSize +`px; width: `+ BoxSize +`px; float: left; " id="`+((i*10)+j)+`" onclick="ChangeState(`+((i*10)+j)+`)"></span>`;
            }
        }
    }
}
//parmaina lauku un to apkārtējo laukus
function ChangeState(SelfID){
    //nelauj speletajam mainīt lauku krasus pēc uzvaras
    if (!victory){
        //pārmaina nospiesto lauku
        ChangeBlock(SelfID);
        //pārmaina to apkārtējos laukus
        ChangeBlock(SelfID-1);
        ChangeBlock(SelfID+1);
        ChangeBlock(SelfID-10);
        ChangeBlock(SelfID+10);
        MoveCount += 1;
        UpdateGajieni();
        CheckWin();
    }
}
//pārmaina lauku
function ChangeBlock(SelfID){
    //pārbaude vai elements existē
 if (document.getElementById(SelfID)){
     let element = document.getElementById(SelfID);
     // ja elements ir pelēks tad pārmaina uz baltu, ja nav tad uz pelēku
     if (element.style.background=== "gray"){
         element.style.background = "#eeeeee";
         return;
     }
     element.style.background = "gray";
 }
}

// uzvaras funkcija
function CheckWin(){
    //parbaudīs vai ir dabūjis uzvaru
    let condition = true;
    //dabū spēles lauku un visus elementus tajā
    let Game = document.getElementById("GameArea");
    let children = Game.children;
    // pārbauda vai visi elementi ir balti un ja nav tad nēsi uzvarējis
    for(let i=0; i<children.length; i++){
        if (children[i].style.background !== "gray"){
            condition = false;
            break;
        }
    }

    //ja tika galā tad pārvērš visus  laukus zaļus un apstādina laiku
    if (condition) {
        for (let i = 0; i < children.length; i++) {
            children[i].style.background = "green";
        }
        victory = true;
    }
}
//atjaunina gajienu skaitītāju
function UpdateGajieni(){
    document.getElementById("Counter").innerHTML = "<b>Gajieni: " + MoveCount + "</b>"
}

//atjaunina laiku
function UpdateLaiks(){
    //iesāk laiku tikai kad pirmais gājiens ir izdarīts
    if (MoveCount > 0 && !victory) {
        //pieskaita vienu sekundi
        timeSeconds += 1;
        // ja sekundes ir 60 tad pārveido to par minūti
        if (timeSeconds == 60) {
            timeMinutes += 1;
            timeSeconds = 0;
        }
        let timeSecStr = "" + timeSeconds;
        let timeMinStr = "" + timeMinutes;
        //izvada laiku
        document.getElementById("Timer").innerHTML = "<b>Laiks: " + timeMinStr.padStart(2, "0") + ":" + timeSecStr.padStart(2, "0") + "<b>";
    }
}

setInterval(UpdateLaiks, 1000);

