var playerArray = []
var movementGain = 0
var path = []
var treasureArray = []
var turnSwitcher = 0
var setDirection = true
var diceThrow = false
var actionTurn = false
var returnedPlayer = 0
for (i=0; i<25; i++){
    path.push(i)
    if((Math.floor(i/6)+1)<5)
    treasureArray.push(Math.floor(i/6)+1)
    else
    treasureArray.push(0)
}
choosePlayerButton = (event) => {
    $('.chosen').attr('class', 'choosePlayers')
    $(event.currentTarget).attr('class', 'chosen')
    playerCount = $(event.currentTarget).attr('players')
    $('#penguinPreview').empty()
    for (i=0; i<playerCount; i++){
        penguinPreviews = ["/Penguins/1 Blue.png", '/Penguins/2 Red.png', '/Penguins/3 Green.png', '/Penguins/4 Yellow.png', '/Penguins/5 Black.png', '/Penguins/6 Orange.png']
        $('#penguinPreview').append('<img src="' + penguinPreviews[i] + '">')
    }
}
startGameButton = (event) => {
    if (playerCount){
        $(event.currentTarget).attr('class', 'startOrHowChosen')
        $('#landingPage').hide()
        $('#gameBoard').show()
        generatePlayerDivs(playerCount)
        generatePathDivs()
        generateTreasureArray(treasureArray)
    }
    $('body').css('background', "url('/Backgrounds/Underwater720.jpg')")
    $('body').css('background-repeat', "no-repeat")
    whosTurnIsIt();
}
howToPlayButton = (event) => {
    $(event.currentTarget).attr('class', 'startOrHowChosen') 
    // bring up howToPlay div
}
class Player {
    constructor(name){
        this.playerName = name;
        this.score = 0;
        this.tier1 = 0;
        this.tier2 = 0;
        this.tier3 = 0;
        this.tier4 = 0;
        this.movement = 0;
        this.position = -1;
        this.dive = true;
        this.returned = false;
        this.abyssAdventures = 0;
        this.misAdventures = 0;
    }
    // user functions 1. rolls die 2. calculate the no. of move that turn
    diveOne(){
        this.movement -= 1;
        this.position +- 1;
    }
    pickUpTreasure(){

    }
    dropTreasure(){

    }
}
// create player Objects and their board pieces (div)
generatePlayerDivs = (playerCount) => {
    userName = ["Blue", "Red", "Green", "Yellow", "Black"]
    penguinPreviews = ["/Penguins/1 Blue.png", '/Penguins/2 Red.png', '/Penguins/3 Green.png', '/Penguins/4 Yellow.png', '/Penguins/5 Black.png', '/Penguins/6 Orange.png']
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
generatePathDivs = () => {
    classArray = ['grid1', 'grid2', 'grid3', 'grid4']
    $gameBoard = $('#gameBoard')
    adder = 0
    for (i=0; i<4; i++){
        $grid = $('<div>').addClass('grid').attr('id', 'grid'+(i+1))
        $gameBoard.append($grid)
        for (j=0; j<6; j++){
            if (i===0 || i===2)
            $pathTile = $('<div>').addClass('pathTile').attr('id', j+adder)
            if (i===1)
            $pathTile = $('<div>').addClass('pathTile').attr('id', 11-j)
            if (i===3)
            $pathTile = $('<div>').addClass('pathTile').attr('id', 23-j)
            $grid.append($pathTile)
        }
        adder += 6
    }
}
// based on treasureArray, assigns the img of chest with respective tier to treasure divs
generateTreasureArray = (treasureArray) => {
    treasureImg = ['', '/Treasures/1 Treasure.png', '/Treasures/2 Treasure.png', '/Treasures/3 Treasure.png', '/Treasures/4 Treasure.png']
    count = 0
    for (i of treasureArray){
        var src = document.getElementById(path[count])
        var img = document.createElement("img")
        img.src = treasureImg[i]
        img.className = 'treasure'
        img.id = 'treasure' + count
        if(treasureImg[i] !== '')
            src.appendChild(img)
        count++
    }
}
// Player turn roller 
whosTurnIsIt = () => {
    turnSwitcher = 0
    currentPlayer = playerArray[turnSwitcher%playerArray.length]
    $('#announcer').text("It is " + currentPlayer.playerName + "'s turn")
    // interval 2s
    // currentPlayer has N Treasures
    // interval 2s
    // Air supply minus N
}
// Player option 1: Set Dive Deeper or Return
setDiveDeep = (event) => {
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
    if (diceThrow) {
        movementGain = Math.floor(Math.random() * 6 + 1)
        currentPlayer.treasureTotal = currentPlayer.tier1 + currentPlayer.tier2 + currentPlayer.tier3 + currentPlayer.tier4 
        if (currentPlayer.treasureTotal === 0){
            currentPlayer.movement += movementGain 
        } else {
            currentPlayer.movement += movementGain - currentPlayer.treasureTotal 
            if (currentPlayer.movement < 0){
                currentPlayer.movement = 0;
                $('#announcer').text('Your treasure felt too heavy')
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
    while (currentPlayer.movement != 0){
        currentPlayer.movement --
        currentPlayer.position ++
        renderPath = '#' + currentPlayer.position
        // To check if landing div has any existing penguins
        if ($(renderPath).children().hasClass('penguins')){
            currentPlayer.movement++
        }
        renderPlayer = $('#' + currentPlayer.playerName)
        $(renderPath).prepend(renderPlayer)
    }
    $('#announcer').text('Landed at tile ' +(currentPlayer.position+1)+', choose action.')
    actionTurn = true;
}
returnPlayer = () => {
    setDirection = false;
    while (currentPlayer.movement != 0){
        currentPlayer.movement --
        currentPlayer.position --
        renderPath = '#' + currentPlayer.position
        // To check if landing div has any existing penguins
        if ($(renderPath).children().hasClass('penguins')){
            currentPlayer.movement++
        }
        renderPlayer = $('#' + currentPlayer.playerName)
        $(renderPath).prepend(renderPlayer)
        $('#announcer').text('Landed at tile ' +(currentPlayer.position+1)+', choose action.')
        if (currentPlayer.position === -1){
            $('#submarine').prepend(renderPlayer)
            $('#announcer').text(currentPlayer.playerName + ' returned safely to the submarine!')
            currentPlayer.movement = 0
            currentPlayer.returned = true;
            returnedPlayer ++
            switchPlayer()
        }
    }   
    actionTurn = true;
}
pickTreasure = () => {
    actionTurn = false;
    $('#announcer').text('Landed at tile ' +(currentPlayer.position+1)+', choose action.')
}
dropTreasure = () => {
    actionTurn = false;
    currentPlayer.tier1 = 1
    currentPlayer.tier2 = 3
    currentPlayer.tier4 = 2
}
doNothing = (event) => {
    if (actionTurn)
        switchPlayer()
    actionTurn = false;
}
switchPlayer = () => {
    if (returnedPlayer === playerArray.length){
        newRound()
    }
    turnSwitcher ++
    currentPlayer = playerArray[(turnSwitcher%playerArray.length)]
    $('#announcer').text("It is " + currentPlayer.playerName + "'s turn")
    $('#direction').text('Set direction')
    actionTurn = false;
    setDirection = true;
    movementGain = 0;
    if (currentPlayer.returned === true){
        switchPlayer()
    }
}

newRound = () => {
    for (i=0; i<playerArray.length; i++){
        playerArray[i].returned = false;
    }
    // convert treasure into score
    // sort playerArray by object key value (playerArray[i].score)
    console.log('round end!')
    alert('round end')
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
}

$(main);