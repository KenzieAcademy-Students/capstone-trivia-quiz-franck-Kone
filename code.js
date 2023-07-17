// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

const body = document.body
body.textContent = '';

//Create Nodes , and variables
let score = 0
let questionsByCategoryArray = []
let displayDivInterval

const congratMessage = document.createElement('section')
const mainDiv = document.createElement('main'),
    header = `<header>
<h1 class="game-title">Trivia Quiz</h1><h2>Score:&nbsp<span class="score">0</span></h2></header>`,
    gameBox = document.createElement('div'),
    questionText = document.createElement('h1'),
    userInput = document.createElement('input'),
    submitButton = document.createElement('button'),
    gameOverDiv = document.createElement('div')


//Set nodes content
mainDiv.innerHTML = header
submitButton.textContent = 'Submit'
gameOverDiv.innerHTML = 'Game Over'


//Set classes and attributes
gameBox.className = 'gameBox'
questionText.className = 'question'
submitButton.className = 'submit'
gameOverDiv.className = 'gameOver'

userInput.setAttribute('placeholder', 'Please Enter Your Answer Here!')
userInput.setAttribute('id', 'userAnswer')
userInput.style.backgroundColor = 'lightgray'
userInput.setAttribute('autocomplete', 'off')

//Insert nodes in their parents
gameBox.append(questionText, userInput, submitButton)
mainDiv.append(gameBox)
body.append(mainDiv, gameOverDiv, congratMessage)

//Fetching data query Q and A
queryQandA()
async function queryQandA() {

    await fetch('https://jservice.kenzie.academy/api/random-clue?valid=true').then(response => response.json()).then(async (result) => {

        const categoryId = result.categoryId

        return await fetch(`https://jservice.kenzie.academy/api/clues?category=${categoryId}`).then(secondResponse => secondResponse.json()).then(secondResult => {

            const randomCategory = Math.round(Math.random() * 99)

            for (let clueIndex = 0; clueIndex < secondResult.clues.length; clueIndex++) {
                if (questionsByCategoryArray.length < 100 && clueIndex !== secondResult.clues.length - 1) {
                    questionsByCategoryArray.push(secondResult.clues[clueIndex])
                }
                if (questionsByCategoryArray.length < 100 && clueIndex === secondResult.clues.length - 1) {
                    questionsByCategoryArray.push(secondResult.clues[clueIndex])
                    queryQandA()
                }
            }

            if (questionsByCategoryArray.length === 100) {

                return updateQuestionAndScore(questionsByCategoryArray[randomCategory])
            }
        })
    })
}

//Update score if right answer and show up game over if wrong

function updateQuestionAndScore(questionAndAnswerObject) {

    const randomCategory = Math.round(Math.random() * 99)
    const question = questionAndAnswerObject.question
    const rightAnswer = questionAndAnswerObject.answer
    questionText.innerText = `${question}`

    //the right answer
    console.log(rightAnswer)

    submitButton.onclick = () => {

        if (userInput.value.toLowerCase() === rightAnswer.toLowerCase()) {
            clearInterval(displayDivInterval)

            userInput.value = ''
            score++
            congratMessage.innerHTML = `<h1>Congratulations...!</h1><p>Your score is Increasing</p><p>New Score:${score}</p>`

            updateQuestionAndScore(questionsByCategoryArray[randomCategory])

            mainDiv.style.filter = 'blur(8px)'
            document.querySelector('section').style.display = 'flex'

            displayDivInterval = setInterval(() => {
                mainDiv.style.filter = 'blur(0)'
                document.querySelector('section').style.display = 'none'

            }, 2000)

            //End game
        } else {
            endGame()
        }
        document.querySelector('.score').innerText = score
    }
}

// Game Over
function endGame() {
    score = 0

    mainDiv.style.display = 'none'
    gameOverDiv.style.display = 'flex'
    userInput.value = ''
    clearInterval(displayDivInterval)

    displayDivInterval = setInterval(() => {
        mainDiv.style.display = 'flex'
        gameOverDiv.style.display = 'none'
    }, 2000)
    queryQandA()
}