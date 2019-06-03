import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { Street, Photo } from './index'
import District from './District';

export enum AdSource {
    Olx = 'olx',
    Gratka = 'gratka',
    Otodom = 'otodom'
}

export enum Size {
    Room = 'room',
    Flat = 'flat'
}

@Entity('ogloszenia')
export default class Ad extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'miasto_id_teryt' })
    cityId: number;
    
    @Column({ name: 'dzielnica_id_teryt' })
    districtId: number;

    @Column({ name: 'zrodlo_id' })
    sourceId: string;

    @Column({ name: 'tytul' })
    title: string;

    @Column({ name: 'opis' })
    description: string;

    @Column({ name: 'powierzchnia' })
    area: number;

    @Column({ name: 'dodatkowe_oplaty' })
    additionalFees: number;

    @Column({ name: 'liczba_pokoi' })
    roomsNumber: number;

    @Column({ name: 'rodzaj_zabudowy' })
    buildingType: string;

    @Column({ name: 'pietro' })
    floor: string;

    @Column({ name: 'liczba_pieter' })
    floorsNumber: number;

    @Column({ name: 'poziom_opis' })
    levelDescription: string;

    @Column({ name: 'okna' })
    windows: string;

    @Column({ name: 'material_budynku' })
    buildingMaterial: string;

    @Column({ name: 'rok_budowy' })
    buildingYear: string;

    @Column({ name: 'autor' })
    ownerName: string;

    @Column({ name: 'nr_telefonu' })
    phoneNumber: string;

    @Column({ name: 'umeblowanie' })
    finishing: string;

    @Column({ name: 'czynsz' })
    price: number;

    @Column({ name: 'url' })
    url: string;

    @Column({ name: 'zrodlo' })
    source: AdSource;

    @ManyToOne(type => Street, (street: Street) => street.ads)
    @JoinColumn([
        { name: 'ulica_id', referencedColumnName: 'id' },
    ])
    street: Street;
    
    @ManyToOne(type => District, (district: District) => district.ads)
    @JoinColumn([
        { name: 'dzielnica_id_teryt', referencedColumnName: 'districtId' }
    ])
    district: District

    @OneToMany(() => Photo, (photo: Photo) => photo.ad)
    photos: Photo[];
}