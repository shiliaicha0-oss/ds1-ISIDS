// nhoto li ahna bch nekhdmo b express
const express = require('express'); 
const app = express();

// dotenv : nhezo les variables ml fichier env 
require('dotenv').config();
// nimportiw les routes handler 
const userRoute= require('./routes/userRoute');
const authRoute = require('./routes/authRoute')
// port njibouh ml env 
const PORT = process.env.PORT;
// nimportiw l middleware cors header
const cors= require ('cors')
const cookieParser = require('cookie-parser');
const mongoose= require('mongoose')

// MIDDLEWARES + ROUTES
// middleware hedha ykhadem l CORS
// ykhalli l backend yekbel des requêtes li aamalnehom
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:60398'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
//   l'envoi des cookies, tokens, headers sécurisés binet front wel back.
  credentials: true
}));

// middleware hedha ykoul l Express :
// “ken requête feha un corps en JSON, ya9rah w ybadlo en objet JavaScript.”
app.use(express.json());
// hedha ykalli Express yakra les données envoyées men formulaire HTML classique.
app.use(express.urlencoded({ extended: true }));
// middleware hedha ykhalli Express yakra les cookies mab3outhin men navigateur.
app.use(cookieParser());

app.use('/user',userRoute);
app.use('/auth', authRoute);
 
// CONNEXION MongoDB
const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ds1-api");
    console.log(" MongoDB database connected");
  } catch (err) {
    console.error(" MongoDB connection failed:", err);
    process.exit(1);
  }
};
connect();
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});