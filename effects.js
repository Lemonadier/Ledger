/**
 * effects.js
 * รวมฟังก์ชันสำหรับสร้างเสียงและ Visual Effects ทั่วทั้งเว็บไซต์
 */

// --- Sound Effects ---
const clickSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBUZW5jAAAADwAAA1NvdW5kSmF5LmNvbQ==');
const successChime = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT19O/j2+Prp+Cn5uBH+jB34Lgn8iBX+vAn8hBn4b/n4H/noFf3IFf3MDB3AFe3sAAnQGfXkABnUGfHkIBnMGfXIMF3AKenwPCHAMfXwWf3sHfXoAfXwLfXYFfXsAfXgAfXUAfHQAfHM/enM/fHE/fHI/e3E/fHA0fW87fW89fW9AfXA/fXA/fW9CfW9EfW9GfW9IfW9KfW9LfW9MfW9OfW9QfW9SfW9VfW9XfW9ZfW9bfW9dfW9ffW9ifW9lfW9nfW9pfW9nfW9ofW9ofW9nfW9pfW9nfW9lfW9ofW9ofW9pfW9ofW9nfW9pfW9ofW9pfW9mfW9nfW9pfW9lfW9lfW9lfW9nfW9pfW9pfW9pfW9pfW9ofW9pfW9mfW9ofW9nfW9ofW9pfW9lfW9lfW9lfW9lfW9mg==');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(error => console.error("Audio play failed:", error));
}

export function playClickSound() {
    playSound(clickSound);
}

export function playSuccessChime() {
    playSound(successChime);
}


// --- Star Burst Effect ---
export function createStarBurst(event) {
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'fixed';
    burstContainer.style.left = `${event.clientX}px`;
    burstContainer.style.top = `${event.clientY}px`;
    burstContainer.style.zIndex = '9999';
    burstContainer.style.pointerEvents = 'none';
    document.body.appendChild(burstContainer);

    for (let i = 0; i < 12; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.setProperty('--angle', `${(i / 12) * 360}deg`);
        star.style.setProperty('--radius', `${Math.random() * 50 + 50}px`);
        burstContainer.appendChild(star);
    }
    
    setTimeout(() => {
        burstContainer.remove();
    }, 1000);
}


// --- Money Fall Effect ---
export function createMoneyFall() {
    const container = document.getElementById('money-fall-container');
    if (!container) return; 

    for (let i = 0; i < 25; i++) {
        const bill = document.createElement('div');
        bill.className = 'money-bill';
        bill.textContent = '฿';
        bill.style.left = `${Math.random() * 100}vw`;
        bill.style.animationDelay = `${Math.random() * 2}s`;
        bill.style.animationDuration = `${3 + Math.random() * 2}s`;
        container.appendChild(bill);

        setTimeout(() => {
            bill.remove();
        }, 5000);
    }
}

// --- NEW: Toast Notification Effect ---
let toastTimeout;

/**
 * แสดง UI แจ้งเตือนที่มุมขวาล่าง
 * @param {string} message - ข้อความที่จะแสดง
 * @param {boolean} isError - ตั้งเป็น true หากเป็นการแจ้งเตือนข้อผิดพลาด (สีแดง)
 */
export function showToast(message, isError = false) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    // Clear previous timeout if it exists
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toast.textContent = message;
    
    // Set color based on type
    if (isError) {
        toast.style.backgroundColor = '#ef4444'; // red-500
    } else {
        toast.style.backgroundColor = '#22c55e'; // green-500
    }

    toast.classList.add('show');
    if (!isError) {
        playSuccessChime();
    }

    toastTimeout = setTimeout(function(){
        toast.classList.remove('show');
    }, 3000);
}
