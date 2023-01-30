import Bundle from './../../models/Bundle.js';
import Product from './../../models/Product.js';

export const bundlePage = async (req, res) => {
  try {
    const bundles = await Bundle.find().select(['name']).lean();
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список связок',
      section: 'bundles',
      elements: bundles,
      addTitle: "Добавить связку",
    });
  } catch (e) {
    res.redirect('/admin')
  }
}

export const bundleAddPage = async (req, res) => {
  res.render('addBundle', {
    layout: 'admin',
    title: 'Добавление новой связки',
  })
}

export const addBundle = async (req, res) => {
  try {
    const {name} = req.body;
    
    await Bundle.create({name});
    
    res.redirect('/admin/bundles');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/bundles/add');
  }
}

export const bundleEditPage = async (req, res) => {
  try {
    const {id} = req.params;
    const bundle = await Bundle.findById(id);
    const products = await Product.find({bundleId: id});
  
    res.render('addBundle', {
      layout: 'admin',
      title: 'Просмотр связки',
      isEdit: true,
      products,
      bundle,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/admin/bundles');
  }
}

export const bundleEdit = async (req, res) => {
  const {id} = req.params;
  
  try {
    const {name} = req.body;
    const bundle = await Bundle.findById(id);
  
    bundle.name = name;
    
    await bundle.save();
    
    res.redirect('/admin/bundles');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bundles/edit/${id}`);
  }
}

export const pageAddProductBundle = async (req, res) => {
  const {bundleId} = req.params;
  
  try {
    const products = await Product.find({bundleId: null});
    
    res.render('addProductBundle', {
      layout: 'admin',
      title: 'Добавление новой игры в связку',
      products,
      bundleId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bundles/edit/${bundleId}`);
  }
}

export const addProductBundle = async (req, res) => {
  const {bundleId} = req.params;
  
  try {
    const {productId, isOriginalInBundle} = req.body;
    const product = await Product.findById(productId);
    
    if (isOriginalInBundle) {
      const currentOriginal = await Product
        .findOne({bundleId, isOriginalInBundle: true})
        .select('_id')
      
      if (currentOriginal) {
        currentOriginal.isOriginalInBundle = false;
        await currentOriginal.save();
      }
  
      product.isOriginalInBundle = true;
    }
    
    product.bundleId = bundleId;
    
    await product.save();
  
    res.redirect(`/admin/bundles/edit/${bundleId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bundles/${bundleId}/addProduct`);
  }
}

export const bundleProductEditPage = async (req, res) => {
  const {bundleId, productId} = req.params;
  
  try {
    const product = await Product.findById(productId);
    
    res.render('addProductBundle', {
      layout: 'admin',
      title: 'Редактирование игры в связке',
      isEdit: true,
      product,
      bundleId,
    });
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bundles/edit/${bundleId}`);
  }
}

export const bundleProductEdit = async (req, res) => {
  const {bundleId, productId} = req.params;
  
  try {
    const product = await Product.findById(productId);
    const {isOriginalInBundle} = req.body;
    
    if (!isOriginalInBundle) {
      return res.redirect(`/admin/bundles/edit/${bundleId}`);
    }
    
    const currentOriginal = await Product.findOne({bundleId, isOriginalInBundle: true});
  
    if (currentOriginal) {
      currentOriginal.isOriginalInBundle = false;
      await currentOriginal.save();
    }

    product.isOriginalInBundle = true;
    
    await product.save();
    
    res.redirect(`/admin/bundles/edit/${bundleId}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/bundles/${bundleId}/${productId}`);
  }
}