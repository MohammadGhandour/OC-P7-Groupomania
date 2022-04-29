module.exports = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (username == '' || email == '' || password == '') {
        res.status(400).json({ error: "Veuillez remplire tout les champs obligatoire du formulaire !" })
    } else if (password.length < 8) {
        res.status(400).json({ error: "Votre mot de passe doit contenir au moins 8 caractères !" })
    } else {
        let validEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        
        if(!validEmail.test(email)){
            return res.status(400).json({error : "Email invalide"})
        } else {
            next();
        }
    }
}

// "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", 'g'