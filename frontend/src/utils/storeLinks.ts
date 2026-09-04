/** 高德地图搜索（到店导航） */
export function getAmapSearchUrl(name: string, address: string) {
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(`${name} ${address}`)}`
}

export function getTelUrl(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`
}
