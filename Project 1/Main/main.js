choosePlayerButton = (event) => {
    $('.chosen').attr('class', 'choosePlayers')
    $(event.currentTarget).attr('class', 'chosen')
    playerCount = $(event.currentTarget).attr('players')
    $('#penguinPreview').empty()
    for (i=0; i<playerCount; i++){
        penguinPreviews = ["1  Blue.png", '2 Red.png', '3 Green.png', '4 Yellow.png', '6 Black.png']
        $('#penguinPreview').append('<img src="' + penguinPreviews[i] + '">')
    }
}
startGameButton = (event) => {
    $(event.currentTarget).attr('class', 'startOrHowChosen')
    $('#landingPage').hide()
    $('#gameBoard').show()
    // bring up gameBoard div
    // gameBoard div buttons.on()
}
howToPlayButton = (event) => {
    $(event.currentTarget).attr('class', 'startOrHowChosen') 
    // bring up howToPlay div
}

const main = () => {
    $('#gameBoard').hide()
    $('.choosePlayers').on('click', (event) => choosePlayerButton(event))
    $('#startGameButton').on('click', (event) => startGameButton(event))
    $('#howToPlayButton').on('click', (event) => howToPlayButton(event))
}

$(main);