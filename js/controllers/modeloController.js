import { modeloService } from '../services/modeloService.js';

const tabela = document.querySelector('#tabelaCorpo');
const form = document.querySelector('#formModelo');
const modalBS = new bootstrap.Modal(document.getElementById('modalModelo'));

async function render() {
    const dados = await modeloService.listar();
    tabela.innerHTML = dados.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.nome}</td>
            <td>
                <button class="btn btn-sm btn-info text-white" onclick="prepararEdicao(${m.id}, '${m.nome}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deletar(${m.id})">Excluir</button>
            </td>
        </tr>`).join('');
}

window.prepararEdicao = (id, nome) => {
    document.querySelector('#idField').value = id;
    document.querySelector('#nomeField').value = nome;
    document.querySelector('#modalTitulo').innerText = "Editar Modelo";
    modalBS.show();
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.querySelector('#idField').value;
    const dados = { nome: document.querySelector('#nomeField').value };

    id ? await modeloService.atualizar(id, dados) : await modeloService.cadastrar(dados);
    modalBS.hide(); 
    render();
});

window.deletar = async (id) => { if(confirm("Deseja excluir?")) { await modeloService.excluir(id); render(); }};
render();