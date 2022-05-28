function loadHP(type)
{
        fetch(type=='P'?'../api/v1/Paziente':type=='M'?'../api/v1/Medico':type=='AO'?'../api/v1/Admin':'', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then((resp) => resp.json())
        .then(function(data) {
            let title = document.getElementById("title");
            title.innerText = title.innerText.replace("[Nome]", capitalizeFirstLetter(data.name));
            title.innerText = title.innerText.replace("[Cognome]", capitalizeFirstLetter(data.surname));
            let nome=document.getElementById("nome");
            nome.innerText = nome.innerText.replace("[Nome]", capitalizeFirstLetter(data.name));
            let cognome=document.getElementById("cognome");
            cognome.innerText = cognome.innerText.replace("[Cognome]", capitalizeFirstLetter(data.surname));
        });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }