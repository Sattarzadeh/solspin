import express from "express";
import bodyParser from "body-parser";
import walletRoutes from "./routes/WalletRoutes"; // Make sure this path is correct
require("dotenv").config();
const db = require("./db/DbConnection");
const app = express();

app.use(bodyParser.json());
app.use("/wallets", walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
