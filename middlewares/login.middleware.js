module.exports.requireLogin = (req, res, next) => {
    if (!req.cookies.userId) {
        res.redirect('/login');
        return;
    }
    next();
};