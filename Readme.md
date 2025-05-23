# Chrome GPT Translator

選択したテキストをOpenAI GPTで瞬時に翻訳するChrome拡張機能です。

![Chrome GPT Translator](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 特徴

- 🖱️ **ドラッグ選択で翻訳** - 英語テキストをマウスで選択するだけで翻訳
- ⚡ **瞬時に表示** - ドラッグ終了と同時に翻訳結果をポップアップ表示
- 🤖 **GPTモデル使用** - OpenAIの最新GPTモデルで高品質な翻訳
- ⚙️ **カスタマイズ可能** - モデル名、最大文字数を自由に設定
- 📝 **シンプル設計** - 余計な説明文なし、翻訳結果のみを表示

## 動作条件

- **クリックのみ**: 処理しない
- **ドラッグ中**: 処理しない  
- **ドラッグ終了時**: 翻訳実行
- **英語なし**: 処理しない
- **文字数超過**: 処理しない

## インストール

### 1. ファイルのダウンロード
```bash
git clone https://github.com/yourusername/chrome-gpt-translator.git
cd chrome-gpt-translator
```

### 2. Chrome拡張機能として読み込み
1. Chromeで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をON
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. ダウンロードしたフォルダを選択

## 設定

### 1. APIキーの設定
1. 拡張機能の「詳細」→「拡張機能のオプション」をクリック
2. [OpenAI API Keys](https://platform.openai.com/api-keys)でAPIキーを取得
3. APIキーを入力して「設定を保存」

### 2. 詳細設定（オプション）
- **使用モデル**: デフォルトは `gpt-4.1-nano`（自由に変更可能）
- **最大文字数**: デフォルトは500文字（1-2000文字で設定可能）

### 3. 接続テスト
「接続テスト」ボタンでAPI接続を確認してください。

## 使用方法

1. 任意のWebページで英語テキストをマウスでドラッグ選択
2. ドラッグを終了すると翻訳結果がポップアップ表示
3. 翻訳結果は10秒後に自動消去（クリックで手動消去も可能）

## 対応モデル

以下のOpenAI GPTモデルに対応しています：

- `gpt-4o-mini` - 高速・低コスト
- `gpt-4o` - 最新・高性能  
- `gpt-4.1-nano` - 推奨デフォルト
- `gpt-4-turbo` - バランス型
- `gpt-4` - 標準
- `gpt-3.5-turbo` - 高速・格安

※ 新しいモデルも設定画面で自由に指定できます

## ファイル構成

```
chrome-gpt-translator/
├── manifest.json          # 拡張機能設定
├── content.js            # メイン処理
├── style.css             # ポップアップスタイル
├── options.html          # 設定画面
├── options.js            # 設定画面処理
└── README.md
```

## 技術仕様

- **Manifest Version**: 3
- **権限**: activeTab, storage
- **API**: OpenAI Chat Completions
- **対象サイト**: 全てのWebサイト
- **ブラウザ**: Chrome（Manifest V3対応）

## 開発

### ローカル開発
1. ファイルを編集
2. `chrome://extensions/` で拡張機能を再読み込み
3. テスト実行

### カスタマイズ例
- `content.js`の`MAX_SELECTION_LENGTH`でデフォルト文字数変更
- `content.js`の`ENGLISH_REGEX`で判定条件変更
- `style.css`でポップアップデザイン変更

## よくある質問

**Q: 翻訳されない**  
A: 以下を確認してください
- APIキーが正しく設定されているか
- 選択テキストに英語が含まれているか
- 最大文字数を超えていないか
- ドラッグ（クリックではなく）で選択しているか

**Q: 料金について**  
A: OpenAI APIの従量課金制です。使用量に応じて料金が発生します。

**Q: 他の言語への翻訳**  
A: 現在は英語→日本語のみ対応。他言語は`content.js`のプロンプト修正で対応可能。

## ライセンス

MIT License

## 作者

[@yourusername](https://github.com/yourusername)