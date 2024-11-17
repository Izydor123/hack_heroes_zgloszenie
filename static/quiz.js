async function submitQuiz(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const response = await fetch(form.action, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    const gameResult = document.getElementById('gameResult');

    gameResult.innerHTML = `Wynik: ${result.correct} na ${result.total} punkty`;
    if(result.correct == 3){
        gameResult.innerHTML = gameResult.innerHTML + "<brGratulacje!"
    }
}
