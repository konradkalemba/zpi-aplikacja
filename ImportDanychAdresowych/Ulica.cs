using System;

namespace ImportDanychAdresowych
{
    class Ulica : IEquatable<Ulica>
    {
        public int IdTeryt { get; set; }
        public string Cecha { get; set; }
        public int MiastoIdTeryt { get; set; }
        public string Nazwa { get; set; }

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