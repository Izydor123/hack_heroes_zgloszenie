async function submitQuiz(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const response = await fetch(form.action, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    const modal = document.getElementById('result-modal');
    const modalMessage = document.getElementById('modal-message');

    modalMessage.innerHTML = `Zdobyłeś <strong>${result.correct}</strong> na <strong>${result.total}</strong> punkty`;

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('result-modal');
    modal.style.display = 'none';
}