create table wojewodztwa (
    id_teryt int primary key,
    nazwa text not null unique
);

create table miasta (
    id_teryt int primary key,
    wojewodztwo_id_teryt int not null references wojewodztwa(id_teryt),
    nazwa text not null
);

create table dzielnice (
    id_teryt int primary key,
    miasto_id_teryt int not null references miasta(id_teryt),
    nazwa text not null
);

create table ulice (
    id_teryt int not null,
    miasto_id_teryt int not null references miasta(id_teryt),
    nazwa text not null,
    primary key(id_teryt, miasto_id_teryt)
);