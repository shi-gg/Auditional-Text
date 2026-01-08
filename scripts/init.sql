CREATE TABLE guilds (
    id varchar(23) PRIMARY KEY,
    timeout INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE users (
    id varchar(23) PRIMARY KEY,
    default_voice varchar(31) DEFAULT NULL,
    command_uses INTEGER NOT NULL DEFAULT 0,
    verification_valid_until INTEGER DEFAULT NULL
);