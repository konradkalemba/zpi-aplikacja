using System;
using System.Threading.Tasks;

namespace ImportDanychAdresowych
{
    class Miasto
    {
        public int IdTeryt { get; set; }
        public int WojewodztwoIdTeryt { get; set; }
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
    }
}