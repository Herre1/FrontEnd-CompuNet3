// src/app/store/contentSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Content {
  id: string;
  title: string;
  type: string;
  genre: string[];
  rating: number;
  imageUrl: string;
}

interface ContentState {
  contents: Content[];
  filteredContents: Content[];
  searchTerm: string;
  selectedType: string;
  selectedGenre: string;
  selectedRating: string;
}

const initialState: ContentState = {
  contents: [],
  filteredContents: [],
  searchTerm: "",
  selectedType: "",
  selectedGenre: "",
  selectedRating: "",
};

// Fetch content data from API
export const fetchContents = createAsyncThunk("content/fetchContents", async () => {
  const response = await fetch("https://proyecto-compunet-lll.onrender.com/api/v1/content");
  const data = await response.json();
  return data;
});

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;
    },
    setSelectedGenre: (state, action: PayloadAction<string>) => {
      state.selectedGenre = action.payload;
    },
    setSelectedRating: (state, action: PayloadAction<string>) => {
      state.selectedRating = action.payload;
    },
    filterContent: (state) => {
      const term = state.searchTerm.toLowerCase();
      const type = state.selectedType;
      const genre = state.selectedGenre;
      const rating = state.selectedRating;

      state.filteredContents = state.contents.filter((content) => {
        const matchesTitle = content.title.toLowerCase().includes(term);
        const matchesType = type === "" || content.type === type;
        const matchesGenre = genre === "" || content.genre.includes(genre);
        const matchesRating = rating === "" || content.rating === parseInt(rating, 10);
        return matchesTitle && matchesType && matchesGenre && matchesRating;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContents.fulfilled, (state, action: PayloadAction<Content[]>) => {
      state.contents = action.payload;
      state.filteredContents = action.payload;
    });
  },
});

export const { setSearchTerm, setSelectedType, setSelectedGenre, setSelectedRating, filterContent } =
  contentSlice.actions;

export default contentSlice.reducer;