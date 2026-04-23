import "dotenv/config";
import app from "./src/app.js";
import { expireReservations } from './src/services/donation.service.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);

  // Inicia a verificação de expiração das reservas de suprimentos do púbico para os abrigos.
  setInterval(() => {
    expireReservations();
  }, 1000 * 60 * 1); // Verificação de aproximadamente 10 em 10 segundos.
});