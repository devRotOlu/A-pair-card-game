
// set timer variables

var secondsOfTimer,minutesOfTimer;

secondsOfTimer=0;

minutesOfTimer=120;


var gameController=(function(){

    let gameInfoStorage={

        setGameInfo: Info=>{
            localStorage.setItem('gameInfo', JSON.stringify(Info))
        },

        getGameInfo: ()=>{
            return JSON.parse(localStorage.getItem('gameInfo'))
        },
        removeGameInfo: ()=>{ 

            localStorage.removeItem("gameInfo");

        }
    }

    return {

        level:1,

        noOfCards:4,

        getGameInfoStorage: gameInfoStorage,

        progressCount:1,

        cardIndexGen:(cardsLength)=>{

            var indexArray,index;

            indexArray=[];

            function indexGen() {

                if (indexArray.length<(cardsLength/2)) {

                    index= Math.floor(Math.random()*(cardsLength/2));
                    
                } else {

                    function genIndex() {

                        index= Math.floor(Math.random()*cardsLength);
                        
                    }

                    do {

                        genIndex();
                        
                    } while (index<(cardsLength/2));                 
                    
                };


                if (indexArray.length>0) {

                    let checkForIndex= indexArray.every((x,i,arr)=>{

                         return index!==arr[i] 

                    })
                    
                    if (checkForIndex) {

                        indexArray.push(index);
                        
                    }
                }else{

                    indexArray.push(index);

                }
                
            };

            while (indexArray.length<cardsLength) {

               indexGen();     
            };

            return indexArray;
    
        },

        setGameInfoOnStorage: function(){

            if (this.progressCount<4) {

                this.level++; this.noOfCards +=2;

                gameInfoStorage.setGameInfo({level:this.level,noOfCards:this.noOfCards});

                this.progressCount++
           
            } else {

                this.level=1; this.noOfCards=4

                this.progressCount=1
                
            }

        },
    }

})();


