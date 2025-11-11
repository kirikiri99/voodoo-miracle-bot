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

// Gemini AI初期化（APIキーがある場合のみ）
const DEMO_MODE = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'test_key_placeholder';
let genAI = null;

if (!DEMO_MODE) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

console.log(`🔮 モード: ${DEMO_MODE ? 'デモモード（Gemini API不使用）' : 'Gemini API連携モード'}`);

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

// デモモード用の祈祷レスポンス生成
function generateDemoPrayerResponse(type, message, moonPhase) {
  const responses = {
    love: `【霊視の結果】
あなたの心の中に、美しいピンク色のオーラが輝いています。愛を求める純粋な気持ちが、宇宙に届いています。今、${moonPhase.phase}の時期は、愛のエネルギーが特に強まる時です。

【シャーマンからのアドバイス】
心を開いて、周囲の人々との繋がりを大切にしてください。笑顔と思いやりの心が、あなたの魅力を何倍にも輝かせます。今週は特に、友人との集まりや新しい場所を訪れることで、運命的な出会いの可能性が高まります。

【祈祷の言葉】
愛の女神よ、この者に祝福を！
赤い糸が導く運命の相手との出会いを！
心に愛の炎を灯し、幸せな未来へと導きたまえ！
エネルギーは満ち、道は開かれた。アーシェー！

【お守りの儀式】
毎朝、鏡の前で自分に笑顔を向け「私は愛される存在です」と3回唱えてください。また、ローズクォーツの石を身につけるか、ピンク色のものを身近に置くと、愛のエネルギーが高まります。`,
    
    wealth: `【霊視の結果】
あなたの周りに金色の光の粒子が集まり始めています。豊かさへの道が、今まさに開かれようとしています。${moonPhase.phase}のエネルギーが、あなたの金運を後押ししています。

【シャーマンからのアドバイス】
今は行動の時です。躊躇せず、新しいチャンスに飛び込んでください。ただし、焦りは禁物。しっかりと計画を立て、周囲の人々との協力関係を大切にすることで、成功への道が開けます。感謝の気持ちを忘れずに。

【祈祷の言葉】
豊穣の神よ、この者に栄光を！
金運の流れが滞りなく、富と繁栄をもたらさん！
努力が実を結び、成功の扉が開かれん！
宇宙の豊かさよ、この者のもとへ！アーシェー！

【お守りの儀式】
財布の中に、金色の折り紙で折った小さな星を入れておきましょう。毎日、「豊かさに感謝します」と心の中で唱えながら、財布を開くことで、金運のエネルギーが活性化します。`,
    
    health: `【霊視の結果】
あなたの生命エネルギーは、緑色の癒しの光に包まれています。心身のバランスを取り戻す時期が来ています。${moonPhase.phase}の力が、あなたの自然治癒力を高めています。

【シャーマンからのアドバイス】
まずは、十分な休息と睡眠を取ることを最優先にしてください。自然と触れ合う時間を持ち、深呼吸を意識しましょう。無理をせず、自分の体の声に耳を傾けることが大切です。心の健康も忘れずに。

【祈祷の言葉】
癒しの精霊よ、この者に安らぎを！
心身に活力が満ち、健康が保たれん！
痛みや苦しみは去り、生命の輝きが戻らん！
大地の力よ、この者を癒したまえ！アーシェー！

【お守りの儀式】
毎晩寝る前に、手のひらを温めてから、体の気になる部分に当ててください。「私は健康で元気です」と心の中で唱えながら、深呼吸を5回行いましょう。緑茶やハーブティーもおすすめです。`,
    
    protection: `【霊視の結果】
あなたの周りに、青白い保護の光が見えます。しかし、いくつかの負のエネルギーが近づこうとしています。${moonPhase.phase}の力を借りて、今こそ強力な防御の壁を築く時です。

【シャーマンからのアドバイス】
ネガティブな人や場所から距離を置き、自分自身の心の平和を守りましょう。直感を信じ、違和感を感じたら無理に近づかないこと。塩風呂に入ったり、部屋の掃除をして清潔に保つことで、邪気を払えます。

【祈祷の言葉】
守護の戦士よ、この者を守りたまえ！
邪気と悪霊は退散し、光の盾が身を守らん！
負のエネルギーは跳ね返され、平和が訪れん！
強力なる守護よ、永遠にこの者と共に！アーシェー！

【お守りの儀式】
玄関に粗塩を小皿に入れて置き、週に一度交換しましょう。また、外から帰ったら手を洗いながら「悪いものは流れていく」と唱えてください。白い服やクリスタルも保護の力を高めます。`,
    
    general: `【霊視の結果】
あなたの魂は、虹色の光に包まれ、新たな段階へと進もうとしています。人生の転機が近づいており、${moonPhase.phase}がその変化を後押ししています。運命の歯車が動き始めました。

【シャーマンからのアドバイス】
今は内省と行動のバランスを取る時です。自分の心の声に耳を傾け、本当に望むものは何かを見極めましょう。恐れを手放し、新しい一歩を踏み出す勇気を持ってください。宇宙はあなたを応援しています。

【祈祷の言葉】
偉大なる宇宙の力よ、この者を導きたまえ！
すべての扉が開かれ、道が照らされん！
試練は祝福に変わり、夢は現実となる！
運命の流れよ、この者に幸運を！アーシェー！

【お守りの儀式】
毎朝、太陽に向かって深呼吸を3回行い、「今日も素晴らしい一日になります」と宣言しましょう。また、就寝前に今日の良かったことを3つ思い出し、感謝の気持ちを捧げてください。これが幸運を引き寄せます。`
  };

  return responses[type] || responses.general;
}

