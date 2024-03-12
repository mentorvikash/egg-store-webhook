const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors())
app.use(bodyParser.json());


let eggStock = {
    count: 100,
    price: 1.5,
};


const eventMsg = {
    message: ""
};


let subscriptions = [];

app.post('/webhook', (req, res) => {
    const payload = req.body;
    if (payload.event === 'stock_update') {
        console.log("stock_update")
        eggStock.count += payload.quantity;
        notifyVendors(`New stock added: ${payload.quantity} eggs`);
    } else if (payload.event === 'purchase') {
        if (payload.quantity <= eggStock.count) {
            eggStock.count -= payload.quantity;
            notifyVendors(`Eggs purchased: ${payload.quantity}`);
        } else {
            return res.status(400).send('Not enough stock available');
        }
    } else if (payload.event === 'price_update') {
        eggStock.price = payload.price;
        notifyVendors(`Egg price updated to $${payload.price}`);
    }

    res.status(200).send('Webhook received successfully');
});

app.post('/subscribe', (req, res) => {
    const vendorId = uuidv4();
    subscriptions.push({ id: vendorId, callback: req.body.callback });
    res.json({ id: vendorId });
});


async function notifyVendors(message) {
    for (const subscription of subscriptions) {
        const response = await fetch(subscription.callback, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        const data = await response.json()
        console.log({ data })
    }
}


app.post('/update-message', (req, res) => {
    console.log("body", typeof req.body);
    if (req?.body?.message) {
        // console.log("message", req.body.message)
        eventMsg.message = req.body.message;
        return res.status(200).json({ message: "updated successfully" })
    } else {
        return res.status(400).json({ message: "something went wrong" })
    }
})


app.get('/getDetail', (req, res) => {
    return res.status(200).json({ eggStock, eventMsg })
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
