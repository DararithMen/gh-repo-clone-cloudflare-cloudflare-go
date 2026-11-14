/**
 * Handles the form submission and saves data to Google Sheets.
 * @param {Object} formData - The data object from the HTML form sent from frontend.
 */
function processForm(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Database');
    
    // បើសិនជារកមិនឃើញ Sheet ឈ្មោះ Database ទេ វាបង្កើតថ្មីស្វ័យប្រវត្តិ
    if (!sheet) {
      sheet = ss.insertSheet('Database');
      // បន្ថែមជួរក្បាលតារាង (Headers) ជាលើកដំបូង
      sheet.appendRow([
        "Timestamp", "No", "Date", "Shift", 
        "H Input", "H Rate", "4001 Input", "4001 Rate", 
        "M Input", "M Rate", "L Input", "L Rate", 
        "RM Input", "RM Rate", "CP Input", "CP Rate", 
        "Return Input", "Return Rate", "Total Amount", 
        "Product Output", "Yield %", "Grand Packaging", "Prepared By"
      ]);
    }
    
    // បង្កើតកាលបរិច្ឆេទ និងម៉ោងពេលរក្សាទុក
    const timestamp = new Date();
    
    // បញ្ចូលទិន្នន័យទៅក្នុង Google Sheet តាមលំដាប់លំដោយ
    sheet.appendRow([
      timestamp,
      formData.no || "1",
      formData.date || "",
      formData.shift || "",
      formData.h_input || "",
      formData.h_rate || "",
      formData.c4001_input || "",
      formData.c4001_rate || "",
      formData.m_input || "",
      formData.m_rate || "",
      formData.l_input || "",
      formData.l_rate || "",
      formData.rm_input || "",
      formData.rm_rate || "",
      formData.cp_input || "",
      formData.cp_rate || "",
      formData.return_input || "",
      formData.return_rate || "",
      formData.tamount_input || "", 
      formData.product_output || "",
      formData.yield || "",
      formData.grand_packaging || "",
      formData.preparedName || ""
    ]);
    
    return { status: 'success', message: 'ទិន្នន័យត្រូវបានរក្សាទុកដោយជោគជ័យទៅក្នុង Sheet Database!' };
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}
