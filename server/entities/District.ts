import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn } from 'typeorm'
import { Ad } from './index'

@Entity('dzielnice')
export default class District extends BaseEntity {
    @PrimaryColumn({ name: 'id_teryt' })
    idTeryt: number;

    @PrimaryColumn({ name: 'miasto_id_teryt' })
    cityId: number;

    @Column({ name: 'nazwa' })
    name: string;
    
    // @OneToMany(() => Ad, (ad: Ad) => ad.district)
    // ads: Ad[];
}