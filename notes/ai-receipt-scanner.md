# 📸 AI Receipt Scanner Feature

## Overview
We implemented an **AI-powered receipt scanner** that allows users to upload or capture receipt images. The system uses **Google Gemini (1.5-flash)** to extract structured transaction details automatically, saving time and reducing manual data entry.

---

## Workflow
1. **User Action**  
   - User clicks **“Scan Receipt with AI”** button.  
   - Opens camera/file picker (`capture="environment"` on mobile uses back camera).  

2. **File Validation**  
   - Only images (`accept="image/*"`).  
   - Maximum size: **5 MB** (checked in the client + limited in Next.js `next.config.js`).  

3. **Upload & Processing**  
   - The image is read as an **ArrayBuffer**, converted to **Base64**, and passed into Gemini via `inlineData` with the correct `mimeType`.  
   - Gemini receives a **prompt** asking it to return details in strict JSON format:
     ```json
     {
       "amount": number,
       "date": "ISO date string",
       "description": "string",
       "merchantName": "string",
       "category": "string"
     }
     ```

4. **Response Handling**  
   - Gemini sometimes returns extra formatting (e.g., ```json fences).  
   - We use regex to extract the JSON block safely before parsing.  
   - If valid, the extracted data auto-fills the transaction form.

5. **Integration with Form**  
   - The scanned data is passed via `onScanComplete` callback.  
   - Fields like **amount, date, description, merchant, category** are filled automatically.  
   - User still chooses **transaction type** (Expense/Income) manually.

---

## ⚙️ Key Technical Details
- **Next.js Config**  
  Increased server action payload size:
  ```js
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  }
  ```

### AI Model

Using `gemini-1.5-flash` for fast response with multimodal support.

### Error Handling

- File size > 5 MB → client shows toast error.

- Invalid AI response → fallback error toast.

- Parsing issues → attempt to clean response before failing.

### Benefits

- Automates manual entry of receipts.

- Improves accuracy of amount/date/category detection.

- Error-safe with size limits and JSON cleaning.

