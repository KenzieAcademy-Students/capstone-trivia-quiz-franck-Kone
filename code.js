// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!
const body = document.body
body.textContent = ''

const mainDiv = document.createElement('main'), header = `<header><img src ="./image/kenzie.png" alt= logo>
<h1 class="game-title">Trivia Quiz</h1><h2>Score:&nbsp<span class="score">0</span></h2></header>`, gameBox = document.createElement('div'), questionContainer = document.createElement('h1'), userAnswer = document.createElement('input'), submitButton = document.createElement('button'), congratDiv = document.createElement('div'), continueButton = document.createElement('button')



mainDiv.innerHTML = header
submitButton.textContent = 'Submit'
continueButton.innerHTML = 'Continue'


let score = 0

//Set classes and attributes
gameBox.className = 'gameBox'
questionContainer.className = 'question'
submitButton.className = 'submit'
congratDiv.className = 'congrat'
continueButton.className = 'skip'


userAnswer.setAttribute('placeholder', 'Please Enter Your Answer Here!')
userAnswer.setAttribute('id', 'userAnswer')

//Insert nodes in the body
gameBox.append(questionContainer, userAnswer, submitButton)
mainDiv.append(gameBox)
body.append(mainDiv)



queryQandA()
async function queryQandA() {

    const data = await fetch('https://jservice.kenzie.academy/api/random-clue?valid=true')
        .then(response => {
            if (response.status !== 200) {
                console.error('No data Fetched')
            }
            const responseIntoJson = response.json()
            // console.log(responseIntoJson) 
            return responseIntoJson
        }).then(result => updateQuestionAndScore(result))
    return data
}


// gameDisplaying()

// async function gameDisplaying() {

//     const gameBox = document.createElement('div')
//     gameBox.className = 'gameBox'

//     const questionContainer = document.createElement('h1')
//     questionContainer.className = 'question'

//     const userAnswer = document.createElement('input')
//     userAnswer.setAttribute('placeholder', 'Please Enter Your Answer Here!')
//     userAnswer.setAttribute('id', 'userAnswer')

//     const submitButton = document.createElement('button')
//     submitButton.className = 'submit'
//     submitButton.textContent = 'Submit'

//     gameBox.append(questionContainer, userAnswer, submitButton)

//     mainDiv.append(gameBox)
// }


function updateQuestionAndScore(res) {
    const question = res.question
    const rightAnswer = res.answer
    console.log(rightAnswer)
    document.querySelector('.question').innerText = question

    document.querySelector('.submit').onclick = () => {

        if (document.getElementById('userAnswer').value.toLowerCase() === rightAnswer.toLowerCase()) {
            score++
            document.querySelector('.score').innerText = score
            document.getElementById('userAnswer').value = ''
            mainDiv.style.filter = 'blur(8px)'
            // mainDiv.style.filter = 'brightness(0.5)'
            congratDiv.style.animation = "celebration 3.5s linear "

            congratulation()
        }
    }
}

let timeOut
function congratulation() {
    congratDiv.style.display = 'flex'


    const congratMessage = `<h1>Bravooo...!</h1>\n<p>🥳Your score is Increasing🥳</p>\n<p>New Score:<span>${score}</span></p>`
    congratDiv.innerHTML = congratMessage

    // continueButton functionality
    continueButton.addEventListener('click', () => {
      

        congratDiv.style.animation = "resumeCongratulation 1s linear"
        mainDiv.style.filter = 'blur(0)'
        timeOut = setTimeout(() => {
            congratDiv.style.display = 'none'

        }, 1000)

        queryQandA()
    })

    congratDiv.append(continueButton)
    body.append(congratDiv)
}