import { getProducts, getProduct } from './services/api.js';
import { creatOrder, retriveOrder } from './services/klarna.js';
import express from 'express';
const app = express();
import { config } from 'dotenv';
config();

app.get('/', async (req, res) => {
	const products = await getProducts();
	console.log(products);
    const markup = `
        <style>
            body {
                background-color: #d5e1df;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                
            }
            .container {
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px; 
            }

            .flex-wrapper{
                display: flex;      
                flex-wrap: wrap;
                flex-direction: row; 
                width: 100%
            }

            .product {
                width: 440px;
                border: 1px solid #ddd;
                border-radius: 8px;
                margin-bottom: 20px;
                margin-right: 20px;
                margin-left: 20px;
                background-color: #fff;
            }
            .product img {
                max-width: 200px;
                max-height: 200px;
                display: block;
                margin: 0 auto 10px;
            }
            .product a {
                color: #333;
                text-decoration: none;
            }
            .product h3 {
                margin: 0;
            }
            .product p {
                margin: 5px 0;
            }
        </style>
        <div class="container">
            <h1 style="text-align: center; margin-bottom: 20px;">Överskottsbolaget, här finns allt!</h1>
          <div class="flex-wrapper">
            ${products.map((p) => `
            <a href="/products/${p.id}" class="product-link">
                <div class="product">
                    <img src="${p.image}" alt="${p.title}">
                    <div style="text-align: center;">
                            <h3>${p.title}</h3>
                            <p>Price: ${p.price} kr</p>
                        </a>
                    </div>
                </div>
            `).join('')}
          </div>
        </div>
    `;
    res.send(markup);
});

app.get('/products/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const product = await getProduct(id);
		const klarnaResponse = await creatOrder(product);
		const markup = klarnaResponse.html_snippet;
		res.send(markup);
	} catch (errror) {
		res.send(error.message);
	}
});

app.get('/confirmation', async (req, res) => {
	const { order_id } = req.query;
	const klarnaResponse = await retriveOrder(order_id);
	const { html_snippet } = klarnaResponse;
	res.send(html_snippet);
});

app.listen(process.env.PORT);
