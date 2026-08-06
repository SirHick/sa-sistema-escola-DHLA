const form = document.getElementById("form-materia");
const inputNome = document.getElementById("input-nome");
const inputProfessor = document.getElementById("input-professor");
const itensList = document.getElementById("lista-materias");
const valorTotal = document.getElementById("total-materias");

const addNewItem = (evento) => {
    evento.preventDefault();

    const nome = inputNome.value.trim();
    const professor = inputProfessor.value.trim();
    if (!nome || !professor) {
        return;
    }

    const li = document.createElement("li");
    li.classList.add("item-materia");
    li.innerHTML = `
        <p class="info-materia"><strong>${nome}</strong> - ${professor}</p>
        <button class="btn-remover">Excluir</button>
    `;

    itensList.appendChild(li);

    const count = Number(valorTotal.innerText) || 0;
    valorTotal.innerText = count + 1;

    inputNome.value = "";
    inputProfessor.value = "";

    const removeBtn = li.querySelector(".btn-remover");
    removeBtn.addEventListener("click", () => {
        itensList.removeChild(li);
        const currentCount = Number(valorTotal.innerText) || 0;
        valorTotal.innerText = Math.max(currentCount - 1, 0);
    });
};

async function mostrarMaterias() {
    try {
        const response = await fetch("http://localhost:3003/materias");
        if (!response.ok) {
            throw new Error(`Erro ao buscar matérias: ${response.status}`);
        }
        const materias = await response.json();

        itensList.innerHTML = "";
        materias.forEach((materia) => {
            const li = document.createElement("li");
            li.classList.add("item-materia");
            li.innerHTML = `
                <p class="info-materia"><strong>${materia.nome_materia}</strong> - ${materia.nome_professor}</p>
            `;
            itensList.appendChild(li);
        });

        valorTotal.innerText = materias.length;
    } catch (erro) {
        console.error(erro);
    }
}

form.addEventListener("submit", addNewItem);
window.addEventListener("DOMContentLoaded", mostrarMaterias);


