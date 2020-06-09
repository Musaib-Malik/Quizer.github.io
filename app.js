// UI Variables
const takeQuizBtn = document.querySelector("#welcome-page-btn");
const container = document.querySelector(".welcome-container");
const spinner = document.querySelector(".spinner");

// Local Variables
let score = 0;
let questionCount = 0;

// Event Handler
takeQuizBtn.addEventListener("click", showQuestion);

// Show Question
async function showQuestion() {
  // Show Spinner
  showSpinner();

  // Make an HTTP request
  const response = await fetch("https://opentdb.com/api.php?amount=1");

  // Validation
  if (response.ok) {
    // Hide Spinner
    hideSpinner();

    // Raise Count by 1
    questionCount++;

    // Convert to JSON
    const questions = await response.json();

    // Display The Results
    questions.results.forEach((question) => {
      container.innerHTML = `
      <header id="question-header">
      <h4 id="question">${question.question}</h4>
      </header>
      <ul id="answer-list">
      </ul>
      <button id='next-page-btn'>Next</button>
    `;

      let finalArray = [];

      // Push Wrong answers to final array
      question.incorrect_answers.forEach((wrongAnswer) => {
        finalArray.push(wrongAnswer);
      });

      // Push correct answer to final array
      finalArray.push(question.correct_answer);

      // Shuffle the Array
      let shuffled = finalArray.sort(() => Math.random() - 0.5);

      document.querySelector('.welcome-container').style.height = 'auto';

      // Display the Options
      finalArray.forEach((option) => {
        document.querySelector("#answer-list").innerHTML += ` 
          <li class="option">${option}</li>
        `;
      });

      if (questionCount === 4) {
        container.innerHTML = `
          <h1 id="result-heading">
            Thanks for participating!
          </h1>

          <p id="result-para">
            You scored: <i id="total-score">
              ${score}
            </i>
          </p>

          <button id="reset-btn">
            Try Again
          </button>
        `;

        document.querySelector('.welcome-container').style.height = '65vh';

        document.querySelector("#reset-btn").addEventListener("click", () => {
          window.location.reload();
        });
      } else {
        // Add Event Listener to Answer-List
        document
          .querySelector("#answer-list")
          .addEventListener("click", checkAnswer);

        // Set Event handler to get next question
        document
          .querySelector("#next-page-btn")
          .addEventListener("click", showQuestion);
      }

      // Verify to see if it is the right answer
      function checkAnswer(e) {
        if (
          e.target.textContent === question.correct_answer &&
          e.target.classList.contains("option")
        ) {
          // Add Correct Class and Remove Event Listener
          e.target.id = "correct";

          document
            .querySelector("#answer-list")
            .removeEventListener("click", checkAnswer);

          // Show Next Button
          document.querySelector("#next-page-btn").style.display = "block";

          // Increase Score by 10
          score += 10;
        } else if (
          e.target.textContent !== question.correct_answer &&
          e.target.classList.contains("option")
        ) {
          // Show Correct Answer
          const options = document.querySelectorAll(".option");
          options.forEach((opt) => {
            if (opt.textContent === question.correct_answer) {
              opt.id = "correct";
            }
          });

          // Add Wrong Class and Remove Event Listener
          e.target.classList.add("wrong");

          document
            .querySelector("#answer-list")
            .removeEventListener("click", checkAnswer);

          // Decrease Score by 5
          score -= 5;

          // Show Next Button
          document.querySelector("#next-page-btn").style.display = "block";
        }
      }
    });
  }
}

// Show Spinner
function showSpinner() {
  container.innerHTML = `
  <div id="btn-div">
  <i
  class="fa fa-circle-o-notch fa-spin spinner"
  style="font-size: 60px; color: deeppink;"
  ></i>
  </div>
  `;
}

// Hide Spinner
function hideSpinner() {
  document.querySelector("#btn-div").remove();
}