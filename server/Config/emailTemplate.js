export const EMAIL_TEMPLATE = (name, otp) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #4f46e5;
      background-color: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin: 25px 0;
      display: inline-block;
    }
    .message {
      color: #374151;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Réinitialisation de mot de passe</h1>
    </div>
    
    <div class="content">
      <p class="message">Bonjour <strong>${name}</strong>,</p>
      
      <p class="message">
        Vous avez demandé une réinitialisation de votre mot de passe.<br>
        Voici votre code de vérification à 6 chiffres :
      </p>

      <div class="otp-code">
        ${otp}
      </div>

      <p class="message">
        Ce code expire dans <strong>10 minutes</strong>.<br>
        Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
      </p>

      <a href="#" class="button">Retourner à l'application</a>
    </div>

    <div class="footer">
      <p>© 2026 Ton Application - Tous droits réservés</p>
      <p>Ce message est automatique, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>`;

export const PASSWORD_RESET_OTP_TEMPLATE = (name, otp) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code de réinitialisation - OTP</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 12px;
      color: #4f46e5;
      background-color: #f8fafc;
      padding: 25px 40px;
      border-radius: 10px;
      margin: 30px 0;
      display: inline-block;
      border: 2px solid #e0e7ff;
    }
    .message {
      color: #374151;
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .warning {
      color: #dc2626;
      font-size: 14px;
      margin-top: 25px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 25px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Code de Réinitialisation</h1>
    </div>
    
    <div class="content">
      <p class="message">Bonjour <strong>${name}</strong>,</p>
      
      <p class="message">
        Vous avez demandé à réinitialiser votre mot de passe.<br>
        Voici votre code de vérification à 6 chiffres :
      </p>

      <div class="otp-code">
        ${otp}
      </div>

      <p class="message">
        Ce code est valable pendant <strong>10 minutes</strong> uniquement.
      </p>

      <p class="warning">
        ⚠️ Ne partagez jamais ce code avec qui que ce soit.
      </p>
    </div>

    <div class="footer">
      <p>© 2026 Ton Application - Tous droits réservés</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>
  </div>
</body>
</html>`;