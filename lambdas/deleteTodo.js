import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

export const handler = async (event) => {
    try {
        await deleteTodoItem(event.pathParameters.id);
        return {
            statusCode: 204,
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const deleteTodoItem = async (id) => {
    const params = { TableName: "ToDoTable", Key: { id: { S: id } } };
    const command = new DeleteItemCommand(params);
    await ddbClient.send(command);
};

const errorResponse = (errorMessage, awsRequestId) => {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: errorMessage, reference: awsRequestId }),
    };
};
