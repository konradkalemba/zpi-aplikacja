select id_teryt, nazwa, nazwa <-> 'Henryka Wieniawskiego' as dist
from ulice
order by dist
limit 5;