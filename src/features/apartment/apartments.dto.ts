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

export interface ApartmentDTO {
  id: string;
  name: string; // apt name
  address: string;
  officeNumber: string | null;
  description: string | null;
  buildings: number[] | string[];
}

export interface GetApartmentsResponseDto {
  data: ApartmentDTO[];
  totalCount: number;
  hasNext: boolean;
  page: number;
  limit: number;
}
