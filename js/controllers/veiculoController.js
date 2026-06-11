import { veiculoService } from '../services/veiculoService.js';
import { marcaService } from '../services/marcaService.js';
import { modeloService } from '../services/modeloService.js';

const tabela = document.querySelector('#tabela'); // No HTML está id="tabela"
const form = document.querySelector('#formVeiculo');
const selMarca = document.querySelector('#selMarca');
const selModelo = document.querySelector('#selModelo');
const modalBS = new bootstrap.Modal(document.getElementById('modalVeiculo'));

async function carregarDropdowns() {
    try {
        const [marcas, modelos] = await Promise.all([
            marcaService.listar(),
            modeloService.listar()
        ]);

        // Preenche o Select de Marcas
        selMarca.innerHTML = '<option value="" disabled selected>Selecione uma Marca</option>' + 
            marcas.map(m => `<option value="${m.id}">${m.nome || m.Nome}</option>`).join('');

        // Preenche o Select de Modelos
        selModelo.innerHTML = '<option value="" disabled selected>Selecione um Modelo</option>' + 
            modelos.map(m => `<option value="${m.id}">${m.nome || m.Nome}</option>`).join('');
    } catch (erro) {
        console.error("Erro ao carregar dados dos seletores:", erro);
    }
}

async function atualizarTela() {
    tabela.innerHTML = ""; 
    const lista = await veiculoService.listar();

    lista.forEach(v => {
        const linha = document.createElement('tr');
        // Tratando possíveis variações de maiúsculas/minúsculas vindas do banco
        const descricao = v.Descricao || v.descricao || "Sem descrição";
        const ano = v.Ano || v.ano || "-";
        
        linha.innerHTML = `
            <td>${descricao}</td>
            <td>${ano}</td>
            <td>
                <button class="btn btn-danger btn-sm" data-id="${v.id}">Excluir</button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // IDs dos seletores ajustados exatamente como estão no seu HTML (descV, anoV, horiV, etc)
    const id = document.querySelector('#idV').value;
    const objetoVeiculo = {
        Descricao: document.querySelector('#descV').value,
        Ano: parseInt(document.querySelector('#anoV').value),
        Horimetro: parseInt(document.querySelector('#horiV').value),
        MarcaId: parseInt(selMarca.value),
        ModeloId: parseInt(selModelo.value)
    };

    if (id) {
        await veiculoService.atualizar(id, objetoVeiculo);
    } else {
        await veiculoService.cadastrar(objetoVeiculo);
    }

    form.reset();
    document.querySelector('#idV').value = ""; // Limpa o ID oculto
    modalBS.hide(); // Fecha o modal após salvar
    atualizarTela();
});

tabela.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-danger')) {
        const id = e.target.getAttribute('data-id');
        if (confirm("Deseja apagar este veículo?")) {
            await veiculoService.excluir(id);
            atualizarTela();
        }
    }
});

async function init() {
    await carregarDropdowns();
    await atualizarTela();
}

init();