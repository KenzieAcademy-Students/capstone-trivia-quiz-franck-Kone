// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!
const body = document.body
body.textContent = ''

//Create Nodes , variables and start game 
let score = 0
let index = 0
let instructionsInterval

const mainDiv = document.createElement('main'), 
header = `<header><img src ="./image/kenzie.png" alt= logo>
<h1 class="game-title">Trivia Quiz</h1><h2>Score:&nbsp<span class="score">0</span></h2></header>`, 
gameBox = document.createElement('div'),
questionText = document.createElement('h1'),
userAnswer = document.createElement('input'),
submitButton = document.createElement('button'),
congratDiv = document.createElement('div'),
continueButton = document.createElement('button'),
gameOverDiv = document.createElement('div'),
resetButton = document.createElement('button'),
gameOverElement = document.createElement('h1'),
instructionDiv = document.createElement('div'),
startGameButton = document.createElement('button')

const instructions = "You will be shown questions that You can respond to and receive points for answering correctly.If you answer incorrectly, the score and game reset."

//Set nodes content
mainDiv.innerHTML = header
submitButton.textContent = 'Submit'
continueButton.innerHTML = 'Continue'
gameOverElement.innerHTML += 'Game <span>😭</span>ver'
resetButton.innerHTML = 'Restart'
startGameButton.textContent = 'Start'

//Set classes and attributes
gameBox.className = 'gameBox'
questionText.className = 'question'
submitButton.className = 'submit'
congratDiv.className = 'congrat'
continueButton.className = 'skip'
gameOverDiv.className = 'gameOver'
resetButton.className = 'restart'
instructionDiv.className = 'instruction-container'
startGameButton.className = 'start-button'

userAnswer.setAttribute('placeholder', 'Please Enter Your Answer Here!')
userAnswer.setAttribute('id', 'userAnswer')
userAnswer.autofocus
userAnswer.setAttribute('autocomplete', 'off')

//Insert nodes in their parents
gameBox.append(questionText, userAnswer, submitButton)
mainDiv.append(gameBox)
body.append(mainDiv, gameOverDiv)
gameOverDiv.append(gameOverElement, resetButton)

//Fetching data query Q and A
queryQandA()
async function queryQandA() {

    const data = await fetch('https://jservice.kenzie.academy/api/random-clue?valid=true')
        .then(response => {
            if (response.status !== 200) {
                console.error('No data Fetched')
            }
            const responseIntoJson = response.json()
            return responseIntoJson
        }).then(result => updateQuestionAndScore(result))
    return data
}

// Instruction and start game 

gameInstruction()
function gameInstruction () {
    clearInterval(instructionsInterval)
    let instructionBody = `<h1>Hey! Do You Want to Check For Your IQ?</h1><h2>Instructions</h2><p>`
    const instructions = "You will be shown questions that You can respond to and receive points for answering correctly.If you answer incorrectly, the score and game reset."

    if(index < instructions.length) {
        instructionBody += instructions.slice(0, index +1)
        instructionBody += '</p>'

        instructionDiv.innerHTML = instructionBody
        mainDiv.append(instructionDiv)

        instructionsInterval = setInterval(() => {
            index++
            gameInstruction()
        }, 100)
    }
    if (index === instructions.length){
        instructionDiv.append(startGameButton)
    }
}

startGameButton.addEventListener('click', () => {
    instructionDiv.style.display = 'none'
    gameBox.style.display = 'flex'
})

//Update score
function updateQuestionAndScore(questionAndAnswerObject) {
    const question = questionAndAnswerObject.question
    const rightAnswer = questionAndAnswerObject.answer
    console.log(rightAnswer)
    questionText.innerText = question

    submitButton.onclick = () => {

        if (userAnswer.value.toLowerCase() === rightAnswer.toLowerCase()) {
            score++
            document.querySelector('.score').innerText = score
            userAnswer.value = ''
            mainDiv.style.filter = 'blur(8px)'
            congratDiv.style.animation = "celebration 4s linear "
            gameBox.style.display ='none'

            congratulation()
        } else {
            score = 0
            mainDiv.style.display = 'none'
            body.style.background = 'radial-gradient(closest-side, black, darkred, black)'
            gameOverDiv.style.display = 'flex'
            gameOverDiv.style.animation = "setGameOverAnime 1.5s ease-out"
            userAnswer.value = ''
        }
    }
}

//Celebration right answers
let timeOut
function congratulation() {

    congratDiv.style.display = 'flex'
    const congratMessage = `<h1>Bravooo...!</h1>\n<p>🥳Your score is Increasing🥳</p>\n<p>New Score:<span>${score}</span></p>`
    congratDiv.innerHTML = congratMessage

    // continueButton functionality
    continueButton.addEventListener('click', () => {

        congratDiv.style.animation = "resumeCongratulation 2s linear"
        gameBox.style.display = 'flex'

        mainDiv.style.filter = 'blur(0)'
        
        timeOut = setTimeout(() => {
            congratDiv.style.display = 'none'

        }, 1000)

        queryQandA()
    })

    congratDiv.append(continueButton)
    body.append(congratDiv)
}

//End Game

resetButton.addEventListener('click', () => {
    gameOverDiv.style.animation = 'resumeGameOverAnime 2s ease-out'

    // clearTimeout(timeOut)
    if (gameOverDiv.style.display === 'flex') {

        timeOut = setTimeout(() => {
            gameOverDiv.style.display = 'none'
            mainDiv.style.animation = 'gameResetAnime 750ms linear'
            mainDiv.style.display = 'flex'

        }, 1000)
    }
    score = 0
    document.querySelector('.score').innerText = score

    queryQandA()
})