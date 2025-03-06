DROP DATABASE IF EXISTS vue_user;
CREATE DATABASE vue_user;
USE vue_user;

-- Table "company"
CREATE TABLE company (
                         siren CHAR(14) NOT NULL,
                         nom VARCHAR(50) NOT NULL,
                         email VARCHAR(75) NOT NULL,
                         password VARCHAR(75) NOT NULL,
                         adress VARCHAR(255) NOT NULL,
                         zipcode VARCHAR(5) NOT NULL,
                         city VARCHAR(50) NOT NULL,
                         phone VARCHAR(10) NOT NULL,
                         token VARCHAR(255) DEFAULT NULL,
                         active BOOL DEFAULT 0,
                         joined DATE DEFAULT NULL,
                         profile_picture LONGBLOB DEFAULT NULL,
                         PRIMARY KEY(siren)
);

-- Table "preference"
CREATE TABLE preference (
                            id_preference INT AUTO_INCREMENT,
                            preference JSON NOT NULL,
                            notif JSON NOT NULL,
                            info JSON NOT NULL,
                            siren CHAR(14) NOT NULL,
                            PRIMARY KEY(id_preference),
                            UNIQUE(siren),
                            FOREIGN KEY(siren) REFERENCES company(siren)
);

-- Table "log"
CREATE TABLE log (
                     id_log INT AUTO_INCREMENT,
                     action VARCHAR(50) NOT NULL,
                     log_timestamp DATETIME NOT NULL,
                     siren CHAR(14) NOT NULL,
                     PRIMARY KEY(id_log),
                     FOREIGN KEY(siren) REFERENCES company(siren)
);

-- Table "category"
CREATE TABLE category (
                          id INT AUTO_INCREMENT NOT NULL,
                          Libelle VARCHAR(50) NOT NULL,
                          PRIMARY KEY(id)
);

-- Table "elearning"
CREATE TABLE elearning (
                           id_elearning INT AUTO_INCREMENT,
                           title VARCHAR(75) NOT NULL,
                           description TEXT NOT NULL,
                           price INT NOT NULL,
                           subscription_date DATE NOT NULL,
                           token VARCHAR(75),
                           password VARCHAR(75),
                           course_id INT,
                           siren CHAR(14) NOT NULL,
                           category INT NOT NULL DEFAULT 1,
                           favorite BOOLEAN DEFAULT 0,
                           PRIMARY KEY(id_elearning),
                           FOREIGN KEY(siren) REFERENCES company(siren),
                           FOREIGN KEY(category) REFERENCES category(id)
);

-- Table "event"
CREATE TABLE event (
                       event_id INT AUTO_INCREMENT,
                       title VARCHAR(50) NOT NULL,
                       description TEXT NOT NULL,
                       event_date DATETIME NOT NULL,
                       location VARCHAR(50) NOT NULL,
                       capacity INT NOT NULL,
                       status VARCHAR(50),
                       PRIMARY KEY(event_id)
);

-- Table "condition_type"
CREATE TABLE condition_type (
                                id_condition_type INT AUTO_INCREMENT,
                                label VARCHAR(50) NOT NULL,
                                PRIMARY KEY(id_condition_type)
);

-- Table "object_type"
CREATE TABLE object_type (
                             id_object_type INT AUTO_INCREMENT,
                             label VARCHAR(50) NOT NULL,
                             PRIMARY KEY(id_object_type)
);

-- Table "container"
CREATE TABLE container (
                           id_Container INT AUTO_INCREMENT,
                           adress VARCHAR(50) NOT NULL,
                           city VARCHAR(50) NOT NULL,
                           zipcode VARCHAR(5) NOT NULL,
                           capacity INT NOT NULL,
                           PRIMARY KEY(id_Container)
);

-- Table "inscription"
CREATE TABLE inscription (
                             id_inscription INT AUTO_INCREMENT,
                             event_id INT NOT NULL,
                             siren CHAR(14) NOT NULL,
                             PRIMARY KEY(id_inscription),
                             FOREIGN KEY(event_id) REFERENCES event(event_id),
                             FOREIGN KEY(siren) REFERENCES company(siren)
);

-- Table "emplacement"
CREATE TABLE emplacement (
                             id_emplacement INT AUTO_INCREMENT,
                             available BOOLEAN,
                             dimension VARCHAR(11),
                             id_Container INT NOT NULL,
                             PRIMARY KEY(id_emplacement),
                             FOREIGN KEY(id_Container) REFERENCES container(id_Container)
);

-- Table "listing"
CREATE TABLE listing (
                         id_item INT AUTO_INCREMENT,
                         title VARCHAR(50) NOT NULL,
                         description TEXT NOT NULL,
                         dimension VARCHAR(11),
                         date_posted DATE,
                         status VARCHAR(50),
                         id_emplacement INT,
                         siren CHAR(14) NOT NULL,
                         id_object_type INT NOT NULL,
                         id_condition_type INT NOT NULL,
                         PRIMARY KEY(id_item),
                         FOREIGN KEY(id_emplacement) REFERENCES emplacement(id_emplacement),
                         FOREIGN KEY(siren) REFERENCES company(siren),
                         FOREIGN KEY(id_object_type) REFERENCES object_type(id_object_type),
                         FOREIGN KEY(id_condition_type) REFERENCES condition_type(id_condition_type)
);

