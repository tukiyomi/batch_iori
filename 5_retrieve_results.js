require('dotenv').config();

const fs = require('fs');
const OpenAI = require('openai');

// OpenAI APIキーの設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// バッチIDを引数から取得
const batchId = process.argv[2];

if (!batchId) {
  console.error('バッチIDが指定されていません。');
  process.exit(1);
}

// 結果の取得関数
async function retrieveResults() {
  try {
    // バッチ情報を取得
    const batch = await openai.batches.retrieve(batchId);

    if (batch.status !== 'completed') {
      console.log(`バッチはまだ完了していません。現在のステータス: ${batch.status}`);
      return;
    }

    // 出力ファイルIDを取得
    const outputFileId = batch.output_file_id;

    if (!outputFileId) {
      console.log('出力ファイルIDが見つかりませんでした。');
      return;
    }

    // 出力ファイルをダウンロード
    const fileResponse = await openai.files.content(outputFileId);
    const fileContents = await fileResponse.text();

    // JSONLファイルを行ごとに処理
    const lines = fileContents.split('\n').filter(Boolean);

    const outputData = lines.map(line => {
      // 各行をJSONパース
      return JSON.parse(line);
    });

    // 結果をJSONファイルとして保存
    const outputFileName = 'batch_output.json';
    const simplifiedData = outputData.map(data => ({
      custom_id: data.custom_id,
      content: data.response.body.choices[0].message.content
    }));

    fs.writeFileSync(outputFileName, JSON.stringify(simplifiedData, null, 2), 'utf8');
    console.log(`パースされた結果を${outputFileName}に保存しました。`);
  } catch (error) {
    console.error('結果の取得中にエラーが発生しました。', error);
  }
}

// メイン関数の実行
retrieveResults();
