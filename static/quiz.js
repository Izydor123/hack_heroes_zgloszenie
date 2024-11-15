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

    gameResult.innerHTML = `<strong>${result.correct}/${result.total}</strong>`;
}