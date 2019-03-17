create extension pg_trgm;

create table wojewodztwa (
    id_teryt int primary key,
    nazwa text not null unique
);

create table miasta (
    id_teryt int primary key,
    wojewodztwo_id_teryt int not null references wojewodztwa(id_teryt),
    nazwa text not null
);

create index miasta_nazwa on miasta using hash(nazwa);

create table dzielnice (
    id_teryt int primary key,
    miasto_id_teryt int not null references miasta(id_teryt),
    nazwa text not null
);

create index dzielnice_nazwa on dzielnice using gist(nazwa gist_trgm_ops);
-- create index dzielnice_nazwa on dzielnice using gin(nazwa gin_trgm_ops);


create table ulice (
    id_teryt int not null,
    miasto_id_teryt int not null references miasta(id_teryt),
    nazwa text not null,
    primary key(id_teryt, miasto_id_teryt)
);

create index ulice_nazwa on ulice using gist(nazwa gist_trgm_ops);
-- create index ulice_nazwa on ulice using gin(nazwa gin_trgm_ops);