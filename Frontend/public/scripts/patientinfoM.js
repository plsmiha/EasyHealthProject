var user_id;

function loadData(){
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    user_id = params.id;

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

    fetch('../api/v1/Referto?patient='+user_id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        document.getElementById("container").innerHTML=null;
        data.forEach(function (el) {
            var item=document.createElement("div");
            item.classList.add("item");
            item.innerText = "("+el.date+") "+el.title;
            //item.setAttribute("value",el._id);
            item.onclick = function() { viewReferto(el._id); };
            document.getElementById("container").appendChild(item);
        });
    })
}

function viewReferto(value)
{
    console.log(value);
    document.getElementById("view_referto_box").style.visibility="visible";
    document.getElementById("view_referto_box").style.opacity=1;
}

async function addReferto()
{
    let title=document.getElementById("title_ref").value;
    let comment=document.getElementById("comment").value;
    if(title!="")
    {
        await fetch('../api/v1/Referto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id_patient: user_id, title: title, pdf: file, comment: comment}),
        })
        .then((resp) => resp.json())
        .then(function(data) {
            console.log(data);
        })
    }
    document.getElementById('add_referto_box').style.opacity=0; 
    document.getElementById('add_referto_box').style.visibility='hidden';
    loadData();
}
var file="";
function loadFile()
{
    file="";
    let pdf=document.getElementById("pdf").files;
    if (pdf.length > 0) {
        var fileToLoad = pdf[0];
        var fileReader = new FileReader();
        var base64;
        fileReader.onload = function(fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            file=base64;
        };
        fileReader.readAsDataURL(fileToLoad);
    }
}