using System;
using System.IO;
using Newtonsoft.Json;

namespace ImportDanychAdresowych
{
    class Program
    {
        static int Main(string[] args)
        {
            if (args.Length != 1)
            {
                Console.WriteLine("No PG connection configuration file specified!");
                return 1;
            }
            var con = JsonConvert.DeserializeObject<PgCon>(File.ReadAllText(args[0]));
            var imp = new Import(con.Host, File.ReadAllText(con.ServerCrtFile), con.User, con.Pass, con.Db);
            imp.Run("./terc.csv", "./simc.csv", "./ulic.csv").Wait();
            return 0;
        }
    }
}
