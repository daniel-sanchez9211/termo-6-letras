require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Termo = require('./models/Termo');

// Importar lista de palavras
const words = require('./words'); 

const app = express();

// Configuração Explícita do CORS
app.use(cors({
    origin: '*', // Permite qualquer origem para teste
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Recebida requisição: ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB CONECTADO com sucesso!'))
.catch(err => {
    console.error('❌ ERRO ao conectar no MongoDB:', err);
    // Não matar o processo, mas logar claro
});

app.get('/word', async (req, res) => {
    console.log('Rota /word chamada...');
    
    // Verificar estado da conexão
    if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB não está conectado!');
        return res.status(500).json({ error: 'Erro de conexão com banco de dados' });
    }

    try {
        let document = await Termo.findOne();
        console.log('Documento encontrado:', document ? 'Sim' : 'Não');

        if (!document) {
            console.log('Criando documento inicial...');
            const initialCandidate = words[Math.floor(Math.random() * words.length)];
            const initialNorm = initialCandidate.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            
            document = new Termo({
                todaysWord: initialCandidate,
                blackList: [initialNorm],
                lastUpdated: new Date()
            });
            await document.save();
        }

        const now = new Date();
        const lastUpdate = new Date(document.lastUpdated);

        const options = { timeZone: 'America/Sao_Paulo', year: 'numeric', month: 'numeric', day: 'numeric' };
        const nowString = now.toLocaleDateString('pt-BR', options);
        const lastUpdateString = lastUpdate.toLocaleDateString('pt-BR', options);

        if (nowString === lastUpdateString) {
            console.log('Palavra do dia já definida:', document.todaysWord);
            const normWord = document.todaysWord.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            return res.json({ word: normWord, displayWord: document.todaysWord });
        }

        console.log('Sorteando nova palavra...');
        // Sorteia nova palavra
        let newWord = ''; // Normalized version for blacklist check
        let candidate = ''; // Original accented version
        let attempts = 0;
        const maxAttempts = 100;

        do {
            candidate = words[Math.floor(Math.random() * words.length)];
            newWord = candidate.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            attempts++;
        } while (document.blackList.includes(newWord) && attempts < maxAttempts);

        document.todaysWord = candidate;
        document.blackList.push(newWord);
        document.lastUpdated = now;
        
        await document.save();
        console.log('Nova palavra salva:', candidate);
        
        res.json({ word: newWord, displayWord: candidate });

    } catch (error) {
        console.error('Erro interno no servidor:', error);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
