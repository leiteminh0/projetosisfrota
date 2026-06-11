import { marcaService } from '../services/marcaService.js';

const tabela = document.querySelector('#tabelaCorpo');
const form = document.querySelector('#formMarca');
const modalBS = new bootstrap.Modal(document.getElementById('modalMarca'));

async function render() {
    const dados = await marcaService.listar();
    tabela.innerHTML = dados.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.nome}</td>
            <td>
                <button class="btn btn-sm btn-info text-white" onclick="prepararEdicao(${m.id}, '${m.Nome}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deletar(${m.id})">Excluir</button>
            </td>
        </tr>`).join('');
}

window.prepararEdicao = (id, nome) => {
    document.querySelector('#idField').value = id;
    document.querySelector('#nomeField').value = nome;
    document.querySelector('#modalTitulo').innerText = "Editar Marca";
    modalBS.show();
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.querySelector('#idField').value;
    const dados = { nome: document.querySelector('#nomeField').value };

    id ? await marcaService.atualizar(id, dados) : await marcaService.cadastrar(dados);
    modalBS.hide(); 
    render();
});

window.deletar = async (id) => { if(confirm("Deseja excluir?")) { await marcaService.excluir(id); render(); }};
render();