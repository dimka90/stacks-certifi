import React, { useState } from 'react';
import './VerifyCredential.css';

function VerifyCredential() {
  const [credentialHash, setCredentialHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!credentialHash.trim()) {
        throw new Error('Please enter a credential hash');
      }

      if (credentialHash.length !== 64) {
        throw new Error('Invalid hash format (should be 64 characters)');
      }

      // In a real app, this would call the smart contract
      // For now, we'll show a mock result
      setResult({
        found: true,
        credentialId: Math.floor(Math.random() * 1000),
        valid: true,
        student: 'SP2J6ZY48GV6RRZRVXF44FYRSTCG9KJDM3NZ8KXY',
        credentialType: 'Bachelor of Science',
        issueDate: new Date().toLocaleDateString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-credential">
      <h2>Verify Credential</h2>
      <p className="subtitle">Verify a credential by its hash</p>

      <form onSubmit={handleVerify} className="form">
        <div className="form-group">
          <label htmlFor="credentialHash">Credential Hash *</label>
          <input
            type="text"
            id="credentialHash"
            placeholder="a680386dffd9fa53781a6953e3b5f4ebb4cfc91d11a2a93b6b1b0676a2307429"
            value={credentialHash}
            onChange={(e) => setCredentialHash(e.target.value)}
            required
          />
          <small>SHA-256 hash of the credential (64 characters)</small>
        </div>

        {error && <div className="message error">❌ {error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : '✔️ Verify Credential'}
        </button>
      </form>

      {result && (
        <div className={`result ${result.valid ? 'valid' : 'invalid'}`}>
          <div className="result-header">
            <span className="result-status">
              {result.valid ? '✅ Valid' : '❌ Invalid'}
            </span>
          </div>

          <div className="result-details">
            <div className="detail-item">
              <span className="label">Credential ID:</span>
              <span className="value">{result.credentialId}</span>
            </div>

            <div className="detail-item">
              <span className="label">Type:</span>
              <span className="value">{result.credentialType}</span>
            </div>

            <div className="detail-item">
              <span className="label">Student:</span>
              <span className="value monospace">{result.student.slice(0, 20)}...</span>
            </div>

            <div className="detail-item">
              <span className="label">Issued:</span>
              <span className="value">{result.issueDate}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-box">
        <h3>ℹ️ How to verify</h3>
        <ol>
          <li>Get the credential hash from the issuer</li>
          <li>Paste it in the input field above</li>
          <li>Click "Verify Credential"</li>
          <li>See the credential details</li>
          <li>Confirm authenticity on blockchain</li>
        </ol>
      </div>
    </div>
  );
}

export default VerifyCredential;
