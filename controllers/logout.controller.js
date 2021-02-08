module.exports.post = async (req, res) => {
    cookies.set('testtoken', {maxAge: 0});
    res.redirect('/');
}