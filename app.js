const HF_TOKEN = "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"; 

async function chat() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'u');
    input.value = "";

    const load = addMessage("AI o'ylamoqda...", 'a');

    try {
        // CORS xatosini chetlab o'tish uchun Mistral-ni boshqa endpoint orqali chaqiramiz
        const response = await fetch("https://api-inference.huggingface.co/models/Mistralai/Mistral-7B-Instruct-v0.2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
                // Ba'zan brauzerlar xavfsizlik uchun qo'shimcha headerlarni talab qiladi
            },
            body: JSON.stringify({ 
                inputs: `<s>[INST] ${text} [/INST]`,
                parameters: { 
                    max_new_tokens: 500,
                    return_full_text: false
                },
                options: { wait_for_model: true }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "API xatosi");
        }

        const data = await response.json();
        load.remove();

        if (data && data[0] && data[0].generated_text) {
            addMessage(data[0].generated_text.trim(), 'a');
        } else {
            addMessage("Xato: Noto'g'ri ma'lumot qaytdi.", 'a');
        }
    } catch (e) {
        if(load) load.remove();
        // Konsolda CORS xatosi ko'rinsa, bu brauzer cheklovidir
        addMessage("Xato: " + e.message, 'a');
        console.error("Xato tafsiloti:", e);
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