// デモモード用の運勢レスポンス生成
function generateDemoFortuneResponse(moonPhase) {
  return `【今日のメッセージ】
${moonPhase.phase}のエネルギーが満ちる今日は、特別な一日となるでしょう。心を開いて、宇宙からのメッセージを受け取ってください。新しいチャンスが訪れる予感がします。直感を信じて行動しましょう。

【恋愛運】 💕
★★★★☆（4/5）
今日は恋愛運が高まっています！思いがけない出会いや、気になる人からの連絡があるかもしれません。笑顔を忘れずに、オープンな心で人と接することで、素敵な展開が期待できます。既にパートナーがいる方は、感謝の気持ちを伝える良い日です。

【金運】 💰
★★★☆☆（3/5）
金運は安定しています。大きな出費は避け、計画的にお金を使いましょう。ただし、自己投資や学びにお金を使うのは吉。思いがけない臨時収入の可能性も。感謝の気持ちを持ってお金を扱うことで、豊かさのエネルギーが循環します。

【健康運】 🌿
★★★★★（5/5）
体調は絶好調！エネルギーに満ち溢れている日です。運動やストレッチなど、体を動かすことで更に運気がアップします。ただし、調子が良いからといって無理は禁物。十分な水分補給と、栄養バランスの取れた食事を心がけましょう。

【ラッキーアイテム】
✨ 紫色のもの
🌸 花や植物
💎 クリスタルやパワーストーン
🕯️ キャンドルの炎

【シャーマンからの一言】
「今日という日は、宇宙からの贈り物。感謝の心を持ち、一瞬一瞬を大切に過ごしなさい。あなたの周りには、見えない守護の力が常に働いています。恐れることなく、自分の道を進みなさい。祝福と共にあれ。」

🕯️ 古代ブードゥーの叡智があなたを守護しています 🕯️`;
}

// 月の満ち欠けを計算
function getMoonPhase() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
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
    
    let text;
    
    // デモモードの場合は、事前定義されたレスポンスを使用
    if (DEMO_MODE) {
      console.log('📝 デモモードで祈祷レスポンスを生成中...');
      text = generateDemoPrayerResponse(type, message, moonPhase);
    } else {
      // Gemini APIを使用
      console.log('🤖 Gemini APIで祈祷レスポンスを生成中...');
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
      text = response.text();
    }
    
    res.json({
      success: true,
      type: prayerConfig.name,
      emoji: prayerConfig.emoji,
      moonPhase: moonPhase,
      message: text,
      demoMode: DEMO_MODE
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
    
    let text;
    
    // デモモードの場合は、事前定義されたレスポンスを使用
    if (DEMO_MODE) {
      console.log('📝 デモモードで運勢レスポンスを生成中...');
      text = generateDemoFortuneResponse(moonPhase);
    } else {
      // Gemini APIを使用
      console.log('🤖 Gemini APIで運勢レスポンスを生成中...');
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
      text = response.text();
    }
    
    res.json({
      success: true,
      date: today,
      moonPhase: moonPhase,
      fortune: text,
      demoMode: DEMO_MODE
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
