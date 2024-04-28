CREATE TABLE "bkpf" (
  "bukrs" char(4),
  "belnr" char(10),
  "gjahr" char(4),
  "blart" char(2),
  "bldat" date,
  "budat" date,
  "monat" char(2),
  "cpudt" date,
  "cputm" time,
  PRIMARY KEY ("bukrs", "belnr", "gjahr")
);

CREATE TABLE "bseg" (
  "bukrs" char(4),
  "belnr" char(10),
  "gjahr" char(4),
  "buzei" char(3),
  "buzid" char(1),
  "augdt" date,
  "augcp" date,
  "augbl" char(10),
  "bschl" char(2),
  PRIMARY KEY ("bukrs", "belnr", "gjahr", "buzei")
);

COMMENT ON COLUMN "bkpf"."bukrs" IS 'Bedrijfsnummer';

COMMENT ON COLUMN "bkpf"."belnr" IS 'Documentnummer boekhoudingsdocument';

COMMENT ON COLUMN "bkpf"."gjahr" IS 'Boekjaar';

COMMENT ON COLUMN "bkpf"."blart" IS 'Documentsoort';

COMMENT ON COLUMN "bkpf"."bldat" IS 'Documentdatum in document';

COMMENT ON COLUMN "bkpf"."budat" IS 'Boekingsdatum in document';

COMMENT ON COLUMN "bkpf"."monat" IS 'Boekmaand';

COMMENT ON COLUMN "bkpf"."cpudt" IS 'Dag waarop boekhoudingsdocument is ingevoerd';

COMMENT ON COLUMN "bkpf"."cputm" IS 'Tijd waarop gegevens zijn ingevoerd';

COMMENT ON COLUMN "bseg"."bukrs" IS 'Bedrijfsnummer';

COMMENT ON COLUMN "bseg"."belnr" IS 'Documentnummer boekhoudingsdocument';

COMMENT ON COLUMN "bseg"."gjahr" IS 'Boekjaar';

COMMENT ON COLUMN "bseg"."buzei" IS 'Nummer van boekingsregel in boekhoudingsdocument';

COMMENT ON COLUMN "bseg"."buzid" IS 'Identificatie van boekingsregel';

COMMENT ON COLUMN "bseg"."augdt" IS 'Datum van vereffening';

COMMENT ON COLUMN "bseg"."augcp" IS 'Invoerdatum van de vereffening';

COMMENT ON COLUMN "bseg"."augbl" IS 'Documentnummer van vereffeningsdocument';

COMMENT ON COLUMN "bseg"."bschl" IS 'Boekingssleutel';

ALTER TABLE "bseg" ADD FOREIGN KEY ("bukrs") REFERENCES "bkpf" ("bukrs");

ALTER TABLE "bseg" ADD FOREIGN KEY ("belnr") REFERENCES "bkpf" ("belnr");

ALTER TABLE "bseg" ADD FOREIGN KEY ("gjahr") REFERENCES "bkpf" ("gjahr");
