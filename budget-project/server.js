const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let envelopes = [
    { id: 1, title: 'Groceries', budget: 250 },
    { id: 2, title: 'Utilities', budget: 100 },
    { id: 3, title: 'Rent', budget: 1200}
];
let totalBudget = 0;

app.get('/envelopes/:id' (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = envelopes.find(env => env.id === id);

    if (envelope) {
        res.status(200).json(envelope);
    } else {
        res.status(400).send('Envelope not found.';)
    }
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/envelopes', (req, res) => {
    const { title, budget } = req.body;
    if (!title || !budget) {
        res.status(400).send('Missing title or budget.');
    }
    const newEnvelope = {
        id: envelopes.length + 1,
        title: title,
        budget: budget
    };
    envelopes.push(newEnvelope);
    totalBudget += budget;
    res.status(201).send(newEnvelope);
});

app.get('/envelopes', (req, res) => {
    res.status(200).send(envelopes);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost: ${PORT}`)
});