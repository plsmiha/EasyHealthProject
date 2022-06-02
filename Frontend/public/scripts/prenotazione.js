const d = new Date(); //potrebbe servirmi in piu funzioni se no sposta in loadData()
var visita=""; //per passare la visita tra la funzione load che ha la gestione dinamica degli elementi select e la funzione prenota
var prevSelect=""; //variabile globale in modo che quando seleziono l'opzione di un altro giorno riesca a tenere traccia dell'id di quello selzionato prima e resettarlo
var body = document.getElementsByTagName('body')[0];


function loadData(){    

    const queryString = window.location.search; //grab the query string
    const urlParams = new URLSearchParams(queryString); //parsing the query string
   
    
    //https//localhost/profile_M?id=asdfghfdsaWWSDF
    id_medico = urlParams.get('id') //prendo dall'insieme di parametri il valore di quello chiamato "id"
  
    
    
//___________________GET SLOTS DISPONIBIILI____________________________________________________________________________________________
    fetch('../api/v1/prenotazione?id='+id_medico, {//passo al middleware il mio parametro attraverso la uri
        method: 'GET', //con il get mi arriva come risposta non solo lo statos ma anche i dati che chiedo
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    .then((resp) => resp.json())
    .then(function(data) {
        var box = document.getElementById('container');
        if(data.success!=null){
            if(data.error == 1){
                console.log("not authorized");
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
              }
              else if(data.error==2){
                console.log("id not accetable")
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
              }

        }else{

            if(slots.length!=0 ){
                console.log("non ci sono slot");
                box.innerHTML="*NON CI SONO SLOT DISPONIBILI PER QUESTO MEDICO NEI PROSSIMI 4 MESI";

            }else{
            
                box.innerHTML=""; //per rimuovere quello che c'era prima nella box degli slot

                //creo gli elementi necessari per ogni giorno in cui c'è almeno uno slot
                //data.slotsDate e un array di date [ 2022-07-13, 2022-4-6 ...]
                for (var i = 0; i < (data).length; i++) {
                    
                    const giorgio = new Date(data[i]._id);
                
                    if((giorgio-d)>0){ //faccio vedere solo da domani
                        
                        //creo un rettangolo rosso con dentro la data
                        const el = document.createElement('div')
                        el.classList.add('item');

                        //spezzo la data che mi arriva per formattarla come voglio
                        scritta=data[i]._id.toString();
                        let a = scritta.split("-");
                        el.innerHTML ="<pre>"+a[2]+"/"+a[1]+"</pre>";

                        //creo un elemento di tipo select
                        const s = document.createElement('select');
                        el.appendChild(s);

                        //metto la prima opzione di defaul cosi posso usare l'ochange quando il paziente scegliera un orario
                        //altrimenti l'onchange non funzionerebbe se il paziente scegliesse il primo orario che compare nel select 
                        const primo = document.createElement('option');
                        primo.classList.add('ora');
                        primo.innerHTML = "scegli orario";
                        s.appendChild(primo);
                        
                        //quando seleziono un orario resetto quello che ho selezionato in un altro giorno se no
                        //se il paziente cambiasse idea e volesse selzionare il giorno selezionato prima di fatto si sbaglierrebbe
                        //perche non ci sarebbe nessun change e l'id memorizzato sarebbe quello dell'ultima cosa CAMBIATA non selezionata
                        //devo ridargli la possibilità di cambiarla di nuovo
                        s.onchange= function(){
                            visita=s.value;
                            prevSelect.selectedIndex = 0;
                            prevSelect=s;
                        }
                        //     giorno 1    g2     g3 ... gn
                        //[ [ {},{},{}],  [{}], [{},{}], ...]
                        //ho un array di arrayc con dentro n json  per ogni casella dell'array // una casella=una data in cui c'è almeno uno slot
                        //per ogni giorno mi creo un'opzione nel select per ogni slot orario e lo appendo al select di quel giorno
                        for(var j=0; j<data[i].giorni.length; j++){
                                var opt = document.createElement('option');
                                opt.classList.add('ora');
                                opt.innerHTML = data[i].giorni[j].from+" - "+data[i].giorni[j].to;
                                opt.value = data[i].giorni[j]._id;
                                s.appendChild(opt);
                        }

                        //metto queso nuovo elemento "giorno+select+opzioni" nel box che contiene tutto
                        box.appendChild(el);
                    }
                }   
           }
        }
    }).catch( error => console.error(error) );


    //_________________GET INFO MEDICO___________________________________
  
    
    fetch('../api/v1/Medico/'+id_medico, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    .then((resp) => resp.json())
    .then(function(data) {

        if(data.success!=null){
            if(data.error == 1){
                console.log("medico non trovato");
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
              }
              else if(data.error==2){
                console.log("id not accetable")
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
              }    

        }else{

            //prendo gli id di tutti gli elementi delle info doctor
            var titolo =  document.getElementById("title");
            var nome = document.getElementById("Nome");
            var competenza =  document.getElementById("Competenza");
            var tel = document.getElementById("Tel");
            var email = document.getElementById("Email");
            var bio = document.getElementById("dashboard");

            //metto le maiuscole al nome 
            var n=data.name+ " "+data.surname;
            const arr = n.split(" ");
        
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
            }
            const nominativo = arr.join("  ");

            //assegno il giusto contenuto preso dalla get a tutti gli elementi
            titolo.innerHTML = "Dottor  "+nominativo; //assegno a quell'id questo valore che ho appena recuperato dal db
            //.value è solo per gli elementi che accettano un inpu/ innerHtml è per tutto
            nome.innerHTML = nominativo; 
            competenza.innerHTML = data.title[0].name;
            tel.innerHTML = data.numero; 
            email.innerHTML = data.email;
            bio.innerHTML = data.bio;

        }

    }).catch( error => console.error(error) );

};

function prenota(){

    console.log("prenotero lo slot "+visita);

    fetch('../api/v1/prenotazione', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({_idSlot: visita}),
        credentials: 'include',
    })
    .then((resp) => resp.json())
    .then(function(data) {
        var box = document.getElementById('container');
        if(data.success=="true")
        {
            loadData();    
            //se la prenotazione va a buon fine ricarico la pagina in modo che sparisca lo slot appena selezionato
            console.log('slot prenotato')
            //window.location.href = "profile_M.html?id="+id_medico; //cosi ritorno su quel medico li
            //non so perche non fuziona se rimetto l'opzione a index 0 e richiamo loadData() con il redirect si invece
        }
        else
        {
            if(data.error == 1){
                console.log("no authorized");
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
              }
              else if(data.error==2){
                console.log("prenotazione non avvenuta")
                box.innerHTML="<pre>"+"Prenotazione non avvenuta correttamente."+"<br>"+"Ricaricare la pagine e riprovare il processo di prenotazione."+"</pre>";

              }    
        }
    })
     .catch( error => console.error(error) );
  
}