var UIcontroller=(function(){


    var domItems={

        cardContainer:document.getElementById('cardContainer'),

        allCards: document.getElementsByClassName('cards'),

        timer: document.getElementById('timer'),

        levelIndicator: document.getElementById("levelIndicator"),

        scoreCounter: document.getElementById('scoresCounter'),
    }

    return {

        getDomItems:domItems,

        myInterval:"",

        timeLog: [secondsOfTimer, minutesOfTimer],

        indexArr:[],

        progressCount:1,

        checkCardSelected: [],

        cardContentArray: ["A","B","C","D","E"].sort(()=>0.5-Math.random()),

        eventsOnCards: function(){

            let count=0;

            Array.from(domItems.allCards).forEach((card,index)=>{

                card.addEventListener('click',e=>{
        
                    count++;
        
                    let checkId= e.target.classList[1] || e.target.id;
        
                    if (checkId ===`card-${index}`) {

        
                        this.getSelectedCard(card,index,count,domItems.allCards)
                                        
                    }
                })
        
            });
           
        },
    

        createCardsDynamically: function (cardPack, gameInfo){

            var card;

            card="";

           if (gameController.level<2) {

                for (let index = 0; index < 4; index++) {
                    
                    card += '<div class="cards card-'+ index +' "> <p id="card-'+ index +'"></p></div>'
                    
                }

                domItems.levelIndicator.innerHTML=`Level 1`;

                domItems.cardContainer.style.gridTemplateColumns=`repeat(2, 60px)`;

                domItems.scoreCounter.innerHTML= '1 of 4'

                
           } else {

                for (let index = 0; index < gameInfo.getGameInfo().noOfCards; index++) {
                    
                    card += '<div class="cards card-'+ index +' "> <p id="card-'+ index +'"></p></div>'
                    
                }
                
                domItems.scoreCounter.innerHTML= `${gameInfo.getGameInfo().level} 0f 4`

                domItems.levelIndicator.innerHTML=`Level ${gameInfo.getGameInfo().level}`;

                // // if (window.matchMedia("(max-width:700px)")) {

                // //     domItems.cardContainer.style.gridTemplateColumns=`repeat(2, 60px)`;
                    
                // }     
            domItems.cardContainer.style.gridTemplateColumns=`repeat(${gameInfo.getGameInfo().noOfCards/2}, 60px)`;
                    
              
           }

           cardPack.innerHTML= card;

           this.eventsOnCards();
        
        },

        changeCardOrder:(indexArr)=>{

            Array.from(domItems.allCards).forEach((card,index)=>{

                card.style.order=indexArr[index]
                    
            })

        },

        confirmContinue: function(){

            this.progressCount++

            let playNext=confirm("Do you want to continue to next level")

            if (playNext) {

                clearInterval(this.myInterval);

                minutesOfTimer=this.timeLog[1]; secondsOfTimer=this.timeLog[0];

                this.indexArr=[];

                this.checkCardSelected= [];

                gameController.setGameInfoOnStorage();

                this.timeCheck();
                
                this.callTimer();

                domItems.cardContainer.innerHTML="";

                this.createCardsDynamically(domItems.cardContainer,gameController.getGameInfoStorage);
                
                this.changeCardOrder(gameController.cardIndexGen(domItems.allCards.length));

            }     
        },

        getSelectedCard: function (pickedCard,cardIndex,count,cards){

            if (count<=2) {

                if (cardIndex+ 1>cards.length/2) {

                    this.indexArr.push(cardIndex);

                    cardIndex= cardIndex-cards.length/2;

                    pickedCard.classList.toggle("slide");
    
                    pickedCard.firstElementChild.innerHTML= this.cardContentArray[cardIndex];

                    this.checkCardSelected.push( pickedCard.firstElementChild.innerHTML);

                    pickedCard.style.pointerEvents="none";

                    pickedCard.firstElementChild.style.opacity="1"
                
                }else{

                    this.indexArr.push(cardIndex);

                    pickedCard.classList.toggle("slide");

                    pickedCard.firstElementChild.innerHTML= this.cardContentArray[cardIndex];

                    this.checkCardSelected.push(pickedCard.firstElementChild.innerHTML);

                    pickedCard.style.pointerEvents="none";

                    pickedCard.firstElementChild.style.opacity="1";              

                };

                if (count==2) {


                    if (this.checkCardSelected[0]===this.checkCardSelected[1]) {

                        for (let index = 0; index < this.indexArr.length; index++) {
                            
                            cards[this.indexArr[index]].style.backgroundColor="green"
                            
                        }

                          setTimeout(() => {

                            this.confirmContinue();
                              
                          }, 3000);
                    }
                    else{


                        for (let index = 0; index < this.indexArr.length; index++) {
                            
                            cards[this.indexArr[index]].style.backgroundColor="red"
                            
                        }

                    };

                    Array.from(cards).forEach((card,index)=>{


                        if (index != this.indexArr[0] && index != this.indexArr[1]) {

                            if (index+1>cards.length/2) {

                                index= index-cards.length/2;

                                card.classList.toggle("newSlide");

                                card.firstElementChild.innerHTML= this.cardContentArray[index];

                                card.firstElementChild.style.opacity="1";
                                
                            } else{

                                card.classList.toggle("newSlide");

                                card.firstElementChild.innerHTML= this.cardContentArray[index];

                                card.firstElementChild.style.opacity="1";
                                
                            }                                               
                        }
                    
                    });

                    if (this.checkCardSelected[0]!==this.checkCardSelected[1]) {

                        setTimeout(() => {

                            clearInterval( this.myInterval);

                            UIcontroller.confirmReplay(domItems.cardContainer);
                           
                        }, 3000);
                        
                    };  

                };   
                
            }

        },

        timeCheck: function () {


            if (minutesOfTimer !== null  || (minutesOfTimer !=0 && secondsOfTimer !=0)) {

     
                    if (secondsOfTimer == -1) {
                
                        secondsOfTimer= 59
                        
                    }
                
                    if(secondsOfTimer == 59){

                        if (minutesOfTimer !=0) {

                            minutesOfTimer --
                            
                        }else{

                            secondsOfTimer=0
                        }
                
                    }

                    
                minutesOfTimer=String(minutesOfTimer);

                secondsOfTimer=String(secondsOfTimer);

                if (minutesOfTimer.length<2 && secondsOfTimer.length >1 ) {

                    domItems.timer.innerHTML=`0${minutesOfTimer}:${secondsOfTimer}`;
                    
                }else if (minutesOfTimer.length>1 && secondsOfTimer.length <2) {

                    domItems.timer.innerHTML=`${minutesOfTimer}:0${secondsOfTimer}`;

                }else if(minutesOfTimer.length<2 && secondsOfTimer.length <2) {

                domItems.timer.innerHTML=`0${minutesOfTimer}:0${secondsOfTimer}`;
                }
                else{

                    domItems.timer.innerHTML=`${minutesOfTimer}:${secondsOfTimer}`;

                }

                secondsOfTimer--

                if (domItems.timer.innerHTML== `00:00`) {

                    Array.from(domItems.allCards).forEach(card=>card.style.pointerEvents="none");

                    if (UIcontroller.checkCardSelected.length<2 || UIcontroller.checkCardSelected[1]!== UIcontroller.checkCardSelected[0]) {


                            clearInterval( UIcontroller.myInterval);
                        
                            setTimeout(() => {

                                UIcontroller.confirmReplay(domItems.cardContainer);
                                
                            },  3000);   
                        
                    } 
                }        
                                              
            }
        },

        callTimer: function(){

            this.myInterval=setInterval(() => {

                if (domItems.timer.innerHTML== `00:00`) {
        
                    setTimeout(() => {
        
                        this.confirmReplay(domItems.cardContainer);
                        
                    },  1000);
        
                    clearInterval(this.myInterval);
        
                    this.myInterval="";
                    
                }
        
                this.timeCheck();
        
            }, 1000);
            
        },

        confirmReplay: function (cardPack){

            let checkReplay;

                checkReplay=confirm('Do you want to try again?');

                if (checkReplay) { 

                    this.checkCardSelected=[];

                    this.indexArr=[],

                    minutesOfTimer=this.timeLog[1]; secondsOfTimer=this.timeLog[0];

                    cardPack.innerHTML="";

                    setTimeout(() => {

                        this.createCardsDynamically(domItems.cardContainer, gameController.getGameInfoStorage);

                        this.changeCardOrder(gameController.cardIndexGen(domItems.allCards.length));
                        
                        domItems.timer.innerHTML="00:00";

                        this.timeCheck();

                        this.callTimer(); 
                        
                    }, 1000);
                        
                }
                
        },

    }
    
})();

var controller=(function(UIctr,gameCtr){

    var selectDomItems;
    
    selectDomItems= UIctr.getDomItems;

    UIctr.createCardsDynamically(selectDomItems.cardContainer, gameCtr.getGameInfoStorage);

    UIctr.changeCardOrder(gameCtr.cardIndexGen(selectDomItems.allCards.length));

    UIctr.timeCheck();

    UIctr.callTimer();

})(UIcontroller,gameController);


