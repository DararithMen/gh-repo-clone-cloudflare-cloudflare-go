// កំណត់ Firebase Database URL របស់អ្នក
const FIREBASE_URL = 'https://documents-y7-2.firebaseio.com';

/**
 * Serves the HTML file when the web app URL is visited.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Staff Login - Firebase')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**

function loadHome() {
  // មុខងារនេះត្រូវបានហៅតាមរយៈ google.script.run ពេល Login ត្រូវ
  return HtmlService.createHtmlOutputFromFile('Home.html').getContent();
}
/**
 * មុខងារពិនិត្យការ Login ពី Firebase Realtime Database
 */
function verifyLogin(empId, password) {
  try {
    if (!empId || !password) {
      return { success: false, message: 'សូមបញ្ចូលអត្តលេខ និងពាក្យសម្ងាត់!' };
    }

    const url = `https://documents-y7-2.firebaseio.com/employees.json`;
    const response = UrlFetchApp.fetch(url, { method: 'get', muteHttpExceptions: true });
    const employees = JSON.parse(response.getContentText());

    if (!employees) {
      return { success: false, message: 'មិនទាន់មានទិន្នន័យបុគ្គលិកនៅក្នុងប្រព័ន្ធទេ!' };
    }

    const cleanInputEmpId = String(empId).trim();
    const cleanInputPassword = String(password).trim();

    // ឆែកមើលថាតើ Emp ID និង Password ត្រូវគ្នាដែរឬទេ
    for (let key in employees) {
      let emp = employees[key];
      if (emp && emp.emp_id && emp.password) {
        if (String(emp.emp_id).trim() === cleanInputEmpId && String(emp.password).trim() === cleanInputPassword) {
          return { 
            success: true, 
            name: emp.name || 'បុគ្គលិក', 
            department: emp.department || '-' 
          };
        }
      }
    }

    return { success: false, message: 'អត្តលេខ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ!' };
  } catch (error) {
    return { success: false, message: 'មានបញ្ហាក្នុងการតភ្ជាប់ទៅកាន់ Firebase: ' + error.toString() };
  }
}

/**
 * មុខងារចុះឈ្មោះបុគ្គលិកថ្មី និងរក្សាទុកចូលទៅក្នុង Firebase
 */
function registerEmployee(formData) {
  try {
    if (!formData || !formData.empId || !formData.password || !formData.name) {
      return { status: 'error', message: 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់!' };
    }

    const newEmpId = String(formData.empId).trim();

    // ទី១៖ ពិនិត្យមើលថាតើអត្តលេខនេះមានរួចហើយឬยัง
    const checkUrl = `https://documents-y7-2.firebaseio.com/employees.json`;
    const checkResponse = UrlFetchApp.fetch(checkUrl, { method: 'get', muteHttpExceptions: true });
    const employees = JSON.parse(checkResponse.getContentText());

    if (employees) {
      for (let key in employees) {
        if (employees[key] && String(employees[key].emp_id).trim() === newEmpId) {
          return { status: 'error', message: 'អត្តលេខបុគ្គលិកនេះមានរួចហើយក្នុងប្រព័ន្ធ!' };
        }
      }
    }

    // ទី២៖ បញ្ចូលទិន្នន័យថ្មីទៅកាន់ Firebase
    const postUrl = `https://documents-y7-2.firebaseio.com/employees.json`;
    const payload = {
      emp_id: newEmpId,
      password: String(formData.password).trim(),
      name: String(formData.name).trim(),
      department: formData.department || 'General',
      timestamp: new Date().toISOString()
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(postUrl, options);
    const responseCode = response.getResponseCode();

    if (responseCode >= 200 && responseCode < 300) {
      return { status: 'success', message: 'បង្កើតគណនីបុគ្គលិកជោគជ័យ!' };
    } else {
      return { status: 'error', message: 'កំហុសពី Server: ' + response.getContentText() };
    }
  } catch (error) {
    return { status: 'error', message: error.toString() };
  }
}
/**
 * មុខងារសម្រាប់ហៅទំព័រ Index.html មកបង្ហាញក្រោយពេល Login ជោគជ័យ
 */
function loadIndex() {
  return HtmlService.createHtmlOutputFromFile('Index').getContent();
}
