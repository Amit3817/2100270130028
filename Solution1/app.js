const express = require("express");
require('dotenv').config();

const app = express();


app.use(express.json());


app.post("/numbers/:numberid", (req, res) => {
    const number=req.params.numberid;
    console.log(number);
    res.send(number)
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
