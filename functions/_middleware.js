export async function onRequest(context) {
    try {
        console.log(context)
        return await context.next();
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}