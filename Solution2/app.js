const express = require("express");
require('dotenv').config();
const axios=require("axios")
const app = express();


app.use(express.json());

app.get('/categories/:categoryname/products', async (req, res, next) => {
    const url = "http://20.244.56.144/test/";

    const { top = 10, minPrice, maxPrice } = req.query;

    const topValue = Math.max(parseInt(top), 10);

    const offset = (topValue - 10) * (req.query.page || 0); 


    const modifiedUrl = `${url}companies/:companyname/categories/${req.params.categoryname}/products?top=${topValue}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    try {
        const data = await fetchWithTimeout(modifiedUrl, 500);
        if (data) {
   
            const totalProducts = data.totalProducts;

            const totalPages = Math.ceil(totalProducts / topValue);

  
            const response = {
                currentPage: req.query.page || 1,
                totalPages: totalPages,
                products: data.products 
            };

            return res.json(response);
        }
    } catch (error) {
        next(error);
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


const fetchWithTimeout = async (url, timeout = 500) => {
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
