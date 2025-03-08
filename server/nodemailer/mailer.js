const nodemailer = require('nodemailer');
const {insertNewNotif} =  require('../notif/notif')
const {getAccountInfoByMail} = require('../account/accountFetcher')
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
    insertNewNotif(siren, 'Bienvenue sur Green Circle !')
    return sendMail(toEmail, subject, text);
};

const sendMailForgotPassword = (siren, toEmail, token, companyName ) => {
    const subject = 'Modification de votre mot de passe';
    const resetLink = `http://localhost:3000/reinitialisation_mot_de_passe?token=${token}&siren=${siren}`;
    const text = `Bonjour ${companyName},
    
Vous avez fait une demande de réinitialisation de votre mot de passe.
Cliquez sur le lien suivant pour continuer : ${resetLink}

S'il ne s'agit pas de vous contactez au plus vite les équipes de Green Circle.

Cordialement,
L'équipe GreenCircle.`;
    return sendMail(toEmail, subject, text);
};

const sendMailForReservation = async (toEmail, itemName, companyName, itemId, status ) => {
    let subject = '';
    let firstText = '';
    if (status === 'active') {
        subject = 'Objet réservé';
        firstText = `Vous avez bien réservé un(e) ${itemName}.`;
    } else {
        subject = 'Objet récupéré';
        firstText = `Vous avez bien récupéré un(e) ${itemName}.`;
    }
    const url = `http://localhost:3000/depot/${itemId}`;
    const text = `Bonjour ${companyName},
    
${firstText}
Cliquez sur le lien suivant pour consulter l'objet : ${url}

S'il ne s'agit pas de vous contactez au plus vite les équipes de Green Circle.

Cordialement,
L'équipe GreenCircle.`;
    const result = await getAccountInfoByMail(toEmail);
    const { siren } = result.account[0];
    insertNewNotif(siren, firstText)
    return sendMail(toEmail, subject, text);
};

const sendMailForReservationOurObject = async (toEmail, itemName, companyName, itemId, status) => {
    let subject = '';
    let firstText = '';
    if (status === 'active') {
        subject = 'Objet réservé';
        firstText = `Votre objet ${itemName} a été réservé.`;
    } else {
        subject = 'Objet récupéré';
        firstText = `Votre objet ${itemName} a été récupéré.`;
    }
    const url = `http://localhost:3000/depot/${itemId}`;
    const text = `Bonjour ${companyName},
    
${firstText}
Cliquez sur le lien suivant pour consulter l'objet : ${url}

Cordialement,
L'équipe GreenCircle.`;

    const result = await getAccountInfoByMail(toEmail);
    const { siren } = result.account[0];
    insertNewNotif(siren, firstText)
    return sendMail(toEmail, subject, text);
};

const sendMailForFavoritesObjects = async (toEmail, itemName, companyName, itemId) => {
    const subject = `Un objet a été récupéré`;
    const url = `http://localhost:3000/product?id=${itemId}`;
    const urlCatalog = `http://localhost:3000/catalog`;
    const text = `Bonjour ${companyName},
    
L'objet que vous aviez mis en favori a été récupéré par une autre entreprise !
Cliquez sur le lien suivant pour consulter l'objet : ${url}

Mais pas de panique ! D'autres objets pourraient vous intéresser.
Cliquez sur le lien suivant pour consulter le catalog : ${urlCatalog}

Cordialement,
L'équipe GreenCircle.`;
    const result = await getAccountInfoByMail(toEmail);
    const { siren } = result.account[0];
    insertNewNotif(siren, firstText)
    return sendMail(toEmail, subject, text);
};

const sendElearningEmail = async (toEmail, link, companyName, password) => {
    const subject = 'Validation de votre paeiment';
    const text = `Bonjour ${companyName},

    Votre paiement pour votre elearning a été validé, vous pouvez accéder à votre elearning via ce lien : ${link} avec ce mot de passe ${password}

    Cordialement,
    L'équipe GreenCircle.`;
    const result = await getAccountInfoByMail(toEmail);
    const { siren } = result.account[0];
    insertNewNotif(siren, 'Paiement eLearning Validé.')
    return sendMail(toEmail, subject, text);
};


module.exports = { sendMail, sendConfirmationEmail, sendMailForgotPassword, sendMailForReservation, sendMailForReservationOurObject, sendMailForFavoritesObjects, sendElearningEmail };
