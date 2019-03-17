select id_teryt, nazwa, similarity(nazwa, 'Henryka Wieniawskiego') as sim
from ulice
where nazwa % 'Henryka Wieniawskiego'
order by sim
limit 5;

