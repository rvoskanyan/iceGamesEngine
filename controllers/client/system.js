export const logout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
}