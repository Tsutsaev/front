import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './state';
import {
  createSheets,
  deleteSheets,
  getAllMySheets,
  getAllMySheetsByDate,
  getAllSheetsByOrg,
  getSheetsByWeek,
  patchSheets,
} from './actions';

const sheetsSlice = createSlice({
  name: 'sheets',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(getAllSheetsByOrg.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllSheetsByOrg.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sheets = action.payload.results;
      })
      .addCase(getAllSheetsByOrg.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getAllMySheets.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllMySheets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sheets = action.payload.results;
      })
      .addCase(getAllMySheets.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getAllMySheetsByDate.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllMySheetsByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sheets = action.payload.results;
      })
      .addCase(getAllMySheetsByDate.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getSheetsByWeek.pending, state => {
        state.status = 'loading';
      })
      .addCase(getSheetsByWeek.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sheets = action.payload.results;
      })
      .addCase(getSheetsByWeek.rejected, state => {
        state.status = 'failed';
      })
      .addCase(patchSheets.fulfilled, (state, action) => {
        const updatedSheetIndex = state.sheets.findIndex(sheet => sheet.id === action.payload.id);
        if (updatedSheetIndex !== -1) {
          state.sheets[updatedSheetIndex] = action.payload;
        }
      })
      .addCase(createSheets.fulfilled, (state, action) => {
        const newSheet = action.payload;
        const indexToInsert = state.sheets.findIndex(sheet => sheet.start_at < newSheet.start_at);

        if (indexToInsert === -1) {
          state.sheets.push(newSheet);
        } else {
          state.sheets.splice(indexToInsert, 0, newSheet);
        }
      })
      .addCase(deleteSheets.fulfilled, (state, action) => {
        const deletedSheetId = action.meta.arg.id;
        const deletedSheetIndex = state.sheets.findIndex(sheet => sheet.id === deletedSheetId);
        if (deletedSheetIndex !== -1) {
          state.sheets.splice(deletedSheetIndex, 1);
        }
      });
  },
});

export default sheetsSlice.reducer;
