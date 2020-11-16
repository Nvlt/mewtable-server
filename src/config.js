module.exports = {
    JWT_SECRET:process.env.JWT_SECRET || "secret-jwt",
    PORT:process.env.PORT || 8080,
    NODE_ENV:process.env.NODE_ENV || 'development',
    AUTH_KEY:"a847863b-ea35-4198-ba9c-7c6fa40ba46e",
    DATABASE_URL:(process.env.NODE_ENV === 'test')? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
}