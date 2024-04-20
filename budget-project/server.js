const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Data for envelopes
let envelopes = [
    { id: 1, title: 'Groceries', budget: 250 },
    { id: 2, title: 'Utilities', budget: 100 },
    { id: 3, title: 'Rent', budget: 1200}
];

let totalBudget = envelopes.reduce((sum, envelope) => sum + envelope.budget, 0);

app.put('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { amount, title, budget } = req.body;

    const envelope = envelopes.find(env => env.id === id);
    if (!envelope) {
        return res.status(404).send('Envelope not found.');
    }

    //Update the budget if amount to subtract is provided
    if (amount) {
        if (amount > envelope.budget) {
            return res.status(400).send('Insufficient funds in the envelope.');
        }
        envelope.budget -= amount;
    }

    // Optionally update the title
    if (title) {
        envelope.title = title;
    }

    // Optionally update the budget directly if given
    if (budget) {
        envelope.budget = budget;
    }

    // Update total budget if needed
    totalBudget = envelopes.reduce((sum, env) => sum + env.budget, 0);

    res.status(200).json(envelope);
});

app.get('/envelopes', (req, res) => {
    res.status(200).send(envelopes);
});

// Endpoint to get specific envelope by id
app.get('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = envelopes.find(env => env.id === id);

    if (envelope) {
        res.status(200).json(envelope);
    } else {
        res.status(404).send('Envelope not found.');
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
// Create new envelope
    const newEnvelope = {
        id: envelopes.length + 1,
        title: title,
        budget: budget
    };
    envelopes.push(newEnvelope);
    totalBudget += budget;
    res.status(201).send(newEnvelope);
});

// POST endpoint to transfer budget between envelopes
app.post('/envelopes/transfer/:from/:to', (req, res) => {
    const fromId = parseInt(req.params.from);
    const toId = parseInt(req.params.to);
    const amount = parseInt(req.params.amount);

    if (!amount || amount < 0) {
        return res.status(400).send('Invalid amount specified.');
    }

    const fromEnvelope = envelopes.find(envelope => envelope.id === fromId);
    const toEnvelope = envelopes.find(envelope => envelope.id === toId);

    if (!fromEnvelope || toEnvelope) {
        return res.status(404).send('One or both envelopes not found.');
    }

    if (fromEnvelope.budget < amount) {
        return res.status(400).send('Insufficient funds in source envelope.');
    }

    // Transfer the amount
    fromEnvelope.budget -= amount;
    toEnvelope.budget += amount;

    res.status(200).json({
        message: 'Transfer successful.',
        envelopes: [fromEnvelope, toEnvelope]
    });
});

// GET endpoint to retrieve all envelopes
app.get('/envelopes', (req, res) => {
    res.status(200).send(envelopes);
});

// Delete endpoint to remove a specific envelope
app.delete('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = envelopes.length;
    envelopes = envelopes.filter(envelope => envelope.id !== id);

    // Check if the length of the array has changed to determine if an item was deleted
    if (envelopes.length === initialLength) {
        return res.status(404).send('Envelope not found.');
    }
    
    res.status(200).send('Envelope deleted successfully.');
});

// Listen on configured port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost: ${PORT}`)
});