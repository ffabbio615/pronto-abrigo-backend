import express from "express";
import shelterRoutes from './routes/shelter.route.js';
import supplyRoutes from './routes/supply.route.js';
import donationRoutes from './routes/donation.route.js';
import entityRoutes from './routes/entity.route.js';

const app = express();
app.use(express.json());

// app.get("/", (req, res)=>{
//     res.send("<h1>Rodando!</h1>");
// });

app.use('/shelters', shelterRoutes);
app.use('/supplies', supplyRoutes);
app.use('/donations', donationRoutes);
app.use('/entities', entityRoutes);


export default app;