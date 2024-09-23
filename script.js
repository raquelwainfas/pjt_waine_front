document.addEventListener('DOMContentLoaded', function() {
    const toggleFormButton = document.getElementById('toggle-form');
    const toggleTableButton = document.getElementById('toggle-table');
    const showTable = document.getElementById('show-table');
    const inserirVinhoModal = new bootstrap.Modal(document.getElementById('inserirVinhoModal'));

    toggleFormButton.addEventListener('click', function() {
        inserirVinhoModal.show();
    });

    const createForm = document.getElementById('create-form');
    createForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        await createVinho();
        inserirVinhoModal.hide(); // Fecha o modal após enviar o formulário
        location.reload();
    });

    toggleTableButton.addEventListener('click', function() {
        showTable.style.display = (showTable.style.display === 'none' || showTable.style.display === '') ? 'block' : 'none';
        fetchVinhos();
    });

    async function fetchVinhos() {
        try {
            const response = await fetch('http://localhost:5000/vinhos');
            if (!response.ok) {
                throw new Error('Erro ao buscar lista de vinhos qualficados');
            }
            const vinhos = await response.json();
            const tableBody = document.querySelector('#vinhos-table tbody');
            tableBody.innerHTML = '';
            vinhos.forEach(vinho => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td class="align-middle"><img src="${vinho.image_url}" alt="Wine Image" class="img-fluid"></td>
                    <td class="align-middle">${vinho.id}</td>
                    <td class="align-middle">${vinho.name}</td>
                    <td class="align-middle">${vinho.fixed_acidity}</td>
                    <td class="align-middle">${vinho.volatile_acidity}</td>
                    <td class="align-middle">${vinho.citric_acid}</td>
                    <td class="align-middle">${vinho.residual_sugar}</td>
                    <td class="align-middle">${vinho.chlorides}</td>
                    <td class="align-middle">${vinho.free_sulfur_dioxide}</td>
                    <td class="align-middle">${vinho.total_sulfur_dioxide}</td>
                    <td class="align-middle">${vinho.density}</td>
                    <td class="align-middle">${vinho.pH}</td>
                    <td class="align-middle">${vinho.sulphates}</td>
                    <td class="align-middle">${vinho.alcohol}</td>
                    <td class="align-middle">${vinho.quality}</td>
                    <td class="align-middle">
                        <button class="btn btn-danger" onclick="deleteItem(${vinho.id})">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error(error);
            alert('Erro ao listar vinhos');
        }
    }

    async function createVinho() {
        try {

            const name = document.getElementById('create-name').value;
            const acidez_fixa = document.getElementById("create-acidez-fixa").value;
            const acidez_volatil = document.getElementById("create-acidez-volatil").value;
            const acido_citrico = document.getElementById("create-acido-citrico").value;
            const acucar_residual = document.getElementById("create-acucar-residual").value;
            const cloretos = document.getElementById("create-cloretos").value;
            const dioxido_livre = document.getElementById("create-dioxido-livre").value;
            const dioxido_total = document.getElementById("create-dioxido-total").value;
            const densidade = document.getElementById("create-densidade").value;
            const ph = document.getElementById("create-ph").value;
            const sulfatos = document.getElementById("create-sulfatos").value;
            const alcool = document.getElementById("create-alcool").value


            const response = await fetch('http://localhost:5000/vinho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, acidez_fixa, acidez_volatil, acido_citrico, acucar_residual, cloretos, dioxido_livre, dioxido_total, densidade, ph, sulfatos, alcool })
            });

            if (!response.ok) {
                throw new Error('Erro ao qualificar vinho');
            }

            alert('Vinho cadastrado e qualificado com sucesso!');
            fetchVinhos();
            createForm.reset();
        } catch (error) {
            console.error(error);
            alert('Erro ao qualificar/cadastrar vinho');
        }
    }

    window.deleteItem = async function(id) {
        try {
            const response = await fetch(`http://localhost:5000/vinho/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Erro ao deletar vinho');
            }
            alert('Vinho deletado com sucesso!');
            fetchVinhos();
        } catch (error) {
            console.error(error);
            alert('Erro ao deletar vinho');
        }
    }

    fetchVinhos();
});
