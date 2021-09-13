//
// MISCELLANEOUS TYPES 
//

// TODO - DELETE
// export type Measurement = {
//   raw: number;
//   normalized?: number;
//   byDistrict?: any[];
//   notes: Dict;
// }

export type Dict = {[key: string]: any};


// ENUMS

export const enum Party
{
  Democratic,
  Republican
}

export const enum DistrictType
{
  Congressional,
  StateLegislative
}

