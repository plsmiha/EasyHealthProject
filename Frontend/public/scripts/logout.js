function logout(){

    event.preventDefault();
    fetch('../api/v1/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(function(data) {
        window.location.href = "login.html";
    })
    .catch( error => console.error(error) );
};