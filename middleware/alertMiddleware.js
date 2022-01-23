const alertMiddleware = (req, res, next) => {
  const { alert } = req.query;

  if (alert === 'booking') {
    res.locals.alert = `Your booking was successful! Please check your email for a confirmation.
      If your booking doesn't show up here immediately, please come back later.`;
  }
  next();
};

export default alertMiddleware;

// READ STRIPE DOCS
// Because sometime webhooks is begin called late
