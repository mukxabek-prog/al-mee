// Google AI Studio'dan olgan kalitingizni shu yerga qo'ying
const GEMINI_API_KEY = "Sizning_Gemini_API_Keyingiz"; 

async function chat() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'u');
    input.value = "";

    const load = addMessage("Gemini o'ylamoqda...", 'a');

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });

        const data = await response.json();
        load.remove();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let reply = data.candidates[0].content.parts[0].text;
            addMessage(reply, 'a');
        } else {
            console.error("Xato tafsiloti:", data);
            addMessage("Xato: Gemini javob bera olmadi.", 'a');
        }
    } catch (e) {
        if(load) load.remove();
        addMessage("Ulanish xatosi! Internetni tekshiring.", 'a');
        console.error("Fetch xatosi:", e);
    }
}

function addMessage(t, type) {
    const d = document.createElement('div');
    d.className = `m ${type}`;
    d.innerText = t;
    const b = document.getElementById('chatBox');
    b.appendChild(d);
    b.scrollTop = b.scrollHeight;
    return d;
}

document.getElementById('sendBtn').onclick = chat;
document.getElementById('userInput').onkeypress = (e) => { if(e.key === 'Enter') chat(); };
