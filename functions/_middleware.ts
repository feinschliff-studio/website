const errorHandler: PagesFunction = async ({ next, env }) => {
    try {
        return await next();
    } catch (err) {
        const response = `${err.message}\n${err.stack}`;

        return new Response(response, { status: 500 });
    }
};

export const onRequest = [errorHandler];
