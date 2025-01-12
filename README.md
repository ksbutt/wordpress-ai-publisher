# AI Content Publisher for WordPress

AI Content Publisher for WordPress is a Node.js and TypeScript-based tool that leverages AI to generate and automate content posting to WordPress. With built-in AI integration, it simplifies the process of creating engaging SEO-optimized content, managing tags, categories, and focus keyphrases via the WordPress REST API using JWT authentication.

## Features

- **AI-Powered Content Creation**: Automatically generate content using advanced AI models.
- **Tag and Category Management**: Fetch or create tags and categories programmatically.
- **Focus Keyphrase Integration**: Set AIOSEO focus keyphrases for SEO optimization.
- **JWT Authentication**: Securely interact with WordPress using JWT tokens.
- **REST API Integration**: Automate publishing and content updates with WordPress REST API.
- **Error Handling**: Comprehensive error logs for debugging.

---

## Prerequisites

- **Node.js** (v14 or later)
- **TypeScript**
- **WordPress Site** with REST API enabled.
- **JWT Authentication Plugin**:
  - Install and activate the [JWT Authentication for WP REST API plugin](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/).
  - Follow the plugin's setup instructions to configure JWT.
  - Add the secret key in the WordPress configuration (`wp-config.php`):
    ```php
    define('JWT_AUTH_SECRET_KEY', 'your-secure-secret-key');
    define('JWT_AUTH_CORS_ENABLE', true);
    ```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wordpress-ai-publisher.git
   cd wordpress-ai-publisher

2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables in a .env file:
    ```env
    WORDPRESS_URL=https://yourwordpresssite.com
    JWT_TOKEN=your-jwt-token
    AI_API_KEY=your-ai-api-key

4. Compile the TypeScript code:
   ```bash
   npm run build

5. Start the application:
   ```bash
   npm run dev

## Usage
AI-Generated Post Creation

    ```ts
    import { createWordPressPost } from "./services/wordpressService";
    import { generatePostWithAI } from "./services/aiService";

    (async () => {
        const topic = "Benefits of Meditation";
        const aiContent = await generatePostWithAI(topic);

        await createWordPressPost({
            title: aiContent.title,
            content: aiContent.content,
            meta_title: aiContent.meta_title,
            meta_description: aiContent.meta_description,
            tags: aiContent.tags,
            focus_keyphrase: aiContent.focus_keyphrase,
            status: "publish",
        });
    })();
    ```
## Authentication

### JWT Authentication

This project uses the **JWT Authentication for WP REST API** plugin for secure communication with WordPress. Ensure the following steps are completed:

1.  Install and activate the plugin.
2.  Configure the secret key in the `wp-config.php` file.
3.  Generate a JWT token using your WordPress credentials:

 ```bash
    curl -X POST https://yourwordpresssite.com/wp-json/jwt-auth/v1/token \
    -H "Content-Type: application/json" \
    -d '{"username":"yourusername","password":"yourpassword"}'`
```
4.  Add the generated token to the `.env` file under `JWT_TOKEN`.


## Roadmap

-   Add support for custom post types.
-   Extend AI capabilities for content optimization.
-   Enable scheduled AI-driven post creation.
-   Add multi-language AI support.

----------

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

----------

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.