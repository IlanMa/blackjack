var blackjack = new Object(); //new object for the game                                                              
blackjack.dealerCards = []; //array for the dealer's cards
blackjack.playerCards = []; //array for the player's cards
blackjack.cardCodes = [   //all possible cards
    "AS","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS",
    "AH","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH",
    "AC","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD", 
    "AC","2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC"];        
blackjack.gameActive = true; //determines if the game is on or not
blackjack.playerScore = 0; //player cards total score
blackjack.dealerScore = 0; //dealer cards total score
blackjack.cardScores = { //value of each card
    "A": 11,
    "K": 10,
    "Q": 10,
    "J": 10,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2
};

blackjack.scoreCalculator = function(cardValues){ //determines the score of either the player or dealer cards
    var scoreSum = 0;
    for (var i = 0; i < cardValues.length; i++){ //sums the value of cards individually
        var cardValue = cardValues[i].slice(0, -1); //removes the type of the card
        var finalSum = this.cardScores[cardValue]; //gives the card a value
        scoreSum = scoreSum + finalSum; //sums up the score of all cards      
    }
    return scoreSum;  //returns the score of either the player or dealer cards
}                         

blackjack.dealCard = function(playerTurn){ //deals a card either to the dealer if playerTurn is false else to player 
    var randomPosition = Math.floor(Math.random() * this.cardCodes.length); //generates random position in array cardCodes
    var randomCard = this.cardCodes[randomPosition]; //card code is assigned to the variable 
    
    if (playerTurn) { //checks if it should give a card to the player
        this.playerCards.push(randomCard); //adds the card to playerCards array
        $("#playercardstest").prepend("<div class=\"cards\"><img src=\"images/" + randomCard + ".jpg\" /></div>"); //displays the card to the player
    } else { //deals card to the dealer
        this.dealerCards.push(randomCard); //adds the card to dealerCards array
        $("#dealergoeshere").prepend("<div class=\"cards\"><img src=\"images/" + randomCard + ".jpg\" /></div>");  //displays the card to the dealer
    }
}           
blackjack.scoreCalculatorDealer = function(cardValues){ //determines the score of either the player or dealer cards
    var scoreSum = 0;    
    for (var i = 0; i < cardValues.length; i++){ //sums the value of cards individually
        var cardValue = cardValues[i].slice(0, -1); //removes the type of the card
        var finalSum = this.cardScores[cardValue]; //gives the card a value

        scoreSum = scoreSum + finalSum; //sums up the score of all cards        
         
       if (scoreSum > 21){ 
            if (cardValues.indexOf("AC") >= 0 || cardValues.indexOf("AH") >= 0 || cardValues.indexOf("AS") >= 0){
                this.cardScores.A = 1;
            }     
       } else if (this.playerScore < scoreSum){
            this.gameActive = false;
        }
    }
    return scoreSum;     
}                              

blackjack.startGame = function(){ //starts a new game
    this.gameActive = true;  
    document.getElementById("playercardstest").innerHTML = "";
    document.getElementById("dealergoeshere").innerHTML = "";
    this.dealerScore = 0;
    this.playerScore = 0;
    blackjack.dealerCards = [];
    blackjack.playerCards = [];
    this.firstAceDealer = false;
    this.dealCard(true); //deals card to the player
    this.dealCard(true); //deals card to the player
    this.dealCard(false); //deals card to the dealer
    this.playerScore = this.scoreCalculator(this.playerCards); //sums up the value of the player cards
    this.dealerScore = this.scoreCalculator(this.dealerCards);
    document.getElementById("start").style.visibility="hidden";
    document.getElementById("hit").style.visibility="visible";
    document.getElementById("stand").style.visibility="visible";
    document.getElementById("playerscore").innerHTML = "Score " + this.playerScore;
    document.getElementById("dealerscore").innerHTML = "Score " + this.dealerScore;
    document.getElementById("middle").innerHTML = ""; 


    if (this.playerScore === 21){ //checks if the player has a blackjack
        this.gameActive = false; //ends the game
        blackjack.displayWinner("Blackjack")
    }
}
blackjack.playerBust = function(){
    this.gameActive = false; //ends the game
    blackjack.displayWinner("Player Bust")
    document.getElementById("playerscore").innerHTML = this.playerScore;
    this.cardScores.A = 11;  
}
blackjack.hitPlayer = function(){ //hits the player with a card
    this.dealCard(true); // deals a card to the player
    this.playerScore = this.scoreCalculator(this.playerCards); //updates the score of the player cards
    document.getElementById("playerscore").innerHTML = "Score " + this.playerScore;  

    if (this.playerScore > 21){ //checks if the player is busted
        if (this.playerCards.indexOf("AC") >= 0 || this.playerCards.indexOf("AS") >= 0 || this.playerCards.indexOf("AN") >= 0){  
            this.cardScores.A = 1;
            this.playerScore = this.scoreCalculator(this.playerCards); //updates the score of the player cards
            document.getElementById("playerscore").innerHTML = "Score " + this.playerScore;
            if (this.playerScore > 21){
                blackjack.playerBust()
            }  
        } else { 
            blackjack.playerBust()
        }
    }    
}

blackjack.hitDealer = function(){
    document.getElementById("hit").style.visibility="hidden"; 
    document.getElementById("stand").style.visibility="hidden"; 

    do { 
        this.dealCard(false);  
        this.dealerScore = this.scoreCalculatorDealer(this.dealerCards);
        document.getElementById("dealerscore").innerHTML = "Score " + this.dealerScore;      
        
        if (this.dealerScore >= 17){         
            this.gameActive = false;
        } 
    }
    while (this.gameActive);
    
    if (this.dealerScore > 21){
        blackjack.displayWinner("Dealer Busts");
    } else if (this.dealerScore > this.playerScore){
        blackjack.displayWinner("Dealer Wins");
    } else if (this.dealerScore < this.playerScore){
        blackjack.displayWinner("Player Wins");       
    } else {
        blackjack.displayWinner("Push");
    }
}                                      

blackjack.displayWinner = function(message){  
    $("#middle").html(message);
    document.getElementById("start").style.visibility="visible";
    document.getElementById("hit").style.visibility="hidden"; 
    document.getElementById("stand").style.visibility="hidden";
}



