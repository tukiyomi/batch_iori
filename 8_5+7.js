const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { input, confirm } = require('@inquirer/prompts');

async function runScripts() {
  try {
    const batchId = await input({
      message: 'バッチIDを入力してください:',
      validate: input => {
        if (!input.trim()) {
          return 'バッチIDは必須です';
        }
        return true;
      }
    });

    console.log('5_retrieve_results.js を実行中...');
    
    // バッチIDを使用して実行
    const { stdout: result5 } = await execPromise(`node 5_retrieve_results.js ${batchId}`);
    console.log(result5);

    const shouldContinue = await confirm({ 
      message: 'マークダウンファイルの生成を続けますか？',
      default: true 
    });

    if (shouldContinue) {
      console.log('7_create_markdown.js を実行中...');
      
      const { stdout: result7 } = await execPromise('node 7_create_markdown.js');
      console.log(result7);
      
      console.log('すべての処理が完了しました。');
    } else {
      console.log('処理を中断しました。');
    }

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// スクリプトの実行
runScripts(); 