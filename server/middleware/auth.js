const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    try{
        const token = req.header("token");
        //console.log(token)
        if(!token)
            return res.status(401).json({msg: "Brak tokena - brak dostępu"});
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified)
            return res.status(401).json({msg: "Weryfikacja tokena zakończona niepowodzeniem"});
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = auth;