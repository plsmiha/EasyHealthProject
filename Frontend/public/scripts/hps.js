function loadHP()
{
    fetch('../api/v1/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json())
    .then(function(data) {

        
    });
}