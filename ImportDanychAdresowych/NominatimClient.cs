using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;

namespace ImportDanychAdresowych
{
    static class NominatimClient
    {
        static string url = "https://nominatim.openstreetmap.org/search?format=json&q=";
        public static async Task<(double, double)?> Query(string q)
        {
            using (var c = new HttpClient())
            {
                string json = await c.GetStringAsync(url + q);
                var r = JsonConvert.DeserializeObject<IEnumerable<NominatimResponse>>(json);
                var best = r.FirstOrDefault();
                if (best != null)
                {
                    return (best.Lat, best.Lng);
                }
                else return null;
            }
        }
    }


    class NominatimResponse
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string DisplayName { get; set; }
        public string Class { get; set; }
    }
}
