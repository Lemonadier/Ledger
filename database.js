/**
 * database.js
 * Manages all data in Local Storage.
 * Changes are now persistent.
 */

const initialData = {
    wallets: [
        { "id": "w1", "name": "เงินสด", "initialBalance": 0, "createdAt": "2025-06-23T10:00:00.000Z" },
        { "id": "w2", "name": "บัญชีธนาคาร", "initialBalance": 0, "createdAt": "2025-06-23T10:01:00.000Z" }
    ],
    transactions: [
        { "id": "t1", "walletId": "w1", "type": "expense", "description": "ซื้อกาแฟ", "amount": 70, "createdAt": "2025-06-23T11:00:00.000Z" },
        { "id": "t2", "walletId": "w2", "type": "income", "description": "เงินเดือน", "amount": 25000, "createdAt": "2025-06-23T12:00:00.000Z" }
    ]
};

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    const defaultData = initialData[key.replace('ledger-', '')] || [];
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getWallets() { return getFromStorage('ledger-wallets'); }
export function getTransactions() { return getFromStorage('ledger-transactions'); }

export function addWallet(name) {
    const wallets = getWallets();
    const newWallet = {
        id: `w${Date.now()}`, name: name, initialBalance: 0,
        createdAt: new Date().toISOString()
    };
    wallets.push(newWallet);
    saveToStorage('ledger-wallets', wallets);
}

export function addTransaction(walletId, description, amount, type) {
    const transactions = getTransactions();
    const newTransaction = {
        id: `t${Date.now()}`, walletId: walletId, description: description,
        amount: Number(amount), type: type,
        createdAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    saveToStorage('ledger-transactions', transactions);
}

export function deleteTransaction(transactionId) {
    let transactions = getTransactions();
    transactions = transactions.filter(t => t.id !== transactionId);
    saveToStorage('ledger-transactions', transactions);
}

export function transferFunds(fromWalletId, toWalletId, amount) {
    const wallets = getWallets();
    const transactions = getTransactions();
    const fromWalletName = wallets.find(w => w.id === fromWalletId)?.name;
    const toWalletName = wallets.find(w => w.id === toWalletId)?.name;
    const transferAmount = Number(amount);
    const now = new Date().toISOString();
    
    transactions.push({
        id: `t${Date.now()}-exp`, walletId: fromWalletId,
        description: `ย้ายเงินไปที่ -> ${toWalletName}`,
        amount: transferAmount, type: 'expense', isTransfer: true, createdAt: now
    });
    transactions.push({
        id: `t${Date.now()}-inc`, walletId: toWalletId,
        description: `รับเงินย้ายจาก <- ${fromWalletName}`,
        amount: transferAmount, type: 'income', isTransfer: true, createdAt: now
    });
    saveToStorage('ledger-transactions', transactions);
}

export function updateWallet(walletId, updates) {
    let wallets = getWallets();
    const walletIndex = wallets.findIndex(w => w.id === walletId);
    if (walletIndex > -1) {
        wallets[walletIndex] = { ...wallets[walletIndex], ...updates };
        saveToStorage('ledger-wallets', wallets);
    }
}

export function deleteWallet(walletId) {
    let wallets = getWallets();
    let transactions = getTransactions();
    wallets = wallets.filter(w => w.id !== walletId);
    transactions = transactions.filter(t => t.walletId !== walletId);
    saveToStorage('ledger-wallets', wallets);
    saveToStorage('ledger-transactions', transactions);
}

export function updateTransaction(transactionId, updates) {
    let transactions = getTransactions();
    const transactionIndex = transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex > -1) {
        transactions[transactionIndex] = { ...transactions[transactionIndex], ...updates };
        saveToStorage('ledger-transactions', transactions);
    }
}
