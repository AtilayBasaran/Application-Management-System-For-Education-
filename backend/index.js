const express = require('express');

const cors = require("cors");

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const passRoutes = require('./routes/pass');

const appRoutes = require('./routes/app');

const settingsRoutes = require('./routes/settings');

const filesRoutes = require('./routes/files');

const programsRoutes = require('./routes/programs');

const homeRoutes = require('./routes/home');

const errorController = require('./controllers/error');

const app = express();

global.__basedir = __dirname;
var corsOptions = {
  origin: "http://localhost:3000"
};

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-access-token'
  );

  next();
});

app.use('/auth', authRoutes);
app.use('/pass', passRoutes);
app.use('/app', appRoutes);
app.use('/settings', settingsRoutes);
app.use('/files', filesRoutes);
app.use('/programs', programsRoutes);
app.use('/home', homeRoutes);


const initRoutes = require("./routes/upload");

initRoutes(app);

app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));
