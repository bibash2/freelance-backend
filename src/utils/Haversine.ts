// import prisma from "../../config/prisma";
// 
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
  
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }


export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const distance = haversineDistance(lat1, lon1, lat2, lon2);
    return distance;
}
  

// export async function getServiceProviderByLocation(lat: number, lng: number): Promise<any> {
//     const radius = 100; // km
    
//     const users = await prisma.$queryRawUnsafe(`
//       SELECT id, name, latitude, longitude,
//         (6371 * acos(
//           cos(radians(${lat})) *
//           cos(radians(latitude)) *
//           cos(radians(longitude) - radians(${lng})) +
//           sin(radians(${lat})) *
//           sin(radians(latitude))
//         )) AS distance_km
//       FROM "User"
//       WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND role = 'SERVICE_PROVIDER'
//       HAVING distance_km < ${radius}
//       ORDER BY distance_km ASC;
//     `);

//     return users;
    
// }

// export async function getServicePostByLocation(lat: number, lng: number): Promise<any> {
//     const radius = 50; // km
    
//     const posts = await prisma.$queryRawUnsafe(`
//       SELECT id
//       FROM "Post"
//       WHERE latitude IS NOT NULL AND longitude IS NOT NULL 
//       HAVING distance_km < ${radius}
//       ORDER BY distance_km ASC;
//     `);

//     return posts;
    
// }

    
    