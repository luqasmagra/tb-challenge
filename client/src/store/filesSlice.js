import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getFilesList, getFilesData } from '../services/api'

export const fetchFilesList = createAsyncThunk(
  'files/fetchFilesList',
  async () => {
    const response = await getFilesList()
    return response.files
  }
)

export const fetchFilesData = createAsyncThunk(
  'files/fetchFilesData',
  async (fileName) => {
    const response = await getFilesData(fileName)
    return response
  }
)

const initialState = {
  data: [],
  filesList: [],
  selectedFile: null,
  loading: false,
  error: null
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchFilesList
      .addCase(fetchFilesList.pending, (state) => {
        state.error = null
      })
      .addCase(fetchFilesList.fulfilled, (state, action) => {
        state.filesList = action.payload
      })
      .addCase(fetchFilesList.rejected, (state, action) => {
        state.error = action.error.message
      })

      // fetchFilesData
      .addCase(fetchFilesData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFilesData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchFilesData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { setSelectedFile } = filesSlice.actions
export default filesSlice.reducer
