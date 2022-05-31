function loadData(){
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let user_id = params.id;

    fetch('../api/v1/Paziente/'+user_id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        document.getElementById("Nome").innerText = data['name']+" "+data['surname'];
        document.getElementById("CF").innerText = data['CF'];
        document.getElementById("Indirizzo").innerText = data['address'];
        document.getElementById("Email").innerText = data['email'];       
    })
}