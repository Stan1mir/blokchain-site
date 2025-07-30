// This is the JavaScript version of the simple blockchain code.

// --- Helper function for SHA-256 Hashing (the equivalent of Python's hashlib) ---
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// --- Class Definitions (same as Python) ---
class Transaction {
    constructor(sender, receiver, amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
    }
    // A helper to display transactions as a simple string
    toString() {
        return `${this.sender} -> ${this.receiver}: ${this.amount}`;
    }
}

class Block {
    constructor(index, previousHash, timestamp, transactions, nonce = 0) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = nonce;
        this.hash = null; // We'll calculate this after creation
    }

    async calculateHash() {
        const value = this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
        return await sha256(value);
    }
}

// --- The Main Blockchain Logic ---
class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.difficulty = 4; // How many leading zeros we need
    }

    async createGenesisBlock() {
        const genesisBlock = new Block(0, "0", Date.now(), [new Transaction("genesis", "genesis", 0)]);
        genesisBlock.hash = await genesisBlock.calculateHash();
        this.chain.push(genesisBlock);
    }

    get latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async minePendingTransactions() {
        const newBlock = new Block(this.latestBlock.index + 1, this.latestBlock.hash, Date.now(), this.pendingTransactions);

        // This is the Proof of Work
        while (true) {
            newBlock.hash = await newBlock.calculateHash();
            if (newBlock.hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join("0")) {
                break; // We found a valid hash!
            }
            newBlock.nonce++; // Try the next number
        }

        this.chain.push(newBlock);
        this.pendingTransactions = []; // Clear the pending list
        return newBlock;
    }
}

// --- Connect the Logic to the HTML Page ---
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-mining-btn');
    const blockchainContainer = document.getElementById('blockchain-container');
    const myBlockchain = new Blockchain();

    startBtn.addEventListener('click', async () => {
        // Disable button to prevent multiple clicks
        startBtn.disabled = true;
        startBtn.textContent = "Mining Next Block...";

        // If it's the first time, create the genesis block
        if (myBlockchain.chain.length === 0) {
            await myBlockchain.createGenesisBlock();
            displayBlock(myBlockchain.latestBlock);
        }

        // Add some dummy transactions for the new block
        myBlockchain.pendingTransactions.push(new Transaction("Alice", "Bob", 100));
        myBlockchain.pendingTransactions.push(new Transaction("Charlie", "David", 50));

        // Mine the block (this can take a moment)
        const newBlock = await myBlockchain.minePendingTransactions();
        displayBlock(newBlock);

        // Re-enable the button for the next block
        startBtn.disabled = false;
        startBtn.textContent = "Start Mining";
    });

    function displayBlock(block) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'blockchain-block';

        const transactionsText = block.transactions.map(tx => tx.toString()).join('<br>');

        blockDiv.innerHTML = `
            <h3>Block #${block.index}</h3>
            <div class="block-info"><strong>Timestamp:</strong> ${new Date(block.timestamp).toLocaleString()}</div>
            <div class="block-info"><strong>Transactions:</strong><br>${transactionsText}</div>
            <div class="block-info"><strong>Nonce:</strong> ${block.nonce}</div>
            <div class="block-info hash-info"><strong>Hash:</strong> ${block.hash}</div>
            <div class="block-info prev-hash-info"><strong>Previous Hash:</strong> ${block.previousHash}</div>
        `;
        blockchainContainer.appendChild(blockDiv);
    }
});