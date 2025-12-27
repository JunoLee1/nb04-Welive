//====================================
// Request
//====================================

export type SearchKeyword = {
  [key in "address" | "descrption" | "contact" | "name" | "officeNumber"]: string;
};
export interface RequestQuery {
  page: number;
  limit: number;
  searchKeyword: SearchKeyword | undefined ;
}

export interface RequestPathParam {
  id: string;
}

//====================================
// Response DTO
//====================================

export interface AparmentDto {
    id : string,
    name : string, // apt name
    address: string,
    officeNumber: string,
    description: string,
    building: number[],
    unit: number[],
}

export interface GetApartmentsResponseDto {
    data: AparmentDto,
    totalCount: number,
    hasNext: boolean,
    page: number;
    limit: number;
}
