const d = new Date();

function loadData(){    

    console.log('prendo i dati')


    fetch('../api/v1/calendarP', {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' },
       // credentials: 'include',
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data.status)
        if(data!=null){
        
                //prendo gli id di tutti gli elementi delle info doctor
            const dx =  document.getElementById("containerDx");
            const sx = document.getElementById("containerSx");
            
           
            for (var i = 0; i < (data.appuntamento).length; i++) {

                 //metto le maiuscole al nome 
                 const giorgio = new Date(data.appuntamento[i].day);
            
                if((giorgio-d)>0){ //faccio vedere solo da domani
                    
                    //creo un rettangolo rosso con dentro la data
                    const el = document.createElement('div')
                    el.classList.add('item');

                    const visita = document.createElement('div');
                    visita.classList.add('appuntamentoDx');
                    visita.innerHTML ="<pre>"+noAnno(data.appuntamento[i])+"  alle  "+data.appuntamento[i].from+"-"+data.appuntamento[i].to+"<br>"+ "Dr  "+nominativo(data.jsonArr[i])+"</pre>";
                    
                    const bottone = document.createElement('button');
                    bottone.classList.add('bottone');
                    bottone.innerHTML="elimina";
                    bottone.onclick = stampa(data.appuntamento[i]._id);
        
                    el.appendChild(visita);
                    el.appendChild(bottone);
                    dx.appendChild(el);
                }else if((giorgio-d)==0){
                    const visita = document.createElement('div');
                    visita.classList.add('appuntamentoSx');
                    visita.innerHTML ="<pre>"+noAnno(data.appuntamento[i])+"  alle  "+data.appuntamento[i].from+"-"+data.appuntamento[i].to+"<br>"+ "Dr  "+nominativo(data.jsonArr[i])+"</pre>";
                    dx.appendChild(visita);

                }
            }
        }else{
            //DA IMPLEMENTARE
            console.log('intanto boh');
        }
    })
     .catch( error => console.error(error) );
    
};

function stampa(){
    console.log("ma chi ti ha detto niente");
}


function cancella(slot){

    console.log("elimino appuntamento "+slot);

    fetch('../api/v1/calendarP/'+slot, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(data.success=="true")
        {
            console.log("eliminato");
            loadData();
        }
        else
        {
            //DA IMPLEMENTARE
            console.log('intanto boh');
        }
    })
     .catch( error => console.error(error) );
  
}

function nominativo(nomi){
    //ricavo nome di quel medico
    var n=nomi[0].name+ " "+nomi[0].surname;
    const arr = n.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join("  ");
}
function noAnno(appuntamento){
    scritta=appuntamento.day.toString();
    let a = scritta.split("-");
    gg=a[2]+"/"+a[1];
    return gg;
}