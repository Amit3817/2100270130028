const express = require("express");
require('dotenv').config();
const axios=require("axios")
const app = express();


app.use(express.json());

let windowPrevState;
app.post("/numbers/:numberId", async (req, res) => {
    try {
    let numberId = req.params.numberId.toLowerCase();
    var url;
    if(numberId=='e')
        {

            url = 'http://20.244.56.144/test/even'; 
        }
    else if(numberId=='f')
        {

            url="http://20.244.56.144/test/even"
        }
    else if(numberId=='p')
        {
            url="http://20.244.56.144/test/primes"

        }
    else if(numberId=='r')
        {

            url="http://20.244.56.144/test/rand"
        }
    else 
    {

       return res.json({message:"Error number type"})
    }

        const data = await fetchWithTimeout(url, 500);

        if (data) {
            const windowCurrState = data.numbers.slice(-10);
            let avg = calculateAverage(data.numbers);
            if(!windowPrevState)
                {

                    res.json({numbers:data.numbers,windowPrevState:[],windowCurrState,avg});
                }
        else
        {
            res.json({numbers:data.numbers,windowPrevState,windowCurrState,avg});
        }
            windowPrevState=windowCurrState;
        } else {
            res.status(504).json({message:'Request timed out and was ignored'});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const fetchWithTimeout = async (url, token, timeout = 500) => {
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
    );

    try {
   const token=process.env.access_token

        const response = await Promise.race([
            axios.get(url, { headers: { Authorization: `Bearer ${token}` } }),
            timeoutPromise
        ]);
        return response.data;
    } catch (error) {
        if (error.message === 'Request timed out') {
            console.log('Request took too long and was ignored.');
            return null;
        } else {
            throw error;
        }
    }
};
const calculateAverage = (numbers) => {
    const sum = numbers.reduce((total, num) => total + num, 0);
    return sum / numbers.length;
};