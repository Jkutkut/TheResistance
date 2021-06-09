var height, pollBtnState;
const POLLUPDATEPERIOD = 5000;

window.onload = function() {
    getQuerry(); //function from common.js

    /** CSS */
    height = pixel2float($("body").css("height"));
    $("body").css("font-size", height * 0.014);

    /** Missions' scores */
    let e = ["M", "nPlayers"]; //id of elements on the score/mission div
    let size = [0.2, 0.6, 0.15].map(x => x * 0.9); //height multiplier of those elements
    
    let s = pixel2float($("#scoreM1").css("height")); //height of the container

    for (let i = 0; i < e.length; i++){// for each element inside a Mission score container
        $("#" + e[i] + 1).css("font-size", (s * size[i]) + "px"); //adjust the font-size to fit the space avalible
    }
    $("#nPlayers1").css("width", $("#nPlayers1").css("height")); //nPlayersX has a circle background, make the width = height
    $("#nPlayers1").css("border-radius", s * 0.5); // The radius of the circle is the height/2

    let score = $("#scoreM1"); //get the container with the 1º mission score to make the rest
    for(let i = 2; i <= 5; i++){ //for all the rest
        let newS = score.clone(); //duplicate the container and change the parameters:
        newS.attr("id", "scoreM" + i); //id
        let children = newS.children();
        for(let j = 0; j < children.length; j++){ //for all the children on the container
            children[j].id = e[j] + i; //change the id of the children
        }
        $("#scoreContainer").append(newS); //add the new container to the div with all of the missions
        $("#M" + i).text("Misión " + i); //also change the title of the mission
    }
    $("#scoreM4").append(jQuery('<i id="score-specialM">2 fallos</i>')); //on the 4º, add the special label
    $("#score-specialM").css("font-size", (s * size[2]) + "px"); //adjust the size to fit the container



    /** Players' containers */
    let playersContainer = $("#playersContainer"); //The div element with the rows where the player's divs + btns are stored
    let mainPlayer = $("#mainPlayer"); //The div element with the info of the host of the device

    let h = pixel2float(mainPlayer.css("height")); //get current height of mainplayer div
    $('#iconMainPlayer').attr("src", "../../Res/img/default_user.png");
    $('#iconMainPlayer').css("height", (h * 0.75) + "px"); //adjust the size of the icon to fit the div
    mainPlayer.css("height", h + "px"); //Also lock this height


    let elem = ["torch", "userName", "gun"];
    for(let i = 1; i < 5; i++) { //Make the rest of the users
        //create a row
        let row = jQuery('<div id="Row' + i + '" class="horizontalCols" style="--h: 100%;--c: 3; grid-row: ' + i + '"></div>');
        for(let j = 1; j <= 3; j += 2){
            let p = mainPlayer.clone();
            
            p.attr("id", i + "" + j);
            p.css("--pos", j);

            $(p.children()[0]).attr("id", "icon" + i + j); // Set id of the icon
            let pChildren = $(p.children()[1]).children(); // Elemets to change id (see elem)
            for (let k = 0; k < elem.length; k++) { // For each element
                $(pChildren[k]).attr("id", elem[k] + i + j); // Change the id of the element
            }

            row.append(p);
            if(i == 1 && j == 1){
                let p = mainPlayer.clone();
                p.attr("id", "12");
                p.css("--pos", 2);
                row.append(p);
            }
        }
        row.appendTo(playersContainer);
    }

    $("#11").click(function() {
        console.log($("#11").css("background"));
        $("#11").css("background", "red");
    });

    /** Poll zone */
    for (let i = 2; i < 5; i++){
        let p = jQuery('<div id="PollContainer' + (i - 1) + '" class="playercontainer PollContainer" style="--pos:2"></div>');
        p.append(jQuery('<strong id="PollText' + (i - 1) + '" class="PollText"></strong>'))
        p.css("height", h);
        p.insertAfter($("#" + i + 1));
        $("#PollText" + (i - 1)).css("font-size", h * 0.20);
    }

    $("#PollText1").text("Sí: 10");
    $("#PollText2").text("No: 10");
    $("#PollText3").text("Misión: Aceptada");
    $("#PollText3").css("padding-top", "30%");
    $("#PollText3").css("text-decoration", "underline");

    //Poll btns
    $("#LefttBtn").css("height", h);
    $("#LeftBtnLabel").css("font-size", h * 0.25);
    $("#RightBtn").css("height", h);
    $("#RightBtnLabel").css("font-size", h * 0.25);
    
    $("#LeftBtn").click(function(){vote(true);});
    $("#RightBtn").click(function(){vote(false);});

    // GetPlayers
    $.ajax({
        url: "players",
        method: "get",
        success: function(data) {
            console.log(data);
            updatePlayers(data);
        }
    });

    $.ajax({
        url: "pollStatus",
        method: "get",
        success: function(data) {
            console.log(data);
            updatePoll(data);
        }
    });
}


