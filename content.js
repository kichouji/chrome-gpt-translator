// 設定値
let MAX_SELECTION_LENGTH = 500; // デフォルト値
const MODEL_NAME = 'gpt-4.1-nano';

// 設定を読み込む
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['maxSelectionLength']);
    if (result.maxSelectionLength) {
      MAX_SELECTION_LENGTH = result.maxSelectionLength;
    }
  } catch (error) {
    console.error('設定の読み込みエラー:', error);
  }
}

// 英語を含むかどうかを判定する正規表現
const ENGLISH_REGEX = /[a-zA-Z]/;

// 翻訳結果表示用のポップアップ要素
let translationPopup = null;
let isDragging = false;

// ポップアップを作成する関数
function createTranslationPopup() {
  const popup = document.createElement('div');
  popup.id = 'llm-translation-popup';
  popup.className = 'llm-translation-popup';
  popup.style.display = 'none';
  document.body.appendChild(popup);
  return popup;
}

// ポップアップを表示する関数
function showTranslation(text, x, y) {
  if (!translationPopup) {
    translationPopup = createTranslationPopup();
  }
  
  translationPopup.textContent = text;
  translationPopup.style.left = x + 'px';
  translationPopup.style.top = y + 'px';
  translationPopup.style.display = 'block';
  
  // 10秒後に自動で非表示にする（翻訳結果は少し長めに表示）
  setTimeout(() => {
    if (translationPopup) {
      translationPopup.style.display = 'none';
    }
  }, 10000);
}

// OpenAI APIを呼び出して翻訳する関数
async function translateWithOpenAI(text) {
  try {
    // ストレージからAPIキーを取得
    const result = await chrome.storage.sync.get(['openaiApiKey']);
    const apiKey = result.openaiApiKey;
    
    if (!apiKey) {
      return 'APIキーが設定されていません。拡張機能の設定ページで設定してください。';
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: '以下の英語テキストを自然な日本語に翻訳してください。翻訳結果のみを出力し、説明文や前置きは一切含めないでください。'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return `API呼び出しエラー: ${response.status} ${response.statusText}`;
    }
    
    const data = await response.json();
    const translation = data.choices[0]?.message?.content?.trim();
    
    if (!translation) {
      return '翻訳結果を取得できませんでした。';
    }
    
    return translation;
    
  } catch (error) {
    console.error('Translation error:', error);
    return `翻訳エラー: ${error.message}`;
  }
}

// ポップアップを非表示にする関数
function hideTranslation() {
  if (translationPopup) {
    translationPopup.style.display = 'none';
  }
}

// テキスト選択が有効かどうかを判定する関数
function isValidSelection(selectedText) {
  // 空文字列の場合は無効
  if (!selectedText || selectedText.trim().length === 0) {
    return false;
  }
  
  // 最大文字数を超えている場合は無効
  if (selectedText.length > MAX_SELECTION_LENGTH) {
    return false;
  }
  
  // 英語が含まれていない場合は無効
  if (!ENGLISH_REGEX.test(selectedText)) {
    return false;
  }
  
  return true;
}

// マウスダウンイベント（ドラッグ開始を検出）
document.addEventListener('mousedown', (event) => {
  isDragging = true;
  hideTranslation();
});

// マウスアップイベント（ドラッグ終了を検出）
document.addEventListener('mouseup', async (event) => {
  // ドラッグ中でない場合は処理しない（クリックの場合）
  if (!isDragging) {
    return;
  }
  
  isDragging = false;
  
  // 少し遅延を入れて、選択状態が確定してから処理する
  setTimeout(async () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    // 有効な選択かどうかを判定
    if (!isValidSelection(selectedText)) {
      return;
    }
    
    // マウスカーソルの位置を取得
    const x = event.clientX + window.scrollX;
    const y = event.clientY + window.scrollY;
    
    // ローディング表示
    showTranslation('翻訳中...', x + 10, y + 10);
    
    // OpenAI APIで翻訳
    const translation = await translateWithOpenAI(selectedText);
    
    // 翻訳結果を表示
    showTranslation(translation, x + 10, y + 10);
  }, 100);
});

// マウス移動イベント（ドラッグ中は処理しない）
document.addEventListener('mousemove', (event) => {
  // ドラッグ中の場合は何もしない
  if (isDragging) {
    return;
  }
});

// クリックイベント（ポップアップを非表示にする）
document.addEventListener('click', (event) => {
  // ポップアップ自体をクリックした場合は非表示にしない
  if (event.target && event.target.id === 'llm-translation-popup') {
    return;
  }
  
  hideTranslation();
});

// 選択解除時にポップアップを非表示にする
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection.toString().length === 0) {
    hideTranslation();
  }
});

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
  console.log('LLM翻訳ツールが読み込まれました');
  loadSettings(); // 設定を読み込み
});