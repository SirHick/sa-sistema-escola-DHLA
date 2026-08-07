const form = document.getElementById("form-materia");
const inputNome = document.getElementById("input-nome");
const inputProfessor = document.getElementById("input-professor");
const itensList = document.getElementById("lista-materias");
const valorTotal = document.getElementById("total-materias");
const formBuscar = document.getElementById("form-buscar");
const inputBuscarId = document.getElementById("input-buscar-id");
const formAtualizar = document.getElementById("form-atualizar");
const inputAtualizarId = document.getElementById("input-atualizar-id");
const inputNomeAtualizar = document.getElementById("input-nome-atualizar");
const inputProfessorAtualizar = document.getElementById("input-professor-atualizar");
const formExcluir = document.getElementById("form-excluir");
const inputExcluirId = document.getElementById("input-excluir-id");
const mensagemOperacao = document.getElementById("mensagem-operacao");
const API_URL = "http://localhost:3003";

const exibirMensagem = (texto, tipo = "info") => {
    mensagemOperacao.textContent = texto;
    mensagemOperacao.className = `mensagem-operacao ${tipo}`;
};

const addNewItem = async (evento) => {
    evento.preventDefault();

    const nome = inputNome.value.trim();
    const idProfessor = Number(inputProfessor.value);

    if (!nome || !Number.isInteger(idProfessor) || idProfessor <= 0) {
        exibirMensagem("Informe um nome e um ID de professor válidos.", "erro");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/materias`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, id_professor: idProfessor }),
        });

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.erro || dados.mensagem || "Não foi possível cadastrar a matéria.");
        }

        exibirMensagem(`Matéria "${nome}" cadastrada com sucesso.`, "sucesso");
        inputNome.value = "";
        inputProfessor.value = "";
        await mostrarMaterias();
    } catch (erro) {
        console.error(erro);
        exibirMensagem(erro.message, "erro");
    }
};

async function mostrarMaterias() {
    try {
        const response = await fetch(`${API_URL}/materias`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar matérias: ${response.status}`);
        }
        const materias = await response.json();

        itensList.innerHTML = "";
        materias.forEach((materia) => {
            const li = document.createElement("li");
            li.classList.add("item-materia");
            li.innerHTML = `
                <p class="info-materia">
                    <strong>${materia.nome_materia}</strong>
                    <span>• ID ${materia.id_materia}</span>
                    <span>• Professor ${materia.nome_professor}</span>
                </p>
            `;
            itensList.appendChild(li);
        });

        valorTotal.innerText = materias.length;
    } catch (erro) {
        console.error(erro);
        exibirMensagem("Não foi possível carregar as matérias.", "erro");
    }
}

const buscarMateriaPorId = async (evento) => {
    evento.preventDefault();

    const id = inputBuscarId.value.trim();
    if (!id) {
        exibirMensagem("Informe o ID da matéria para buscar.", "erro");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/materias/${id}`);
        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.mensagem || "Matéria não encontrada.");
        }

        inputAtualizarId.value = dados.id_materia;
        inputNomeAtualizar.value = dados.nome_materia;
        inputProfessorAtualizar.value = dados.id_professor_materias;
        exibirMensagem(`Matéria "${dados.nome_materia}" carregada para edição.`, "info");
    } catch (erro) {
        console.error(erro);
        exibirMensagem(erro.message, "erro");
    }
};

const atualizarMateria = async (evento) => {
    evento.preventDefault();

    const id = inputAtualizarId.value.trim();
    const nome = inputNomeAtualizar.value.trim();
    const idProfessor = Number(inputProfessorAtualizar.value);

    if (!id || !nome || !Number.isInteger(idProfessor) || idProfessor <= 0) {
        exibirMensagem("Preencha o ID, o novo nome e o ID do professor para atualizar.", "erro");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/materias/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, id_professor: idProfessor }),
        });

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.erro || dados.mensagem || "Não foi possível atualizar a matéria.");
        }

        exibirMensagem(`Matéria atualizada com sucesso.`, "sucesso");
        inputAtualizarId.value = "";
        inputNomeAtualizar.value = "";
        inputProfessorAtualizar.value = "";
        await mostrarMaterias();
    } catch (erro) {
        console.error(erro);
        exibirMensagem(erro.message, "erro");
    }
};

const excluirMateria = async (evento) => {
    evento.preventDefault();

    /*
    <div class = "confirm-message"> 
        <p>Você tem certeza que deseja excluir esta matéria?</p>
        
        <div id = "div-buttons">
            <button id = "yes-button">Sim</button>
            <button id = "no-button">Não</button>
        </div>
    </div>

    <div id = "black-div"></div> */

    let newButtonsDiv = document.createElement("div");

    newButtonsDiv.classList.add("confirm-message");

    newButtonsDiv.innerHTML = `
    
        <p>Você tem certeza que deseja excluir esta matéria?</p>
        
        <div id = "div-buttons">
            <button id = "yes-button">Sim</button>
            <button id = "no-button">Não</button>
        </div>`

    let newBlackDiv = document.createElement("div");

    newBlackDiv.classList.add("black-div");


    const id = inputExcluirId.value.trim();
    if (!id) {
        exibirMensagem("Informe o ID da matéria para excluir.", "erro");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/materias/${id}`, {
            method: "DELETE",
        });

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.erro || dados.mensagem || "Não foi possível excluir a matéria.");
        }

        exibirMensagem(dados.mensagem || "Matéria excluída com sucesso.", "sucesso");
        inputExcluirId.value = "";
        await mostrarMaterias();
    } catch (erro) {
        console.error(erro);
        exibirMensagem(erro.message, "erro");
    }
};

form.addEventListener("submit", addNewItem);
formBuscar.addEventListener("submit", buscarMateriaPorId);
formAtualizar.addEventListener("submit", atualizarMateria);
formExcluir.addEventListener("submit", excluirMateria);
window.addEventListener("DOMContentLoaded", mostrarMaterias);


