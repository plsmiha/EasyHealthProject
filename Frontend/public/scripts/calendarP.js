const d = new Date();
const anno = d.getFullYear();
const mese= d.getMonth()+1;
const giorno =d.getDate();
const oggi =anno+"-"+mese+"-"+giorno;
var body = document.getElementsByTagName('body')[0];


function loadData(){

    fetch('../api/v1/agendaPaziente', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    })
    .then((resp) => resp.json())
    .then(function(data) {
        //prendo gli id di tutti gli elementi delle info doctor
        const dx =  document.getElementById("containerDx");
        const sx = document.getElementById("containerSx");

        if(data.success!=null){
            if(data.error == 1){
                console.log("unauthorized");
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
            }

        }else{

            //li setto a niente per ripulire la pagina senza doverla ricaricare
            dx.innerHTML="";
            sx.innerHTML="";

            if(data.length==0){
                console.log("nessun appuntamento trovato");
                dx.innerHTML="*NON HAI ANCORA PRENOTATO NESSUN APPUNTAMENTO";
            }else{

                for (var i = 0; i < (data).length; i++) {

                    const giorgio = new Date(data[i].day);


                    if((giorgio-d)>0){ //faccio vedere solo da domani

                        //creo un rettangolo rosso con dentro la data
                        const el = document.createElement('div')
                        el.classList.add('item');

                        const visita = document.createElement('div');
                        visita.classList.add('appuntamentoDx');
                        visita.innerHTML ="<pre>"+noAnno(data[i])+"  alle  "+data[i].from+"-"+data[i].to+"<br>"+ "Dr  "+data[i].id_doc['name']+" "+data[i].id_doc['surname']+"</pre>";

                        const bottone = document.createElement('button');
                        bottone.classList.add('bottone');
                        bottone.innerHTML="elimina";
                        bottone.value=data[i]._id;
                        bottone.onclick= function() {

                          if (confirm("Eliminare l'appuntamento?")) {
                          cancella(bottone.value);}
                         };

                        el.appendChild(visita);
                        el.appendChild(bottone);
                        dx.appendChild(el);

                    } else if(oggi==data[i].day){

                        const visita= document.createElement('div');
                        visita.classList.add('appuntamentoSx');
                        visita.innerHTML ="<pre>"+noAnno(data[i])+"  alle  "+data[i].from+"-"+data[i].to+"<br>"+ "Dr  "+data[i].id_doc['name']+" "+data[i].id_doc['surname']+"</pre>";
                        sx.appendChild(visita);
                    }
                }
            }
        }
    })
     .catch( error => console.error(error) );

};



function cancella(slot){

    console.log("elimino appuntamento "+slot);

    fetch('../api/v1/agendaPaziente/'+slot, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then((resp) => resp.json())
    .then(function(data) {
        if(data.success=="true"){
            console.log("eliminato");
            loadData();
            //window.location.href = "calendar_P.html";
        }else{
            if(data.error=="1"){
                console.log("unauthorized");
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
            }else if(data.error=="2"){
                console.log("gia eliminato/slot non tuo/slot di oggi");
                body.innerHTML="";
                body.style.backgroundImage = 'url(../img/error.jpg)';
            }
        }
    })
     .catch( error => console.error(error) );

}


function noAnno(appuntamento){
    scritta=appuntamento.day.toString();
    let a = scritta.split("-");
    gg=a[2]+"/"+a[1];
    return gg;
}
