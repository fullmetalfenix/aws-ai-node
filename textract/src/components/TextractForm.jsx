import { useState } from 'react';
import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";

const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_REGION = import.meta.env.VITE_AWS_REGION;


function TextractForm() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      setLoading(true);

      // Convert file to buffer
      const fileBuffer = await file.arrayBuffer();
      
      const client = new TextractClient({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY
        }
      });



      const command = new AnalyzeDocumentCommand({
        Document: {
          Bytes: new Uint8Array(fileBuffer)
        },
        FeatureTypes: ["FORMS", "TABLES"]
      });

      const response = await client.send(command);
      setResults(response);
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Error processing document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTextractResults = (results) => {
    if (!results?.Blocks) return null;

    const lines = results.Blocks.filter(block => block.BlockType === 'LINE');

    return (
      <div className="results-container">
        <h3 className="results-title">Extracted Text</h3>
        <div className="results-content">
          {lines.map((line, index) => (
            <div key={line.Id} className="result-card">
              <div className="result-text">{line.Text}</div>
              <div className="result-confidence">
                <div className="confidence-bar" 
                     style={{ width: `${line.Confidence}%` }}>
                </div>
                <span>{line.Confidence.toFixed(1)}% confidence</span>
              </div>
            </div>
          ))}
        </div>
        
        <details className="raw-data">
          <summary>View Raw JSON</summary>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </details>
      </div>
    );
  };

  return (
    <div className="textract-container">
      <h2 className="page-title">Document Analysis</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file-input"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              Choose a file
            </label>
            {file && <span className="file-name">{file.name}</span>}
          </div>
          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={!file || loading}
          >
            {loading ? 'Processing...' : 'Analyze Document'}
          </button>
        </form>
      </div>

      {results && renderTextractResults(results)}
    </div>
  );
}

export default TextractForm;