-- Table "listing_favorites"
CREATE TABLE listing_favorites (
                                   id_fav INT AUTO_INCREMENT,
                                   id_item INT NOT NULL,
                                   siren CHAR(14) NOT NULL,
                                   PRIMARY KEY(id_fav),
                                   FOREIGN KEY(id_item) REFERENCES listing(id_item) ON DELETE CASCADE ON UPDATE CASCADE,
                                   FOREIGN KEY(siren) REFERENCES company(siren) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table "listing_image"
CREATE TABLE listing_image (
                               id_listing_image INT AUTO_INCREMENT,
                               image LONGBLOB,
                               id_item INT NOT NULL,
                               mime_type VARCHAR(15),
                               PRIMARY KEY(id_listing_image),
                               FOREIGN KEY(id_item) REFERENCES listing(id_item)
);

-- Table "transaction"
CREATE TABLE transaction (
                             id_transaction INT AUTO_INCREMENT,
                             status VARCHAR(50),
                             date_transaction DATETIME NOT NULL,
                             id_item INT,
                             siren CHAR(14) NOT NULL,
                             PRIMARY KEY(id_transaction),
                             FOREIGN KEY(id_item) REFERENCES listing(id_item),
                             FOREIGN KEY(siren) REFERENCES company(siren)
);

-- Table "discussion"
CREATE TABLE discussion (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            title VARCHAR(255) NOT NULL,
                            siren CHAR(14) NOT NULL,
                            date_creation DATE NOT NULL,
                            FOREIGN KEY(siren) REFERENCES company(siren) ON DELETE CASCADE
);

-- Table "message"
CREATE TABLE message (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         discussion_id INT NOT NULL,
                         siren CHAR(14) NOT NULL,
                         message TEXT NOT NULL,
                         date_of_message DATE NOT NULL,
                         status VARCHAR(10) NOT NULL,
                         FOREIGN KEY(discussion_id) REFERENCES discussion(id) ON DELETE CASCADE,
                         FOREIGN KEY(siren) REFERENCES company(siren) ON DELETE CASCADE
);

CREATE TABLE chat (
                        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        firstSiren VARCHAR(20) NOT NULL,
                        secondSiren VARCHAR(20) NOT NULL,
                        dateCreation DATETIME NOT NULL,
                        FOREIGN KEY (firstSiren) REFERENCES company(siren) ON DELETE CASCADE,
                        FOREIGN KEY (secondSiren) REFERENCES company(siren) ON DELETE CASCADE
);

CREATE TABLE chat_message (
                        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        chatId INT NOT NULL,
                        siren VARCHAR(20) NOT NULL,
                        message VARCHAR(200) NOT NULL,
                        dateMessage DATETIME NOT NULL,
                        FOREIGN KEY (siren) REFERENCES company(siren) ON DELETE CASCADE,
                        FOREIGN KEY (chatId) REFERENCES chat(id) ON DELETE CASCADE
);


DROP DATABASE IF EXISTS vue_admin;
CREATE DATABASE vue_admin;
USE vue_admin;

-- Table "admin"
CREATE TABLE admin (
                       admin_id INT AUTO_INCREMENT,
                       password VARCHAR(75) NOT NULL,
                       rights JSON NOT NULL,
                       PRIMARY KEY(admin_id)
);

-- Table "article"
CREATE TABLE article (
                         id_veille INT AUTO_INCREMENT,
                         title VARCHAR(75) NOT NULL,
                         article_date DATETIME,
                         author VARCHAR(75) NOT NULL,
                         content TEXT NOT NULL,
                         image LONGBLOB DEFAULT NULL,
                         category INT NOT NULL,
                         admin_id INT NOT NULL,
                         PRIMARY KEY(id_veille),
                         FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

-- Table "elearning_list"
CREATE TABLE elearning_list (
                                course_id INT AUTO_INCREMENT,
                                title VARCHAR(75),
                                description TEXT NOT NULL,
                                price VARCHAR(50),
                                category INT NOT NULL,
                                admin_id INT NOT NULL,
                                PRIMARY KEY(course_id),
                                FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

-- Table "event"
CREATE TABLE event (
                       id_event INT AUTO_INCREMENT,
                       title VARCHAR(50) NOT NULL,
                       description TEXT NOT NULL,
                       event_date DATETIME NOT NULL,
                       location VARCHAR(50) NOT NULL,
                       capacity INT,
                       status VARCHAR(50) NOT NULL,
                       admin_id INT NOT NULL,
                       PRIMARY KEY(id_event),
                       FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

DROP DATABASE IF EXISTS payment_data;
CREATE DATABASE payment_data;
USE payment_data;

-- Table "payment_cards"
CREATE TABLE payment_cards (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               card_name VARCHAR(100) NOT NULL,
                               card_holder_first_name VARCHAR(50),
                               card_holder_last_name VARCHAR(50),
                               encrypted_card_number VARCHAR(255),
                               expiration_date VARCHAR(5) NOT NULL,
                               siren CHAR(14),
                               is_default BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               encryption_key VARCHAR(255)
);
