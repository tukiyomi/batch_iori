const fs = require('fs');
const path = require('path');

function createMarkdownFiles(jsonFile) {
    // 出力ディレクトリを作成
    const outputDir = 'markdown_output_files';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    // JSONファイルを読み込む
    const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    
    // 各エントリーに対してマークダウンファイルを作成
    data.forEach(entry => {
        // ファイルパスを出力ディレクトリと結合
        const filename = path.join(outputDir, `${entry.custom_id}.md`);
        
        // マークダウンファイルに内容を書き込む
        fs.writeFileSync(filename, entry.content, 'utf8');
        
        console.log(`作成されたファイル: ${filename}`);
    });
}

// 使用例
createMarkdownFiles('batch_output.json');