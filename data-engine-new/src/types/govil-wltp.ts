/** Raw record from data.gov.il — תוצרים ודגמים של כלי רכב WLTP */
export interface GovIlWltpRecord {
  _id: number;
  sug_degem: string;
  tozeret_cd: number;
  tozeret_nm: string;
  tozeret_eretz_nm: string | null;
  tozar: string | null;
  degem_cd: number;
  degem_nm: string;
  shnat_yitzur: number;
  kvuzat_agra_cd: number | null;
  nefah_manoa: number | null;
  mishkal_kolel: number | null;
  gova: number | null;
  hanaa_cd: number | null;
  hanaa_nm: string | null;
  mazgan_ind: number | null;
  abs_ind: number | null;
  kariot_avir_source: string | null;
  mispar_kariot_avir: number | null;
  hege_koah_ind: number | null;
  automatic_ind: number | null;
  halonot_hashmal_source: string | null;
  mispar_halonot_hashmal: number | null;
  halon_bagg_ind: number | null;
  galgaley_sagsoget_kala_ind: number | null;
  argaz_ind: number | null;
  merkav: string | null;
  ramat_gimur: string | null;
  delek_cd: number | null;
  delek_nm: string | null;
  mispar_dlatot: number | null;
  koah_sus: number | null;
  mispar_moshavim: number | null;
  bakarat_yatzivut_ind: number | null;
  technologiat_hanaa_nm: string | null;
  kvutzat_zihum: number | null;
  bakarat_stiya_menativ_ind: number | null;
  bakarat_shyut_adaptivit_ind: number | null;
  kinuy_mishari: string | null;
}

export interface GovIlWltpSearchResult {
  success: boolean;
  result?: {
    records: GovIlWltpRecord[];
    total: number;
  };
  error?: unknown;
}
