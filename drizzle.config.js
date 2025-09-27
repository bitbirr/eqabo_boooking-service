import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle/migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL, // Neon connection string
    },
    verbose: true,
    strict: false,
});
//# sourceMappingURL=drizzle.config.js.map