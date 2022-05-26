function loadData()
{    
    event.preventDefault();
   
    console.log('prendo i dati')
    fetch('../api/v1/profileM', {
        method: 'GET', //con il get mi arriva come risposta non solo lo statos ma anche i dati che chiedo
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        var titolo =  document.getElementById("title");
        var nome = document.getElementById("Nome");
        var competenza =  document.getElementById("Competenza");
        var tel = document.getElementById("Tel");
        var email = document.getElementById("Email");
        var bio = document.getElementById("dashboard");

        var n=data.med['name']+ " "+data.med["surname"];
        const arr = n.split(" ");
        
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        const nominativo = arr.join("  ");

        titolo.innerHTML = "Dottor  "+nominativo; //assegno a quell'id questo valore che ho appena recuperato dal db
        //.value è solo per gli elementi che accettano un inpu/ innerHtml è per tutto
        nome.innerHTML = nominativo; 
        competenza.innerHTML = data.spec['name'];
        tel.innerHTML = data.med['numero']; 
        email.innerHTML = data.med['email']
        bio.innerHTML = data.med['bio']
    })
};

