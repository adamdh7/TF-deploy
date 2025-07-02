import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let users = {}; // { phone: { points: number, botsDeployed: [] } }

// Jenere kòd 8-chif
function generateCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Route ajoute pwen (+7)
app.post('/addPoints', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone needed' });
  if (!users[phone]) users[phone] = { points: 0, botsDeployed: [] };
  users[phone].points += 7;
  res.json({ points: users[phone].points });
});

// Route deploy bot
app.post('/deployBot', (req, res) => {
  const { phone, botName } = req.body;
  if (!phone || !botName) return res.status(400).json({ error: 'Phone and botName needed' });
  if (!users[phone]) users[phone] = { points: 0, botsDeployed: [] };

  if (users[phone].points < 7) return res.status(403).json({ error: 'Not enough points' });

  users[phone].points -= 7;
  if (!users[phone].botsDeployed.includes(botName)) {
    users[phone].botsDeployed.push(botName);
  }

  let response = { points: users[phone].points, botName };
  if (botName === "Adam_D'H7") {
    response.code = generateCode();
    response.qr = `https://api.qrserver.com/v1/create-qr-code/?data=${response.code}&size=150x150`;
  }
  res.json(response);
});

// Route wè pwen + bots itilizatè
app.get('/status/:phone', (req, res) => {
  const phone = req.params.phone;
  if (!users[phone]) return res.json({ points: 0, botsDeployed: [] });
  res.json(users[phone]);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
