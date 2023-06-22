function showConfirmationPopup(url) {
    var confirmResult = confirm('Bist du sicher?');
    if (confirmResult === true) {
        window.location.href = url;
    }
}

function openOrDownloadPDF(filePath) {
    window.open(filePath);
}