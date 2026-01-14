import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API 엔드포인트
app.post('/api/generate', async (req, res) => {
  try {
    const { word } = req.body;

    if (!word || word.length !== 3) {
      return res.status(400).json({ error: '3글자를 입력해주세요.' });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 20000,
      temperature: 1,
      system: '당신은 삼행시 작가입니다.\\n사용자가 입력한 3글자로 삼행시를 작성하세요.\\n\\n규칙:\\n1. 각 글자로 시작하는 문장을 작성합니다\\n2. 긍정적이고 유머러스한 톤을 유지합니다\\n3. 각 줄은 자연스럽게 이어져야 합니다\\n\\n출력 형식 (반드시 이 형식만 출력):\\n[첫번째글자]: [문장]\\n[두번째글자]: [문장]\\n[세번째글자]: [문장]\\n\\n주의: 삼행시 3줄만 출력하세요. 인사말, 설명, 부연설명 등 다른 텍스트는 절대 포함하지 마세요.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${word}\n`
            }
          ]
        }
      ]
    });

    const result = message.content[0].text;
    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: '삼행시 생성 중 오류가 발생했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 삼행시 생성기 서버가 실행되었습니다!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`========================================\n`);
});
