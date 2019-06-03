using System;
using System.Threading.Tasks;

namespace ImportDanychAdresowych
{
    class Ulica : IEquatable<Ulica>
    {
        public int IdTeryt { get; set; }
        public string Cecha { get; set; }
        public int MiastoIdTeryt { get; set; }
        public string Nazwa { get; set; }

        public double Lat { get; set; }
        public double Lng { get; set; }

        public async Task FindCoordinates()
        {
            var c = await NominatimClient.Query(Nazwa);
            if (c != null)
            {
                Lat = c.Value.Item1;
                Lng = c.Value.Item2;
            }
        }

        public override bool Equals(object other)
        {
            if ((other == null) || !this.GetType().Equals(other.GetType()))
            {
                return false;
            }
            else
            {
                Ulica u = (Ulica)other;
                return Equals(u);
            }
        }

        public bool Equals(Ulica o)
        {
            return IdTeryt == o.IdTeryt && MiastoIdTeryt == o.MiastoIdTeryt;
        }
        public override int GetHashCode()
        {
            return IdTeryt + MiastoIdTeryt;
        }
    }
}