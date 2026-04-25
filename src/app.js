import express from "express";
import shelterRoutes from './routes/shelter.route.js';
import supplyRoutes from './routes/supply.route.js';
import donationRoutes from './routes/donation.route.js';
import entityRoutes from './routes/entity.route.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/shelters', shelterRoutes);
app.use('/supplies', supplyRoutes);
app.use('/donations', donationRoutes);
app.use('/entities', entityRoutes);


export default app;