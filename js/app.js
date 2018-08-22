/*
 * Create an array list that holds all of your cards symbols
 */

const cardSymbols =  ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", 
"fa fa-bomb", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
       

//Empty the array to push open/flipped cards into
let flippedCards = [];

let matchedCards = [];           //add elements to this array when cards are matched up

const OpenCards = [];           //allows me to get the array index and count ever card by running openCards 

//create deck to hold cards
const deckCards = document.querySelector(".deck");


/*
* Initizlize the game by building the cards then attach them to the card deck. I will need to invoke this funcion to start the game see below gameboardInit(); is invoked
*/

function gameboardInit(){    
    shuffle(cardSymbols);

    for(let i = 0; i < cardSymbols.length; i++) { 
    
            let card = document.createElement("li");
            card.classList.add("card");
            card.innerHTML = `<i class="${cardSymbols[i]}"></i>`;           //E5 card.innerHTML = "<i class='" + cardSymbols[i] + "'</li>; we set the cards innerHTML here
            deckCards.appendChild(card);
    
    //add an event listener for a click for each card in the loop as they are created so pass in the click function i created below so invoke the function
    click(card);   

    //reset timer
    let timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
      }
}


/*
* Create and set the timer for the game
*/

let second = 0, minute = 0;
let timer = document.querySelector(".timer");
let interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second = 0;
        }
    }, 1000);
}

/*
*   Create the Click Event
*/

function click(card) {
    card.addEventListener('click', function() {        
    const currentCard = this;
    const previousCard = flippedCards[0];

    //we have an existing open card
    if(flippedCards.length === 1) {                          //if openCrads length is 1 it is true and will run the code
           
         card.classList.add("open", "show", "disable");    //add card class open + show + new class of disabled to prevent a card from showing as matched if it is doubled clicked so fixing that bug

         flippedCards.push(this);                            //push this-> as in this opened card into the flippedCards variable array

           //here invoke the function compare the two opened cards to see if they match
           compare(currentCard, previousCard);

    } else {
          //here we do not have any open cards
          card.classList.add("open", "show", "disable");      //add card class open + show + disable
          flippedCards.push(this);                            //push this-> as in this opended card into the flippedCards variable array 
     }      

});
}


/*
* create function to compare two cards that are matching or not
*/

function compare(currentCard, previousCard){
     if(currentCard.innerHTML === previousCard.innerHTML){       //innerHTML represent the icons inside each card flippedCards[0] is the first element + this refers to the card that is clicked is the 2nd
                                                                //run  console.log("Matched!");  in console to see if cards match
            //matched
            currentCard.classList.add("match");
            previousCard.classList.add("match");

            matchedCards.push(currentCard, previousCard);

            flippedCards = [];          
            //this allows us reset our open cards array to 0 after two cards have bn pushed in so we can check if only two cards at a time match

            //check if the game is completed
            gameCompleted();     
    
    } else {                    //else if the innerHTML on the symbols of the card is different the icons do not match run
                                //you can also run console.log("Doesn't match!"); in console while building this to see if this doesn't matches when creating this step at first
                                //what to do if cards do not match is remove the open + show classes
        
            //set a time out function so js will display/show the two dif symbols to the viewer for a second
            setTimeout(function() {
                currentCard.classList.remove("open", "show", "disable");
                previousCard.classList.remove("open", "show", "disable");
            }, 500);               
       }

            flippedCards = [];          //this allows us reset our open cards array to 0 after two cards have bn pushed in so we can check if only two cards at a time match                                        
            addMove();
      }


/*
*Check if the game is completed using a function
*/

function gameCompleted(){
//if matched cards and card symbols equals the same then the game is over
    if(matchedCards.length === cardSymbols.length){     
            setTimeout(function() {
                 //call the modal congratulations popup on game end
                 openModal();

                 //reset timer
                let timer = document.querySelector(".timer");
                timer.innerHTML = "0 mins 0 secs";
                clearInterval(interval);
          }, 500);  
                    }//
}
//where do you check if the game is completed? you place the gameCompleted(); under the matched area see above where I did this


/*
* Add moves taken by a player, every two cards that are flipped accounts for one move
*/

const movesContainer = document.querySelector(".moves");

let moves = 0;
movesContainer.innerHTML = 0;

function addMove() {        //where should we call the add move function to add  move? A move is create when 2 cards are opened/flipped so we add this function in matching area see above
    moves++;
    movesContainer.innerHTML = moves;

    //set the rating
    rating();

    //start the timer on first move
    if(moves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        startTimer();
    }
}


/*
* Ratings should be measured by something, therefore I then invoke the rating function after each move as i am measuring the ratings against number of moves, so we will set rating depending on how many moves
*/

const starsContainer = document.querySelector(".stars");
starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>`;

function rating(){
        switch(moves){                                                 
            case 18:
                starsContainer.innerHTML =`<li><i class="fa fa-star"></i></li>
                                           <li><i class="fa fa-star"></i></li>`;                                   
                                            break;
            case 25:
                starsContainer.innerHTML =`<li><i class="fa fa-star"></i></li>`;
                                           break;
                }
        }


/*
* Restart button
*/

const retartSymbol = document.querySelector(".restart");

retartSymbol.addEventListener("click", function(){
    //delete all cards
    deckCards.innerHTML = "";

    //call init function to create new cards
    gameboardInit();
    //reset any related variables to empty 
    //empty te matched array on reset
    matchedCards = [];

    //reset 'moves'
    moves = 0;
    movesContainer.innerHTML = moves;

    //reset the star ratings
    starsContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>`; 
        
});

//initiate the start of the game for the first time by creating the gameboard  by invoking the below function 
gameboardInit();


// Shuffle function utilised by inserting the cardSymbols array  
function shuffle(cardSymbols) {
    let currentIndex = cardSymbols.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        //And swap it with the current element.
        temporaryValue = cardSymbols[currentIndex];
        cardSymbols[currentIndex] = cardSymbols[randomIndex];
        cardSymbols[randomIndex] = temporaryValue;
    }
    return cardSymbols;
}

   
/*
* Congratulations Modal xomd code taken here from Daniela Kuester https://github.com/DanielaKuester/Udacity-Project03-Memory-Game and w3
*/
 function openModal() {
   
    modal.style.display = "block";    
  
    // Add a final score panel with the latest data to the modal box
    let scorePanel = document.querySelector(".score-panel");
    let scorePanelCloned = scorePanel.cloneNode(true);
    let finalScore = document.querySelector(".final-score");
    let finalScorePanel = finalScore.appendChild(scorePanelCloned);

    // Adapt the final score panel
    finalScorePanel.setAttribute("id", "modal-scorepanel");
    let oldReset = finalScorePanel.lastElementChild;
    oldReset.remove();
}

let closeX = document.getElementsByClassName("closeX")[0];

// When the user clicks on <span> (x), close the modal
closeX.onclick = function() {    
    modal.style.display = "none";
};

// reload the page on click of the play again button
const playAgain = document.querySelector(".playAgain");
playAgain.addEventListener("click", function(){
                                    window.location.reload();
});

