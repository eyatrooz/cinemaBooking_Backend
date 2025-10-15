
CREATE DATABASE cinema_booking;
USE cinema_booking;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(13),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,  -- this column changed to main_cast
    duration INT NOT NULL,
    genre VARCHAR(100),
    rating VARCHAR(10),  -- varchar changed to decimal(3, 1);
    poster_url VARCHAR(500),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE halls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE screenings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    theater_id INT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    theater_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    row_letter VARCHAR(5) NOT NULL,
    seat_type ENUM('regular', 'premium', 'vip') DEFAULT 'regular',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    screenings_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- junction table for M_M relationship between booking-seats
CREATE TABLE booking_seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
	CONSTRAINT uc_booking_seat UNIQUE (booking_id, seat_id)
);
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'cliq', 'cash') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
create table password_reset_tokens (
 id INT PRIMARY KEY AUTO_INCREMENT,
 user_id INT not null,
 token  varchar(255) unique not null,
 created_at timestamp default current_timestamp,
 updated_at timestamp not null
);

-- relationships:
-- users-bookings (1-M)
ALTER TABLE bookings
add constraint fk_bookings_users
foreign key (user_id) references users(id)
on delete cascade
on update cascade;

-- movies-screenings (1-M)
alter table screenings
add constraint fk_screenings_movies
foreign key (movie_id) references movies(id)
on delete cascade
on update cascade;

-- halls-screenings (1-M)
alter table screenings
add constraint fk_screenings_halls
foreign key (theater_id) references halls(id)
on delete cascade
on update cascade;


-- halls → seats (1:M)
alter table seats
add constraint fk_seats_halls
foreign key (theater_id) references halls(id)
on delete cascade
on update cascade;

-- screenings → bookings (1:M)

ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_screenings
FOREIGN KEY (screenings_id) REFERENCES screenings(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- bookings → payments (1:M)
ALTER TABLE payments
ADD CONSTRAINT fk_payments_bookings
FOREIGN KEY (booking_id) REFERENCES bookings(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- bookings ↔ seats (M:M) via booking_seats junction table
alter table booking_seats
add constraint fk_booking_seats_bookings
foreign key (booking_id) references bookings(id)
on delete cascade
on update cascade;

alter table booking_seats
add constraint fk_booking_seats_seats
foreign key (seat_id) references seats(id)
on delete cascade
on update cascade;

-- users → password_reset_tokens (1:M)
ALTER TABLE password_reset_tokens
ADD CONSTRAINT fk_password_reset_tokens_users
foreign key (user_id) references users(id)
on delete cascade
on update cascade;


-- Queries-------------------
ALTER TABLE users
ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'; 

UPDATE users SET role = 'admin' WHERE email = 'emranatrooz03@gmail.com';

SELECT id, name, email, role FROM users WHERE email = 'emranatrooz03@gmail.com';

Alter table password_reset_tokens
ADD COLUMN expires_at DATETIME NOT NULL,
ADD COLUMN used BOOLEAN DEFAULT FALSE;

ALTER TABLE password_reset_tokens
MODIFY COLUMN updated_at TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp;

DESCRIBE password_reset_tokens;

SELECT * FROM password_reset_tokens ORDER BY created_at DESC LIMIT 1;


alter table movies change column description main_cast text ;
describe movies; 

-- change the rating from varchar to float
ALTER TABLE movies 
MODIFY COLUMN rating DECIMAl(3, 1);

-- modifying halls table
ALTER TABLE halls
ADD COLUMN hall_type ENUM('standard', 'imax', 'vip', '3d', '4dx') DEFAULT 'standard' AFTER total_seats,
ADD COLUMN status ENUM('active', 'maintenance', 'closed') DEFAULT 'active' AFTER hall_type,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN deleted_at TIMESTAMP NULL;
describe halls;


-- modifying screenings table--
ALTER TABLE screenings 
CHANGE COLUMN theater_id hall_id INT NOT NULL;

ALTER TABLE screenings
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
ADD COLUMN screening_status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled' AFTER price,
ADD COLUMN available_seats INT NOT NULL AFTER price;

ALTER TABLE screenings 
DROP FOREIGN KEY fk_screenings_halls;

ALTER TABLE screenings
ADD CONSTRAINT fk_screenings_halls
FOREIGN KEY (hall_id) REFERENCES halls(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

DESCRIBE screenings;










