import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
import axios from "axios";

const initialState = {
  movies: [],
  tvSeries: [],
  cast: null,
  status: "idle", // for tracking request status
  error: null, // for error handling
  searched: { data: [], searchedtext: "" },
  bookmarked: [],
  recommendations: [],
};

const createArrayFromRawData = async (array, dataArray) => {
  for (const item of array) {
    if (item.backdrop_path) {
      try {
        const releaseResponse = await axios.get(
          `${TMDB_BASE_URL}/movie/${item.id}/release_dates?api_key=${API_KEY}`
        );
        const { results } = releaseResponse.data;
        const certificationInfo = results.find(
          (release) => release.iso_3166_1 === "US"
        );

        dataArray.push({
          id: item.id,
          genre_ids: item.genre_ids ? item.genre_ids : "Not-found",
          name: item.original_title,
          original_language: item.original_language
            ? item.original_language
            : "Not_found",
          overview: item.overview ? item.overview : "Not-found",
          poster_path: item.poster_path ? item.poster_path : "Not-found",
          image: item.backdrop_path,
          rating: item.vote_average ? item.vote_average : "Not-found",
          certification:
            certificationInfo &&
            certificationInfo.release_dates[0].certification
              ? certificationInfo.release_dates[0].certification
              : "Not Rated", // NR: Not Rated
          releaseYear: item.release_date
            ? item.release_date.split("-")[0]
            : "Unknown",
          type: "Movie",
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(`Release dates not found for movie ID: ${item.id}`);
          dataArray.push({
            id: item.id,
            name: item.original_title,
            image: item.backdrop_path,
            certification: "NR", // NR: Not Rated
            releaseYear: item.release_date
              ? item.release_date.split("-")[0]
              : "Unknown",
            type: "movie",
          });
        } else {
          throw error;
        }
      }
    }
  }
};

const createArrayFromRawSeriesData = async (array, dataArray) => {
  for (const item of array) {
    if (item.backdrop_path) {
      try {
        const contentResponse = await axios.get(
          `${TMDB_BASE_URL}/tv/${item.id}/content_ratings?api_key=${API_KEY}`
        );
        const { results } = contentResponse.data;

        if (results) {
          const certificationInfo = results.find(
            (rating) => rating.iso_3166_1 === "US"
          );

          dataArray.push({
            id: item.id,
            name: item.original_name,
            image: item.backdrop_path,
            certification: certificationInfo ? certificationInfo.rating : "NR",
            releaseYear: item.first_air_date
              ? item.first_air_date.split("-")[0]
              : "Unknown",
            type: "tv-series",
          });
        } else {
          console.warn(
            `Content ratings not found for TV series ID: ${item.id}`
          );
          dataArray.push({
            id: item.id,
            name: item.original_name,
            image: item.backdrop_path,
            certification: "NR", // Set default certification to "NR" (Not Rated)
            releaseYear: item.first_air_date
              ? item.first_air_date.split("-")[0]
              : "Unknown",
            type: "tv-series",
          });
        }
      } catch (error) {
        console.error("Error fetching content ratings:", error);
        // Handle error appropriately
      }
    }
  }
};

const getRawData = async (api, paging, dataArray, isSeries = false) => {
  console.log("getRawData called", { api, paging, isSeries });
  for (let i = 1; dataArray.length < 60 && i <= 10; i++) {
    console.log("Fetching page", i);
    try {
      const response = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
      const { results } = response.data;
      console.log("Results fetched", results);
      if (isSeries) {
        await createArrayFromRawSeriesData(results, dataArray);
      } else {
        await createArrayFromRawData(results, dataArray);
      }
      console.log("Data array after processing", dataArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  }
};
export const fetchUserRecommendations = createAsyncThunk(
  "netflix/fetchUserRecommendations",
  async ({ contentId, contentType }, thunkAPI) => {
    try {
      console.log("Fetching recommendations for", contentId, contentType);

      let response;
      if (contentType === "movie" || contentType === "Movie") {
        response = await axios.get(
          `${TMDB_BASE_URL}/movie/${contentId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
        );
      } else {
        response = await axios.get(
          `${TMDB_BASE_URL}/tv/${contentId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
        );
      }

      console.log("Recommendations response:", response.data.results);

      return response.data.results; // Return results directly
    } catch (error) {
      console.log("Error fetching recommendations:", error);
      throw error;
    }
  }
);

export const fetchUserBookmarked = createAsyncThunk(
  "netflix/fetchUserBookmarked",
  async (email) => {
    const {
      data: { content },
    } = await axios.get(
      `http://localhost:5000/api/user/getbookmarked/${email}`
    );
    console.log("fetched bookmarks", content);
    return content;
  }
);
export const fetchContentByName = createAsyncThunk(
  "netflix/fetchContentByName",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/search/multi?api_key=${API_KEY}&query=${name}`
      );
      console.log("Api search results", response);
      const data = response.data.results;
      console.log("search results", data);
      return { data: data, searchedtext: name };
    } catch (error) {
      console.log("error fetching", error.response);
      return rejectWithValue(error.response.data); // Handle error and return appropriate value
    }
  }
);

export const fetchCast = createAsyncThunk(
  "netflix/fetchMovieCast",
  async ({ type = "movie", id }, { rejectWithValue }) => {
    try {
      let response;
      if (type === "movie") {
        response = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
        );
      } else {
        response = await axios.get(
          `${TMDB_BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
        );
      }

      console.log("API Response:", response.data); // Log the entire API response

      const data = response.data;
      let cast = [];
      if (data.credits && Array.isArray(data.credits.cast)) {
        cast = data.credits.cast.map((actor) => actor.name);
      }

      console.log("Extracted Cast Data:", cast); // Log the extracted cast data

      const movietvCast = {
        name: data.original_title || data.name || "Unknown",
        poster_path: data.poster_path,
        genres: data.genres || [],
        country: data.origin_country || [],
        language: data.original_language || "Unknown",
        overview: data.overview,
        releaseYear: data.release_date
          ? data.release_date.split("-")[0]
          : "Unknown" || data.first_air_date
          ? data.first_air_date.split("-")[0]
          : "Unknown",
        runtime:
          data.runtime ||
          data.seasons.episode_count ||
          data.number_of_episodes ||
          "Unknown",
        rating: data.vote_average,
        cast: cast,
        status: data.status,
        ContentType: type,
      };

      return movietvCast;
    } catch (error) {
      console.error("API Error:", error.response); // Log the API error
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMovies = createAsyncThunk(
  "netflix/fetchMovies",
  async ({ type }) => {
    const moviesArray = [];
    await getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      true,
      moviesArray
    );
    return moviesArray;
  }
);

export const fetchTvSeries = createAsyncThunk(
  "netflix/fetchTvSeries",
  async () => {
    const seriesArray = [];
    await getRawData(
      `${TMDB_BASE_URL}/trending/tv/week?api_key=${API_KEY}`,
      true,
      seriesArray,
      true
    );
    console.log("seriesArray", seriesArray);
    return seriesArray;
  }
);

const netflixSlice = createSlice({
  name: "netflix",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTvSeries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTvSeries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tvSeries = action.payload;
      })
      .addCase(fetchTvSeries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCast.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCast.fulfilled, (state, action) => {
        state.cast = action.payload;
      })
      .addCase(fetchCast.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchContentByName.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContentByName.fulfilled, (state, action) => {
        state.searched = action.payload;
      })
      .addCase(fetchContentByName.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchUserBookmarked.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUserBookmarked.fulfilled, (state, action) => {
        state.bookmarked = action.payload;
      })
      .addCase(fetchUserBookmarked.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchUserRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchUserRecommendations.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const store = configureStore({
  reducer: {
    netflix: netflixSlice.reducer,
  },
});
