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
        // const post = {
        //   title: "What If My Baby Won't Burp After Feeding? A Comprehensive Guide",
        //   content: "This is my post content",
        //   meta_title: "Baby Not Burping After Feed? Expert Tips & Advice",
        //   meta_description: "Is your baby not burping after feeding? Learn why and what to do. Get expert advice, tips, and techniques to help your little one.",
        //   tags: [
        //     "baby burping",
        //     "baby not burping",
        //     "infant burping",
        //     "burping techniques",
        //     "newborn burping",
        //     "baby feeding",
        //     "gas in babies",
        //     "baby discomfort",
        //     "infant care",
        //     "post-feeding care"
        //   ],
        //   focus_keyphrase: "what if my baby won't burp after feeding"
        // };

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
