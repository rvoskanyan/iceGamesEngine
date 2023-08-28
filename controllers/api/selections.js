import Selection from "../../models/Selection.js";

export const getSelections = async (req, res) => {
  try {
    const {
      limit = 4,
      skip = 0,
      delistSelection = '',
    } = req.query;
  
    const platform = req.cookies.platform || 'pc';
    const filter = { _id: { $ne: delistSelection } };
    const selections = await Selection
      .find(filter)
      .sort({createdAt: -1})
      .limit(+limit)
      .skip(+skip)
      .populate([{
        path: 'products',
        select: ['platformType'],
      }])
      .lean();
    const count = await Selection.countDocuments(filter);
    const isLast = +skip + +limit >= count;
    
    res.json({
      success: true,
      selections: selections.map(selection => ({
        ...selection,
        products: selection.products.filter(product => product.platformType === platform),
      })),
      isLast,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
    });
  }
}