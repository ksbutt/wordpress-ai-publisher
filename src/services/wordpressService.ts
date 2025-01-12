import axios from "axios";
import slugify from "slugify";

const WORDPRESS_URL = process.env.URL!;
const JWT_TOKEN = process.env.JWT_TOKEN!;


// Helper to generate the Basic Auth header
const getAuthHeader = (): any => {
    return {
        Authorization: `Bearer ${JWT_TOKEN}`,
        "Content-Type": "application/json",
    };
};
/**
 * Handle errors of type 'unknown'.
 * @param error The error object to process.
 * @param context A custom error message for context.
 */
const handleError = (error: unknown, context: string): void => {
    if (axios.isAxiosError(error)) {
        console.error(`${context} Axios error:`, error.response?.data || error.message);
    } else if (error instanceof Error) {
        console.error(`${context} Error:`, error.message);
    } else {
        console.error(`${context} Unknown error:`, error);
    }
};


/**
 * Get the ID of a tag by name.
 * @param tagName - The name of the tag to check.
 * @returns A Promise that resolves to the tag ID or undefined if not found.
 */
export const getTagIdByName = async (tagName: string): Promise<number | undefined> => {
    try {
        const normalizedSlug = slugify(tagName.trim().toLowerCase(), {
            lower: true, // Convert to lowercase
            strict: true, // Remove special characters
        });
        const response = await axios.get(`${WORDPRESS_URL}/wp-json/wp/v2/tags`, {
            headers: getAuthHeader(),
            params: { search: tagName, per_page: 50 },
        });

        if (response.data.length > 0) {
            const matchingTag = response.data.find((tag: any) => tag.slug === normalizedSlug);
            if (matchingTag) {
                console.log(`Tag "${tagName}" found with ID: ${matchingTag.id}`);
                return matchingTag.id;
            }
        }
        console.log(`Tag "${tagName}" not found.`);
    } catch (error) {
        handleError(error, `Error fetching tag "${tagName}"`);
        throw error;
    }

    return undefined;
};

/**
 * Create a new tag.
 * @param tagName - The name of the tag to create.
 * @returns A Promise that resolves to the ID of the newly created tag.
 */
const createTag = async (tagName: string): Promise<number> => {
    try {
        const response = await axios.post(
            `${WORDPRESS_URL}/wp-json/wp/v2/tags`,
            { name: tagName },
            {
                headers: getAuthHeader(),
            }
        );
        console.log(`Tag "${tagName}" created with ID: ${response.data.id}`);
        return response.data.id;
    } catch (error) {
        handleError(error, `Error creating tag "${tagName}""`);
        throw error;
    }
};

/**
 * Resolve all tag names to their corresponding IDs.
 * @param tags An array of tag names.
 * @returns An array of tag IDs.
 */
export const resolveTagIds = async (tags: string[]): Promise<number[]> => {
    const tagIds: number[] = [];

    for(const tagName of tags){
        const normalizedTagName = tagName.trim();

        // Check if the tag exists
        const tagId = await getTagIdByName(normalizedTagName);

        if (tagId) {
            tagIds.push(tagId);
        } else {
            // If the tag doesn't exist, create it
            const newTagId = await createTag(normalizedTagName);
            tagIds.push(newTagId);
        }
    }

    return tagIds;
};

/**
 * Create a new WordPress post.
 * @param postData The data for the post (title, content, tags, etc.).
 */
export const createWordPressPost = async (postData: {
    title: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
    tags: string[];
    focus_keyphrase?: string; // publish | draft | pending
}): Promise<void> => {
    try {
        // Resolve tags into IDs
        const tagIds = await resolveTagIds(postData.tags);

        // Resolve category into ID
        const categoryId = process.env.CATEGORY!;


        // Create the WordPress post
        const response = await axios.post(
            `${WORDPRESS_URL}/wp-json/wp/v2/posts`,
            {
                title: postData.title,
                content: postData.content,
                status: "draft", // Default to draft
                tags: tagIds,
                author: process.env.AUTHOR_ID,
                categories: categoryId ? [categoryId] : undefined,
                meta: {
                    meta_title: postData.meta_title,
                    meta_description: postData.meta_description,
                    aioseo_focus_keyword: postData.focus_keyphrase,
                },
            },
            {
                headers:  getAuthHeader(),
            }
        );
        console.log(`Post created successfully: ${postData.title}`);
    } catch (error) {
        handleError(error, `Error creating post.`);
        throw error;
    }
};
