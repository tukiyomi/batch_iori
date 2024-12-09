require('dotenv').config();

const fs = require('fs');
const OpenAI = require('openai');

// OpenAI APIキーの設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

// アップロードするファイル名
const batchFileName = 'batch_input.jsonl';

// バッチファイルのアップロード関数
async function uploadBatchFile() {
  try {
    // ファイルが存在するか確認
    if (!fs.existsSync(batchFileName)) {
      console.error(`ファイル ${batchFileName} が見つかりません。`);
      process.exit(1);
    }

    const fileStream = fs.createReadStream(batchFileName);

    const file = await openai.files.create({
      file: fileStream,
      purpose: 'batch',
    });

    console.log('ファイルのアップロードが完了しました。');
    console.log(`ファイルID: ${file.id}`);
  } catch (error) {
    console.error('ファイルのアップロード中にエラーが発生しました。', error);
  }
}

// メイン関数の実行
uploadBatchFile();
