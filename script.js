function copyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        if (localStorage['openapi_copy_to_clipboard'] * 1 !== 1) {
            localStorage['openapi_copy_to_clipboard'] = window.prompt('COPY SUCCESSFUL. enter 1 to hide this message from next time onwards. To show again, run in js console localStorage["openapi_copy_to_clipboard"]=0', 0);
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
};
function onClick() {
    let prompt = {};
    const editor = [...document.getElementsByClassName('editor-container')][0];
    const boldSpans = [...editor.querySelectorAll('span')].filter(e => e.style.fontWeight === "bold");
    prompt['Prompt Text'] = boldSpans.length > 0 ? boldSpans.map(e => e.innerText).join('') : editor.innerText;
    try {
        const sliders = Object.fromEntries([...document.querySelectorAll('.slider-container')]
            .map((sd) => {
                const text = [...sd.querySelectorAll('span')].map(e => e.innerText).sort((a, b) => (a.length - b.length)).pop();
                const val = sd.querySelectorAll('[aria-valuenow]')[0].getAttribute('aria-valuenow') * 1;
                return [text, val];
            }));
        prompt = { ...sliders, ...prompt };
        prompt['Start Sequence'] = document.querySelectorAll('.start-seq-ta')[0].value;
        prompt['Restart Sequence'] = document.querySelectorAll('.restart-seq-ta')[0].value;
        prompt['Stop Sequences'] = [...document.querySelectorAll('.css-1rhbuit-multiValue')].map(e => e.innerText);
        prompt['Engine'] = document.getElementsByClassName('model-select')?.[0]?.innerText;
    } catch (e) { console.error('error occurred in extension', e); }
    copyTextToClipboard(JSON.stringify(prompt));
};

function init() {
    const button = document.createElement('div');
    const subButton = document.getElementsByClassName('submit-button')[0];
    if (!subButton) {
        setTimeout(init, 700);
        return;
    }
    subButton.parentNode.insertBefore(button, subButton.nextSibling);
    button.innerHTML = subButton.innerHTML;
    button.className = "submit-button";
    button.getElementsByClassName('submit-text')[0].innerText = 'Copy Prompt and other settings to clipboard';
    button.onclick = onClick;
}
init();
