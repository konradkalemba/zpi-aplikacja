using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Security;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using Npgsql;

namespace ImportDanychAdresowych
{
    public class Import
    {
        private string _dbcon;
        private char _sep = ';';

        private string _srvCert;

        private IList<Wojewodztwo> _w;
        private IList<Miasto> _m;
        private IList<Dzielnica> _d;
        private IList<Ulica> _u;

        // nazwa -> id_teryt
        private Dictionary<string, int> _delegatury;

        private Dictionary<string, int> _miastaZDelegaturamiId = new Dictionary<string, int>()
                {
            {"Wrocław", -1},
            {"Kraków", -1},
            {"Łódź", -1},
            {"Poznań", -1}
        };


        public Import(string addr, string srvCert, string usr, string pass, string db)
        {
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
            _delegatury = new Dictionary<string, int>();
            _srvCert = srvCert.Replace("-----BEGIN CERTIFICATE-----", "");
            _srvCert = _srvCert.Replace("-----END CERTIFICATE-----", "");
            _srvCert = Regex.Replace(_srvCert, @"\s+", "");
            _dbcon = $"Host={addr};Username={usr};Password={pass};Database={db};SSL Mode=Require;";
        }
        // pliki
        // http://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne.aspx?contrast=default
        // opisy struktur
        // http://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/udostepnianie_danych/baza_teryt/uzytkownicy_indywidualni/pobieranie/pliki_pelne_struktury.aspx
        // opisy cd
        // http://eteryt.stat.gov.pl/eTeryt/rejestr_teryt/ogolna_charakterystyka_systemow_rejestru/ogolna_charakterystyka_systemow_rejestru.aspx?contrast=default
        public async Task Run(string terc, string simc, string ulic)
        {
            await LoadFromCsv(terc, simc, ulic);
            await Persist();
        }
        private async Task LoadFromCsv(string terc, string simc, string ulic)
        {
            string l = null;

            // województwa
            _w = new List<Wojewodztwo>();
            using (var r = new StreamReader(new FileStream(terc, FileMode.Open)))
            {
                await r.ReadLineAsync();
                while ((l = await r.ReadLineAsync()) != null)
                {
                    string[] cols = l.Split(_sep);
                    if (cols.Length > 5 && cols[5] == "województwo")
                    {
                        var w = new Wojewodztwo()
                        {
                            IdTeryt = int.Parse(cols[0]),
                            Nazwa = cols[4]
                        };
                        _w.Add(w);
                    }
                }
            }
            _m = new List<Miasto>();
            // miasta i delegatury
            using (var r = new StreamReader(new FileStream(simc, FileMode.Open)))
            {
                await r.ReadLineAsync();
                while ((l = await r.ReadLineAsync()) != null)
                {
                    string[] cols = l.Split(_sep);
                    if (cols.Length > 4)
                    {
                        int rodz = int.Parse(cols[4]);
                        // miasto
                        if (rodz == 96)
                        {
                            var m = new Miasto()
                            {
                                IdTeryt = int.Parse(cols[7]),
                                Nazwa = cols[6],
                                WojewodztwoIdTeryt = int.Parse(cols[0])
                            };
                            _m.Add(m);
                            foreach (var md in new Dictionary<string, int>(_miastaZDelegaturamiId))
                                if (m.Nazwa == md.Key)
                                    _miastaZDelegaturamiId[m.Nazwa] = m.IdTeryt;
                        }
                        // delegatura - zapisz id
                        if (rodz == 98)
                            foreach (var d in _miastaZDelegaturamiId)
                                if (cols[6].Contains(d.Key + "-"))
                                    _delegatury[cols[6]] = int.Parse(cols[7]);
                    }
                }
            }

            // dzielnice
            _d = new List<Dzielnica>();
            using (var r = new StreamReader(new FileStream(simc, FileMode.Open)))
            {
                await r.ReadLineAsync();
                while ((l = await r.ReadLineAsync()) != null)
                {
                    string[] cols = l.Split(_sep);
                    if (cols.Length > 4)
                    {
                        int rodz = int.Parse(cols[4]);
                        // część miasta
                        if (rodz == 99)
                        {
                            var d = new Dzielnica()
                            {
                                IdTeryt = int.Parse(cols[7]),
                                Nazwa = cols[6],
                                MiastoIdTeryt = int.Parse(cols[8])
                            };
                            foreach (var md in _delegatury)
                                if (d.MiastoIdTeryt == md.Value)
                                    d.MiastoIdTeryt = _miastaZDelegaturamiId[md.Key.Remove(md.Key.IndexOf("-"))];

                            if (_m.Any(m => m.IdTeryt == d.MiastoIdTeryt))
                                _d.Add(d);
                        }
                    }
                }
            }

            // ulice
            _u = new List<Ulica>();
            using (var r = new StreamReader(new FileStream(ulic, FileMode.Open)))
            {
                await r.ReadLineAsync();
                while ((l = await r.ReadLineAsync()) != null)
                {
                    string[] cols = l.Split(_sep);
                    if (cols.Length > 8)
                    {
                        var u = new Ulica()
                        {
                            IdTeryt = int.Parse(cols[5]),
                            Nazwa = string.Join(' ', cols[8], cols[7]).Trim(),
                            MiastoIdTeryt = int.Parse(cols[4])
                        };
                        foreach (var md in _delegatury)
                            if (u.MiastoIdTeryt == md.Value)
                                u.MiastoIdTeryt = _miastaZDelegaturamiId[md.Key.Remove(md.Key.IndexOf("-"))];

                        if (_m.Any(m => m.IdTeryt == u.MiastoIdTeryt))
                            _u.Add(u);
                    }
                }
            }
        }

