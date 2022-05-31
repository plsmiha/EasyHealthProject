const d = new Date();
var visita="";
var prevSelect="";
const primo = document.createElement('option');


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
        

        for (var i = 0; i < (data.slotsDate).length; i++) {
            const giorgio = new Date(data.slotsDate[i]);
            if((giorgio-d)>0){
                //date1 - date2;
                const el = document.createElement('div')
                el.classList.add('item');
                //riordina formato data
                scritta=data.slotsDate[i].toString();
                let a = scritta.split("-");
                console.log('qui');
                el.innerHTML ="<pre>"+a[2]+"/"+a[1]+"</pre>";
                const s = document.createElement('select');
               
                //s.classList.add('ora');
                el.appendChild(s);
                const primo = document.createElement('option');
                primo.classList.add('ora');
                primo.innerHTML = "scegli orario";
                primo.value
                s.appendChild(primo);
                s.onchange= function(){
                    console.log('s'+s.id);
                    visita=s.value;
                    prevSelect.selectedIndex = 0;
                    console.log(visita);
                    prevSelect=s;
                    console.log('prevSelect'+s);
                }
                for(var j=0; j<data.jsonArr[i].length; j++){
                        //console.log(data.jsonArr[i][j].from+" - "+data.jsonArr[i][j].to);
                        var opt = document.createElement('option');
                        opt.classList.add('ora');
                        opt.innerHTML = data.jsonArr[i][j].from+" - "+data.jsonArr[i][j].to;
                        opt.value = data.jsonArr[i][j]._id;
                        console.log(opt.value);
                        //opt.style.backgroundColor=
                        s.appendChild(opt);
                }
                const box = document.getElementById('container');
                box.appendChild(el);
            }
        }
    })
};


function prenota(){
    console.log("prenotero lo slot "+visita);
    fetch('../api/v1/profileM', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {_idSlot: visita } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(data.success=="true")
        {
            console.log('slot prenotato')
            window.location.href = "profile_M.html";
        }
        else
        {
            console.log('intanto boh');
        }
    })
     .catch( error => console.error(error) );
  
}


/*

 


*/