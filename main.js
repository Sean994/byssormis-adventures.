var playerCount = choosePlayerButton = (event) => {
    clickSound.play()
    $('.chosen').attr('class', 'choosePlayers')
    $(event.currentTarget).attr('class', 'chosen')
    playerCount = $(event.currentTarget).attr('players')
    $('#penguinPreview').empty()
    for (i=0; i<playerCount; i++){
        penguinPreviews = ["./Penguins/1 Blue.png", './Penguins/2 Red.png', './Penguins/3 Green.png', './Penguins/4 Yellow.png', './Penguins/5 Black.png', './Penguins/6 Orange.png']
        $('#penguinPreview').append('<img src="' + penguinPreviews[i] + '">')
    }
    return playerCount
}
startGameButton = () => {
    clickSound.play()  
    if (playerCount){
        $('#landingPage').hide()
        $('#gameBoard').show()
        $('.directionSigns').show()
        $('#audio').show()
        generatePathDivs()
        playerArray = generatePlayerDivs(playerCount)
        treasureArray = createTreasureArray(32)
        generateTreasureArray()
    }
    $('body').css('background', "url('./Backgrounds/Underwater720.jpg')")
    $('body').css('background-repeat', "no-repeat")
    scrollFound = false;
    turnSwitcher = 0
    roundsOver = 0
    returnedPlayer = 0
    whosFirstTurn();
    document.getElementById("audio").src = "./Audio/Blue World.mp3"
    audio.muted = false;
}
createTreasureArray = (totalTiles) => { 
    var treasureArray = []
    totalLanes = 4
    tilesPerLane = totalTiles / totalLanes
    for (i=0; i<totalTiles; i++){
            treasureArray.push(Math.floor(i/tilesPerLane)+1)
    }
    treasureArray[treasureArray.length -1 ] = 5
    return treasureArray
}
generatePlayerDivs = (playerCount) => {
    userName = ["Blue", "Red", "Green", "Yellow", "Black", "Orange"]
    penguinPreviews = ["./Penguins/1 Blue.png", './Penguins/2 Red.png', './Penguins/3 Green.png', './Penguins/4 Yellow.png', './Penguins/5 Black.png', './Penguins/6 Orange.png']
    var playerArray = []
    for(let i = 0; i<playerCount; i++){
        playerArray.push( new Player (userName[i])) // array gets new Player Obj
        $('#submarine').append($('<div>') // spawns player at submarine div
            .attr('id', userName[i])
            .addClass('penguins')
            .css('background-image', 'url("' + penguinPreviews[i] + '")')   
            )
    }
    return playerArray
}
generatePathDivs = () => {
    classArray = ['grid1', 'grid2', 'grid3', 'grid4']
    $gameBoard = $('#gameBoard')
    adder = 0
    tilesPerLane = 8
    totalLanes = 4
    lastIDofPath2 = 8*2 - 1
    lastIDofPath4 = 8*4 - 1
    for (i=0; i<totalLanes; i++){
        $grid = $('<div>').addClass('grid').attr('id', 'grid'+(i+1))
        $gameBoard.append($grid)
        for (j=0; j<tilesPerLane; j++){
            if (i===0 || i===2)
            $pathTile = $('<div>').addClass('pathTile').attr('id', j+adder)
            if (i===1)
            $pathTile = $('<div>').addClass('pathTile').attr('id', lastIDofPath2-j)
            if (i===3)
            $pathTile = $('<div>').addClass('pathTile').attr('id', lastIDofPath4-j)
            $grid.append($pathTile)
        }
        adder += tilesPerLane
    }
}
generateTreasureArray = () => {
    treasureImg = ['', './Treasures/1 Treasure.png', './Treasures/2 Treasure.png', './Treasures/3 Treasure.png', './Treasures/4 Treasure.png', './Treasures/5 Treasure.png']
    count = 0
    for (i of treasureArray){
        var src = document.getElementById(count)
        var img = document.createElement("img")
        img.src = treasureImg[i]
        img.className = 'treasure'
        if(treasureImg[i] !== ''){
            treasureRefresh = src.getElementsByClassName('treasure')
            $(treasureRefresh).remove()
            src.appendChild(img)
        } else {
            treasureRemove = src.getElementsByClassName('treasure')
            $(treasureRemove).remove()
        }
        count++
    }
}
whosFirstTurn = () => {
    currentPlayer = playerArray[0]
    $('#announcer').text(currentPlayer.playerName + "'s turn. Roll dice to start exploring the deep!")
    $('#direction').text('Roll or Set Return')
    airSupply = (playerArray.length)*2 + 28
    $('#airSupply').text("Air Supply: " + airSupply)
    diceThrow = true;
    actionTurn = false
    lastTurn = false;
}
setReturnSub = () => {
    clickSound.play()
    if (actionTurn && !diceThrow){
        $('#announcer').text("You just rolled the dice, choose action.")
    }
    if(!actionTurn && diceThrow && (currentPlayer.treasurePouch.length === 0)){
        $('#announcer').text('You must hold at least 1 treasure before returning.')
    }
    if (!currentPlayer.dive &&!actionTurn){
        $('#announcer').text('You already deicded to return, time to roll.')
    }
    if (currentPlayer.position >= 0 && currentPlayer.dive && currentPlayer.treasurePouch.length > 0 && !actionTurn){
        $('#direction').text('Confirm return?')
        eventPop.play()
        $('#returnBoard').show()
    }
    if (currentPlayer.position < 0){
        $('#announcer').text(currentPlayer.playerName + ' is already in sub. Dive deeper!')
    }
}
setReturnConfirm = () => {
    clickSound.play()
    $('#direction').text('Returning to Sub!')
    $('#announcer').text(currentPlayer.playerName + ' deicded to return to sub. Roll the die!')
    currentPlayer.dive = false
    $('#returnBoard').hide()
}
hideReturn = () => {
    clickSound.play()
    $('#direction').text('Roll or Set Return')
    $('#returnBoard').hide()
}
eventBoardShow = (text) => {
    setTimeout( () => {
        eventPop.play()
        $('#eventBoard').show()
        $('#eventText').text(text)
        console.log(text) 
        
    }, 800)
    console.log ('hi')
}
hideEvent = () => {
    clickSound.play()
    $('#eventBoard').hide()
}
rollDice = () => {
    clickSound.play()
    if (actionTurn){
        $('#announcer').text('You already rolled the dice, pick tile action')
    }
    if (diceThrow) {
        movementGain = Math.floor(Math.random() * 6 + 1)
        treasureTotal = currentPlayer.treasurePouch.length
        $('#direction').text('Rolled a ' + movementGain + '!')
        if (treasureTotal === 0){
            currentPlayer.movement += movementGain 
        } else {
            currentPlayer.movement += movementGain - treasureTotal 
            if (currentPlayer.movement <= 0){
                currentPlayer.movement = 0;
                $('#announcer').text("The treasure felt too heavy for " + currentPlayer.playerName + ". Choose action.")
                text = currentPlayer.playerName + " rolled " + movementGain + " but the treasure feels heavier.. "
                eventBoardShow(text)
                actionTurn = true
            }
        }
    }
    diceThrow = false;
    if(currentPlayer.dive === true && currentPlayer.movement > 0){
        divePlayer()
        // $('#direction').text(currentPlayer.playerName + '\'s Diving!')
    }
    if(currentPlayer.dive === false && currentPlayer.movement > 0)
        returnPlayer()  
        // $('#direction').text(currentPlayer.playerName + '\'s Diving!')
}
divePlayer = () => {
    lastTile = treasureArray.length
    // while (currentPlayer.movement != 0 && currentPlayer.position < lastTile-1){
    timerDive = setInterval( ()=>{
        jumpSound.play()
        currentPlayer.movement --
        currentPlayer.position ++
        renderPath = '#' + currentPlayer.position
        // To check if landing div has any existing penguins
        if ($(renderPath).children().hasClass('penguins') || $(renderPath).hasClass('oxygenTank')){
            currentPlayer.movement++
        }
        $('#announcer').text(currentPlayer.playerName + ' dived down to tile ' +(currentPlayer.position + 1)+', choose action.')
        renderPlayer = $('#' + currentPlayer.playerName)
        $(renderPath).prepend(renderPlayer)
        if (currentPlayer.position >= lastTile -3){
            $('#danger1').show()
            $('#shark1').show()
        }
        if (currentPlayer.position >= lastTile-1){   
            currentPlayer.movement = 0
            currentPlayer.position = lastTile-1
            alert ('Congrats, you touched the ocean floor. Turn back now.')
            currentPlayer.dive = false;
            $('#announcer').text(currentPlayer.playerName + ' hears a deep growl.. time to go back..')
        }
        if(currentPlayer.movement <= 0 || currentPlayer.position === lastTile-1){
            clearInterval(timerDive)
            actionTurn = true;
        }   
    }, 500) 
}
returnPlayer = () => {
    // while (currentPlayer.movement != 0)
    timerReturn = setInterval( ()=>{
        jumpSound.play()
        currentPlayer.movement --
        currentPlayer.position --
        renderPath = '#' + currentPlayer.position
        // To check if landing div has any existing penguins
        if ($(renderPath).children().hasClass('penguins') || $(renderPath).hasClass('oxygenTank')){
            currentPlayer.movement++
        }
        renderPlayer = $('#' + currentPlayer.playerName)
        $(renderPath).prepend(renderPlayer)
        if (currentPlayer.position === lastTile - 5){
            $('#shark2').hide()
            $('#danger2').hide()
            $('#danger1').show()
        }
        $('#announcer').text(currentPlayer.playerName + ' swam upwards to tile ' +(currentPlayer.position+1)+', choose action.')
        if (currentPlayer.position === -1){
            $('#submarine').prepend(renderPlayer)
            $('#announcer').text(currentPlayer.playerName + ' returned to the sub safely!')
            currentPlayer.treasureToScore()
            currentPlayer.movement = 0
            currentPlayer.returned = true;
            returnedPlayer ++
            actionTurn = false;
            switchPlayer()
        }
        if (currentPlayer.movement <= 0){
            clearInterval(timerReturn)
            actionTurn = true;
        }
    }, 500)        
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
                    if (treasureHere === 5){
                        $('#danger1').hide()
                        $('#shark1').hide()
                        $('#danger2').show()
                        $('#shark2').show()
                    }
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
        $('#announcer').text('Roll the dice first.')
    }
}
dropTreasure = () => {
    clickSound.play()
    if (actionTurn && currentPlayer.treasurePouch.length === 1 && !currentPlayer.dive){
        $('#announcer').text('You must have at least 1 treasure when returning.')
    } else {
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
                renderCurrentPlayer();
                if (lastTurn){
                    newRound()
                } else {
                switchPlayer()
                }
            }
        } else {
            $('#announcer').text('Roll the dice first.')
        }
    }
} 
renderCurrentPlayer = () => {
    treasureImg = ['', './Treasures/1 Treasure.png', './Treasures/2 Treasure.png', './Treasures/3 Treasure.png', './Treasures/4 Treasure.png', './Treasures/5 Treasure.png']
    $player = currentPlayer.playerName
    $("#" + $player).empty()
    for (i of currentPlayer.treasurePouch){
        $("#"+$player).append($("<img>").attr('src', treasureImg[i]))
    }
}
doNothing = () => {
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
        currentPlayer = playerArray[(turnSwitcher%playerArray.length)]
        treasureCount = currentPlayer.treasurePouch.length
        if (treasureCount>0){
        airSupplyTurn(currentPlayer, treasureCount);
        }
        if(currentPlayer.dive === true){
            $('#announcer').text(currentPlayer.playerName + "'s turn. Currently diving deeper. Roll the dice!")
        } else {
            $('#announcer').text(currentPlayer.playerName + "'s turn. Returning to the sub. Roll the dice!")
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
        bubbleSound.play()
        treasureText = treasure>1 ? "treasure boxes":"treasure box"
        text = player.playerName + ' is currently holding ' + treasure + ' ' + treasureText + '. '  + 'This round\'s Air supply is reduced by '+ treasure + '. ' + 'You have ' + airSupply + ' units of air supply remaining.'
        eventBoardShow(text)
        $('#airSupply').text("Air Supply: " + airSupply)
    } else {
        bubbleSound.play()
        text = 'The air supply ran out!! This will be the last turn of this round.'
        eventBoardShow(text)
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
        audio.volume = 0.5
        document.getElementById("audio").src = "./Audio/Missing You.mp3"
        audio
        playerArray.sort((a,b)=>{return b.score - a.score})
        winner = playerArray[0].playerName
        if (playerArray[0].score === playerArray[1].score){
            winner = playerArray[0].playerName + " and " + playerArray[1].playerName
        }
        if (scrollFound){
            text = (winner + ' wins with a highest score of ' + playerArray[0].score + '! The Lost Scroll to Eternal Joy has finally been found and as the scroll is being unrolled slowly, the entire town brims with anticipation. Perhaps, it is a map to greater riches. Alas! The opened scroll reveals an old recipe for Sicilian Fish Stew, written neatly and signed by Granny Doris. That day, the penguins found eternal joy indeed. The recipe became the crown piece of the Krappacino Archives and spurred a new age of chefs.')
            eventBoardShow(text)
        }else {
            text = (winner + ' wins with a highest score of ' + playerArray[0].score + '! Upon returning to Krappacino Town Hall, the younglings confirmed that the rumoured treasures were true after all. Their successful expedition set a pivotal point in the reputation of the Bronze Beak Penguins. This historical moment spurred a new age of explorers, young and old.')
            eventBoardShow(text)
        }
    } else {
        for (i=0; i<playerArray.length; i++){
            if(playerArray[i].position >=0){
                $(`#${playerArray[i].playerName}`).appendTo($('#submarine'))
            }
            playerArray[i].returned = false;
            playerArray[i].dive = true;
            playerArray[i].treasurePouch = []
            playerArray[i].position = -1
            playerArray[i].movement = 0
            $(`#${playerArray[i].playerName}`).empty()
        }
        returnedPlayer = 0;
        text = ('Round ' + (roundsOver) +' is over. Any penguins who were still mid-way back, panicked, dropped the weighty treasures and made it back safely. The penguins realized they can kick off the empty air tanks and propel themsleves forward into the deep. Penguins will now skip over tiles that has an air tank on them. Time to dive deeper in round ' + (roundsOver+1) + "!")
        eventBoardShow(text)
        closeEmptyPath()
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
showScore = () => {
    clickSound.play()
    $("#helpBox").hide()
    $('#scoreBoardText').empty()
    $('#scoreBoard').show()
    $('#scoreBoardText').append($('<h2>').text(`Current round: ${roundsOver}`))
    for (i in playerArray){
        playersName = (playerArray[[i]].playerName) 
        playersScore = (playerArray[i].score)
        $('#scoreBoardText').append($('<h2>').text(`${playersName} : ${playersScore}`))
    }
}
hideScore= () => {
    clickSound.play()
    $('#scoreBoardText').empty()
    $("#scoreBoard").hide()
}
showHelp = () => {
    clickSound.play()
    $('#helpBox').show()
    $("#scoreBoard").hide()
}
historyHelp = (event) => {
    clickSound.play()
    $('.chosenHelp').attr('class', 'helpBtn')
    $(event.currentTarget).attr('class','chosenHelp')
    $('#helpText').html("ATLANTIC TIMES, 3 MAY 2019 <br />  <br /> Rumours of untold treasures are spreading within the bronze-beak penguin tribe, Krappacino. A long forgotten myth - The Lost Scroll to Eternal Joy, is currently trending in The Igloo Forums. Most of the penguinfolk remain skeptical, except for a bunch of adolescents. Pooling their savings, they managed to afford a single yellow submarine for their expedition. <br /> <br /> This submarine is pivotal in their plan to bring back the rumored treasures (if any). However, the submarine can only bring a limited supply of fresh air; to be shared among the young Krappas. The individual choices of these younglings will decide if the expedition will be known as The Abyss-Adventure or A Mis-Adventure. <br /><br /> Will they find these untold treasures and have their lives change forever? <br /> Or .. will they just become another meme icon for future generations.")
}
turnHelp = (event) => {
    clickSound.play()
    $('.chosenHelp').attr('class', 'helpBtn')
    $(event.currentTarget).attr('class','chosenHelp')
    $('#helpText').html("BREATHE: At the start of each player's turn, Submarine's air supply will be reduced by the number of treasures player is holding. If the air supply reaches 0 or below, the current player's turn will be the last one of the entire round. <br /> <br /> DIVE or RETURN: Player will roll the dice and move tiles equal to the roll. If player is carrying treasure, subtract the number of treasure from the roll. Eg. If player is carrying 3 treasures & rolls a 4, player will move by 1 tile only. Player can skip over tiles that are already occupied by another player. <br />Once player has pick his first treasure, player can decide to return back to submarine or dive deeper. Once Player decides to return, Player must continue all the way back to submarine for the round. ie. Player cannot choose to return, and then dive deeper again during the next turn.<br /><br /> TILE ACTIONS: Player can pick or drop treasure, or do nothing at arrived tile. Player can only drop treasure on empty tiles. Player will always first drop lowest tier of treasure. Turn ends after this.")
}
scoreHelp = (event) => {
    clickSound.play()
    $('.chosenHelp').attr('class', 'helpBtn')
    $(event.currentTarget).attr('class','chosenHelp')
    $('#helpText').html("TREASURE TYPES: There are 4 tiers/types of treasures scattered in the abyss, with each type different in appearance and score value (randomly generated). Treasures will only be converted to the player's score when player returns safely to submarine with it. If a player did not return to the submarine safely, all treasures that the player is holding will be lost.<br /> <br /> TIER 1: Gold Coins (2 - 3 points), found on the first 7 tiles. <br /><br /> TIER 2: Oak Crates (4 - 6 points), found on the next 7 tiles.<br /><br /> TIER 3: Willow Chests (7 - 10 points), found on the next 7 tiles.<br /><br /> TIER 4: Mahogany Chests (12 - 15 points), found on the next 6 tiles. <br /><br /> TIER 5: Lost Scroll to Eternal Joy (50 points), only found at the deepest floors of the abyss. It was last seen by Admiral Henrik Dansgar.")
}
roundHelp = (event) => {
    clickSound.play()
    $('.chosenHelp').attr('class', 'helpBtn')
    $(event.currentTarget).attr('class','chosenHelp')
    $('#helpText').html("Round ends when either one of these 2 conditions is met:<br>1. Air supply reaches 0. <br />2. All players returned safely to the submarine.<br /><br /> After each round, treasure tiles that are empty will be converted to oxygen tanks. Players can skip over these oxygen tanks to advance to the next nearest treasure tile. Player with the lowest score will start first in the next round.<br /><br />The whole game ends after 3 rounds and players will be ranked by their score earned by returning treasures safely.")
}
hideHelp = () => {
    clickSound.play()
    $("#helpBox").hide()
}
loadClickListeners = () => {
    // Landing page listeners
    $('.choosePlayers').on('click', (event) => choosePlayerButton(event))
    $('#startGameButton').on('click', (event) => startGameButton(event))
    $('#howToPlayButton').on('click', (event) => showHelp(event))
    // Roll or return listeners
    $('#returnSub').on('click', (event) => setReturnSub(event))
    $('#rollDie').on('click', (event) => rollDice(event))
    // Action listeners
    $('#pickTreasure').on('click', (event) => pickTreasure(event))
    $('#dropTreasure').on('click', (event) => dropTreasure(event))
    $('#doNothingButton').on('click', (event) => doNothing(event))
    // Scoreboard listeners
    $('#scoreBoardButton').on('click', () => showScore())
    $('#closeScore').on('click', () => hideScore())
    // Helpbox listeners
    $('#utilityHelp').on('click', () => showHelp())
    $('#HistoryHelpBtn').on('click', (e) => historyHelp(e))
    $('#turnHelpBtn').on('click', (e) => turnHelp(e))
    $('#scoreHelpBtn').on('click', (e) => scoreHelp(e))
    $('#roundHelpBtn').on('click', (e) => roundHelp(e))
    $('#closeHelpBtn').on('click', () => hideHelp())
    $('#confirmReturn').on('click', () => setReturnConfirm())
    $('#closeReturn').on('click', () => hideReturn())
    $('#closeEvent').on('click', () => hideEvent())
    // Music and sound effects
    $(".choosePlayers").mouseenter((event) => hoverSound.play(event))
    $(".startOrHow").mouseenter((event) => hoverSound.play(event))
    $(".helpNStart").mouseenter((event) => hoverSound.play(event))
    $(".helpBtn").mouseenter((event) => hoverSound.play(event))
    $(".closeScoreBtn").mouseenter((event) => hoverSound.play(event))
    $(".returnBtn").mouseenter((event) => hoverSound.play(event))
    $('#closeEvent').mouseenter((event) => hoverSound.play(event))
    $("#utilityList div").mouseenter((event) => hoverSound.play(event))
    $("#utilityList button").mouseenter((event) => hoverSound.play(event))
}
loadAudioEffects = () => {
    audio.muted = false;
    audio.volume = 0.2;
    clickSound = new audioEffect('./Audio/Click.wav')
    hoverSound = new audioEffect('./Audio/Hover.wav')
    pickSound = new audioEffect('./Audio/PickUp.wav')
    bubbleSound = new audioEffect('./Audio/Bubble.wav')
    jumpSound = new audioEffect('./Audio/Jump.mp3')
    eventPop = new audioEffect('./Audio/EventPop.mp3')
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
    }
    treasureToScore(){
        var treasureConvert = 0
        var scoreAdd = 0
        for (let i = 0; i<this.treasurePouch.length; i++){
            treasureConvert = this.treasurePouch[i]
            if(treasureConvert === 1)
                {scoreAdd = (Math.ceil(Math.random()*2) + 1)}
            if(treasureConvert === 2)
                {scoreAdd = (Math.ceil(Math.random()*3) + 3)}
            if(treasureConvert === 3)
                {scoreAdd = (Math.ceil(Math.random()*4) + 6)}
            if(treasureConvert === 4)
                {scoreAdd = (Math.ceil(Math.random()*4) + 11)}
            if(treasureConvert === 5)
                {scoreAdd = 50
                scrollFound = true;
                }
            this.score += scoreAdd
        }
        this.treasurePouch = []
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
    $('#scoreBoard').hide()
    $('#returnBoard').hide()
    $('#audio').hide()
    $('#eventBoard').hide()
    $('.directionSigns').hide()
    loadClickListeners()
    loadAudioEffects()
}

$(main);