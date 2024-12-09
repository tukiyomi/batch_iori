require('dotenv').config();

const OpenAI = require('openai');

// OpenAI APIキーの設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

// アップロード済みのファイルIDを指定
const inputFileId = ''; // 実際のファイルIDに置き換えてください

// バッチの作成関数
async function createBatch() {
  try {
    const batch = await openai.batches.create({
      input_file_id: inputFileId,
      endpoint: '/v1/chat/completions', // 使用するエンドポイントを指定
      completion_window: '24h', // 現在は '24h' のみサポート
      // 必要に応じてメタデータを追加
      // metadata: {
      //   "customer_id": "user_123456789",
      //   "batch_description": "My first batch job",
      // },
    });

    console.log('バッチの作成が完了しました。');
    console.log(`バッチID: ${batch.id}`);
  } catch (error) {
    console.error('バッチの作成中にエラーが発生しました。', error);
  }
}

// メイン関数の実行
createBatch();
