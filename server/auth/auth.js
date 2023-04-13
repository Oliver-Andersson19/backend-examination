import jwt from 'jsonwebtoken'


export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // hämta accesstoken från request
    if (token == null) return res.sendStatus(401) // kolla så token finns

    jwt.verify(token, "SECRET", (err, user) => { // verify token mot env secret
        if (err) return res.sendStatus(403) // return om den inte stämmer
        req.user = user; // sätt req.user till user, kommer från verify
        next() // gå vidare
    })
}


export function createToken(data) {
    return jwt.sign(data, "SECRET"); // skapa token av user objektet
}

export default { authenticateToken, /*authenticateSocketToken,*/ createToken }