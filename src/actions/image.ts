"use server";

import { currentUser } from "@clerk/nextjs/server";

export async function getImages(query: string, perPage: number = 12){
    try {
        const currUser = await currentUser();
        
        if(!currUser || !currUser.id){
            return { success: false, error: "User not authenticated", status: 401 };
        }

        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&per_page=${perPage}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        );

        if(!response.ok){
            return {success: false, error: `Unsplash API error: ${response.statusText}`, status: response.status}
        }
        const data = await response.json();
        return { success: true, data: data.results || [], status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while fetching images: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}