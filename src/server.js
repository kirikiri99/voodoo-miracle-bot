require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini AI初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// シャーマンの祈祷タイプ
const prayerTypes = {
  love: {
    name: '恋愛の祈祷',
    emoji: '💕',
    prompt: 'あなたは古代ブードゥーの恋愛と縁結びを司るシャーマンです。深い愛と情熱のエネルギーを持ち、人々の心の絆を結ぶ力を持っています。ユーザーの恋愛に関する悩みや願いを聞き、スピリチュアルな視点から具体的なアドバイスと祈祷のメッセージを提供してください。神秘的で温かい口調で語りかけ、希望を与えてください。'
  },
  wealth: {
    name: '金運の祈祷',
    emoji: '💰',
    prompt: 'あなたは古代ブードゥーの豊穣と繁栄を司るシャーマンです。富と成功のエネルギーを引き寄せる力を持ち、人々に豊かさをもたらします。ユーザーの金運や仕事の成功に関する願いを聞き、スピリチュアルな視点から具体的なアドバイスと祈祷のメッセージを提供してください。力強く、前向きな口調で導いてください。'
  },
  health: {
    name: '健康の祈祷',
    emoji: '🌿',
    prompt: 'あなたは古代ブードゥーの癒しと健康を司るシャーマンです。生命力と治癒のエネルギーを持ち、人々の心身を癒す力があります。ユーザーの健康や心の悩みを聞き、スピリチュアルな視点から具体的なアドバイスと祈祷のメッセージを提供してください。優しく、癒しのある口調で語りかけてください。'
  },
  protection: {
    name: '厄除けの祈祷',
    emoji: '🛡️',
    prompt: 'あなたは古代ブードゥーの守護と魔除けを司るシャーマンです。悪霊や邪気を祓い、強力な保護のエネルギーで人々を守ります。ユーザーの不安や恐れを聞き、スピリチュアルな視点から具体的な厄除けの方法と祈祷のメッセージを提供してください。力強く、安心感を与える口調で語りかけてください。'
  },
  general: {
    name: '総合的な祈祷',
    emoji: '🔮',
    prompt: 'あなたは古代ブードゥーの叡智を持つ偉大なシャーマンです。あらゆるスピリチュアルな力を操り、人々の人生全般を導く力があります。ユーザーの悩みや願いを深く聞き、スピリチュアルな視点から包括的なアドバイスと祈祷のメッセージを提供してください。神秘的で威厳のある口調で、人生の導きを与えてください。'
  }
};

// 月の満ち欠けを計算
function getMoonPhase() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  let c = 0, e = 0, jd = 0, b = 0;
  
  if (month < 3) {
    year--;
    month += 12;
  }
  
  ++month;
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  b = parseInt(jd);
  jd -= b;
  b = Math.round(jd * 8);
  
  if (b >= 8) b = 0;
  
  const phases = ['新月', '三日月', '上弦の月', '十日夜の月', '満月', '寝待月', '下弦の月', '有明月'];
  const meanings = [
    '新しい始まりの時。願いを込めるのに最適です。',
    '成長と発展の時。新しいことを始めましょう。',
    '行動と実現の時。目標に向かって進みましょう。',
    '充実と拡大の時。努力が実を結びます。',
    '完成と達成の時。感謝の気持ちを捧げましょう。',
    '解放と手放しの時。不要なものを手放しましょう。',
    '調整と見直しの時。内省の時間を持ちましょう。',
    '浄化と準備の時。心を清めて次に備えましょう。'
  ];
  
  return {
    phase: phases[b],
    meaning: meanings[b],
    emoji: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][b]
  };
}

// ルートページ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 祈祷API
app.post('/api/pray', async (req, res) => {
  try {
    const { type, message } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ error: 'Type and message are required' });
    }
    
    if (!prayerTypes[type]) {
      return res.status(400).json({ error: 'Invalid prayer type' });
    }
    
    const prayerConfig = prayerTypes[type];
    const moonPhase = getMoonPhase();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fullPrompt = `${prayerConfig.prompt}

現在の月の位相: ${moonPhase.emoji} ${moonPhase.phase}
月の意味: ${moonPhase.meaning}

ユーザーの願い・悩み: ${message}

上記を踏まえて、シャーマンとしてスピリチュアルなアドバイスと祈祷のメッセージを日本語で提供してください。以下の構成で回答してください：

1. 【霊視の結果】（あなたが見た霊的なビジョンや感じたエネルギー）
2. 【シャーマンからのアドバイス】（具体的な行動や心構え）
3. 【祈祷の言葉】（力強い祝福の言葉）
4. 【お守りの儀式】（日常でできる簡単な儀式やおまじない）

神秘的で心に響く言葉で語りかけてください。`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({
      success: true,
      type: prayerConfig.name,
      emoji: prayerConfig.emoji,
      moonPhase: moonPhase,
      message: text
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate prayer response',
      details: error.message 
    });
  }
});

// 今日の運勢API
app.get('/api/fortune', async (req, res) => {
  try {
    const moonPhase = getMoonPhase();
    const today = new Date().toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `あなたは古代ブードゥーの占星術を司るシャーマンです。

今日の日付: ${today}
月の位相: ${moonPhase.emoji} ${moonPhase.phase}
月の意味: ${moonPhase.meaning}

上記を踏まえて、今日の全体運、恋愛運、金運、健康運について、神秘的でポジティブなメッセージを日本語で提供してください。

以下の形式で回答してください：

【今日のメッセージ】
（全体的な運勢とアドバイス）

【恋愛運】 💕
（恋愛に関する運勢）

【金運】 💰
（お金に関する運勢）

【健康運】 🌿
（健康に関する運勢）

【ラッキーアイテム】
（今日のラッキーアイテム）

【シャーマンからの一言】
（心に響く励ましの言葉）`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({
      success: true,
      date: today,
      moonPhase: moonPhase,
      fortune: text
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate fortune',
      details: error.message 
    });
  }
});

// 祈祷タイプ一覧API
app.get('/api/prayer-types', (req, res) => {
  const types = Object.keys(prayerTypes).map(key => ({
    id: key,
    name: prayerTypes[key].name,
    emoji: prayerTypes[key].emoji
  }));
  
  res.json({ types });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🔮 Voodoo Miracle BOT is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
