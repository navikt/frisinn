

# Forslag innsendt søknad (eksempel)
```
  {
  "søknadId": "XXXXUUIDXXXX",
  "mottattDato": "2020-04-04T12:00:00+01:00",
  "versjon": "1.0",
  "søker": {
    "aktørId": "260676XXXXX1"
  },
  "søknadsperiode": "2020-04-01/2002-04-30"
  "inntekter": {
    "frilans": {
      "inntektstapStartet": "2020-03-13",  // mulig dette bli fast 13.mars
      "inntekterFør": {
        // rapporter historiske inntekter 12 fulle kalendermåneder før skjæringstidspunkt første gang?
        "2019-02-01/2019-02-28": {
          "beløp": "2000.00"
        },
        "2020-02-01/2020-02-29": {
          "beløp": "3000.00"
        },
        // rapporter inntekt i måned med skjæringstidspunkt før stp hvis
        "2020-03-01/2020-03-12": {
          "beløp": "1000.00"
        }
      },
      "inntekterEtter": {
        // rapporter inntekt i måned med stp etter
        "2020-03-13/2020-03-30": {
          "beløp": "500.00"
        },
        // rapporter påløpende inntekter i måneder det søkes for
        "2020-04-01/2020-04-30": {
          "beløp": "1000.00"
        }
      }
    },
    "selvstendig": [
      {
        "orgnummer": "92134212",
        "inntektstapStartet": "2020-03-13",
        "inntekterFør": {
          // rapporter historiske inntekter 12 fulle kalendermåneder før skjæringstidspunkt første gang?
          "2019-02-01/2019-02-28": {
            "beløp": "2000.00"
          },
          "2020-02-01/2020-02-29": {
            "beløp": "3000.00"
          },
          // rapporter inntekt i måned med skjæringstidspunkt før stp hvis
          "2020-03-01/2020-03-12": {
            "beløp": "1000.00"
          }
        },
        "inntekterEtter": {
          // rapporter inntekt i måned med stp etter
          "2020-03-13/2020-03-30": {
            "beløp": "500.00"
          },
          // rapporter påløpende inntekter i måneder det søkes for
          "2020-04-01/2020-04-30": {
            "beløp": "1000.00"
          }
        }
      }
    ]
  }
}
```
