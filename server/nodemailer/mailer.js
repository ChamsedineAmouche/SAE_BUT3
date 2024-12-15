const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilisez votre service de messagerie (Gmail, Outlook, etc.)
    auth: {
        user: 'greencirclesae@gmail.com', // Remplacez par votre e-mail
        pass: 'btax xdcv wpfx tnvo' // Remplacez par votre mot de passe ou token d'application
    }
});

// Fonction pour envoyer un e-mail
const sendConfirmationEmail = (toEmail, siren, companyName) => {
    const mailOptions = {
        from: 'greencirclesae@gmail.com',
        to: toEmail,
        subject: 'Validation de votre compte',
        text: `Bonjour ${companyName},

Votre compte associé au SIREN ${siren} a été validé avec succès. Vous pouvez maintenant accéder à notre plateforme.

Cordialement,
L'équipe GreenCircle.`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
