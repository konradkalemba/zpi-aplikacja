using System;

namespace ImportDanychAdresowych
{
    public class PgCon
    {
        public string Host { get; set; }
        // certyfikat wystawiony dla postgresa, nie ca
        public string ServerCrtFile { get; set; }
        public string User { get; set; }
        public string Pass { get; set; }
        public string Db { get; set; }
    }
}