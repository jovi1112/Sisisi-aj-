async function cloneServer() {
    const sourceServerId = document.getElementById('sourceServerId').value;
    const targetServerId = document.getElementById('targetServerId').value;
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch('/api/clone', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({sourceServerId, targetServerId})
        });

        const data = await response.json();
        resultDiv.innerHTML = `Servidor clonado: \${data.message}`;
    } catch (error) {
        resultDiv.innerHTML = `Error: \${error.message}`;
    }
}
