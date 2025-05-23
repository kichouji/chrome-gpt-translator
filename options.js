// DOM要素の取得
const apiKeyInput = document.getElementById('apiKey');
const maxLengthInput = document.getElementById('maxLength');
const modelNameInput = document.getElementById('modelName');
const saveBtn = document.getElementById('saveBtn');
const testBtn = document.getElementById('testBtn');
const statusDiv = document.getElementById('status');

// ステータス表示関数
function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${isError ? 'error' : 'success'}`;
  statusDiv.style.display = 'block';
  
  // 3秒後に非表示
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// 設定を読み込む
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['openaiApiKey', 'maxSelectionLength', 'modelName']);
    
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
    
    if (result.maxSelectionLength) {
      maxLengthInput.value = result.maxSelectionLength;
    }
    
    if (result.modelName) {
      modelNameInput.value = result.modelName;
    }
  } catch (error) {
    console.error('設定の読み込みエラー:', error);
  }
}

// 設定を保存する
async function saveSettings() {
  const apiKey = apiKeyInput.value.trim();
  const maxLength = parseInt(maxLengthInput.value);
  const modelName = modelNameInput.value.trim();
  
  if (!apiKey) {
    showStatus('APIキーを入力してください', true);
    return;
  }
  
  if (!apiKey.startsWith('sk-')) {
    showStatus('有効なOpenAI APIキーを入力してください', true);
    return;
  }
  
  if (maxLength < 1 || maxLength > 2000) {
    showStatus('最大文字数は1-2000の範囲で設定してください', true);
    return;
  }
  
  if (!modelName) {
    showStatus('モデル名を入力してください', true);
    return;
  }
  
  try {
    await chrome.storage.sync.set({
      openaiApiKey: apiKey,
      maxSelectionLength: maxLength,
      modelName: modelName
    });
    
    showStatus('設定を保存しました');
  } catch (error) {
    console.error('設定の保存エラー:', error);
    showStatus('設定の保存に失敗しました', true);
  }
}

// API接続テスト
async function testConnection() {
  const apiKey = apiKeyInput.value.trim();
  const modelName = modelNameInput.value.trim();
  
  if (!apiKey) {
    showStatus('APIキーを入力してください', true);
    return;
  }
  
  if (!modelName) {
    showStatus('モデル名を入力してください', true);
    return;
  }
  
  testBtn.disabled = true;
  testBtn.textContent = 'テスト中...';
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ],
        max_tokens: 10
      })
    });
    
    if (response.ok) {
      showStatus(`✅ API接続に成功しました (${modelName})`);
    } else {
      const errorData = await response.json();
      showStatus(`❌ API接続に失敗しました: ${errorData.error?.message || response.statusText}`, true);
    }
  } catch (error) {
    showStatus(`❌ 接続エラー: ${error.message}`, true);
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = '接続テスト';
  }
}

// イベントリスナー
saveBtn.addEventListener('click', saveSettings);
testBtn.addEventListener('click', testConnection);

// APIキー入力時にマスク表示
apiKeyInput.addEventListener('input', () => {
  if (apiKeyInput.type === 'password' && apiKeyInput.value.length > 0) {
    // フォーカス時のみ内容を表示
    apiKeyInput.addEventListener('focus', () => {
      apiKeyInput.type = 'text';
    });
    
    apiKeyInput.addEventListener('blur', () => {
      apiKeyInput.type = 'password';
    });
  }
});

// ページ読み込み時に設定を復元
document.addEventListener('DOMContentLoaded', loadSettings);