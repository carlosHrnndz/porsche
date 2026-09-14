// Fuentes y supuestos de mercado. Fotografía a 13/09/2026; no previsión para 2028.
window.WorkshopMarket = {
  "snapshotDate": "2026-09-13",
  "openingTarget": "2028-09",
  "areas": [
    {
      "id": "alcobendas_sanse",
      "name": "Alcobendas / San Sebastián de los Reyes",
      "municipalities": [
        {
          "code": "28006",
          "name": "Alcobendas",
          "count": 1548
        },
        {
          "code": "28134",
          "name": "San Sebastián de los Reyes",
          "count": 273
        }
      ],
      "count": 1821,
      "coverage": "Suma de ambos municipios; no incluye Madrid capital ni todo el norte.",
      "rentLow": 2500,
      "rentHigh": 2900,
      "rentSampleSize": 2,
      "rentBasis": "Dos anuncios en San Sebastián, 323–327 m² construidos; 164–248 m² en planta baja. No es una media de la zona.",
      "assessment": "Candidata razonable para validar demanda, con mayor parque local que los otros pares comparados. Ya hay especialista independiente y red oficial cercana.",
      "risks": [
        "El parque registrado no mide clientes captables.",
        "Muchos metros anunciados son oficinas; adaptación y accesos pueden invalidar la nave.",
        "Coste y desplazamientos deben compensarse con demanda demostrada."
      ],
      "sources": [
        {
          "title": "Datos locales del proyecto: DGT parque 2026-03 (sin revalidar origen)",
          "url": "referencia/data/parque_data.json"
        },
        {
          "title": "Carrera6 — taller especializado en Alcobendas",
          "url": "https://carrera6.com/"
        },
        {
          "title": "Porsche Ibérica — centros oficiales",
          "url": "https://www.porsche-iberica.com/es/centrosporsche/listado/"
        },
        {
          "title": "Anuncio: San Sebastián, Fuente Nueva, 327 m²",
          "url": "https://www.idealista.com/inmueble/104892228/"
        },
        {
          "title": "Anuncio: San Sebastián, Isla de Alegranza, 323 m²",
          "url": "https://www.idealista.com/inmueble/111263608/"
        }
      ]
    },
    {
      "id": "colmenar_trescantos",
      "name": "Colmenar Viejo / Tres Cantos",
      "municipalities": [
        {
          "code": "28045",
          "name": "Colmenar Viejo",
          "count": 115
        },
        {
          "code": "28903",
          "name": "Tres Cantos",
          "count": 69
        }
      ],
      "count": 184,
      "coverage": "Solo Colmenar Viejo y Tres Cantos. No incluye todo el corredor de la M-607.",
      "rentLow": null,
      "rentHigh": null,
      "rentSampleSize": 0,
      "rentBasis": "No se ha verificado en esta muestra un alquiler industrial comparable de 250–400 m². No equivale a falta de oferta.",
      "assessment": "Necesitaría captar fuera de sus municipios y demostrar que acceso, local o relaciones comerciales compensan el menor parque local observado.",
      "risks": [
        "Muestra local pequeña y clasificación de modelos especialmente incompleta.",
        "No atribuir menor competencia ni menor renta sin comprobarlo."
      ],
      "sources": [
        {
          "title": "Datos locales del proyecto: DGT parque 2026-03 (sin revalidar origen)",
          "url": "referencia/data/parque_data.json"
        }
      ]
    },
    {
      "id": "las_rozas",
      "name": "Las Rozas / entorno noroeste",
      "municipalities": [
        {
          "code": "28127",
          "name": "Las Rozas de Madrid",
          "count": 523
        }
      ],
      "count": 523,
      "coverage": "523 corresponde solo a Las Rozas. El anillo ampliado de cuatro municipios suma 2.941 y no debe compararse como si fuese el mismo perímetro.",
      "extendedCount": 2941,
      "extendedMunicipalities": [
        {
          "code": "28127",
          "name": "Las Rozas de Madrid",
          "count": 523
        },
        {
          "code": "28080",
          "name": "Majadahonda",
          "count": 548
        },
        {
          "code": "28115",
          "name": "Pozuelo de Alarcón",
          "count": 863
        },
        {
          "code": "28022",
          "name": "Boadilla del Monte",
          "count": 1007
        }
      ],
      "rentLow": null,
      "rentHigh": null,
      "rentSampleSize": 0,
      "rentBasis": "Sin alquiler comparable de 250–400 m² verificado en esta muestra. El traspaso de 180 m² se muestra aparte.",
      "assessment": "Tiene sentido explorar el anillo noroeste como área de captación; el parque de cuatro municipios no prueba que todos elijan un taller en Las Rozas.",
      "risks": [
        "Centro Porsche Madrid Oeste en Majadahonda.",
        "Validar tiempos reales de entrega/recogida y aparcamiento.",
        "El traspaso observado exige mucho capital y una superficie menor que la buscada."
      ],
      "sources": [
        {
          "title": "Datos locales del proyecto: DGT parque 2026-03 (sin revalidar origen)",
          "url": "referencia/data/parque_data.json"
        },
        {
          "title": "Centro Porsche Madrid Oeste — web oficial",
          "url": "https://dealer.porsche.com/es/madridoeste/es-ES"
        },
        {
          "title": "Traspaso: taller multimarca en Las Rozas, 180 m²",
          "url": "https://www.idealista.com/inmueble/111706785/"
        }
      ]
    },
    {
      "id": "sur",
      "name": "Leganés / Getafe / Alcorcón",
      "municipalities": [
        {
          "code": "28074",
          "name": "Leganés",
          "count": 132
        },
        {
          "code": "28065",
          "name": "Getafe",
          "count": 183
        },
        {
          "code": "28007",
          "name": "Alcorcón",
          "count": 126
        }
      ],
      "count": 441,
      "coverage": "Solo estos tres municipios; excluye Móstoles, Madrid capital y el resto del sur.",
      "rentLow": 2100,
      "rentHigh": 2100,
      "rentSampleSize": 1,
      "rentBasis": "Una nave de Getafe de 307 m² construidos y 232 en planta baja; renta base, gastos adicionales. No es una media de la zona.",
      "assessment": "Mantenerla en la selección: la cercanía personal puede facilitar la operación. La demanda deberá validarse y ya existen especialistas Porsche consolidados en el sur.",
      "risks": [
        "Menor parque registrado en estos tres municipios; no equivale a ausencia de mercado.",
        "Valentín Motors en Leganés y Taredblau en Móstoles.",
        "Las garantías de alquiler pueden inmovilizar caja incluso con renta moderada."
      ],
      "sources": [
        {
          "title": "Datos locales del proyecto: DGT parque 2026-03 (sin revalidar origen)",
          "url": "referencia/data/parque_data.json"
        },
        {
          "title": "Anuncio: Getafe, calle Destreza, 307 m²",
          "url": "https://www.idealista.com/inmueble/102493867/"
        },
        {
          "title": "Valentín Motors — centro de Leganés",
          "url": "https://www.valentinmotors.es/contacto"
        },
        {
          "title": "Taredblau — servicios y ubicación",
          "url": "https://taredblau.com/servicios/"
        }
      ]
    }
  ],
  "competitors": [
    {
      "id": "carrera6",
      "name": "Carrera6",
      "type": "Independiente",
      "location": "Alcobendas",
      "area": "alcobendas_sanse",
      "specialty": "Porsche; mecánica general, mantenimiento y diagnosis.",
      "implication": "Competidor directo por especialización y proximidad al corredor norte.",
      "sources": [
        {
          "title": "Carrera6 — taller especializado en Alcobendas",
          "url": "https://carrera6.com/"
        }
      ]
    },
    {
      "id": "valentin_motors",
      "name": "Valentín Motors Madrid",
      "type": "Independiente",
      "location": "Calle Puig Adam, 10, Leganés",
      "area": "sur",
      "specialty": "Porsche modernos y clásicos; mantenimiento, motores, transmisiones y comprobaciones de compra.",
      "implication": "El sur ya alberga una oferta especialista amplia; estudiar una propuesta concreta de servicio.",
      "sources": [
        {
          "title": "Valentín Motors — centro de Leganés",
          "url": "https://www.valentinmotors.es/contacto"
        },
        {
          "title": "Valentín Motors — servicios Porsche",
          "url": "https://www.valentinmotors.es/"
        }
      ]
    },
    {
      "id": "taredblau",
      "name": "Taredblau",
      "type": "Independiente",
      "location": "Calle Plasencia, 47, Móstoles",
      "area": "sur",
      "specialty": "Porsche; mantenimiento, PDK, comprobaciones de compra, IMS y diagnóstico del motor.",
      "implication": "Ejemplo de apertura con servicios propios delimitados y geometría externalizada.",
      "sources": [
        {
          "title": "Taredblau — servicios y ubicación",
          "url": "https://taredblau.com/servicios/"
        },
        {
          "title": "Taredblau — servicios que externaliza",
          "url": "https://taredblau.com/servicio/que-no-hacemos/"
        }
      ]
    },
    {
      "id": "porsche_oeste",
      "name": "Centro Porsche Madrid Oeste",
      "type": "Red oficial",
      "location": "Calle Ciruela, 5, Majadahonda",
      "area": "las_rozas",
      "specialty": "Venta y posventa oficial Porsche.",
      "implication": "Referencia de confianza y servicio en el noroeste; no se presume igualdad de tarifas.",
      "sources": [
        {
          "title": "Centro Porsche Madrid Oeste — web oficial",
          "url": "https://dealer.porsche.com/es/madridoeste/es-ES"
        }
      ]
    },
    {
      "id": "porsche_norte",
      "name": "Centro Porsche Madrid Norte",
      "type": "Red oficial",
      "location": "Avenida de Burgos, 87, Madrid",
      "area": "alcobendas_sanse",
      "specialty": "Venta y posventa oficial Porsche.",
      "implication": "Está en Madrid capital, próximo al corredor norte; no sumar su dirección a Alcobendas.",
      "sources": [
        {
          "title": "Porsche Ibérica — centros oficiales",
          "url": "https://www.porsche-iberica.com/es/centrosporsche/listado/"
        }
      ]
    }
  ],
  "listings": [
    {
      "id": "getafe_destreza",
      "area": "sur",
      "name": "Getafe — calle Destreza",
      "type": "Alquiler de nave",
      "rentMonthly": 2100,
      "builtM2": 307,
      "groundM2": 232,
      "rentPerBuiltM2": 6.84,
      "communityMonthly": 213.72,
      "ibiAnnual": 547.53,
      "recurringMonthlyBeforeTax": 2359.35,
      "deposit": 4200,
      "additionalGuarantee": 16797.61,
      "askingPriceOnly": true,
      "suitabilityConfirmed": false,
      "availableFrom": null,
      "caveat": "El total resumido del anuncio no suma correctamente el IBI; confirmar gastos y aval. La aptitud para taller está sin comprobar.",
      "sources": [
        {
          "title": "Anuncio: Getafe, calle Destreza, 307 m²",
          "url": "https://www.idealista.com/inmueble/102493867/"
        }
      ]
    },
    {
      "id": "sanse_fuente_nueva",
      "area": "alcobendas_sanse",
      "name": "San Sebastián — avenida Fuente Nueva",
      "type": "Alquiler de nave",
      "rentMonthly": 2500,
      "builtM2": 327.32,
      "groundM2": 163.66,
      "rentPerBuiltM2": 7.64,
      "askingPriceOnly": true,
      "suitabilityConfirmed": false,
      "availableFrom": "2026-10-31",
      "caveat": "La mitad son oficinas en primera planta. Fachada acristalada y acceso peatonal: comprobar entrada de vehículos. Comunidad adicional no cuantificada.",
      "sources": [
        {
          "title": "Anuncio: San Sebastián, Fuente Nueva, 327 m²",
          "url": "https://www.idealista.com/inmueble/104892228/"
        }
      ]
    },
    {
      "id": "sanse_alegranza",
      "area": "alcobendas_sanse",
      "name": "San Sebastián — calle Isla de Alegranza",
      "type": "Alquiler de nave",
      "rentMonthly": 2900,
      "builtM2": 323,
      "groundM2": 248,
      "rentPerBuiltM2": 8.98,
      "askingPriceOnly": true,
      "suitabilityConfirmed": false,
      "availableFrom": null,
      "caveat": "Interior compartimentado orientado a showroom/oficinas; adaptación por comprobar. Montacargas de 300 kg, sin utilidad para elevar coches.",
      "sources": [
        {
          "title": "Anuncio: San Sebastián, Isla de Alegranza, 323 m²",
          "url": "https://www.idealista.com/inmueble/111263608/"
        }
      ]
    }
  ],
  "transferExample": {
    "name": "Taller multimarca — calle Londres, Las Rozas",
    "type": "Traspaso; fuera del rango de 250–400 m²",
    "price": 350000,
    "rentMonthly": 3250,
    "builtM2": 180,
    "groundM2": 125,
    "askingPriceOnly": true,
    "suitabilityConfirmed": false,
    "caveat": "El anunciante ofrece equipamiento y actividad. Exige seis meses de garantía y un canon de red sin cuantificar. Cuentas, contrato, inventario y continuidad de la actividad pendientes de comprobación.",
    "sources": [
      {
        "title": "Traspaso: taller multimarca en Las Rozas, 180 m²",
        "url": "https://www.idealista.com/inmueble/111706785/"
      }
    ]
  },
  "salary": {
    "role": "Jefe de taller con experiencia Porsche y capacidad de formar a los socios",
    "currency": "EUR",
    "period": "anual",
    "grossLow": 40000,
    "grossBase": 45000,
    "grossHigh": 50000,
    "stressGross": 55000,
    "employerLoadAssumption": 0.35,
    "employerAnnualLow": 54000,
    "employerAnnualBase": 60750,
    "employerAnnualHigh": 67500,
    "employerMonthlyLow": 4500,
    "employerMonthlyBase": 5062.5,
    "employerMonthlyHigh": 5625,
    "evidenceStatus": "Hipótesis de presupuesto, no rango salarial Porsche Madrid confirmado.",
    "comparison": [
      {
        "name": "Adecco, Automoción 2025 — jefe de taller Madrid",
        "grossLow": 26000,
        "grossHigh": 37000,
        "note": "Tres tramos por experiencia: 26–28k, 28–32k y 32–37k. Sector general, no Porsche."
      },
      {
        "name": "Flexicar, jefe de taller Esplugues",
        "grossLow": 44000,
        "grossHigh": 45000,
        "note": "Oferta en Barcelona; exige más de cinco años de experiencia. Comparador, no estimador Madrid."
      },
      {
        "name": "V.M. German Engineering, jefe de taller Leganés",
        "grossLow": null,
        "grossHigh": null,
        "note": "Oferta recogida por un agregador, perfil de marca premium y liderazgo. Sin cifra salarial verificable."
      }
    ],
    "caveat": "El 35% es un recargo orientativo para simular coste empresarial, no un cálculo de nómina. Confirmar cotizaciones, variables y condiciones con asesoría. Selección, formación y cobertura de ausencias requieren partidas aparte. El neto deseado de los socios no equivale a coste de empresa.",
    "sources": [
      {
        "title": "Adecco — Guía salarial 2025, Automoción",
        "url": "https://www.adecco.com/-/jssmedia/project/adecco/adecco-es/guia-salarial/pdf/guia-salarial-2025-automocion.pdf"
      },
      {
        "title": "Flexicar — oferta jefe de taller en Esplugues (InfoJobs)",
        "url": "https://www.infojobs.net/esplugues-de-llobregat/jefe-taller-automotriz-esplugues/of-ia8c0b6a91d4b848b3812d8ffc1be61?applicationOrigin=Corporativas-DP"
      },
      {
        "title": "V.M. German Engineering — jefe de taller Leganés (agregador, salario no publicado)",
        "url": "https://es.trabajo.org/oferta-5001-5bbc085eed24c598ce9e47b8d447a082"
      }
    ]
  },
  "dataCaveat": "Fotografía de anuncios y fuentes consultadas el 13/09/2026, no previsión de precios ni disponibilidad en septiembre de 2028. Los recuentos reproducen el JSON local etiquetado DGT parque 2026-03: cada fila representa un registro y se agrupa por código municipal. No se ha revalidado su transformación contra el fichero original DGT. De 17.658 registros Madrid, 1.614 no tienen municipio y 4.685 llevan familia sin identificar o clásico sin identificar. No son clientes, personas únicas ni coches fuera de garantía. Municipios distintos no definen por sí solos un área de captación comparable. Los alquileres son precios solicitados de tres anuncios, no estadística representativa ni validación de licencia de taller.",
  "decision": "Visitar y validar demanda en norte y sur en paralelo; mantener Las Rozas como alternativa. Elegir por coste total de apertura, superficie útil, acceso, demanda demostrada y disponibilidad del jefe, no por una puntuación inventada."
};
