const https = require('https');

const verifyGoogleToken = (idToken) => {
  return new Promise((resolve, reject) => {
    if (!idToken) {
      return reject(new Error('Google ID Token is required'));
    }
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error_description) {
            reject(new Error(parsed.error_description));
          } else {
            resolve(parsed); // contains email, name, picture, sub, aud, exp, etc.
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = {
  verifyGoogleToken
};
