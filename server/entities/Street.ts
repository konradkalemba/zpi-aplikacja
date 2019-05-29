import { BaseEntity, Entity, Column, OneToMany, PrimaryColumn } from 'typeorm'
import { Ad } from './index'

@Entity('ulice')
export default class Street extends BaseEntity {
    @PrimaryColumn({ name: 'id' })
    id: number;

    @PrimaryColumn({ name: 'miasto_id_teryt' })
    cityId: number;

    @Column({ name: 'nazwa' })
    name: string;

    @Column()
    lat: number;

    @Column()
    long: number;
    
    @OneToMany(() => Ad, (ad: Ad) => ad.street)
    ads: Ad[];
}