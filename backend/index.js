const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
