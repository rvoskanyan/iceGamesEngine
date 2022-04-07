export const addProduct = async (req, res) => {
  try {
    if (!req.session.isAuth) {
      throw new Error();
    }
    
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    })
  }
}