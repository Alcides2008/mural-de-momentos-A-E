// --- CONFIGURAÇÃO DA DATA ---
const dataInicio = new Date(2025, 11, 18); // Ano, Mês-1, Dia

// --- BANCO DE DADOS (IndexedDB) ---
let db;
const request = indexedDB.open("AlbumAmorDB", 1);

request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("momentos")) {
        db.createObjectStore("momentos", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = (e) => {
    db = e.target.result;
    mostrarMomentos();
};

// --- CONTADOR DE TEMPO ---
function atualizarContador() {
    const agora = new Date();
    const diff = agora - dataInicio;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / 1000 / 60) % 60);
    document.getElementById('timer').innerText = `Juntos há ${dias} dias, ${horas}h e ${minutos}m`;
}
setInterval(atualizarContador, 1000);
atualizarContador();

// --- SALVAR MOMENTO ---
document.getElementById('moment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const file = document.getElementById('image-input').files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const novoMomento = {
            titulo: document.getElementById('title').value,
            data: document.getElementById('date').value,
            descricao: document.getElementById('description').value,
            foto: event.target.result // Base64 da imagem
        };

        const transaction = db.transaction(["momentos"], "readwrite");
        const store = transaction.objectStore("momentos");
        store.add(novoMomento);

        transaction.oncomplete = () => {
            document.getElementById('moment-form').reset();
            mostrarMomentos();
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

// --- MOSTRAR MOMENTOS ---
function mostrarMomentos() {
    const container = document.getElementById('moments-container');
    container.innerHTML = "";

    const transaction = db.transaction(["momentos"], "readonly");
    const store = transaction.objectStore("momentos");
    const requestAll = store.getAll();

    requestAll.onsuccess = () => {
        const momentos = requestAll.result;
        // Ordenar por data (mais recente primeiro)
        momentos.sort((a, b) => new Date(b.data) - new Date(a.data));

        momentos.forEach(m => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${m.foto}">
                <div class="card-info">
                    <span class="card-date">${new Date(m.data).toLocaleDateString('pt-BR')}</span>
                    <h3>${m.titulo}</h3>
                    <p>${m.descricao}</p>
                    <button class="btn-delete" onclick="deletarMomento(${m.id})">Remover memória</button>
                </div>
            `;
            container.appendChild(card);
        });
    };
}

// --- DELETAR MOMENTO ---
function deletarMomento(id) {
    if (confirm("Deseja apagar essa lembrança?")) {
        const transaction = db.transaction(["momentos"], "readwrite");
        const store = transaction.objectStore("momentos");
        store.delete(id);
        transaction.oncomplete = () => mostrarMomentos();
    }
}
