import Review from "../../models/Review.js";

export const pageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({status: 'moderation'}).select(['text', 'eval']).lean();
    
    res.render('admReviewsModerationList', {
      layout: 'admin',
      reviews,
    })
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const rejectPage = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId).select(['text', 'eval', 'status']).lean();
    
    if (!review || review.status !== 'moderation') {
      throw new Error('not found review or his not has moderation status');
    }
    
    res.render('admRejectReview', {
      layout: 'admin',
      review,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/reviews');
  }
}

export const reject = async (req, res) => {
  const reviewId = req.params.reviewId;
  
  try {
    const rejectionReason = req.body.rejectionReason;
    
    if (!rejectionReason) {
      throw new Error('not found rejectionReason');
    }
    
    const review = await Review.findById(reviewId).select(['text', 'eval', 'status']);
  
    if (!review || review.status !== 'moderation') {
      throw new Error('not found review or his not has moderation status');
    }
    
    review.status = 'rejected';
    review.rejectionReason = rejectionReason;
    
    await review.save();
    
    res.redirect('/admin/reviews');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/reviews/reject/${reviewId}`);
  }
}

export const take = async (req, res) => {
  const reviewId = req.params.reviewId;
  
  try {
    const review = await Review.findById(reviewId).select(['status']);
    
    if (!review || review.status !== 'moderation') {
      throw new Error('not found review or his not has moderation status');
    }
    
    review.status = 'taken';
    
    await review.save();
    
    res.redirect('/admin/reviews');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/reviews/reject/${reviewId}`);
  }
}