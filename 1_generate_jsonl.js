const fs = require('fs');
const path = require('path');

// システムプロンプトの設定 （目的に応じて変更してください）
const systemPrompt = "ユーザーから提供される英文を日本語に翻訳してください。\n";

// マークダウンファイル（ユーザープロンプト）が入っているディレクトリ
const markdownDir = './markdown_input_files';

// 出力するjsonlファイル名
const outputJsonlFile = 'batch_input.jsonl';

// マークダウンディレクトリが存在するか確認
if (!fs.existsSync(markdownDir)) {
  console.error(`ディレクトリ ${markdownDir} が見つかりません。`);
  process.exit(1);
}

// ファイルを同期的に読み込む
const files = fs.readdirSync(markdownDir);

// 書き込みストリームを作成
const writeStream = fs.createWriteStream(outputJsonlFile, { flags: 'w' });

// ファイルごとに処理
let requestCount = 1;

files.forEach(file => {
  const ext = path.extname(file);
  if (ext === '.md') {
    const filePath = path.join(markdownDir, file);
    const userPrompt = fs.readFileSync(filePath, 'utf-8');

    // ファイル名から拡張子を除外してcustom_idに使用
    const customId = path.basename(file, ext);

    // リクエストオブジェクトを作成
    const requestObject = {
      custom_id: customId,
      method: "POST",
      url: "/v1/chat/completions",
      body: {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 16000,
        temperature: 0
      }
    };

    // JSON文字列に変換し、一行に書き込む
    const jsonString = JSON.stringify(requestObject);
    writeStream.write(jsonString + '\n');

    console.log(`Processed ${file} as custom_id: ${customId}`);

    requestCount++;
  }
});

writeStream.end(() => {
  console.log('バッチ入力ファイルの作成が完了しました。');
});
