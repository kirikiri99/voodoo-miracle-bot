// アプリケーション状態
let currentType = null;

// DOM要素
const elements = {
    // タブ
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // 祈祷相談
    prayerTypes: document.getElementById('prayerTypes'),
    prayerForm: document.getElementById('prayerForm'),
    responseArea: document.getElementById('responseArea'),
    loading: document.getElementById('loading'),
    
    // ボタン
    typeCards: document.querySelectorAll('.type-card'),
    backBtn: document.getElementById('backBtn'),
    backToFormBtn: document.getElementById('backToFormBtn'),
    submitPrayer: document.getElementById('submitPrayer'),
    getFortune: document.getElementById('getFortune'),
    
    // アクションボタン
    documentBtn: document.getElementById('documentBtn'),
    
    // モーダル
    documentModal: document.getElementById('documentModal'),
    modalClose: document.getElementById('modalClose'),
    documentForm: document.getElementById('documentForm'),
    
    // フォーム要素
    prayerMessage: document.getElementById('prayerMessage'),
    selectedType: document.getElementById('selectedType'),
    
    // レスポンス要素
    responseTitle: document.getElementById('responseTitle'),
    responseMoon: document.getElementById('responseMoon'),
    responseContent: document.getElementById('responseContent'),
    
    // 運勢
    fortuneResult: document.getElementById('fortuneResult'),
    
    // 月の位相とデモ通知
    moonPhase: document.getElementById('moonPhase'),
    demoNotice: document.getElementById('demoNotice')
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initPrayerTypes();
    initButtons();
    loadMoonPhase();
});

