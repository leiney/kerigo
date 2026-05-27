
export const  TENANT_ID  = "EC02";
export default function ReturnHeaders(token : string){
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-tenant-id": `${TENANT_ID}`,
        "Authorization": `Bearer ${token}`
      }; 

      return headers
}

export const QUERY_STRING = `?tenant-id=${TENANT_ID}`;
export const BASE_URL ="https://ciprop.mustsacco.co.ke"

export const HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "x-tenant-id": TENANT_ID,
}; 


