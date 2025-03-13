import React, { useState } from 'react';
import { RekognitionClient, RecognizeCelebritiesCommand } from '@aws-sdk/client-rekognition';

const CelebrityRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [celebrities, setCelebrities] = useState([]);
  const [unrecognizedFaces, setUnrecognizedFaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const AWS_REGION = import.meta.env.VITE_AWS_REGION;


  const rekognitionClient = new RekognitionClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setCelebrities([]);
      setUnrecognizedFaces([]);
      setError(null);
    }
  };

  const analyzeCelebrities = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const imageBytes = await selectedImage.arrayBuffer();

      const params = {
        Image: {
          Bytes: new Uint8Array(imageBytes),
        },
      };

      const command = new RecognizeCelebritiesCommand(params);
      const response = await rekognitionClient.send(command);

      setCelebrities(response.CelebrityFaces || []);
      setUnrecognizedFaces(response.UnrecognizedFaces || []);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Celebrity Recognition</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginRight: '10px' }}
        />
        <button
          onClick={analyzeCelebrities}
          disabled={!selectedImage || loading}
          style={{
            backgroundColor: !selectedImage || loading ? '#f2db83' : 'black',
            color: !selectedImage || loading ? 'black' : '#f2db83',
            border: 'none',
            fontSize: '16px',
            borderRadius: '14px',
            padding: "12px 20px",
            cursor: !selectedImage || loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {imagePreview && (
        <div id="image-container"style={{ marginBottom: '20px' }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px' }}
          />
        </div>
      )}

      {celebrities.length > 0 && (
        <div>
          <h3>Recognized Celebrities ({celebrities.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {celebrities.map((celebrity, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0' }}>{celebrity.Name}</h4>
                <div style={{ fontSize: '14px' }}>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Confidence:</strong> {celebrity.MatchConfidence.toFixed(2)}%
                  </p>
                  {celebrity.Urls && celebrity.Urls.length > 0 && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>IMDB:</strong>{' '}
                      <a 
                        href={celebrity.Urls[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#007bff' }}
                      >
                        View Profile
                      </a>
                    </p>
                  )}
                  {celebrity.KnownGender && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>Gender:</strong> {celebrity.KnownGender.Type}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unrecognizedFaces.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Unrecognized Faces: {unrecognizedFaces.length}</h3>
          <p style={{ margin: '0', color: '#666' }}>
            Found faces in the image that don't match any known celebrities.
          </p>
        </div>
      )}

      {celebrities.length === 0 && unrecognizedFaces.length === 0 && !loading && selectedImage && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          color: '#856404' 
        }}>
          No celebrities were recognized in this image.
        </div>
      )}
    </div>
  );
};

export default CelebrityRecognition;
