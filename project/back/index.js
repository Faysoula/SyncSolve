const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testConnection } = require('./config/db');
require('dotenv').config();

const { Team, User, TeamMember } = require("./models/associations");

const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemsRoutes');
const teamRoutes = require('./routes/teamRoute');
const teamMemberRoutes = require('./routes/teamMembersRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-members', teamMemberRoutes);

app.get("/", (req, res) => {
  res.send("api running yay");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});


app.listen(PORT, () => {
  console.log(`====================================`);
  console.log(`Server running on port ${PORT}`);
  testConnection();
  console.log(`====================================`);
});
