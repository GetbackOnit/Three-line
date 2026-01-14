const wordInput = document.getElementById('wordInput');
const generateBtn = document.getElementById('generateBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');

generateBtn.addEventListener('click', generateThreeLine);
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateThreeLine();
    }
});

async function generateThreeLine() {
    const word = wordInput.value.trim();

    if (!word) {
        showError('단어를 입력해주세요.');
        return;
    }

    if (word.length !== 3) {
        showError('정확히 3글자를 입력해주세요.');
        return;
    }

    hideAll();
    loadingSpinner.classList.remove('hidden');
    generateBtn.disabled = true;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '삼행시 생성에 실패했습니다.');
        }

        showResult(data.result);
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || '삼행시 생성 중 오류가 발생했습니다.');
    } finally {
        loadingSpinner.classList.add('hidden');
        generateBtn.disabled = false;
    }
}

function hideAll() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

function showResult(text) {
    hideAll();
    resultText.textContent = text;
    resultSection.classList.remove('hidden');
}

function showError(message) {
    hideAll();
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
}
