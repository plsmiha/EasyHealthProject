function loadAree()
{
    fetch('../api/v1/aree', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(),
    })
    .then((resp) => resp.json())
    .then(function(data) {
        data.forEach(el => {
            var opt = document.createElement('option');
            opt.innerHTML = el.name;
            opt.value = el._id;
            document.getElementById("aree").appendChild(opt);
        })
    })
}