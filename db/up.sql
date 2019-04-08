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



create table ogloszenia (
    id int generated always as identity primary key,
    otodom_id int,
    olx_id int,
    opis text not null,
    powierzchnia int,
    dodatkowe_oplaty number,
    liczba_pokoi int,
    rodzaj_zabudowy text,
    pietro text,
    poziom_opis text,
    liczba_pieter int,
    okna text,
    material_budynku text,
    rok_budowy int,
    autor text,
    nr_telefonu text,
    umeblowanie boolean,
    czynsz int,
    ulica_id int foreign key references ulice(id_teryt),
    miasto_id int foreign key references miasta(id_teryt),
    dzielnica_id int foreign key references dzielnice(id_teryt)
);

create table zdjecia (
    id int generated always as identity primary key,
    ogloszenie_id int foreign key references ogloszenia(id),
    zdj bytea not null,
    nazwa_pliku text
);