const URL = "https://x8ki-letl-twmt.n7.xano.io/api:ijUECDHD/veiculo";
export const veiculoService = {
    listar: () => fetch(URL).then(r => r.json()),
    cadastrar: (d) => fetch(URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(d) }),
    atualizar: (id, d) => fetch(`${URL}/${id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(d) }),
    excluir: (id) => fetch(`${URL}/${id}`, { method: 'DELETE' })
};