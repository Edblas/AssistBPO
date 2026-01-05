export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://assistbpo-backend.onrender.com' 
  : 'http://localhost:8080';

export const api = {
  async consultar(pergunta) {
    const res = await fetch(`${API_BASE_URL}/api/consulta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta })
    })
    const data = await res.json()
    let resp = data.resposta || 'Sem resposta.'

    // Formatações de resposta (HTML injection)
    resp = resp.replace(
      'Pode Aceitar: true',
      'Pode Aceitar: <span style="color:#16a34a;font-weight:600">Sim</span>'
    )

    resp = resp.replace(
      'Pode Aceitar: false',
      'Pode Aceitar: <span style="color:#dc2626;font-weight:600">Não</span>'
    )

    return resp
  }
}
