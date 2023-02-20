const router = require('express').Router();
const cribs = require('../controller/cribs.controller');

module.exports = (app) => {
  router.post('/', cribs.create);
  router.put('/:id', cribs.update);
  router.get('/:id', cribs.get);
  router.get('/', cribs.getAll);
  router.delete('/:id', cribs.delete);

  app.use('/api/cribs', router);
};
