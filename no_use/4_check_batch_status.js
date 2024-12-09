// DASHBOARDのBatches でも確認できるので、そちらで見るのが早い。

require('dotenv').config();

const OpenAI = require('openai');

// OpenAI APIキーの設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// バッチIDを指定
const batchId = ''; // 実際のバッチIDに置き換えてください

// バッチのステータス確認関数
async function checkBatchStatus() {
  try {
    const batch = await openai.batches.retrieve(batchId);

    console.log('バッチのステータスを取得しました。');
    console.log(`バッチID: ${batch.id}`);
    console.log(`ステータス: ${batch.status}`);
    console.log(`完了したリクエスト数: ${batch.request_counts.completed}/${batch.request_counts.total}`);
    // その他の情報を必要に応じて表示
    // console.log(`作成日時: ${new Date(batch.created_at * 1000).toLocaleString()}`);
    // console.log(`完了日時: ${batch.completed_at ? new Date(batch.completed_at * 1000).toLocaleString() : '未完了'}`);
  } catch (error) {
    console.error('バッチのステータス取得中にエラーが発生しました。', error);
  }
}

// メイン関数の実行
checkBatchStatus();