        private async Task Persist()
        {
            using (var c = new NpgsqlConnection(_dbcon))
            {
                c.UserCertificateValidationCallback = ValidateCert;
                await c.OpenAsync();
                using (var t = c.BeginTransaction())
                {
                    var existing = (await c.QueryAsync<int>("select id_teryt from wojewodztwa;")).ToHashSet();

                    Console.WriteLine("Kopiowanie województw...");
                    // województwa
                    foreach (var w in _w)
                        if (!existing.Contains(w.IdTeryt))
                            await c.ExecuteAsync("insert into wojewodztwa(id_teryt,nazwa) values (@IdTeryt,@Nazwa)", w);

                    // miasta
                    Console.WriteLine("Kopiowanie miast...");
                    existing = (await c.QueryAsync<int>("select id_teryt from miasta;")).ToHashSet();
                    _m = _m.Where(m => !existing.Contains(m.IdTeryt)).ToList();
                    using (var wr = c.BeginBinaryImport("copy miasta(id_teryt,nazwa,wojewodztwo_id_teryt) from stdin (format binary);"))
                    {
                        foreach (var m in _m)
                        {
                            wr.WriteRow(m.IdTeryt, m.Nazwa, m.WojewodztwoIdTeryt);
                        }
                        wr.Complete();
                    }

                    // dzielnice
                    Console.WriteLine("Kopiowanie dzielnic...");
                    existing = (await c.QueryAsync<int>("select id_teryt from dzielnice;")).ToHashSet();
                    _d = _d.Where(d => !existing.Contains(d.IdTeryt)).ToList();
                    using (var wr = c.BeginBinaryImport("copy dzielnice(id_teryt,nazwa,miasto_id_teryt) from stdin (format binary);"))
                    {
                        foreach (var d in _d)
                        {
                            wr.WriteRow(d.IdTeryt, d.Nazwa, d.MiastoIdTeryt);
                        }
                        wr.Complete();
                    }

                    // ulice
                    Console.WriteLine("Kopiowanie ulic...");
                    var exStr = (await c.QueryAsync<Ulica>("select id_teryt, miasto_id_teryt from ulice;"));

                    _u = _u
                        .Where(u => !exStr.Any(e => e.Equals(u)))
                        .Distinct()
                        .ToList();

                    using (var wr = c.BeginBinaryImport("copy ulice(id_teryt,nazwa,miasto_id_teryt) from stdin (format binary);"))
                    {
                        foreach (var u in _u)
                        {
                            wr.WriteRow(u.IdTeryt, u.Nazwa, u.MiastoIdTeryt);
                        }
                        wr.Complete();
                    }

                    await t.CommitAsync();
                }
            }
        }
        private bool ValidateCert(object sender, X509Certificate cert, X509Chain chain, SslPolicyErrors err)
        {
            Console.WriteLine(Convert.ToBase64String(cert.GetRawCertData()));
            Console.WriteLine();
            Console.WriteLine(_srvCert);
            return Convert.ToBase64String(cert.GetRawCertData()) == _srvCert;
        }
    }
}