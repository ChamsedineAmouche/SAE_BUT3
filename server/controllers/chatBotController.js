const { spawn } = require('child_process');
const path = require('path');

const pythonScript = path.join(__dirname, '../../chatbot/chat.py');

const chatBot = async (req, res) => {
    try {
        const { sentence } = req.query;
        const process = spawn('python3', [pythonScript, sentence], {
            cwd: path.join(__dirname, '../../chatbot') 
        });

        let output = ''; 

        process.stdout.on('data', (data) => {
            output += data.toString(); 
        });

        process.stderr.on('data', (data) => {
            console.error(`Erreur Python : ${data.toString().trim()}`);
        });

        process.on('close', (code) => {
            console.log(`Processus Python terminé avec le code ${code}`);
            res.json({ response: output.trim() });
        });

    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = { chatBot };
