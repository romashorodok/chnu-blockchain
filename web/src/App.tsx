import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const VOTING_CONTRACT_ABI = [{ "inputs": [{ "internalType": "string[]", "name": "_candidates", "type": "string[]" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "candidateList", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCandidates", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "candidate", "type": "string" }], "name": "getVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "candidate", "type": "string" }], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "votesReceived", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

const VOTING_CONTRACT_ADDRESS = "0xE5190c313d7C2c3b81d68D1c08407f825f88B7a5";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      setProvider(provider)
      const newSigner = await provider.getSigner();
      const newContract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, newSigner);
      const accounts = await provider.send("eth_accounts", []);
      setAccount(accounts[0]);
      const balance = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance))
      setContract(newContract)
      await loadCandidates(newContract);
    };
    init();
  }, []);

  const loadCandidates = async (contract: ethers.Contract) => {
    try {
      const candidateList = await contract.getCandidates();

      setCandidates(candidateList);

      const initialVotes: any = {};
      for (const candidate of candidateList) {
        const voteCount = await contract.getVotes(candidate);
        initialVotes[candidate] = voteCount.toString();
      }
      setVotes(initialVotes);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  const handleVote = async () => {
    if (!contract || !provider) return

    try {
      if (!selectedCandidate) {
        alert("Please select a candidate to vote for.");
        return;
      }

      const tx = await contract.vote(selectedCandidate);
      await tx.wait();

      const accounts = await provider.send("eth_accounts", []);
      setAccount(accounts[0]);
      const balance = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance))


      alert(`Vote for ${selectedCandidate} successful!`);
      await loadCandidates(contract);
    } catch (error) {
      console.error("Error voting:", error);
      alert("An error occurred while voting.");
    }
  };

  return (
    <div className="App">
      <p><strong>Account:</strong> {account}</p>
      <p><strong>Balance:</strong> {balance}</p>

      <h1>Voting</h1>
      <div>
        <h2>Select a Candidate to Vote For</h2>
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
          <option value="">--Select a Candidate--</option>
          {candidates.map((candidate) => (
            <option key={candidate} value={candidate}>
              {candidate}
            </option>
          ))}
        </select>
        <button onClick={handleVote}>Vote</button>
      </div>

      <h2>Votes Count</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate}>
            {candidate}: {votes[candidate] || 0} votes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

