var playerArray = []
var path = []
var treasureArray = []
for (i=0; i<28; i++){
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
        generatePenguinDivs(playerCount)
        generateTreasureArray(treasureArray)
    }
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
        this.movement = 0
        this.dive = true;
        this.abyssAdventures = 0;
        this.misAdventures = 0;
    }
    // user function if dive true, penguin diving deeper, else penguin returning to submarine
    diveOrReturn(){
        this.dive = !(this.dive)
    }
    // user functions 1. rolls die 2. calculate the no. of move that turn
    rollMovement(){
        movementGain = rollDice()
        treasureTotal = this.tier1 + this.tier2 + this.tier3 + this.tier4
        this.movement = movementGain - treasureTotal
    }
    dropTreasure(){

    }
    pickUpTreasure(){

    }
}
// create player Objects and their board pieces (div)
generatePenguinDivs = (playerCount) => {
    userName = ["Blue", "Red", "Green", "Yellow", "Black"]
    penguinPreviews = ["/Penguins/1 Blue.png", '/Penguins/2 Red.png', '/Penguins/3 Green.png', '/Penguins/4 Yellow.png', '/Penguins/5 Black.png', '/Penguins/6 Orange.png']
    for(let i = 0; i<playerCount; i++){
        playerArray.push( new Player (userName[i]))
        $('#submarine').append($('<div>')
            .attr('id', userName[i])
            .addClass('penguins')
            .css('background-image', 'url("' + penguinPreviews[i] + '")')
            // .text(userName[i])    
            )
    }
}
// Treasure assets here
generateTreasureArray = (treasureArray) => {
    treasureImg = ['', '/Treasures/1 Treasure.png', '/Treasures/2 Treasure.png', '/Treasures/3 Treasure.png', '/Treasures/4 Treasure.png']
    count = 0
    for (i of treasureArray){
        var src = document.getElementById(path[count])
        var img = document.createElement("img")
        img.src = treasureImg[i]
        img.className = 'treasure'
        if(treasureImg[i] !== '')
            src.appendChild(img)
        count++
    }
}
const main = () => {
    $('#gameBoard').hide()
    // $('#howToPlayBoard').hide()
    $('.choosePlayers').on('click', (event) => choosePlayerButton(event))
    $('#startGameButton').on('click', (event) => startGameButton(event))
    $('#howToPlayButton').on('click', (event) => howToPlayButton(event))
}

$(main);