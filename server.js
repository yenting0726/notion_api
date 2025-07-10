require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
console.log('NOTION_TOKEN:', process.env.NOTION_TOKEN ? '有' : '無');
console.log('DATABASE_ID:', process.env.NOTION_DATABASE_ID ? '有' : '無');
app.get('/test', (req, res) => {
  res.send('Server is running');
});
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received:', { name, email, message });
  console.log('Using Notion Token:', NOTION_TOKEN ? 'Yes' : 'No');
  console.log('Using Database ID:', DATABASE_ID);

  try {
    const notionRes = await axios.post('https://api.notion.com/v1/pages', {
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: { content: name }
            }
          ]
        },
       Email: {
    rich_text: [
      {
        text: { content: email }
      }
    ]
  },
        Message: {
          rich_text: [
            {
              text: { content: message }
            }
          ]
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ success: true, data: notionRes.data });
  } catch (err) {
    console.error('Error response data:', err.response?.data);
    console.error('Error message:', err.message);
    res.status(500).json({ success: false, error: 'Failed to submit to Notion' });
  }
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
