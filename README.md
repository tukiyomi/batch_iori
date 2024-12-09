# OpenAI Batch Results to Markdown

このリポジトリは、OpenAIのBatches機能を使い、jsonlファイルをアップロードした結果を取得してMarkdownファイルとして出力するまでの手順とツールをまとめたものです。
この手法では、すべてをコードで完結するのではなく、コードでの実行と、ウェブ上での実行を組み合わせています。

## 概要

1. `markdown_input_files` ディレクトリに、バッチ処理したいユーザープロンプトを記載したマークダウンファイルを保存します。
2. `1_generate_jsonl.js` を用いて、1 のマークダウンファイルから、OpenAI Batchesにアップロードするための jsonl ファイルを作成します。
3. OpenAI Dashboard の Batchesページで `+ Create` ボタンから上記で生成した jsonl ファイルをアップロードし、処理完了を待ちます。
4. バッチ処理が完了後、`8_5+7.js` を実行すると、`5_retrieve_results.js` および `7_create_markdown.js` が自動的に実行され、最終的に `markdown_output_files` ディレクトリ内に個別のMarkdownファイルが生成されます。

## 前提条件

- Node.js (推奨: 最新LTS)
- npmまたはyarnでの依存関係インストール環境
- [OpenAI APIキー](https://platform.openai.com/)
  - `.env` ファイルに `OPENAI_API_KEY` を設定してください。
    ```bash
    OPENAI_API_KEY=sk-xxxxxxxxxxxx...
    ```

## セットアップ

1. リポジトリをクローンします:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. 依存関係をインストールします:

   ```bash
   npm install
   ```

   または

   ```bash
   yarn install
   ```

3. `.env`ファイルをプロジェクト直下に作成し、`OPENAI_API_KEY`を設定します。

   ```bash
   OPENAI_API_KEY=sk-xxxxxxxxxxxx...
   ```

## 手順詳細

### 1. jsonlファイルの作成

`1_generate_jsonl.js` は、入力が `markdown_input_files` ディレクトリの下にあるマークダウンファイルです。出力が `batch_input.jsonl` となります。

このスクリプト内ではシステムプロンプトがハードコーディングされています。必要に応じてコードを編集し、プロンプトをカスタマイズしてください。\
実行例:

```bash
node 1_generate_jsonl.js
```

これにより、`batch_input.jsonl` ファイルが生成されます。

### 2. OpenAI Batches へのアップロードと実行

1. [OpenAI Dashboard](https://platform.openai.com/) にアクセスし、左ナビゲーションの「Batches」を選択します。
2. 「+Create」ボタンをクリックし、先ほど生成した jsonl ファイルをアップロードします。
3. バッチ処理が開始され、`pending` → `running` → `completed` の順にステータスが変化します。完了するまで待ちます。

### 3. 結果の取得とMarkdownファイルの生成

バッチ処理が完了したら、そのバッチのID（`batchId`）を確認します。その後、`8_5+7.js` を実行すると、コンソール上でバッチIDの入力を求められます。

`8_5+7.js` は、`5_retrieve_results.js` と `7_create_markdown.js` を対話式に実行するスクリプトです。

```bash
node 8_5+7.js
```

- スクリプトの流れ
  1. `5_retrieve_results.js` を自動実行し、指定したバッチIDから結果を取得します。
  2. 結果は `batch_output.json` として保存されます。
  3. 続いて「マークダウンファイルの生成を続けますか？」と確認が入ります。`y` を入力（またはデフォルトでエンター）すれば、そのまま `7_create_markdown.js` を自動実行します。
  4. `7_create_markdown.js` は `batch_output.json` をもとに `markdown_output_files` ディレクトリにカスタムIDごとに markdown ファイルを生成します。

### 出力結果

`markdown_output_files` ディレクトリ下に、`custom_id` の値をファイル名とした `.md` ファイルが複数作成されます。これが最終的な結果となります。

## トラブルシューティング

- `batchId` を指定していない、または間違っている場合:\
  `5_retrieve_results.js` 実行時にエラーが表示されます。BatchesページでバッチIDを再確認してください。

- APIキーが間違っている場合、`OPENAI_API_KEY` が設定されていない場合:\
  OpenAI API呼び出し時に認証エラーが発生します。`.env`ファイルとOpenAIの管理画面でAPIキーを再度チェックしてください。

## ライセンス

本リポジトリはMITライセンスで提供されます。

