import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

export const handler = async (event) => {
    try {
        const todo = await getTodoDetails(event.pathParameters.id);
        if (todo) {
            return {
                statusCode: 200,
                body: JSON.stringify(todo),
                headers: { "Access-Control-Allow-Origin": "*" },
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Item not found" }),
            };
        }
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const getTodoDetails = async (id) => {
    const params = { TableName: "ToDoTable", Key: { id: { S: id } } };
    const command = new GetItemCommand(params);
    const data = await ddbClient.send(command);
    return data.Item;
};

const errorResponse = (errorMessage, awsRequestId) => {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: errorMessage, reference: awsRequestId }),
    };
};
