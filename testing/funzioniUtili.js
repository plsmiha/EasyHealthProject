function generaHash(pass) //funzione che genera l'hash della psw per non mandare robe in chiaro al db, deve essere questa la func o non sono coerenti
{
    var hash = crypto.createHash('sha512');
    data = hash.update(pass, 'utf-8');
    gen_hash = data.digest('hex');
    return gen_hash;
}

module.exports = {
  generaHash: generaHash,
};
