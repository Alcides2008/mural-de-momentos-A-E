// 1. Configuração da Data (Ano, Mês-1, Dia)
const startDate = new Date(2025, 11, 18); 

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    document.getElementById('timer').innerHTML = `${days} dias, ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// 2. Lógica de Upload e Armazenamento
const momentForm = document.getElementById('moment-form');
const momentsContainer = document.getElementById('moments-container');
let moments = JSON.parse(localStorage.getItem('nosso_mural')) || [];

function displayMoments() {
    momentsContainer.innerHTML = '';
    moments.sort((a, b) => new Date(b.date) - new Date(a.date));

    moments.forEach((m, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${m.image}" alt="Momento">
            <div class="card-content">
                <p class="card-date">${new Date(m.date).toLocaleDateString('pt-BR')}</p>
                <h3>${m.title}</h3>
                <p>${m.description}</p>
                <button onclick="deleteMoment(${index})" style="background:none; color:red; padding:0; margin-top:10px; font-size:0.8rem; width:auto; cursor:pointer;">Apagar</button>
            </div>
        `;
        momentsContainer.appendChild(card);
    });
}

momentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const base64Image = event.target.result;
            
            const newMoment = {
                title: document.getElementById('title').value,
                date: document.getElementById('date').value,
                description: document.getElementById('description').value,
                image: base64Image
            };

            moments.push(newMoment);
            localStorage.setItem('nosso_mural', JSON.stringify(moments));
            displayMoments();
            momentForm.reset();
        };

        reader.readAsDataURL(file); // Converte imagem para texto
    } else {
        alert("Por favor, selecione uma foto!");
    }
});

function deleteMoment(index) {
    if(confirm("Deseja apagar essa memória?")) {
        moments.splice(index, 1);
        localStorage.setItem('nosso_mural', JSON.stringify(moments));
        displayMoments();
    }
}

displayMoments();