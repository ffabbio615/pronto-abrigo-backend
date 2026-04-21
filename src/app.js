import express from "express";
import shelterRoutes from './routes/shelter.route.js';

const app = express();
app.use(express.json());

// app.get("/", (req, res)=>{
//     res.send("<h1>Rodando!</h1>");
// });

app.use('/shelters', shelterRoutes);

export default app;