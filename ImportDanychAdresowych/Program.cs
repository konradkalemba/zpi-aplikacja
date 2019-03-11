using System;
using System.IO;
using Newtonsoft.Json;

namespace ImportDanychAdresowych
{
    class Program
    {
        static void Main(string[] args)
        {
            var con = JsonConvert.DeserializeObject<PgCon>(File.ReadAllText("./pg-con.json"));
            var imp = new Import(con.Host, con.ServerCrt, con.User, con.Pass, con.Db);
            imp.Run("./terc.csv", "./simc.csv", "./ulic.csv").Wait();
        }
    }
}
