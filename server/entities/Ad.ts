import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, Any, ManyToOne, JoinColumn } from 'typeorm'
import { Street } from './index'

@Entity('ogloszenia')
export default class Ad extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ name: 'opis' })
    description: string;

    @Column({ name: 'powierzchnia' })
    area: string;
    
    @Column({ name: 'dodatkowe_oplaty' })
    additionalFees: string;

    @Column({ name: 'liczba_pokoi' })
    roomsNumber: string;

    @Column({ name: 'rodzaj_zabudowy' })
    buildingType: string;

    @Column({ name: 'pietro' })
    floor: string;

    @Column({ name: 'liczba_pieter' })
    floorsNumber: string;

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
    price: string;

    @ManyToOne(type => Street, (street: Street) => street.ads)
    @JoinColumn([
        { name: 'ulica_id', referencedColumnName: 'id' },
        { name: 'miasto_id', referencedColumnName: 'cityId' }
    ])
    street: Street;
}