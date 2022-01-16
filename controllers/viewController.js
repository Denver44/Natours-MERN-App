const getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest Hiker Tour',
  });
};
const getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
};

export { getTour, getOverview };
