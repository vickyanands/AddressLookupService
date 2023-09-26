import { handler } from "./src/index";

const main = async () => {
    const response = await handler({ queryStringParameters: { address: "16-20 warialda street kogarah" } } as any)
    console.log(response)
}

main();
