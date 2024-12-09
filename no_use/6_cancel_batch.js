require('dotenv').config();

const OpenAI = require('openai');

// OpenAI APIキーの設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// バッチIDを指定
const batchId = 'batch-xyz123'; // 実際のバッチIDに置き換えてください

// バッチのキャンセル関数
async function cancelBatch() {
  try {
    const batch = await openai.batches.cancel(batchId);

    console.log('バッチのキャンセルをリクエストしました。');
    console.log(`バッチID: ${batch.id}`);
    console.log(`現在のステータス: ${batch.status}`);
  } catch (error) {
    console.error('バッチのキャンセル中にエラーが発生しました。', error);
  }
}

// メイン関数の実行
cancelBatch();
