import { BaseEntity, Entity, Column, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm'
import { Ad } from './index'

@Entity('zdjecia')
export default class Photo extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column({ name: 'sciezka' })
    path: string;
    
    @ManyToOne(type => Ad, (ad: Ad) => ad.photos)
    @JoinColumn({ name: 'ogloszenie_id', referencedColumnName: 'id' })
    ad: Ad;
}