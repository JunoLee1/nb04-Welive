//====================================
// Request
//====================================

export type SearchKeyword = Partial<{
  address: string;
  description: string;
  contact: string;
  name: string;
  officeNumber: string;
}>;
export interface RequestQuery {
  page: number;
  limit: number;
  searchKeyword: SearchKeyword | undefined;
}

export interface RequestPathParam {
  id: string;
}

//====================================
// Response DTO
//====================================

export interface ApartmentDto {
  id: string;
  name: string; // apt name
  address: string;
  officeNumber: string | null;
  description: string | null;
  building?: number[] | undefined;
  unit?: number[] | undefined;
}

export interface GetApartmentsResponseDto {
  data: ApartmentDto[];
  totalCount: number;
  hasNext: boolean;
  page: number;
  limit: number;
}
