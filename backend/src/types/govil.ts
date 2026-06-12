/**
 * Raw record shape from data.gov.il CKAN datastore_search
 * Resource: "רכב פרטי ומסחרי עד 3.5 טון"
 * resource_id: 053cea08-09bc-40ec-8f7a-156f0677aff3
 */
export interface GovIlVehicleRecord {
  _id: number;
  mispar_rechev: number;
  tozeret_cd: number;
  sug_degem: string;
  tozeret_nm: string;
  degem_cd: number;
  degem_nm: string;
  ramat_gimur: string;
  ramat_eivzur_betihuty: number | null;
  kvutzat_zihum: number | null;
  shnat_yitzur: number;
  degem_manoa: string;
  mivchan_acharon_dt: string;
  tokef_dt: string;
  baalut: string;
  misgeret: string;
  tzeva_cd: number;
  tzeva_rechev: string;
  zmig_kidmi: string;
  zmig_ahori: string;
  sug_delek_nm: string;
  horaat_rishum: number | null;
  moed_aliya_lakvish: string | null;
  kinuy_mishari: string;
}

export interface GovIlDatastoreSearchResult {
  success: boolean;
  result?: {
    records: GovIlVehicleRecord[];
    total: number;
  };
  error?: unknown;
}
