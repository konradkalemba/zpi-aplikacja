using System;

namespace ImportDanychAdresowych
{
    class Program
    {
        static string SERVER_CERT = 
"MIICETCCAZigAwIBAgIQNH/sITmLm4qM/imlvPdqQzAKBggqhkjOPQQDAjAQMQ4w"+
"DAYDVQQDDAVQRy1DQTAeFw0xOTAzMDkyMzM4MTdaFw0yOTAzMDYyMzM4MTdaMBQx"+
"EjAQBgNVBAMMCXBnLXNlcnZlcjB2MBAGByqGSM49AgEGBSuBBAAiA2IABME5pMPy"+
"0BaHFn5egAbtwbJwwQUlc+NX5fxKVcY7yt+FhOv0TqpqZ96BG7dpdUL4oBbdXbH4"+
"zru4npQtc2S/HpQxyFjozxTzQmBrG0UzJ//TkaVKUhlgII53mv9VL1vdfaOBsjCB"+
"rzAJBgNVHRMEAjAAMB0GA1UdDgQWBBRlHBLCzj3V1NcAFRZ1wRs7OSauAzBLBgNV"+
"HSMERDBCgBSOVKgpwjwMPwGxfMHKMFLnoI5tF6EUpBIwEDEOMAwGA1UEAwwFUEct"+
"Q0GCFFUY3qxVzrOJuZOSMLZaFF9oZKXiMBMGA1UdJQQMMAoGCCsGAQUFBwMBMAsG"+
"A1UdDwQEAwIFoDAUBgNVHREEDTALgglwZy1zZXJ2ZXIwCgYIKoZIzj0EAwIDZwAw"+
"ZAIwVZXpaXsBYekyJL1O0JeVDktcQiWXHjLgIOGeLjLgxOlLk6UKqaI4PkvS4UJt"+
"jw2CAjBAUWYMjCtkU5KhxA3ZO8GgQLO//SzpGkJfVhtjRx+iIR+NHTEl/JljrdOd"+
"Bt1XWhA=";
        static string SERVER_ADDR = "fd0a:d902:e4ad:6bd2::1";
        static string USR = "zpi";
        static string PASS = "AFhoDMD7Tf4BYItJkAE7TCgZhl1MLQAR";
        static string DB = "zpi";

        static void Main(string[] args)
        {
            var imp = new Import(SERVER_ADDR, SERVER_CERT, USR, PASS, DB);
            imp.Run("./terc.csv", "./simc.csv", "./ulic.csv").Wait();
        }
    }
}
