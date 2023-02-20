const express = require('express');
const log4js = require('log4js');
const cors = require('cors');
const { application } = require('./config/config');
const { errorHandle } = require('./middleware/errror.handler');

const { PORT } = application;
const port = PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logger
log4js.addLayout(
  'json',
  (config) => (logEvent) => JSON.stringify(logEvent) + config.separator
);
log4js.configure('config/log4js.json');
const logger = log4js.getLogger('app');
logger.info('using environment: ', process.env.NODE_ENV);
app.use(
  log4js.connectLogger(log4js.getLogger('http'), {
    level: 'auto',
    format: (req, res, format) => format(':remote-addr :method :url'),
  })
);

const sequelize = require('./src/models');

sequelize
  .sync({
    alter: false,
    force: false,
  })
  .then(() => {
    // initialize default records files from app/controllers/models/default-records/**
  });

// health check
app.get('/api/health-check', (req, res) => {
  res.send({ success: true, message: 'Service is Running' });
});

require('./src/routes')(app);

app.use(errorHandle);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening at http://localhost:${port}`);
});
