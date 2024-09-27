$(document).ready(function () {
    getList();
});

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:5000/vinhos';
    try {
        let response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        if (data && data.vinhos && Array.isArray(data.vinhos.vinhos)) {
            const table = document.getElementById('recordsTable');
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = ''; // Limpar apenas o corpo da tabela

            data.vinhos.vinhos.forEach(item => {
                console.log(item.name);
                console.log(item.volatile_acidity);

                // if (item.name && item.acidez_fixa && item.acidez_volatil && item.acido_citrico && item.acucar_residual && item.cloretos && item.dioxido_livre && item.dioxido_total && item.densidade && item.ph && item.sulfatos && item.alcool) {
                if (Object.values(item).every(valor => valor !== null)) {
                    insertList(
                        item.name,
                        item.fixed_acidity,
                        item.volatile_acidity,
                        item.citric_acid,
                        item.residual_sugar,
                        item.chlorides,
                        item.free_sulfur_dioxide,
                        item.total_sulfur_dioxide,
                        item.density,
                        item.ph,
                        item.sulphates,
                        item.alcohol,
                        `⭐${"⭐".repeat(item.outcome)} (${item.outcome})`

                    );
                } else {
                    console.warn('Dados incompletos:', item);
                }
            });
        } else {
            console.warn('Nenhum dado encontrado ou formato inválido:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (name, fixed_acidity, volatile_acidity, citric_acid, residual_sugar, chlorides, free_sulfur_dioxide, total_sulfur_dioxide, density, ph, sulphates, alcohol) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('fixed_acidity', fixed_acidity);
    formData.append('volatile_acidity', volatile_acidity);
    formData.append('citric_acid', citric_acid);
    formData.append('residual_sugar', residual_sugar);
    formData.append('chlorides', chlorides);
    formData.append('free_sulfur_dioxide', free_sulfur_dioxide);
    formData.append('total_sulfur_dioxide', total_sulfur_dioxide);
    formData.append('density', density);
    formData.append('ph', ph);
    formData.append('sulphates', sulphates);
    formData.append('alcohol', alcohol);

    const url = 'http://127.0.0.1:5000/vinho';

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
};

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de exclusão para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertDeleteButton = (parent) => {
    let icon = document.createElement("i");
    icon.className = "fa fa-trash close";
    icon.onclick = async function () {
        let row = this.closest("tr");
        const nomeItem = row.getElementsByTagName('td')[0].textContent;
        const result = await Swal.fire({
            title: 'Você tem certeza?',
            text: "Este item será removido.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await deleteItem(nomeItem);
            row.remove();
            Swal.fire(
                'Removido!',
                'O item foi removido com sucesso.',
                'success'
            );
        }
    };
    parent.appendChild(icon);
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = async (item) => {
    let url = `http://127.0.0.1:5000/vinho?name=${encodeURIComponent(item)}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        await response.json();
        await getList();
    } catch (error) {
        console.error('Error:', error);
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome e características
  --------------------------------------------------------------------------------------
*/
const newItem = async () => {

    let inputName = document.getElementById("name").value;
    let inputAcidezFixa = document.getElementById("fixed_acidity").value;
    let inputAcidezVolatil = document.getElementById("volatile_acidity").value;
    let inputAcidoCitrico = document.getElementById("citric_acid").value;
    let inputAcucarResidual = document.getElementById("residual_sugar").value;
    let inputCloretos = document.getElementById("chlorides").value;
    let inputDioxidoLivre = document.getElementById("free_sulfur_dioxide").value;
    let inputDioxidoTotal = document.getElementById("total_sulfur_dioxide").value;
    let inputDensidade = document.getElementById("density").value;
    let inputPh = document.getElementById("ph").value;
    let inputSulfatos = document.getElementById("sulphates").value;
    let inputAlcool = document.getElementById("alcohol").value;

    if (inputName === '') {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'O nome do vinho não pode ser vazio!',
        });
        return;
    }

    if (isNaN(inputAcidezFixa) || isNaN(inputAcidezVolatil) || isNaN(inputAcidoCitrico) || isNaN(inputAcucarResidual) || isNaN(inputCloretos) || isNaN(inputDioxidoLivre) || isNaN(inputDioxidoTotal) || isNaN(inputDensidade) || isNaN(inputPh) || isNaN(inputSulfatos) || isNaN(inputAlcool)) {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Os campos precisam ser números!',
        });
        return;
    }

    const checkUrl = `http://127.0.0.1:5000/vinhos?nome=${encodeURIComponent(inputName)}`;
    try {
        const response = await fetch(checkUrl, { method: 'GET' });
        const data = await response.json();

        if (Array.isArray(data.vinhos) && data.vinhos.some(item => item.name === inputName)) {
            Swal.fire({
                icon: 'warning',
                title: 'Vinho já cadastrado',
                text: 'Cadastre o vinho com um nome diferente ou atualize o existente.',
            });
        } else {
            const result = await Swal.fire({
                title: 'Confirmação',
                text: "Você deseja adicionar este item?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, adicionar!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await postItem(inputName, inputAcidezFixa, inputAcidezVolatil, inputAcidoCitrico, inputAcucarResidual, inputCloretos, inputDioxidoLivre, inputDioxidoTotal, inputDensidade, inputPh, inputSulfatos, inputAlcool);
                Swal.fire(
                    'Adicionado!',
                    'O item foi adicionado com sucesso!',
                    'success'
                );

                await getList();
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Ocorreu um erro ao verificar o vinho. Por favor, tente novamente.',
        });
    }
};

/*
  --------------------------------------------------------------------------------------
  Função para inserir itens na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameVinho, acidezFixa, acidezVolatil, acidoCitrico, acucarResidual, cloretos, dioxidoLivre, dioxidoTotal, densidade, ph, sulfatos, alcool, outcome) => {
    const table = document.getElementById('recordsTable');
    const tbody = table.querySelector('tbody'); // Selecione o corpo da tabela
    const row = tbody.insertRow();
    console.log("outcome", outcome)
    const item = [
        nameVinho,
        acidezFixa,
        acidezVolatil,
        acidoCitrico,
        acucarResidual,
        cloretos,
        dioxidoLivre,
        dioxidoTotal,
        densidade,
        ph,
        sulfatos,
        alcool,
        outcome
    ];

    item.forEach((value, index) => {
        const cell = row.insertCell(index);
        cell.textContent = value;
    });

    const deleteCell = row.insertCell(item.length);
    deleteCell.className = "table-action";
    insertDeleteButton(deleteCell);

    document.getElementById("predictionForm").reset();
}