/** Main functions */
/**
 * @param {number} n - Number of players
 * @returns Generator with the id of the players Divs in counterClockwise order.
 */
function *playerIterator(n) {
    if (n < 5 || n > 10 || !Number.isInteger(n)){ //if n not on the correct range or not an int
        throw "Error at showPlayers: The value show an int be between 5 and 10, both inclusive.";
    }

    yield "MainPlayer";
    yield 43; // Always
    if (n > 6) yield 33;
    yield 23; // Always
    if (n > 8) yield 13;
    if (n % 2 == 0) yield 12;   
    if (n > 8) yield 11;
    yield 21; // Always
    if (n > 6) yield 31;
    yield 41; // Always
}

/**
 * Updates the screen with the players given
 * @param {Obj[]} players - Array with the objects with the player's data.
 */
function updatePlayers(players) {
    let len = players.length;
    showPlayers(len);

    let pIte = playerIterator(len);
    let current = pIte.next();
    let index = 0;
    console.log(queryString)
    while(players[index].name != queryString.username) {
        index++; // While the first is not my name, go to the next
        if (index === len) {
            throw new Error("Name not found");
        }
    }

    while (!current.done) {
        let content = players[index];
        console.log(current.value);
        console.log(content.name);

        $("#userName" + current.value).text(content.name); // Update the name of the user

        // Get and update img
        
        current = pIte.next();
        index = (index + 1) % len;
    }
}

/**
 * Given the number of players, show the containers on the correct positions.
 * @param {number} n - The number of players on the game.
 * @throws error if the value is not on the range [5, 10]
 */
function showPlayers(n){
    if (n < 5 || n > 10 || !Number.isInteger(n)){ //if n not on the correct range or not an int
        throw "Error at showPlayers: The value show an int be between 5 and 10, both inclusive.";
    }
    // Rows: always: 2, 4, self; n > 6: 3; n > 8: 1; if even, 12 on;
    let index = new Set(); //set of row numbers to show on screen
    if (n > 6) index.add(3);
    if (n > 8) index.add(1);
    
    let display = function(id, visible){ //function to switch the visibility of the container given as input
        $(id).css("display", (visible)? "flex" : "none");
    }

    for(let i = 1; i < 4; i += 2){ //for each row to change
        let visible = index.has(i); // if not on set -> no need to drawit => delete it
        for(let j = 1; j <= 3; j += 2){ //change both containers (left and right)
            display("#" + i + j, visible);
        }
    }
    display("#12", n % 2 == 0); //if even, add the one on the top middle
}

/** Poll zone */
/**
 * Given the input, show it on screen and calculate the current result of the poll.
 * @param {Array} data - Array with the result of each player (Example: [{val: 0}])
 * @see DB-Logic to see the meaning of each value.
 */
function updatePoll(data){
    let si = 0, no = 0;
    for (let d of data) { // For each player
        if (d.val == 1) si++; // If vote is positive
        else if (d.val == -1) no++; // If negative
    }
    $("#PollText1").text("Sí: " + si);
    $("#PollText2").text("No: " + no);
    $("#PollText3").text("Misión: " + ((si > no)? "Aceptada" : "Denegada")); //mission valid -> aceptada; mission invalid -> denegada
}

/**
 * Updates the vote of the player and sends it to the Raspberry.
 * @param {boolean} v - Whenever the btn pressed is Yes (true) or No (false). 
 */
function vote(v){
    // pollBtnState = Current status of the btns
    if (v == undefined || v == pollBtnState) { //if empty argument or they are the same, clear vote
        pollBtnState = 0; //reset var
    }
    else if(v) { // If v == true => Yes
        pollBtnState = 1;
    }
    else { // If v == false => No
        pollBtnState = -1;
    }

    $.ajax({
        url: "changeOpinion.php",
        method: "post",
        data: {
            user: queryString.username,
            opinion: pollBtnState
        },
        success: function(data) {
            console.log(data);
        }
    });
}

/** Mission History */

var debugMissionHistory = [
    {
        mId: 0,
        active: false,
        leaderId: 1,
        vYes: 4,
        vNo: 1,
        mRes: 1
    },
    {
        mId: 0,
        active: false,
        leaderId: 4,
        vYes: 5,
        vNo: 0,
        mRes: 0
    },
    {
        mId: 0,
        active: true,
        leaderId: 3,
        vYes: null,
        vYes: null,
        mRes: 0
    }
];

function updateMissionHistory() {
    let i;
    for (i = 1; i < debugMissionHistory.length; i++) {
        let color = "red";
        if (debugMissionHistory[i - 1].mRes == 1) { // If mission was successful
            color = "blue";
        }

        $("#nPlayers" + i).css("background", color);
    }
    $("#nPlayers" + i).css("background", "yellow");

}