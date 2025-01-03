const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'greencirclesae@gmail.com',
        pass: 'btax xdcv wpfx tnvo'
    }
});

const sendMail = (toEmail, subject, text) => {
    const mailOptions = {
        from: 'greencirclesae@gmail.com',
        to: toEmail,
        subject: subject,
        text: text,
    };

    return transporter.sendMail(mailOptions);
};

const sendConfirmationEmail = (toEmail, siren, companyName) => {
    const subject = 'Validation de votre compte';
    const text = `Bonjour ${companyName},

Votre compte associé au SIREN ${siren} a été validé avec succès. Vous pouvez maintenant accéder à notre plateforme.

Cordialement,
L'équipe GreenCircle.`;

    return sendMail(toEmail, subject, text);
};

const sendMailForgotPassword = (siren, toEmail, token, companyName ) => {
    const subject = 'Modification de votre mot de passe';
    const resetLink = `http://localhost:3000/reset_password?token=${token}&siren=${siren}`;
    const text = `Bonjour ${companyName},
    
Vous avez fait une demande de réinitialisation de votre mot de passe.
Cliquez sur le lien suivant pour continuer : ${resetLink}

S'il ne s'agit pas de vous contactez au plus vite les équipes de Green Circle.

Cordialement,
L'équipe GreenCircle.`;

    return sendMail(toEmail, subject, text);
};


module.exports = { sendMail, sendConfirmationEmail, sendMailForgotPassword };
