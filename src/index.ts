import dotenv from "dotenv";
dotenv.config();


import { fetchRowsWhereBIsEmpty, updateSheetData } from "./services/googleSheetsService";
import { gemini } from "./services/genAIService";
import { createWordPressPost } from "./services/wordpressService";


const processWorkflow = async (): Promise<void> => {
  try {
    //Step Fetch rows
    const rows = await fetchRowsWhereBIsEmpty();
    console.log("Rows where column B is empty:", rows);

    for (const { row, index } of rows) {
      const rowItem = row[0]; // Assuming the first column contains the data to send to genAI

      console.log(`Processing row at index ${index}:`, rowItem);

      // Send the item to genAI and wait for the response
      const result = await gemini(rowItem);

      console.log(result);

      if(result){
        const post = {
          title: result.title,
          content: result.content,
          meta_title: result.meta_title,
          meta_description: result.meta_description,
          tags: result.tags,
          focus_keyphrase: result.focus_keyword
        };

        await createWordPressPost(post);
      }

      // Update the sheet with "Done" in column B and the current timestamp in column C
      const updateRange = `B${index}:C${index}`; // Use the original index
      await updateSheetData(updateRange, [["Done", new Date().toISOString()]]);

      console.log(`Row at index ${index} updated successfully.`);
    }
    console.log(`Job done successfully!!`);
  } catch (error) {
    console.error("Error fetching rows:", error);
  }
};
processWorkflow();
