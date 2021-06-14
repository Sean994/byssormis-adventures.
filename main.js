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
        $(event.currentTarget).attr('class', 'startOrHowChosen')
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
    $(event.currentTarget).attr('class', 'startOrHowChosen') 
    // bring up howToPlay div
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
                {scoreAdd = (Math.ceil(Math.random()*2) + 1)
                console.log("tier 1")}
            if(treasureConvert === 2)
                {scoreAdd = (Math.ceil(Math.random()*3) + 3)
                console.log("tier 2")}
            if(treasureConvert === 3)
                {scoreAdd = (Math.ceil(Math.random()*4) + 6)
                console.log("tier 3")}
            if(treasureConvert === 4)
                {scoreAdd = (Math.ceil(Math.random()*4) + 11)
                console.log("tier 4")}
            this.score += scoreAdd
            console.log(this.score, "score")
        }
        this.treasurePouch = []
    }
}
// create player Objects and their board pieces (div), append to submarine
generatePlayerDivs = (playerCount) => {
    userName = ["Blue", "Red", "Green", "Yellow", "Black"]
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
    for (i=0; i<4; i++){
        $grid = $('<div>').addClass('grid').attr('id', 'grid'+(i+1))
        $gameBoard.append($grid)
        for (j=0; j<7; j++){
            if (i===0 || i===2)
            $pathTile = $('<div>').addClass('pathTile').attr('id', j+adder)
            if (i===1)
            $pathTile = $('<div>').addClass('pathTile').attr('id', 13-j)
            if (i===3)
            $pathTile = $('<div>').addClass('pathTile').attr('id', 27-j)
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
    setDirection = true;
    airSupply = 25
    diceThrow = false
    actionTurn = false
    lastTurn = false;
    // interval 2s
    // currentPlayer has N Treasures
    // interval 2s
    // Air supply minus N
}
// Player option 1: Set Dive Deeper or Return
setDiveDeep = (event) => {
    clickSound.play()
    if (currentPlayer.dive === false && setDirection === true){
        $('#announcer').text("You can't dive deeper for this turn")
    } 
    if (currentPlayer.dive === true && setDirection === true){
        $('#direction').text('Diving Deep')
        $('#announcer').text(currentPlayer.playerName + ' is diving deep.')
        diceThrow = true;
    }
}
setReturnSub = (event) => {
    clickSound.play()
    if (currentPlayer.position >= 0 && setDirection === true){
        $('#direction').text('Returning to Sub')
        $('#announcer').text(currentPlayer.playerName + ' is returning to sub.')
        currentPlayer.dive = false
        diceThrow = true
    }
    if (currentPlayer.position < 0 && setDirection === true){
        $('#announcer').text(currentPlayer.playerName + ' is already in sub. Dive deeper')
        diceThrow = false
    }
}
// Player option 2: Roll die only
rollDice = (event) => {
    clickSound.play()
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
    // } else {
    //     $('#announcer').text('You already rolled '+ movementGain)
    // }
    diceThrow = false;
    if(currentPlayer.dive === true && currentPlayer.movement > 0)
        divePlayer()
    if(currentPlayer.dive === false && currentPlayer.movement > 0)
        returnPlayer()  
}
divePlayer = () => {
    setDirection = false;
    while (currentPlayer.movement != 0 && currentPlayer.position < 24){
        currentPlayer.movement --
        currentPlayer.position ++
        renderPath = '#' + currentPlayer.position
        // To check if landing div has any existing penguins
        if ($(renderPath).children().hasClass('penguins') || $(renderPath).hasClass('Bye')){
            currentPlayer.movement++
        }
        if (currentPlayer.position === 23){   
            currentPlayer.movement = 0
            console.log("congrats")
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
        if ($(renderPath).children().hasClass('penguins') || $(renderPath).hasClass('Bye')){
            currentPlayer.movement++
        }
        renderPlayer = $('#' + currentPlayer.playerName)
        $(renderPath).prepend(renderPlayer)
        $('#announcer').text('Landed at tile ' +(currentPlayer.position+1)+', choose action.')
        if (currentPlayer.position === -1){
            $('#submarine').prepend(renderPlayer)
            $('#announcer').text(currentPlayer.playerName + ' returned safely!')
            currentPlayer.treasureToScore()
            currentPlayer.movement = 0
            currentPlayer.returned = true;
            returnedPlayer ++
            for (i of currentPlayer.treasurePouch){
                console.log('treasure', i)
            }
            switchPlayer()
        }
    }   
    actionTurn = true;
}
pickTreasure = () => {
    clickSound.play()
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
        actionTurn = true;
    }
}
dropTreasure = () => {
    clickSound.play()
    var temp = treasureArray[currentPlayer.position]
    if (currentPlayer.treasurePouch.length === 0){
        $('#announcer').text('Your pouch is empty..')
        actionTurn = true
    } else if (temp > 0){
        $('#announcer').text('There is already existing treasure!')
        actionTurn = true
    } else if (currentPlayer.treasurePouch.length === 0){
        $('#announcer').text('Your pouch is empty..')
        actionTurn = true
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
    if (lastTurn)
        newRound()
    if (actionTurn)
        switchPlayer()
}
switchPlayer = () => {
    if (returnedPlayer === playerArray.length){
        newRound()
    } else {
        turnSwitcher ++
        currentPlayer = playerArray[(turnSwitcher%playerArray.length)]
        treasureCount = currentPlayer.treasurePouch.length

        if (treasureCount>0){
        airSupplyTurn(currentPlayer, treasureCount);
        }
        
        $('#announcer').text(currentPlayer.playerName + "'s turn. Choose direction")
        $('#direction').text('Set direction')
        actionTurn = false;
        setDirection = true;
        movementGain = 0;
        if (currentPlayer.returned === true){
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
        $('#airSupply').text("Air Supply: Empty (Last Turn)")
        lastTurn = true;
    }
}
newRound = () => {
    roundsOver++
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
        alert('Penguins will now skip over tiles that has an oxygen tank on them. Time to dive deeper in round' + roundsOver + "!")
        playerArray.sort((a,b)=>{return a.score - b.score})
        whosFirstTurn();
    }
}
closeEmptyPath = () => {
    count = 0
    for (i of treasureArray){
            if(i===0){
            closePath = document.getElementById(count)
            closePath.className = 'pathTile Bye'
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
    audio.muted = false;
    audio.volume = 0.4;
    clickSound = new audioEffect('./Audio/Click.wav')
    hoverSound = new audioEffect('./Audio/Hover.wav')
    pickSound = new audioEffect('./Audio/PickUp.wav')
    bubbleSound = new audioEffect('./Audio/Bubble.wav')
    $(".choosePlayers").mouseenter((event) => hoverSound.play(event))
    $(".startOrHow").mouseenter((event) => hoverSound.play(event))
    $("#utilityList div").mouseenter((event) => hoverSound.play(event))
    $("#utilityList button").mouseenter((event) => hoverSound.play(event))
}

$(main);