var playerArray = []
var movementGain = 0
var path = []
var treasureArray = []
var airSupply = 25
var turnSwitcher = 0
var setDirection = true
var diceThrow = false
var actionTurn = false
var returnedPlayer = 0
var lastTurn = false
var roundsOver = 0
// prepares array: path and treasureArray for first render
for (i=0; i<28; i++){
    path.push(i) //
    if((Math.floor(i/7)+1)<6)
    treasureArray.push(Math.floor(i/7)+1)
}
choosePlayerButton = (event) => {
    clickSound.play()
    $('.chosen').attr('class', 'choosePlayers')
    $(event.currentTarget).attr('class', 'chosen')
    playerCount = $(event.currentTarget).attr('players')
    $('#penguinPreview').empty()
    for (i=0; i<playerCount; i++){
        penguinPreviews = ["./Penguins/1 Blue.png", './Penguins/2 Red.png', './Penguins/3 Green.png', './Penguins/4 Yellow.png', './Penguins/5 Black.png', './Penguins/6 Orange.png']
        $('#penguinPreview').append('<img src="' + penguinPreviews[i] + '">')
    }
}
startGameButton = (event) => {
    clickSound.play()  
    if (playerCount){
        $('#landingPage').hide()
        $('#gameBoard').show()
        generatePlayerDivs(playerCount)
        generatePathDivs()
        generateTreasureArray(treasureArray)
    }
    $('body').css('background', "url('./Backgrounds/Underwater720.jpg')")
    $('body').css('background-repeat', "no-repeat")
    whosFirstTurn();
    document.getElementById("audio").src = "./Audio/Blue World.mp3"
    audio.muted = false;
}
howToPlayButton = (event) => {
    clickSound.play()
    $('#helpBox').show()
    $('#helpText').text("Welcome to ByssOrMis Adventures! You are lucky.")
}
hideHelp = (event) => {
    clickSound.play()
    $("#helpBox").hide()
}
class Player {
    constructor(name){
        this.playerName = name;
        this.score = 0;
        this.treasurePouch = []
        this.movement = 0;
        this.position = -1;
        this.dive = true;
        this.returned = false;
        this.abyssAdventures = 0;
        this.misAdventures = 0;
    }
    treasureToScore(){
        var treasureConvert = 0
        var scoreAdd = 0
        for (let i = 0; i<this.treasurePouch.length; i++){
            console.log(this.treasurePouch, 'treasure invent')
            treasureConvert = this.treasurePouch[i]
            console.log(treasureConvert, 'tier in question')
            if(treasureConvert === 1)
                {scoreAdd = (Math.ceil(Math.random()*2) + 1)}
            if(treasureConvert === 2)
                {scoreAdd = (Math.ceil(Math.random()*3) + 3)}
            if(treasureConvert === 3)
                {scoreAdd = (Math.ceil(Math.random()*4) + 6)}
            if(treasureConvert === 4)
                {scoreAdd = (Math.ceil(Math.random()*4) + 11)}
            this.score += scoreAdd
        }
        this.treasurePouch = []
    }
}
// create player Objects and their board pieces (div), append to submarine
generatePlayerDivs = (playerCount) => {
    userName = ["Blue", "Red", "Green", "Yellow", "Black", "Orange"]
    penguinPreviews = ["./Penguins/1 Blue.png", './Penguins/2 Red.png', './Penguins/3 Green.png', './Penguins/4 Yellow.png', './Penguins/5 Black.png', './Penguins/6 Orange.png']
    for(let i = 0; i<playerCount; i++){
        playerArray.push( new Player (userName[i])) // array gets new Player Obj
        $('#submarine').append($('<div>') // spawns player at submarine div
            .attr('id', userName[i])
            .addClass('penguins')
            .css('background-image', 'url("' + penguinPreviews[i] + '")')
            // .text(userName[i])    
            )
    }
}
// create the Path divs with id for players to travel on.
generatePathDivs = () => {
    classArray = ['grid1', 'grid2', 'grid3', 'grid4']
    $gameBoard = $('#gameBoard')
    adder = 0
    tilesInOnePath = 7;
    lastIDPath2 = 13
    lastIDPath4 = 27
    for (i=0; i<4; i++){
        $grid = $('<div>').addClass('grid').attr('id', 'grid'+(i+1))
        $gameBoard.append($grid)
        for (j=0; j<tilesInOnePath; j++){
            if (i===0 || i===2)
            $pathTile = $('<div>').addClass('pathTile').attr('id', j+adder)
            if (i===1)
            $pathTile = $('<div>').addClass('pathTile').attr('id', lastIDPath2-j)
            if (i===3)
            $pathTile = $('<div>').addClass('pathTile').attr('id', lastIDPath4-j)
            $grid.append($pathTile)
        }
        adder += 7
    }
}
// based on treasureArray, assigns the img of chest with respective tier to Path divs
generateTreasureArray = () => {
    treasureImg = ['', './Treasures/1 Treasure.png', './Treasures/2 Treasure.png', './Treasures/3 Treasure.png', './Treasures/4 Treasure.png']
    count = 0
    for (i of treasureArray){
        var src = document.getElementById(path[count])
        var img = document.createElement("img")
        img.src = treasureImg[i]
        img.className = 'treasure'
        // img.id = 'treasure' + count
        if(treasureImg[i] !== ''){
            treasureRefresh = src.getElementsByClassName('treasure')
            $(treasureRefresh).remove()
            src.appendChild(img)
        } else {
            treasureRemove = src.getElementsByClassName('treasure')
            $(treasureRemove).remove()
            // src.remove(treasureRemove)
            // src.removeChild(src.lastChild)
        }
        count++
    }
}
// Player turn roller 
whosFirstTurn = () => {
    currentPlayer = playerArray[0]
    $('#announcer').text(currentPlayer.playerName + "'s turn. Dive deep!")
    airSupply = 25
    diceThrow = true;
    actionTurn = false
    lastTurn = false;
}
setReturnSub = (event) => {
    clickSound.play()
    if (actionTurn){
        $('#announcer').text('You already rolled, pick tile action')
    }
    if (!currentPlayer.dive &&!actionTurn){
        $('#announcer').text('You already deicded to return, time to roll.')
    }
    if (currentPlayer.position >= 0 && currentPlayer.dive &&!actionTurn){
        $('#direction').text('Returning to Sub!')
        $('#announcer').text(currentPlayer.playerName + ' deicded to return to sub.')
        currentPlayer.dive = false
    }
    if (currentPlayer.position < 0 /*&& setDirection === true*/){
        $('#announcer').text(currentPlayer.playerName + ' is already in sub. Dive deeper')
    }
}
// Player option 2: Roll die only
rollDice = (event) => {
    clickSound.play()
    if (actionTurn){
        $('#announcer').text('You already rolled, pick tile action')
    }
    if (diceThrow) {
        movementGain = Math.floor(Math.random() * 6 + 1)
        treasureTotal = currentPlayer.treasurePouch.length
        if (treasureTotal === 0){
            currentPlayer.movement += movementGain 
        } else {
            currentPlayer.movement += movementGain - treasureTotal 
            console.log('dice rolled', movementGain, 'minus', treasureTotal)
            if (currentPlayer.movement <= 0){
                currentPlayer.movement = 0;
                $('#announcer').text(currentPlayer.playerName + " felt heavy. Choose action.")
                actionTurn = true
            }
        }
    }
    diceThrow = false;
    if(currentPlayer.dive === true && currentPlayer.movement > 0){
        divePlayer()
        $('#direction').text(currentPlayer.playerName + '\'s Diving!')
    }
    if(currentPlayer.dive === false && currentPlayer.movement > 0)
        returnPlayer()  
        $('#direction').text(currentPlayer.playerName + '\'s Diving!')
}
divePlayer = () => {
    setDirection = false;
    while (currentPlayer.movement != 0 && currentPlayer.position < 24){
        currentPlayer.movement --
        currentPlayer.position ++
        renderPath = '#' + currentPlayer.position
        // To check if landing div has any existing penguins
        if ($(renderPath).children().hasClass('penguins') || $(renderPath).hasClass('oxygenTank')){
            currentPlayer.movement++
        }
        if (currentPlayer.position === 27){   
            currentPlayer.movement = 0
            console.log("congrats you have reached the end")
        }
        renderPlayer = $('#' + currentPlayer.playerName)
        $(renderPath).prepend(renderPlayer)
    }
    $('#announcer').text('Landed at tile ' +(currentPlayer.position + 1)+', choose action.')
    actionTurn = true;
}
returnPlayer = () => {
    setDirection = false;
    while (currentPlayer.movement != 0){
        currentPlayer.movement --
        currentPlayer.position --
        renderPath = '#' + currentPlayer.position
        // To check if landing div has any existing penguins
        if ($(renderPath).children().hasClass('penguins') || $(renderPath).hasClass('oxygenTank')){
            currentPlayer.movement++
        }
        renderPlayer = $('#' + currentPlayer.playerName)
        $(renderPath).prepend(renderPlayer)
        $('#announcer').text('Landed at tile ' +(currentPlayer.position+1)+', choose action.')
        actionTurn = true;
        if (currentPlayer.position === -1){
            $('#submarine').prepend(renderPlayer)
            $('#announcer').text(currentPlayer.playerName + ' returned safely!')
            currentPlayer.treasureToScore()
            currentPlayer.movement = 0
            currentPlayer.returned = true;
            returnedPlayer ++
            actionTurn = false;
            switchPlayer()
        }
    }   
}
pickTreasure = () => {
    clickSound.play()
    if (actionTurn) {
        if (currentPlayer.position === -1 ){
            $('#announcer').text('You are in the submarine..')
        } else {
            treasureHere = treasureArray[currentPlayer.position]
            if(actionTurn && treasureHere !== 0){
                if(actionTurn){
                    pickSound.play()
                    currentPlayer.treasurePouch.push(treasureHere)
                    treasureArray[currentPlayer.position] = 0
                    generateTreasureArray();
                    renderCurrentPlayer();
                    if(lastTurn){
                        newRound()
                    }
                    switchPlayer()
                }
            } else {
                $('#announcer').text('No treasure found.. Do something else')
            }
        }
    } else {
        $('#announcer').text('Roll the die first.')
    }
}
dropTreasure = () => {
    clickSound.play()
    if (actionTurn) {
        var checkTreasureExisting = treasureArray[currentPlayer.position]
        if (currentPlayer.treasurePouch.length === 0){
            $('#announcer').text('Your pouch is empty..')
        } else if (checkTreasureExisting > 0){
            $('#announcer').text('There is already existing treasure!')
        } else {
            currentPlayer.treasurePouch.sort()
            treasureDrop = currentPlayer.treasurePouch.shift()
            treasureArray[currentPlayer.position] = treasureDrop
            generateTreasureArray()
            // $player = document.getElementById(currentPlayer.playerName)
            // //.getElementById("playerPouch" + treasureDrop)
            // // imgRemove = $playerID.getElementsByClassName("playerPouch" + treasureDrop)
            // removeTreasure = '.playerPouch' + treasureDrop
            // test = $($player).children().find(removeTreasure)
            // $(test).remove()
            renderCurrentPlayer();
            if (lastTurn){
                newRound()
            } else {
            switchPlayer()
            }
        }
    } else {
        $('#announcer').text('Roll the die first.')
    }
} 
renderCurrentPlayer = () => {
    treasureImg = ['', './Treasures/1 Treasure.png', './Treasures/2 Treasure.png', './Treasures/3 Treasure.png', './Treasures/4 Treasure.png']
    $player = currentPlayer.playerName
    $("#" + $player).empty()
    for (i of currentPlayer.treasurePouch){
        $("#"+$player).append($("<img>").attr('src', treasureImg[i]))
    }
}
doNothing = (event) => {
    clickSound.play()
    if (lastTurn){
        newRound()
    }
    if (actionTurn){
        switchPlayer()
    }
}
switchPlayer = () => {
    if (returnedPlayer === playerArray.length){
        newRound()
    } else {
        turnSwitcher ++
        console.log('hey turnSwitcher should change to 0 after 1 round', turnSwitcher)
        currentPlayer = playerArray[(turnSwitcher%playerArray.length)]
        treasureCount = currentPlayer.treasurePouch.length

        if (treasureCount>0){
        airSupplyTurn(currentPlayer, treasureCount);
        }
        if(currentPlayer.dive === true){
            $('#announcer').text(currentPlayer.playerName + "'s turn. Currently diving.")
        } else {
            $('#announcer').text(currentPlayer.playerName + "'s turn. Heading back to sub.")
        }
        $('#direction').text('Roll or Set Return')
        actionTurn = false;
        diceThrow = true;
        movementGain = 0;
        if (currentPlayer.returned === true){
            actionTurn = false;
            switchPlayer()
        }
    }
}
airSupplyTurn = (player, treasure) => {
    airSupply -= treasure
    if (airSupply > 0 ){
        $('#airSupply').text("Air Supply: " + airSupply)
        alert(player.playerName + ' is holding ' + treasure +' treasures. Air supply minus by '+ treasure + '. Current air supply is ' + airSupply + ' good luck')
        bubbleSound.play()
    } else {
        bubbleSound.play()
        alert('Air supply ran out!! This is the last turn of the round')
        $('#airSupply').text("Air Supply: Empty!")
        lastTurn = true;
    }
}
newRound = () => {
    roundsOver++
    turnSwitcher = 0;
    if(roundsOver === 1){
        document.getElementById("audio").src = "./Audio/Beachway.mp3"
    }
    if(roundsOver === 2){
        document.getElementById("audio").src = "./Audio/Shining Sea.mp3"
    }
    if(roundsOver === 3){
        playerArray.sort((a,b)=>{return b.score - a.score})
        winner = playerArray[0]
        alert(winner.playerName + ' wins with ' + winner.score)
    } else {
        for (i=0; i<playerArray.length; i++){
            playerArray[i].returned = false;
            playerArray[i].dive = true;
            playerArray[i].treasurePouch = []
            if(playerArray[i].position >=0){
                $(`#${playerArray[i].playerName}`).appendTo($('#submarine'))
            }
            $(`#${playerArray[i].playerName}`).empty()
            playerArray[i].position = -1
            playerArray[i].movement = 0
        }
        returnedPlayer = 0;
        alert('Round ends, penguins who didnt make it back, dropped all their treasure into the trenches..')
        closeEmptyPath()
        alert('Penguins will now skip over tiles that has an oxygen tank on them. Time to dive deeper in round' + (roundsOver+1) + "!")
        playerArray.sort((a,b)=>{return a.score - b.score})
        whosFirstTurn();
    }
}
closeEmptyPath = () => {
    count = 0
    for (i of treasureArray){
            if(i===0){
            closePath = document.getElementById(count)
            closePath.className = 'pathTile oxygenTank'
        }
        count++
    }
}
class audioEffect{
    constructor(source){
    this.sound = document.createElement("audio");
    this.sound.src = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    }
    play(){
      this.sound.play();
    }
    stop(){
      this.sound.pause();
    }
}
const main = () => {
    $('#gameBoard').hide()
    $('#helpBox').hide()
    // $('#howToPlayBoard').hide()
    $('.choosePlayers').on('click', (event) => choosePlayerButton(event))
    $('#startGameButton').on('click', (event) => startGameButton(event))
    $('#howToPlayButton').on('click', (event) => howToPlayButton(event))
    $('#diveDeep').on('click', (event) => setDiveDeep(event))
    $('#returnSub').on('click', (event) => setReturnSub(event))
    $('#rollDie').on('click', (event) => rollDice(event))
    $('#pickTreasure').on('click', (event) => pickTreasure(event))
    $('#dropTreasure').on('click', (event) => dropTreasure(event))
    $('#doNothingButton').on('click', (event) => doNothing(event))
    $('#closeHelp').on('click', () => hideHelp(event))
    $('#utilityHelp').on('click', () => howToPlayButton(event))
    audio.muted = false;
    audio.volume = 0.4;
    clickSound = new audioEffect('./Audio/Click.wav')
    hoverSound = new audioEffect('./Audio/Hover.wav')
    pickSound = new audioEffect('./Audio/PickUp.wav')
    bubbleSound = new audioEffect('./Audio/Bubble.wav')
    $(".choosePlayers").mouseenter((event) => hoverSound.play(event))
    $(".startOrHow").mouseenter((event) => hoverSound.play(event))
    $(".helpNStart").mouseenter((event) => hoverSound.play(event))
    $("#utilityList div").mouseenter((event) => hoverSound.play(event))
    $("#utilityList button").mouseenter((event) => hoverSound.play(event))
}

$(main);