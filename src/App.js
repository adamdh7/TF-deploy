import React, { useState } from 'react';

const BOTS = [
  { name: "Adam_D'H7", logo: '🚶🏻‍♂️' },
  { name: "《T•F》", logo: '🇭🇹' },
  { name: "Tergene Focus", logo: '🌐' }
];

export default function App() {
  const [phone, setPhone] = useState('');
  const [points, setPoints] = useState(0);
  const [botsDeployed, setBotsDeployed] = useState([]);
  const [deployResponse, setDeployResponse] = useState(null);

  async function fetchStatus(phone) {
    const res = await fetch(`http://localhost:3001/status/${phone}`);
    const data = await res.json();
    setPoints(data.points);
    setBotsDeployed(data.botsDeployed);
  }

  async function addPoints() {
    if (!phone) return alert('Mete nimewo telefòn ou!');
    const res = await fetch('http://localhost:3001/addPoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    setPoints(data.points);
  }

  async function deployBot(botName) {
    if (!phone) return alert('Mete nimewo telefòn ou!');
    if (points < 7) return alert('Ou bezwen omwen 7 pwen pou deploy bot!');
    const res = await fetch('http://localhost:3001/deployBot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, botName })
    });
    const data = await res.json();
    setPoints(data.points);
    setBotsDeployed(prev => prev.includes(botName) ? prev : [...prev, botName]);
    setDeployResponse(data);
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Bot Deploy System</h1>
      <input 
        placeholder="Mete nimewo telefòn" 
        value={phone} 
        onChange={e => setPhone(e.target.value)} 
        onBlur={() => fetchStatus(phone)} 
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <p>Pwen ou: <b>{points}</b></p>
      <button onClick={addPoints} style={{ padding: '8px 16px', marginBottom: 20 }}>+7 Pwen</button>

      <h2>Deploy Bots</h2>
      {BOTS.map(bot => (
        <div key={bot.name} style={{ marginBottom: 12 }}>
          <button 
            onClick={() => deployBot(bot.name)} 
            disabled={botsDeployed.includes(bot.name)}
            style={{ padding: '6px 12px', cursor: botsDeployed.includes(bot.name) ? 'not-allowed' : 'pointer' }}
          >
            {bot.logo} {bot.name} {botsDeployed.includes(bot.name) ? '(Deployed)' : ''}
          </button>
        </div>
      ))}

      {deployResponse && deployResponse.botName === "Adam_D'H7" && (
        <div style={{ marginTop: 30 }}>
          <h3>Adam_D'H7 Details</h3>
          <p>Kòd 8-chif: <b>{deployResponse.code}</b></p>
          <img src={deployResponse.qr} alt="QR Code" />
        </div>
      )}
    </div>
  );
      }