// タブ切り替え
function initTabs() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // タブのアクティブ状態を更新
            elements.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // コンテンツの表示切り替え
            elements.tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetTab = document.getElementById(`${tabName}Tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // 運勢タブに切り替えた時に結果をリセット
            if (tabName === 'fortune') {
                elements.fortuneResult.classList.add('hidden');
                elements.fortuneResult.innerHTML = '';
            }
        });
    });
}

// 祈祷タイプの選択
function initPrayerTypes() {
    elements.typeCards.forEach(card => {
        card.addEventListener('click', () => {
            currentType = card.dataset.type;
            const emoji = card.querySelector('.type-emoji').textContent;
            const name = card.querySelector('.type-name').textContent;
            
            elements.selectedType.textContent = `${emoji} ${name}`;
            elements.prayerMessage.value = '';
            
            showSection('form');
        });
    });
}

// ボタンイベント
function initButtons() {
    // 戻るボタン（フォームから）
    elements.backBtn.addEventListener('click', () => {
        showSection('types');
        currentType = null;
    });
    
    // 戻るボタン（レスポンスから）
    elements.backToFormBtn.addEventListener('click', () => {
        showSection('types');
        currentType = null;
    });
    
    // 祈祷送信
    elements.submitPrayer.addEventListener('click', submitPrayer);
    
    // 運勢取得
    elements.getFortune.addEventListener('click', getFortune);
    
    // 資料請求ボタン
    if (elements.documentBtn) {
        elements.documentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
    
    // モーダルを閉じる
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', closeModal);
    }
    
    // モーダル外をクリックして閉じる
    if (elements.documentModal) {
        elements.documentModal.addEventListener('click', (e) => {
            if (e.target === elements.documentModal) {
                closeModal();
            }
        });
    }
    
    // 資料請求フォーム送信
    if (elements.documentForm) {
        elements.documentForm.addEventListener('submit', handleDocumentSubmit);
    }
}

// セクション表示切り替え
function showSection(section) {
    elements.prayerTypes.classList.add('hidden');
    elements.prayerForm.classList.add('hidden');
    elements.responseArea.classList.add('hidden');
    elements.loading.classList.add('hidden');
    
    switch(section) {
        case 'types':
            elements.prayerTypes.classList.remove('hidden');
            break;
        case 'form':
            elements.prayerForm.classList.remove('hidden');
            break;
        case 'response':
            elements.responseArea.classList.remove('hidden');
            break;
        case 'loading':
            elements.loading.classList.remove('hidden');
            break;
    }
}

// 月の位相を読み込み
async function loadMoonPhase() {
    try {
        const response = await fetch('/api/fortune');
        const data = await response.json();
        
        if (data.success && data.moonPhase) {
            const moon = data.moonPhase;
            elements.moonPhase.innerHTML = `
                ${moon.emoji} ${moon.phase}<br>
                <small>${moon.meaning}</small>
            `;
        }
    } catch (error) {
        console.error('月の位相の読み込みエラー:', error);
    }
}

// 祈祷を送信
async function submitPrayer() {
    const message = elements.prayerMessage.value.trim();
    
    if (!message) {
        alert('願いや悩みを入力してください。');
        return;
    }
    
    if (!currentType) {
        alert('祈祷の種類を選択してください。');
        return;
    }
    
    showSection('loading');
    
    try {
        const response = await fetch('/api/pray', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: currentType,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayPrayerResponse(data);
        } else {
            throw new Error(data.error || '祈祷の処理に失敗しました。');
        }
    } catch (error) {
        console.error('エラー:', error);
        alert('エラーが発生しました: ' + error.message);
        showSection('form');
    }
}

// 祈祷レスポンスを表示
function displayPrayerResponse(data) {
    elements.responseTitle.textContent = `${data.emoji} ${data.type}`;
    
    if (data.moonPhase) {
        const moon = data.moonPhase;
        elements.responseMoon.innerHTML = `
            ${moon.emoji} ${moon.phase} - ${moon.meaning}
        `;
    }
    
    elements.responseContent.textContent = data.message;
    
    // デモモードの通知を表示
    if (data.demoMode && elements.demoNotice) {
        elements.demoNotice.classList.remove('hidden');
    }
    
    showSection('response');
    
    // スムーズにスクロール
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 今日の運勢を取得
async function getFortune() {
    elements.getFortune.disabled = true;
    elements.getFortune.innerHTML = '<span class="btn-text">読み込み中...</span>';
    
    try {
        const response = await fetch('/api/fortune');
        const data = await response.json();
        
        if (data.success) {
            displayFortune(data);
        } else {
            throw new Error(data.error || '運勢の取得に失敗しました。');
        }
    } catch (error) {
        console.error('エラー:', error);
        alert('エラーが発生しました: ' + error.message);
    } finally {
        elements.getFortune.disabled = false;
        elements.getFortune.innerHTML = '<span class="btn-text">今日の運勢を見る</span><span class="btn-icon">✨</span>';
    }
}

// 運勢を表示
function displayFortune(data) {
    const moon = data.moonPhase;
    
    elements.fortuneResult.innerHTML = `
        <div class="response-header">
            <h3>📅 ${data.date}</h3>
            <div class="moon-info">
                ${moon.emoji} ${moon.phase} - ${moon.meaning}
            </div>
        </div>
        <div class="response-content">${data.fortune}</div>
    `;
    
    // デモモードの通知を表示
    if (data.demoMode && elements.demoNotice) {
        elements.demoNotice.classList.remove('hidden');
    }
    
    elements.fortuneResult.classList.remove('hidden');
    
    // スムーズにスクロール
    elements.fortuneResult.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
    });
}

// モーダルを開く
function openModal() {
    if (elements.documentModal) {
        elements.documentModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// モーダルを閉じる
function closeModal() {
    if (elements.documentModal) {
        elements.documentModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // フォームをリセット
        if (elements.documentForm) {
            elements.documentForm.reset();
        }
    }
}

// 資料請求フォーム送信
async function handleDocumentSubmit(e) {
    e.preventDefault();
    
    const submitBtn = elements.documentForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // ボタンを無効化
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">送信中...</span>';
    
    try {
        const formData = {
            name: elements.documentForm.name.value,
            email: elements.documentForm.email.value,
            phone: elements.documentForm.phone.value,
            message: elements.documentForm.message.value
        };
        
        // ここでは実際の送信処理をシミュレート
        // 実際の実装では、バックエンドAPIに送信します
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 成功メッセージ
        alert('資料請求を受け付けました。ご登録いただいたメールアドレスに資料をお送りします。');
        
        // モーダルを閉じる
        closeModal();
        
    } catch (error) {
        console.error('送信エラー:', error);
        alert('送信に失敗しました。もう一度お試しください。');
    } finally {
        // ボタンを元に戻す
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('グローバルエラー:', event.error);
});

// ページ離脱時の確認（フォーム入力中の場合）
window.addEventListener('beforeunload', (event) => {
    if (elements.prayerMessage.value.trim() && !elements.responseArea.classList.contains('hidden')) {
        event.preventDefault();
        event.returnValue = '';
    }
});
