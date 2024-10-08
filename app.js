// Importa il modulo Express per creare il server
const express = require('express');

// Importa il modulo body-parser per gestire i dati JSON nelle richieste HTTP
const bodyParser = require('body-parser');

// Importa il modulo nodemailer per inviare email
const nodemailer = require('nodemailer');

// Importa il modulo bcryptjs per hashare le password e garantire la sicurezza
const bcrypt = require('bcryptjs');

// Importa il modulo jsonwebtoken per gestire l'autenticazione con JWT
const jwt = require('jsonwebtoken');

// Importa il modulo mongoose per interagire con MongoDB
const mongoose = require('mongoose');

// Inizializza l'app Express
const app = express();

// Usa body-parser per permettere all'app di gestire richieste con corpo JSON
app.use(bodyParser.json());

// Connessione al database MongoDB locale
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true, // Usa il nuovo parser per URL MongoDB
    useUnifiedTopology: true // Imposta l'uso del nuovo motore di gestione delle connessioni di MongoDB
});

// Definisce lo schema per gli utenti nel database
const UserSchema = new mongoose.Schema({
    email: String,   // Campo email dell'utente
    password: String, // Campo password dell'utente, che verrà hashata
    cart: Array      // Un array per memorizzare i prodotti nel carrello
});

// Crea il modello 'User' basato sullo schema UserSchema per interagire con la collezione 'users' nel database
const User = mongoose.model('User', UserSchema);

// Rotta per la registrazione degli utenti
app.post('/register', async (req, res) => {
    // Estrai email e password dal corpo della richiesta (req.body)
    const { email, password } = req.body;

    // Hasher la password con bcrypt con un "salt" di 10 cicli
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuovo utente con l'email fornita e la password hashata, il carrello è inizialmente vuoto
    const user = new User({ email, password: hashedPassword, cart: [] });

    // Salva il nuovo utente nel database
    await user.save();

    // Configura nodemailer per inviare un'email tramite Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Usa il servizio Gmail per l'invio di email
        auth: {
            user: 'your-email@gmail.com', // L'email che invia il messaggio
            pass: 'your-password'         // La password dell'email (meglio usare variabili di ambiente per sicurezza)
        }
    });

    // Definisce le opzioni dell'email da inviare
    const mailOptions = {
        from: 'your-email@gmail.com',    // Mittente dell'email
        to: email,                       // Email destinatario, ossia l'utente appena registrato
        subject: 'Benvenuto!',           // Oggetto dell'email
        text: 'Grazie per esserti registrato sul nostro sito.' // Corpo dell'email
    };

    // Invia l'email di benvenuto all'utente
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error); // Logga l'errore se l'invio fallisce
        } else {
            console.log('Email inviata: ' + info.response); // Logga la conferma se l'email viene inviata
        }
    });

    // Risponde al client con un messaggio di conferma della registrazione
    res.json({ message: 'Registrazione completata' });
});

// Rotta per il login degli utenti
app.post('/login', async (req, res) => {
    // Estrai email e password dal corpo della richiesta
    const { email, password } = req.body;

    // Trova l'utente corrispondente all'email fornita
    const user = await User.findOne({ email });

    // Se l'utente non esiste, restituisce un errore
    if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Confronta la password fornita con quella salvata (hashata) nel database
    const isMatch = await bcrypt.compare(password, user.password);

    // Se la password non corrisponde, restituisce un errore
    if (!isMatch) {
        return res.status(400).json({ message: 'Password errata' });
    }

    // Genera un token JWT contenente l'ID dell'utente, che servirà per autenticare le future richieste
    const token = jwt.sign({ userId: user._id }, 'secret-key'); // 'secret-key' è la chiave segreta per firmare il token

    // Risponde con il token JWT al client
    res.json({ token });
});

// Rotta per ottenere il carrello persistente dell'utente autenticato
app.get('/cart', async (req, res) => {
    // Estrai il token JWT dall'header 'authorization'
    const token = req.headers['authorization'];

    // Se non è presente il token, restituisce un errore di autenticazione
    if (!token) {
        return res.status(401).json({ message: 'Autenticazione richiesta' });
    }

    // Verifica e decodifica il token JWT
    const decoded = jwt.verify(token, 'secret-key'); // 'secret-key' deve essere la stessa usata per generare il token

    // Trova l'utente in base all'ID decodificato dal token
    const user = await User.findById(decoded.userId);

    // Restituisce il carrello dell'utente autenticato
    res.json({ cart: user.cart });
});

// Avvia il server sulla porta 3000 e logga il messaggio di avvio
app.listen(3000, () => {
    console.log('Server avviato sulla porta 3000');
});

// Connessione al database MongoDB locale (è ripetuto ma già presente sopra, può essere rimosso)
mongoose.connect('mongodb://localhost:27017/ecommerce');
