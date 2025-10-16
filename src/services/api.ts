import axios from 'axios';
import type{ ArtworkApiResponse } from '../types';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const artworkService = {
  async getArtworks(page: number, limit: number = 5): Promise<ArtworkApiResponse> {
    try {
      const response = await axios.get<ArtworkApiResponse>(
        `${BASE_URL}?page=${page}&limit=${limit}&fields=id,title,artist_display`
      );
      
     
      const transformedData = response.data.data.map(artwork => ({
        ...artwork,
        category: artwork.artist_display 
      }));
      
      return {
        ...response.data,
        data: transformedData
      };
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  }
};